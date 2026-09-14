<?php
/**
 * CloudPixel theme functions.
 *
 * @package CloudPixel
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('cloudpixel_setup')) {
    function cloudpixel_setup(): void
    {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('automatic-feed-links');
        add_theme_support('custom-logo', ['height' => 40, 'width' => 160, 'flex-width' => true]);
        add_theme_support('html5', ['search-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
        register_nav_menus([
            'primary' => __('Primary Menu', 'cloudpixel'),
            'footer'  => __('Footer Menu', 'cloudpixel'),
        ]);
    }
}
add_action('after_setup_theme', 'cloudpixel_setup');

/** Enqueue the theme stylesheet (versioned by file mtime so CSS updates aren't cached stale). */
function cloudpixel_assets(): void
{
    $css = get_stylesheet_directory() . '/style.css';
    $ver = file_exists($css) ? (string) filemtime($css) : '1.0.0';
    wp_enqueue_style('cloudpixel', get_stylesheet_uri(), [], $ver);
}
add_action('wp_enqueue_scripts', 'cloudpixel_assets');

/** Shorter excerpts for cards. */
add_filter('excerpt_length', fn () => 24);
add_filter('excerpt_more', fn () => '…');

/** Drop the "Category:" / "Tag:" prefix from archive titles (show just the name). */
add_filter('get_the_archive_title_prefix', '__return_empty_string');

/** Register query vars: `type` (functional tag) and `ptype` (Cloudlee Review post-type tab). */
add_filter('query_vars', function (array $vars): array {
    $vars[] = 'type';
    $vars[] = 'ptype';
    $vars[] = 'rtopic';
    return $vars;
});

/**
 * Cloudlee Review (blog category) type filter: /category/blog/?ptype=tutorial|news|blog|review
 * narrows by the `cloudpixel_ptype` meta so the archive tabs mirror the local site.
 */
add_action('pre_get_posts', function (WP_Query $q): void {
    if (is_admin() || !$q->is_main_query() || !$q->is_category()) {
        return;
    }
    $ptype = sanitize_key((string) get_query_var('ptype'));
    if ($ptype === '') {
        return;
    }
    $mq = (array) $q->get('meta_query');
    $mq[] = ['key' => 'cloudpixel_ptype', 'value' => $ptype, 'compare' => '='];

    // Review topic sub-filter uses its own var (?ptype=review&rtopic=lifestyle) so it
    // doesn't collide with the functional-tag `type` filter above.
    $rtopic = sanitize_title((string) get_query_var('rtopic'));
    if ($ptype === 'review' && $rtopic !== '') {
        $mq[] = ['key' => 'cloudpixel_topic', 'value' => $rtopic, 'compare' => '='];
    }
    $q->set('meta_query', $mq);
});

/**
 * On a category archive, if `?type=<tag>` is present, AND the listing with that
 * tag — so /category/ai/?type=chatbot shows only AI tools tagged "chatbot".
 */
add_action('pre_get_posts', function (WP_Query $q): void {
    if (is_admin() || !$q->is_main_query() || !$q->is_category()) {
        return;
    }
    $type = sanitize_title((string) get_query_var('type'));
    if ($type === '') {
        return;
    }
    $tax = (array) $q->get('tax_query');
    $tax[] = ['taxonomy' => 'post_tag', 'field' => 'slug', 'terms' => $type];
    $q->set('tax_query', $tax);
});

/**
 * Resolve a card logo for a post, resilient to missing meta on import:
 *   1. explicit `cloudpixel_logo_url` meta
 *   2. favicon derived from `cloudpixel_website` meta
 *   3. favicon derived from the first EXTERNAL link in the post body
 *      (tool reviews always carry a "Visit" CTA to the product site)
 * Returns '' when nothing usable is found (caller shows a letter fallback).
 */
