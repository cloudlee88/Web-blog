<?php
/**
 * Front page — hero + featured tools + how it works + why trust +
 * browse by category + buying guides + rankings + newsletter CTA.
 *
 * Mirrors the Next.js homepage at src/app/page.tsx.
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

/* ── Resolve the 3 pillar category IDs ─────────────────────────── */
$pillar_slugs = ['tech', 'ai', 'digital-products'];
$pillar_ids   = [];
$pillar_cats  = [];
foreach ($pillar_slugs as $slug) {
    $cat = get_category_by_slug($slug);
    if ($cat) {
        $pillar_ids[]  = $cat->term_id;
        $pillar_cats[] = $cat;
    }
}

/* ── Buying-guides category (exclude from featured, use for guide section) */
$guides_cat    = get_category_by_slug('buying-guides');
$guides_cat_id = $guides_cat ? $guides_cat->term_id : 0;

/* ── Total tool count (posts in the 3 pillars) ─────────────────── */
$count_q    = new WP_Query([
    'category__in'   => $pillar_ids,
    'posts_per_page' => 1,
    'no_found_rows'  => false,
    'fields'         => 'ids',
]);
$tool_count = $count_q->found_posts ?: 20;
wp_reset_postdata();
?>

<!-- Hero -->
<section class="hero">
    <div class="hero-decoration" aria-hidden="true">
        <svg class="hd-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="currentColor" stroke-width="0.15" vector-effect="non-scaling-stroke">
                <line x1="0" y1="0" x2="46" y2="34"/><line x1="0" y1="0" x2="34" y2="46"/><line x1="0" y1="0" x2="52" y2="20"/>
                <line x1="100" y1="0" x2="54" y2="34"/><line x1="100" y1="0" x2="66" y2="46"/><line x1="100" y1="0" x2="48" y2="20"/>
                <line x1="0" y1="100" x2="46" y2="66"/><line x1="100" y1="100" x2="54" y2="66"/>
            </g>
        </svg>
        <svg class="hd-dots">
            <defs><pattern id="hd-dot" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="currentColor"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#hd-dot)"/>
        </svg>
        <svg class="hd-rings" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="90" stroke="currentColor" stroke-width="1"/>
            <circle cx="200" cy="200" r="150" stroke="currentColor" stroke-width="1"/>
            <circle cx="200" cy="200" r="200" stroke="currentColor" stroke-width="1"/>
        </svg>
        <svg class="hd-sparkle" style="left:12%;top:30%" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.3 2.7 7.3 8 8-5.3.7-7.3 2.7-8 8-.7-5.3-2.7-7.3-8-8 5.3-.7 7.3-2.7 8-8Z"/></svg>
        <svg class="hd-sparkle" style="right:16%;top:24%" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.3 2.7 7.3 8 8-5.3.7-7.3 2.7-8 8-.7-5.3-2.7-7.3-8-8 5.3-.7 7.3-2.7 8-8Z"/></svg>
        <svg class="hd-sparkle" style="left:22%;top:64%" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.3 2.7 7.3 8 8-5.3.7-7.3 2.7-8 8-.7-5.3-2.7-7.3-8-8 5.3-.7 7.3-2.7 8-8Z"/></svg>
        <svg class="hd-sparkle" style="right:24%;bottom:18%" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.3 2.7 7.3 8 8-5.3.7-7.3 2.7-8 8-.7-5.3-2.7-7.3-8-8 5.3-.7 7.3-2.7 8-8Z"/></svg>
    </div>
    <div class="container">
        <span class="pill-tag">Hand-picked &middot; Honestly reviewed &middot; No fluff</span>
        <h1><?php echo esc_html(get_bloginfo('description') ?: 'Honest, in-depth reviews of AI tools'); ?></h1>
        <p class="lead">CloudPixel reviews AI tools, software and digital products in depth &mdash; with buying guides and honest verdicts. Less noise, more signal.</p>
        <div class="hero-search"><?php get_search_form(); ?></div>
        <div class="hero-explore">
            <span>Explore:</span>
            <?php if ($guides_cat) : ?>
                <a href="<?php echo esc_url(get_category_link($guides_cat_id)); ?>">Best Guides</a>
            <?php endif; ?>
            <?php foreach ($pillar_cats as $pc) : ?>
                <a href="<?php echo esc_url(get_category_link($pc->term_id)); ?>"><?php echo esc_html($pc->name); ?></a>
            <?php endforeach; ?>
        </div>

        <!-- Dashboard mockup (ports src/components/hero-mockup.tsx) -->
        <div class="hero-mockup" aria-hidden="true">
            <div class="mk-topbar">
                <div class="mk-brand">
                    <span class="mk-brand-badge">C</span> Dashboard
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div class="mk-topactions">
                    <span class="mk-addbtn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add review</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span class="mk-avatar"></span>
                </div>
            </div>
            <div class="mk-body">
                <aside class="mk-sidebar">
                    <nav class="mk-nav">
                        <div class="mk-navitem is-active">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            <span>Dashboard</span>
                        </div>
                        <div class="mk-navitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5z"/><path d="m9 12 2 2 4-4"/></svg>
                            <span>Reviews</span><span class="mk-badge-new">New</span>
                        </div>
                        <div class="mk-navitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/><rect x="6" y="14" width="12" height="8"/></svg>
                            <span>Rankings</span>
                        </div>
                        <div class="mk-navitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            <span>Guides</span>
                        </div>
                        <div class="mk-navitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            <span>Trending</span>
                        </div>
                        <div class="mk-navitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span>Readers</span>
                        </div>
                    </nav>
                </aside>
                <div class="mk-main">
                    <div class="mk-metrics">
                        <div class="mk-metric">
                            <div class="mk-metric-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5z"/><path d="m9 12 2 2 4-4"/></svg> Tools reviewed</div>
                            <div class="mk-metric-row"><span class="mk-metric-val">42</span><span class="mk-delta">&#8599; 12%</span></div>
                        </div>
                        <div class="mk-metric">
                            <div class="mk-metric-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Avg. score</div>
                            <div class="mk-metric-row"><span class="mk-metric-val">4.6</span><span class="mk-delta">&#8599; 3%</span></div>
                        </div>
                        <div class="mk-metric">
                            <div class="mk-metric-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Readers / mo</div>
                            <div class="mk-metric-row"><span class="mk-metric-val">128k</span><span class="mk-delta">&#8599; 8%</span></div>
                        </div>
                    </div>
                    <span class="mk-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20 7 4"/></svg></span>
                    <div class="mk-lower">
                        <div class="mk-perf">
                            <div class="mk-perf-head"><strong>Performance overview</strong><span class="mk-dropdown">Last 30 days <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span></div>
                            <div class="mk-perf-val"><strong>128,420</strong><span class="mk-delta">&#8599; 8%</span></div>
                            <svg class="mk-chart" viewBox="0 0 300 80" preserveAspectRatio="none">
                                <defs><linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.28"/><stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/></linearGradient></defs>
                                <path d="M0,64 C28,56 44,34 68,40 C96,47 108,16 140,26 C176,37 190,52 222,32 C252,14 270,20 300,14 L300,80 L0,80 Z" fill="url(#mk-area)"/>
                                <path d="M0,64 C28,56 44,34 68,40 C96,47 108,16 140,26 C176,37 190,52 222,32 C252,14 270,20 300,14" fill="none" stroke="#1d4ed8" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
                            </svg>
                        </div>
                        <div class="mk-toprated">
                            <strong>Top rated</strong>
                            <ul class="mk-tr">
                                <li class="mk-tr-item"><span class="mk-tr-rank">1</span><span class="mk-tr-name">ChatGPT</span><span class="mk-tr-score"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>4.7</span></li>
                                <li class="mk-tr-item"><span class="mk-tr-rank">2</span><span class="mk-tr-name">Claude</span><span class="mk-tr-score"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>4.6</span></li>
                                <li class="mk-tr-item"><span class="mk-tr-rank">3</span><span class="mk-tr-name">Perplexity</span><span class="mk-tr-score"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>4.5</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Featured tools (white) -->
