<?php
/**
 * Search results.
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<section class="section">
    <div class="container">
        <div class="section-head">
            <div>
                <h2>Search</h2>
                <p>
                    <?php
                    global $wp_query;
                    printf(
                        esc_html('%1$d result(s) for “%2$s”'),
                        (int) $wp_query->found_posts,
                        esc_html(get_search_query())
                    );
                    ?>
                </p>
            </div>
        </div>

        <div style="max-width:620px;margin-bottom:28px"><?php get_search_form(); ?></div>

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
            <p>No results. Try a different keyword, or browse the categories.</p>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();