function cloudpixel_post_logo(int $post_id): string
{
    $favicon = fn (string $host): string =>
        'https://www.google.com/s2/favicons?domain='
        . rawurlencode(preg_replace('/^www\./', '', $host)) . '&sz=128';

    // 1) explicit logo
    $logo = (string) get_post_meta($post_id, 'cloudpixel_logo_url', true);
    if ($logo !== '') {
        return $logo;
    }

    // 2) favicon from website meta
    $website = (string) get_post_meta($post_id, 'cloudpixel_website', true);
    if ($website !== '') {
        $host = wp_parse_url($website, PHP_URL_HOST);
        if ($host) {
            return $favicon($host);
        }
    }

    $content = (string) get_post_field('post_content', $post_id);
    if ($content === '') {
        return '';
    }

    // 3a) the review body embeds the logo as a favicon URL (…/s2/favicons?domain=X):
    //     reuse that domain — it's exactly the product's site.
    if (preg_match('#s2/favicons\?domain=([^&"\'\s<>]+)#i', $content, $mm)) {
        $dom = urldecode($mm[1]);
        if ($dom !== '') {
            return $favicon($dom);
        }
    }

    // 3b) otherwise, the first EXTERNAL link in the body (skip self / embeds / CDNs)
    $self = (string) wp_parse_url(home_url(), PHP_URL_HOST);
    $skip = ['google.com', 'gstatic.com', 'youtube.com', 'youtu.be', 'vimeo.com', 'ytimg.com', 'gravatar.com', 'w.org'];
    if (preg_match_all('#https?://([^/"\'\s<>]+)#i', $content, $m)) {
        foreach ($m[1] as $host) {
            $host = strtolower($host);
            if (!$host) {
                continue;
            }
            if ($self !== '' && stripos($host, $self) !== false) {
                continue; // internal link
            }
            foreach ($skip as $bad) {
                if (strpos($host, $bad) !== false) {
                    continue 2; // embed / CDN / favicon host
                }
            }
            return $favicon($host);
        }
    }

    return '';
}

/**
 * Render a review/post card for the current loop item.
 *
 * Matches the Next.js ToolCard layout: logo, title + category badge, rating,
 * excerpt, pricing + tag pills, Details + Visit buttons.
 */