<section class="section">
    <div class="container">
        <div class="section-head">
            <div><h2>Featured tools</h2><p>Our current picks &mdash; tested and worth your time.</p></div>
            <a class="btn" href="<?php echo esc_url(home_url('/')); ?>?s=">Browse all</a>
        </div>
        <div class="card-grid">
            <?php
            $featured_args = [
                'posts_per_page'      => 6,
                'ignore_sticky_posts' => false,
            ];
            if (!empty($pillar_ids)) {
                $featured_args['category__in'] = $pillar_ids;
            }
            if ($guides_cat_id) {
                $featured_args['category__not_in'] = [$guides_cat_id];
            }
            $q = new WP_Query($featured_args);
            if ($q->have_posts()) {
                while ($q->have_posts()) {
                    $q->the_post();
                    cloudpixel_card();
                }
                wp_reset_postdata();
            } else {
                echo '<p>No reviews yet. Import <code>cloudpixel.xml</code> via Tools &rarr; Import.</p>';
            }
            ?>
        </div>
    </div>
</section>

<!-- How it works (tinted) -->
<section class="section section--alt">
    <div class="container">
        <div class="section-head"><div><h2>How CloudPixel works</h2><p>From &ldquo;which tool?&rdquo; to a confident choice in three steps.</p></div></div>
        <div class="steps">
            <div class="step">
                <div class="step-icon"><?php echo esc_html("\xF0\x9F\xA7\xAD"); /* compass */ ?></div>
                <span class="step-label">Step 1</span>
                <h3>Browse or search</h3>
                <p style="color:var(--muted-fg)">Find tools by pillar (Tech, AI, Digital Products), tag, or a quick search.</p>
            </div>
            <div class="step">
                <div class="step-icon"><?php echo esc_html("\xE2\x9C\x85"); /* check */ ?></div>
                <span class="step-label">Step 2</span>
                <h3>Read the honest review</h3>
                <p style="color:var(--muted-fg)">A clear score, the good &amp; the bad, pricing and who it&rsquo;s really for &mdash; tested, not hyped.</p>
            </div>
            <div class="step">
                <div class="step-icon"><?php echo esc_html("\xF0\x9F\x9A\x80"); /* rocket */ ?></div>
                <span class="step-label">Step 3</span>
                <h3>Pick with confidence</h3>
                <p style="color:var(--muted-fg)">Compare the shortlist, grab any deal, and head straight to the tool.</p>
            </div>
        </div>
        <div class="section-link">
            <a href="<?php echo esc_url(home_url('/methodology/')); ?>">See how we test &amp; score &rarr;</a>
        </div>
    </div>
