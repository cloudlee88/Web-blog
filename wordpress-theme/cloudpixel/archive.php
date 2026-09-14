<?php
/**
 * Category / tag / date archives.
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

// The blog category is presented as "Cloudlee Review" everywhere.
$q_obj   = get_queried_object();
$is_blog = is_category() && $q_obj && $q_obj->slug === 'blog';
$archive_title = $is_blog ? 'Cloudlee Review' : wp_strip_all_tags(get_the_archive_title());
?>
<section class="section">
    <div class="container">
        <div class="section-head">
            <div>
                <h2><?php echo esc_html($archive_title); ?></h2>
                <?php
                $desc = get_the_archive_description();
                if ($desc) {
                    echo '<p>' . wp_kses_post($desc) . '</p>';
                }
                ?>
            </div>
        </div>

        <?php
        // Cloudlee Review (blog category): post-type tabs mirroring the local site.
        if ($is_blog) :
            $blog_base = get_category_link($q_obj->term_id);
            $ptype     = sanitize_key((string) get_query_var('ptype'));
            $tabs      = ['' => 'All', 'tutorial' => 'Tutorials', 'news' => 'News', 'blog' => 'Blog', 'review' => 'Reviews'];
            ?>
            <div class="sc-tabs">
                <?php foreach ($tabs as $slug => $label) : ?>
                    <a class="sc-tab<?php echo $ptype === $slug ? ' is-active' : ''; ?>"
                       href="<?php echo esc_url($slug ? add_query_arg('ptype', $slug, $blog_base) : $blog_base); ?>"><?php echo esc_html($label); ?></a>
                <?php endforeach; ?>
            </div>
            <?php if ($ptype === 'review') :
                $topics      = ['lifestyle' => 'Lifestyle', 'beauty-fashion' => 'Beauty & Fashion', 'entertainment' => 'Entertainment'];
                $activeTopic = sanitize_title((string) get_query_var('rtopic'));
                ?>
                <div class="sc-subtabs">
                    <a class="sc-subtab<?php echo !$activeTopic ? ' is-active' : ''; ?>"
                       href="<?php echo esc_url(add_query_arg('ptype', 'review', $blog_base)); ?>">All topics</a>
                    <?php foreach ($topics as $ts => $tn) : ?>
                        <a class="sc-subtab<?php echo $activeTopic === $ts ? ' is-active' : ''; ?>"
                           href="<?php echo esc_url(add_query_arg(['ptype' => 'review', 'rtopic' => $ts], $blog_base)); ?>"><?php echo esc_html($tn); ?></a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>

        <?php
        // Browse by type — functional sub-categories (tags used in this category).
        // Only for the tool pillars (AI / Tech / Digital Products), not Cloudlee Review/Best Guides.
        if (is_category() && !$is_blog && $q_obj && !in_array($q_obj->slug, ['buying-guides'], true)) :
            $cat_id  = get_queried_object_id();
            $cat_obj = get_queried_object();
            $base    = get_category_link($cat_id);
            $active  = sanitize_title((string) get_query_var('type'));

            // Data-driven types (tags used by posts here); else curated fallback.
            $items = [];
            foreach (cloudpixel_category_types($cat_id) as $t) {
                $items[] = ['slug' => $t['term']->slug, 'name' => ucwords($t['term']->name), 'count' => (int) $t['count']];
            }
            if (empty($items)) {
                foreach (cloudpixel_curated_types($cat_obj->slug ?? '') as $c) {
                    $items[] = ['slug' => $c['slug'], 'name' => $c['name'], 'count' => null];
                }
            }

            if ($items) :
                $total = (int) ($cat_obj->count ?? 0);
                ?>
                <h3 class="eyebrow" style="margin-bottom:14px">Browse <?php echo esc_html(single_cat_title('', false)); ?> by type</h3>
                <div class="type-grid">
                    <a class="type-card<?php echo $active === '' ? ' is-active' : ''; ?>" href="<?php echo esc_url($base); ?>">
                        <span class="type-name">All types</span>
                        <span class="type-count"><?php echo $total > 0 ? esc_html($total . ' tools') : 'Browse all'; ?></span>
                    </a>
                    <?php foreach ($items as $it) : ?>
                        <a class="type-card<?php echo $active === $it['slug'] ? ' is-active' : ''; ?>"
                           href="<?php echo esc_url(add_query_arg('type', $it['slug'], $base)); ?>">
                            <span class="type-name"><?php echo esc_html($it['name']); ?></span>
                            <span class="type-count"><?php echo (is_int($it['count']) && $it['count'] > 0) ? esc_html($it['count'] . ' tools') : 'Explore'; ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php
            endif;
        endif;
        ?>

        <?php if (have_posts()) : ?>
            <div class="card-grid">
                <?php
                while (have_posts()) {
                    the_post();
                    cloudpixel_card();
                }
                ?>
            </div>
            <div class="pagination"><?php echo paginate_links(['type' => 'plain', 'prev_text' => '« Prev', 'next_text' => 'Next »']); ?></div>
        <?php else : ?>
            <p>No posts in this section yet.</p>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();