function cloudpixel_card(): void
{
    $post_id = get_the_ID();
    $title   = get_the_title();
    $cats    = get_the_category();
    $cat     = !empty($cats) ? $cats[0] : null;

    /* ── Logo (robust: meta → website meta → first external link in body) ── */
    $logo_url = cloudpixel_post_logo($post_id);

    /* ── Rating ──────────────────────────────────────────────────── */
    $rating = get_post_meta($post_id, 'cloudpixel_rating', true);

    /* ── Pricing ─────────────────────────────────────────────────── */
    $pricing = strtoupper((string) get_post_meta($post_id, 'cloudpixel_pricing', true));
    $pricing_labels = [
        'FREE'     => 'Free',
        'FREEMIUM' => 'Freemium',
        'PAID'     => 'Paid',
    ];

    /* ── Tags ────────────────────────────────────────────────────── */
    $tags = get_the_tags();

    /* ── Type / topic / flags ────────────────────────────────────── */
    $verified = get_post_meta($post_id, 'cloudpixel_verified', true) === '1';
    $featured = get_post_meta($post_id, 'cloudpixel_featured', true) === '1';
    $ptype    = get_post_meta($post_id, 'cloudpixel_ptype', true);   // editorial posts only
    $topic    = get_post_meta($post_id, 'cloudpixel_topic', true);   // review sub-topic
    $ptype_labels = ['blog' => 'Blog', 'tutorial' => 'Tutorial', 'news' => 'News', 'review' => 'Review'];
    $topic_labels = ['lifestyle' => 'Lifestyle', 'beauty-fashion' => 'Beauty & Fashion', 'entertainment' => 'Entertainment'];
    /* Primary badge: editorial posts show their TYPE; tools show their category. */
    $primary_badge = $ptype && isset($ptype_labels[$ptype]) ? $ptype_labels[$ptype] : ($cat ? $cat->name : '');

    /* ── Visit URL ───────────────────────────────────────────────── */
    $website = get_post_meta($post_id, 'cloudpixel_website', true);
    ?>
    <div class="card">
        <div class="card-head">
            <?php if ($logo_url) : ?>
                <img class="card-logo" src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($title); ?>" width="48" height="48" loading="lazy">
            <?php else :
                $letter = mb_strtoupper(mb_substr($title, 0, 1));
                /* Deterministic hue from the title so each tool gets a stable color. */
                $hue = crc32($title) % 360;
                ?>
                <span class="card-logo card-logo-fallback" style="background:hsl(<?php echo (int) $hue; ?>,55%,50%)" aria-hidden="true"><?php echo esc_html($letter); ?></span>
            <?php endif; ?>

            <div class="card-info">
                <h3><a href="<?php the_permalink(); ?>"><?php echo esc_html($title); ?></a></h3>
                <?php if ($primary_badge) : ?>
                    <span class="badge badge-cat"><?php echo esc_html($primary_badge); ?></span>
                <?php endif; ?>
            </div>

            <?php if ($rating) : ?>
                <span class="card-rating">&#9733; <?php echo esc_html(number_format((float) $rating, 1)); ?></span>
            <?php endif; ?>
        </div>

        <p class="excerpt"><?php echo esc_html(wp_trim_words(get_the_excerpt(), 22)); ?></p>

        <div class="card-tags">
            <?php if ($featured) : ?>
                <span class="badge badge-featured">&#10022; Featured</span>
            <?php endif; ?>
            <?php if ($verified) : ?>
                <span class="badge badge-tested">&#10003; Tested</span>
            <?php endif; ?>
            <?php if ($topic && isset($topic_labels[$topic])) : ?>
                <span class="badge badge-topic"><?php echo esc_html($topic_labels[$topic]); ?></span>
            <?php endif; ?>
            <?php if ($pricing && isset($pricing_labels[$pricing])) : ?>
                <span class="badge badge-pricing badge-price-<?php echo esc_attr(strtolower($pricing)); ?>"><?php echo esc_html($pricing_labels[$pricing]); ?></span>
            <?php endif; ?>
            <?php if ($tags) : foreach (array_slice($tags, 0, 2) as $t) : ?>
                <a class="badge badge-tag" href="<?php echo esc_url(get_tag_link($t->term_id)); ?>"><?php echo esc_html($t->name); ?></a>
            <?php endforeach; endif; ?>
        </div>

        <div class="card-actions">
            <a class="btn" href="<?php the_permalink(); ?>">Details</a>
            <?php if ($website) : ?>
                <a class="btn btn-primary" href="<?php echo esc_url($website); ?>" target="_blank" rel="nofollow sponsored noopener">Visit &#8599;</a>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

/**
 * Functional sub-categories ("types") within a category — the tags used by
 * posts in that category, with counts. Powers the "Browse X by type" grid.
 *
 * @return array<int,array{term:WP_Term,count:int}>
 */
function cloudpixel_category_types(int $cat_id, int $limit = 16): array
{
    $q = new WP_Query([
        'cat'            => $cat_id,
        'posts_per_page' => 300,
        'fields'         => 'ids',
        'no_found_rows'  => true,
    ]);
    $counts = [];
    $terms  = [];
    foreach ($q->posts as $pid) {
        foreach (wp_get_object_terms($pid, 'post_tag') as $t) {
            $counts[$t->term_id] = ($counts[$t->term_id] ?? 0) + 1;
            $terms[$t->term_id]  = $t;
        }
    }
    wp_reset_postdata();
    arsort($counts);
    $out = [];
    foreach (array_slice($counts, 0, $limit, true) as $tid => $c) {
        $out[] = ['term' => $terms[$tid], 'count' => $c];
    }
    return $out;
}

/**
 * Curated sub-category taxonomy per category (shown when a pillar has no
 * tagged posts yet). Digital Products list is based on Amasty's "best digital
 * products to sell".
 *
 * @return array<int,array{slug:string,name:string}>
 */
function cloudpixel_curated_types(string $cat_slug): array
{
    $map = [
        'digital-products' => [
            ['slug' => 'ebooks', 'name' => 'E-books & Audiobooks'],
            ['slug' => 'courses', 'name' => 'Online Courses'],
            ['slug' => 'templates', 'name' => 'Templates & Planners'],
            ['slug' => 'themes', 'name' => 'Website Themes'],
            ['slug' => 'graphics', 'name' => 'Graphics & Design Assets'],
            ['slug' => 'stock-photos', 'name' => 'Stock Photos'],
            ['slug' => 'fonts', 'name' => 'Fonts & Typography'],
            ['slug' => 'printables', 'name' => 'Printables'],
            ['slug' => 'digital-art', 'name' => 'Digital Art Prints'],
            ['slug' => 'ai-prompts', 'name' => 'AI Prompts & Assets'],
            ['slug' => 'software', 'name' => 'Software & Apps'],
            ['slug' => 'music-audio', 'name' => 'Music & Audio'],
            ['slug' => 'memberships', 'name' => 'Memberships'],
            ['slug' => 'spreadsheets', 'name' => 'Spreadsheets & Finance'],
            ['slug' => 'marketing-kits', 'name' => 'Marketing Kits'],
            ['slug' => 'wellness', 'name' => 'Wellness & Meal Plans'],
        ],
    ];
    return $map[$cat_slug] ?? [];
}

/**
 * Fallback menu when no primary menu is assigned.
 *
 * Matches the Next.js header nav order:
 *   Best Guides / Tech / AI / Digital Products / Cloudlee Review (blog)
 *
 * Category links are looked up by slug so they stay correct regardless
 * of term ID. "Best Guides" links to the /best page (or home if that
 * page doesn't exist yet). "Cloudlee Review" links to the blog posts page.
 */
function cloudpixel_fallback_menu(): void
{
    /* Resolve a category permalink by slug (create-safe fallback to /category/<slug>/). */
    $cat_link = static function (string $slug): string {
        $c = get_category_by_slug($slug);
        return $c ? get_category_link($c->term_id) : home_url('/category/' . $slug . '/');
    };

    /*
     * Every item points to a real category archive. Best Guides → the
     * buying-guides category, Cloudlee Review → the blog category. (Linking to
     * non-existent /best/ or /blog/ made WordPress 404-guess and redirect to a
     * random "best-*" post.)
     */
    $items = [
        ['url' => $cat_link('buying-guides'),   'label' => 'Best Guides'],
        ['url' => $cat_link('tech'),            'label' => 'Tech'],
        ['url' => $cat_link('ai'),              'label' => 'AI'],
        ['url' => $cat_link('digital-products'), 'label' => 'Digital Products'],
        ['url' => $cat_link('blog'),            'label' => 'Cloudlee Review'],
    ];

    echo '<ul>';
    foreach ($items as $item) {
        echo '<li><a href="' . esc_url($item['url']) . '">' . esc_html($item['label']) . '</a></li>';
    }
    echo '</ul>';
}

/*──────────────────────────────────────────────────────────────────────
 * Affiliate link redirect: /go/<slug> → target URL
 * Links are stored as a hidden CPT so they're manageable from WP Admin
 * and importable via WXR. Each redirect logs a click count in post meta.
 *────────────────────────────────────────────────────────────────────*/

/** Register the affiliate_link custom post type. */
function cloudpixel_register_affiliate_cpt(): void
{
    register_post_type('affiliate_link', [
        'labels' => [
            'name'          => 'Affiliate Links',
            'singular_name' => 'Affiliate Link',
            'add_new_item'  => 'Add Affiliate Link',
            'edit_item'     => 'Edit Affiliate Link',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true, // expose to the REST API so WP MCP can manage links
        'menu_icon'     => 'dashicons-admin-links',
        'supports'      => ['title', 'custom-fields'],
        'rewrite'       => false,
        'has_archive'   => false,
    ]);
}
add_action('init', 'cloudpixel_register_affiliate_cpt');

/**
 * Register post meta with REST support so WP MCP (and the REST API generally)
 * can read AND write structured fields when creating/updating content.
 *
 * - Tool/product review meta lives on the standard `post` type.
 * - Affiliate target/network/clicks live on the `affiliate_link` CPT.
 * All are single values, editable by anyone who can edit posts.
 */
function cloudpixel_register_rest_meta(): void
{
    $can_edit = fn () => current_user_can('edit_posts');

    $post_meta = [
        'cloudpixel_rating'         => 'string',
        'cloudpixel_pricing'        => 'string',
        'cloudpixel_website'        => 'string',
        'cloudpixel_logo_url'       => 'string',
        'cloudpixel_verified'       => 'string',
        'cloudpixel_featured'       => 'string',
        'cloudpixel_editorial_rank' => 'string',
        'cloudpixel_ptype'          => 'string',
        'cloudpixel_topic'          => 'string',
    ];
    foreach ($post_meta as $key => $type) {
        register_post_meta('post', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => $can_edit,
        ]);
    }

    $aff_meta = [
        'target_url'  => 'string',
        'network'     => 'string',
        'click_count' => 'integer',
    ];
    foreach ($aff_meta as $key => $type) {
        register_post_meta('affiliate_link', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => $can_edit,
        ]);
    }
}
add_action('init', 'cloudpixel_register_rest_meta');