</section>

<!-- Why trust our reviews (white) -->
<section class="section">
    <div class="container">
        <div class="section-head"><div><h2>Why trust our reviews</h2><p>No hype, no pay-to-win. Here&rsquo;s what stands behind every score.</p></div></div>
        <div class="card-grid">
            <div class="card benefit-card">
                <span class="benefit-icon" style="background:var(--primary)">
                    <svg width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </span>
                <h3>Hands-on tested</h3>
                <ul class="check-list">
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Real accounts, real tasks</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>&ldquo;Tested&rdquo; badge only when we&rsquo;ve used it</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Screenshots from actual use</span></li>
                </ul>
            </div>
            <div class="card benefit-card">
                <span class="benefit-icon" style="background:var(--coral)">
                    <svg width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M1 1l6 6m-6 0l6-6"/><rect x="7" y="7" width="16" height="16" rx="2"/><line x1="11" y1="11" x2="11" y2="17"/><line x1="15" y1="11" x2="15" y2="17"/><line x1="19" y1="11" x2="19" y2="17"/></svg>
                </span>
                <h3>Editorially independent</h3>
                <ul class="check-list">
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Affiliate deals never change a score</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>We call out the downsides</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Rankings are editorial, never paid</span></li>
                </ul>
            </div>
            <div class="card benefit-card">
                <span class="benefit-icon" style="background:var(--blue)">
                    <svg width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </span>
                <h3>Kept up to date</h3>
                <ul class="check-list">
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>&ldquo;Last updated&rdquo; on every review</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Revised as tools change</span></li>
                    <li><svg class="check-icon" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Reader corrections welcomed</span></li>
                </ul>
            </div>
        </div>
        <!-- Stats row -->
        <div class="stats-row">
            <div class="stat-item">
                <p class="stat-number"><?php echo esc_html($tool_count); ?>+</p>
                <p class="stat-label">tools reviewed in depth</p>
            </div>
            <div class="stat-item">
                <p class="stat-number">3</p>
                <p class="stat-label">focused categories</p>
            </div>
            <div class="stat-item">
                <p class="stat-number">100%</p>
                <p class="stat-label">independent verdicts</p>
            </div>
        </div>
    </div>
</section>

