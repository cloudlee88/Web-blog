<?php
/**
 * Single review / post. The imported content is self-contained styled HTML
 * (verdict, the good/bad, pricing, use-cases, FAQ, Visit CTA + disclosure).
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

while (have_posts()) :
    the_post();
    $cats = get_the_category();
    $cat  = !empty($cats) ? $cats[0] : null;
    ?>
    <article class="entry">
        <nav class="breadcrumb">
            <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
            <?php if ($cat) : ?>
                &rsaquo; <a href="<?php echo esc_url(get_category_link($cat->term_id)); ?>"><?php echo esc_html($cat->name); ?></a>
            <?php endif; ?>
            &rsaquo; <span><?php the_title(); ?></span>
        </nav>

        <h1 class="entry-title"><?php the_title(); ?></h1>
        <div class="entry-meta">
            Updated <?php echo esc_html(get_the_modified_date()); ?>
            <?php if ($cat) : ?> · <?php echo esc_html($cat->name); ?><?php endif; ?>
        </div>

        <?php if (has_post_thumbnail()) : ?>
            <div style="margin-bottom:24px"><?php the_post_thumbnail('large', ['style' => 'border-radius:16px']); ?></div>
        <?php endif; ?>

        <div class="entry-content">
            <?php the_content(); ?>
        </div>

        <?php
        $tags = get_the_tags();
        if ($tags) :
            ?>
            <div style="margin-top:32px">
                <?php foreach ($tags as $t) : ?>
                    <a class="badge badge-cat" style="margin-right:6px" href="<?php echo esc_url(get_tag_link($t->term_id)); ?>"><?php echo esc_html($t->name); ?></a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </article>

    <?php
    // Related posts from the same category.
    if ($cat) :
        $related = new WP_Query([
            'category__in'        => [$cat->term_id],
            'post__not_in'        => [get_the_ID()],
            'posts_per_page'      => 3,
            'ignore_sticky_posts' => true,
        ]);
        if ($related->have_posts()) :
            ?>
            <section class="section section--alt">
                <div class="container">
                    <div class="section-head"><div><h2>Related reviews</h2></div></div>
                    <div class="card-grid">
                        <?php
                        while ($related->have_posts()) {
                            $related->the_post();
                            cloudpixel_card();
                        }
                        wp_reset_postdata();
                        ?>
                    </div>
                </div>
            </section>
            <?php
        endif;
    endif;
endwhile;

get_footer();