/** Add /go/<slug> rewrite rule. */
function cloudpixel_affiliate_rewrite(): void
{
    add_rewrite_rule('^go/([^/]+)/?$', 'index.php?affiliate_redirect=$matches[1]', 'top');
}
add_action('init', 'cloudpixel_affiliate_rewrite');

/** Register the query var. */
add_filter('query_vars', function (array $vars): array {
    $vars[] = 'affiliate_redirect';
    return $vars;
});

/** Handle the redirect on template_redirect. */
add_action('template_redirect', function (): void {
    $slug = sanitize_title((string) get_query_var('affiliate_redirect'));
    if ($slug === '') {
        return;
    }

    $posts = get_posts([
        'post_type'      => 'affiliate_link',
        'name'           => $slug,
        'posts_per_page' => 1,
        'post_status'    => 'publish',
    ]);

    if (empty($posts)) {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        get_template_part('404');
        exit;
    }

    $link = $posts[0];
    $target = get_post_meta($link->ID, 'target_url', true);
    if (empty($target)) {
        wp_safe_redirect(home_url('/'));
        exit;
    }

    $clicks = (int) get_post_meta($link->ID, 'click_count', true);
    update_post_meta($link->ID, 'click_count', $clicks + 1);

    nocache_headers();
    wp_redirect($target, 302);
    exit;
});

/** Show target URL and click count columns in the admin list. */
add_filter('manage_affiliate_link_posts_columns', function (array $cols): array {
    $new = [];
    foreach ($cols as $k => $v) {
        $new[$k] = $v;
        if ($k === 'title') {
            $new['target_url']  = 'Target URL';
            $new['click_count'] = 'Clicks';
        }
    }
    return $new;
});

add_action('manage_affiliate_link_posts_custom_column', function (string $col, int $id): void {
    if ($col === 'target_url') {
        $url = get_post_meta($id, 'target_url', true);
        echo $url ? '<a href="' . esc_url($url) . '" target="_blank">' . esc_html($url) . '</a>' : '—';
    }
    if ($col === 'click_count') {
        echo esc_html(get_post_meta($id, 'click_count', true) ?: '0');
    }
}, 10, 2);