<!-- Browse by category (tinted) -->
<?php if (!empty($pillar_cats)) : ?>
<section class="section section--alt" id="categories">
    <div class="container">
        <div class="section-head"><div><h2>Browse by category</h2><p>Find tools by what you need to do.</p></div></div>
        <div class="category-sections">
            <?php foreach ($pillar_cats as $pc) :
                $cat_q = new WP_Query([
                    'cat'            => $pc->term_id,
                    'posts_per_page' => 3,
                    'no_found_rows'  => true,
                ]);
                if (!$cat_q->have_posts()) {
                    wp_reset_postdata();
                    continue;
                }
            ?>
            <div class="category-section">
                <div class="category-header">
                    <h3><?php echo esc_html($pc->name); ?></h3>
                    <a href="<?php echo esc_url(get_category_link($pc->term_id)); ?>">See all &rarr;</a>
                </div>
                <div class="card-grid">
                    <?php
                    while ($cat_q->have_posts()) {
                        $cat_q->the_post();
                        cloudpixel_card();
                    }
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Popular buying guides (white) -->
<?php
$guide_q = null;
if ($guides_cat_id) {
    $guide_q = new WP_Query([
        'cat'            => $guides_cat_id,
        'posts_per_page' => 3,
        'no_found_rows'  => true,
    ]);
}
if ($guide_q && $guide_q->have_posts()) : ?>
<section class="section">
    <div class="container">
        <div class="section-head">
            <div><h2>Popular buying guides</h2><p>Ranked shortlists for the &ldquo;best X&rdquo; questions people actually search.</p></div>
            <?php if ($guides_cat) : ?>
                <a class="btn" href="<?php echo esc_url(get_category_link($guides_cat_id)); ?>">See all guides</a>
            <?php endif; ?>
        </div>
        <div class="card-grid">
            <?php while ($guide_q->have_posts()) : $guide_q->the_post(); ?>
            <a class="card guide-card" href="<?php the_permalink(); ?>">
                <span class="guide-icon">
                    <svg width="24" height="24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><polyline points="16 3 16 8 21 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
                </span>
                <h3><?php the_title(); ?></h3>
                <?php
                $intro = wp_trim_words(get_the_excerpt(), 20);
                if ($intro) : ?>
                    <p class="excerpt"><?php echo esc_html($intro); ?></p>
                <?php endif; ?>
                <span class="guide-link">Read guide &rarr;</span>
            </a>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Rankings (tinted) -->
