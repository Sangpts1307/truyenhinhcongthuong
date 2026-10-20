<?php

use App\ArticleStatus;
use App\Http\Middleware\ResolveLegacyRedirect;
use App\Models\Article;
use App\Models\Banner;
use App\Models\Category;
use App\Models\GalleryAlbum;
use App\Models\Video;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

// Export only public pages; never copy environment files, accounts or the CMS.
$source = realpath($argv[1] ?? __DIR__.'/../../cms-news');
$destination = dirname(__DIR__);
require $source.'/vendor/autoload.php';
$app = require $source.'/bootstrap/app.php';
$app->instance('request', Request::create('http://preview.invalid/'));
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();
config(['app.url' => 'http://preview.invalid', 'app.debug' => false, 'cache.default' => 'array', 'session.driver' => 'array', 'services.recaptcha.enabled' => false]);
URL::forceRootUrl('http://preview.invalid');
$app['router']->removeMiddlewareFromGroup('web', ResolveLegacyRedirect::class);
$app['router']->bind('category', function (string $slug) {
    $category = Category::where('slug', $slug)->firstOrFail();
    $category->is_visible = true;

    return $category;
});
$connection = DB::connection();
$connection->beginTransaction();
$urls = ['/', '/tim-kiem', '/album-anh'];
$articles = Article::published()->with(['primaryCategory', 'tags'])->latest('published_at')->get();
$search = [];
foreach ($articles as $article) {
    $url = '/bai-viet/'.$article->slug;
    $urls[] = $url;
    $search[] = ['title' => $article->title, 'url' => $url, 'category' => $article->primaryCategory?->name, 'categoryUrl' => $article->primaryCategory ? '/chuyen-muc/'.$article->primaryCategory->slug : '', 'thumbnail' => $article->thumbnail, 'excerpt' => $article->excerpt ?: Str::limit(strip_tags($article->content), 160), 'text' => strip_tags($article->content).' '.$article->tags->pluck('name')->implode(' ')];
}
foreach (Category::all() as $category) {
    $urls[] = '/chuyen-muc/'.$category->slug;
}
foreach ([Video::class => '/video/', GalleryAlbum::class => '/album-anh/'] as $model => $prefix) {
    foreach ($model::where('status', ArticleStatus::Published)->where('published_at', '<=', now())->get() as $item) {
        $urls[] = $prefix.$item->slug;
    }
}
$adTargets = Banner::pluck('target_url', 'id')->all();
$normalize = function (string $html) use ($adTargets): string {
    $html = preg_replace('~https?://(?:preview\.invalid|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)/~', '/', $html);
    $html = str_replace(['http://preview.invalid', 'https://preview.invalid'], '/', $html);
    $html = preg_replace('~<script id="browser-logger-active">.*?</script>~s', '', $html);
    $html = preg_replace('~\sdata-ad-(?:impression|click)="[^"]*"~', '', $html);
    $html = preg_replace('~<meta name="csrf-token"[^>]*>~', '', $html);
    $html = preg_replace('~<input type="hidden" name="_token"[^>]*>~', '', $html);
    $html = preg_replace_callback('~href="/quang-cao/(\d+)/click[^\"]*"~', fn ($m) => 'href="'.htmlspecialchars($adTargets[$m[1]] ?? '#', ENT_QUOTES).'"', $html);
    $html = preg_replace_callback('~href="([^"?]+)\?page=(\d+)"~', fn ($m) => 'href="'.rtrim($m[1], '/').'/trang/'.$m[2].'"', $html);
    $html = str_replace('</head>', '<meta name="robots" content="noindex, nofollow"><script src="/assets/js/preview.js" defer></script></head>', $html);

    return $html;
};
if (in_array('--retry', $argv, true)) {
    $previous = json_decode(file_get_contents($destination.'/preview-manifest.json'), true);
    $urls = array_column($previous['failures'], 0);
}
$seen = [];
$failures = [];
try {
    for ($i = 0; $i < count($urls); $i++) {
        $url = $urls[$i];
        if (isset($seen[$url])) {
            continue;
        }
        $seen[$url] = true;
        $encodedUrl = implode('/', array_map('rawurlencode', explode('/', explode('?', $url, 2)[0])));
        $request = Request::create('http://preview.invalid'.$encodedUrl.(str_contains($url, '?') ? '?'.(explode('?', $url, 2)[1] ?? '') : ''));
        $response = $kernel->handle($request);
        if ($response->getStatusCode() !== 200) {
            $failures[] = [$url, $response->getStatusCode()];
            fwrite(STDERR, 'Failed '.$url.' '.$response->getStatusCode().PHP_EOL);

            continue;
        }
        $html = $response->getContent();
        // Discover the next pagination pages from the original rendered navigation.
        preg_match_all('~href="http://preview\.invalid([^"?]+)\?page=(\d+)"~', $html, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $next = $match[1].'?page='.$match[2];
            if (! isset($seen[$next]) && ! in_array($next, $urls, true)) {
                $urls[] = $next;
            }
        }
        $path = explode('?', $url, 2)[0];
        parse_str((explode('?', $url, 2)[1] ?? ''), $query);
        if (isset($query['page'])) {
            $path = rtrim($path, '/').'/trang/'.$query['page'];
        }
        $file = $destination.($path === '/' ? '/index.html' : $path.'/index.html');
        if (! is_dir(dirname($file))) {
            mkdir(dirname($file), 0755, true);
        }
        file_put_contents($file, $normalize($html));
        if ($i % 100 === 0) {
            echo 'Exported '.$i.'/'.count($urls).PHP_EOL;
        }
        $app['cache']->store('array')->flush();
        $app['session']->driver()->flush();
        unset($response, $request);
    }
    file_put_contents($destination.'/assets/search-index.json', $normalize(json_encode($search, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)));
    file_put_contents($destination.'/preview-manifest.json', json_encode(['exportedAt' => date(DATE_ATOM), 'pages' => isset($previous) ? $previous['pages'] : count($seen), 'articles' => count($search), 'failures' => $failures], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo 'Done: '.count($seen).' pages, '.count($failures).' failures.'.PHP_EOL;
} finally {
    $connection->rollBack();
}
exit($failures === [] ? 0 : 1);