<section class="section section--alt">
    <div class="container">
        <div class="section-head"><div><h2>Rankings</h2><p>Editor&rsquo;s picks and what&rsquo;s trending right now.</p></div></div>
        <div class="ranking-grid">
            <?php
            /* ── Editor's picks: sticky posts first, then recent from pillars ── */
            $editors_args = [
                'posts_per_page'      => 5,
                'ignore_sticky_posts' => false,
            ];
            if (!empty($pillar_ids)) {
                $editors_args['category__in'] = $pillar_ids;
            }
            $editors_q = new WP_Query($editors_args);
            ?>
            <div class="ranking-col ranking-col--violet">
                <div class="ranking-col-head">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3l1.09 3.35h3.52l-2.85 2.07 1.09 3.35L12 9.7l-2.85 2.07 1.09-3.35-2.85-2.07h3.52z"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5z"/></svg>
                    <h3>Editor&rsquo;s picks</h3>
                </div>
                <ol class="ranking-list">
                    <?php
                    $rank = 1;
                    if ($editors_q->have_posts()) {
                        while ($editors_q->have_posts()) {
                            $editors_q->the_post();
                            $cats = get_the_category();
                            $cat_name = !empty($cats) ? $cats[0]->name : '';
                            ?>
                            <li class="ranking-item">
                                <span class="ranking-num"><?php echo esc_html($rank); ?></span>
                                <?php $rlogo = cloudpixel_post_logo(get_the_ID()); ?>
                                <?php if ($rlogo) : ?><img class="ranking-logo" src="<?php echo esc_url($rlogo); ?>" alt="" width="24" height="24" loading="lazy"><?php endif; ?>
                                <div class="ranking-info">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    <?php if ($cat_name) : ?>
                                        <span class="ranking-cat"><?php echo esc_html($cat_name); ?></span>
                                    <?php endif; ?>
                                </div>
                            </li>
                            <?php
                            $rank++;
                        }
                        wp_reset_postdata();
                    } else {
                        echo '<li class="ranking-item"><span class="ranking-num">-</span><div class="ranking-info">No picks yet</div></li>';
                    }
                    ?>
                </ol>
                <a class="ranking-see-all" href="<?php echo esc_url(home_url('/')); ?>?s=">See all &rarr;</a>
            </div>

            <?php
            /* ── Trending now: order by comment count as a proxy for engagement ── */
            $trending_args = [
                'posts_per_page' => 5,
                'orderby'        => 'comment_count',
                'order'          => 'DESC',
            ];
            if (!empty($pillar_ids)) {
                $trending_args['category__in'] = $pillar_ids;
            }
            $trending_q = new WP_Query($trending_args);
            ?>
            <div class="ranking-col ranking-col--coral">
                <div class="ranking-col-head">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3-7.5.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.5-2.5 1.5-3.5l1 1z"/></svg>
                    <h3>Trending now</h3>
                </div>
                <ol class="ranking-list">
                    <?php
                    $rank = 1;
                    if ($trending_q->have_posts()) {
                        while ($trending_q->have_posts()) {
                            $trending_q->the_post();
                            $cats = get_the_category();
                            $cat_name = !empty($cats) ? $cats[0]->name : '';
                            ?>
                            <li class="ranking-item">
                                <span class="ranking-num"><?php echo esc_html($rank); ?></span>
                                <?php $rlogo = cloudpixel_post_logo(get_the_ID()); ?>
                                <?php if ($rlogo) : ?><img class="ranking-logo" src="<?php echo esc_url($rlogo); ?>" alt="" width="24" height="24" loading="lazy"><?php endif; ?>
                                <div class="ranking-info">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    <?php if ($cat_name) : ?>
                                        <span class="ranking-cat"><?php echo esc_html($cat_name); ?></span>
                                    <?php endif; ?>
                                </div>
                            </li>
                            <?php
                            $rank++;
                        }
                        wp_reset_postdata();
                    } else {
                        echo '<li class="ranking-item"><span class="ranking-num">-</span><div class="ranking-info">No trending tools yet</div></li>';
                    }
                    ?>
                </ol>
                <a class="ranking-see-all" href="<?php echo esc_url(home_url('/')); ?>?s=">See all &rarr;</a>
            </div>

            <?php
            /* ── Top rated: order by 'rating' meta if available, fallback to date ── */
            $toprated_args = [
                'posts_per_page' => 5,
                'meta_key'       => 'cloudpixel_rating',
                'orderby'        => 'meta_value_num',
                'order'          => 'DESC',
            ];
            if (!empty($pillar_ids)) {
                $toprated_args['category__in'] = $pillar_ids;
            }
            $toprated_q = new WP_Query($toprated_args);

            /* Fallback if no posts have 'rating' meta */
            if (!$toprated_q->have_posts()) {
                wp_reset_postdata();
                $toprated_args_fallback = [
                    'posts_per_page' => 5,
                    'orderby'        => 'date',
                    'order'          => 'DESC',
                ];
                if (!empty($pillar_ids)) {
                    $toprated_args_fallback['category__in'] = $pillar_ids;
                }
                $toprated_q = new WP_Query($toprated_args_fallback);
            }
            ?>
            <div class="ranking-col ranking-col--blue">
                <div class="ranking-col-head">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/><rect x="6" y="14" width="12" height="8"/></svg>
                    <h3>Top rated</h3>
                </div>
                <ol class="ranking-list">
                    <?php
                    $rank = 1;
                    if ($toprated_q->have_posts()) {
                        while ($toprated_q->have_posts()) {
                            $toprated_q->the_post();
                            $cats = get_the_category();
                            $cat_name = !empty($cats) ? $cats[0]->name : '';
                            ?>
                            <li class="ranking-item">
                                <span class="ranking-num"><?php echo esc_html($rank); ?></span>
                                <?php $rlogo = cloudpixel_post_logo(get_the_ID()); ?>
                                <?php if ($rlogo) : ?><img class="ranking-logo" src="<?php echo esc_url($rlogo); ?>" alt="" width="24" height="24" loading="lazy"><?php endif; ?>
                                <div class="ranking-info">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    <?php if ($cat_name) : ?>
                                        <span class="ranking-cat"><?php echo esc_html($cat_name); ?></span>
                                    <?php endif; ?>
                                </div>
                            </li>
                            <?php
                            $rank++;
                        }
                        wp_reset_postdata();
                    } else {
                        echo '<li class="ranking-item"><span class="ranking-num">-</span><div class="ranking-info">No rated tools yet</div></li>';
                    }
                    ?>
                </ol>
                <a class="ranking-see-all" href="<?php echo esc_url(home_url('/')); ?>?s=">See all &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- Newsletter CTA (white) -->
<section class="section">
    <div class="container">
        <div class="cta-banner">
            <h2>One good tool in your inbox, weekly</h2>
            <p>No spam, no hype &mdash; just the occasional tool worth knowing about, with the honest verdict.</p>
            <p style="margin-top:22px">
                <a class="btn" style="background:#fff;color:var(--primary)" href="#">Subscribe</a>
            </p>
        </div>
    </div>
</section>

<?php
get_footer();
