<?php
/**
 * Fallback blog listing (also used for the posts page).
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
                <h2><?php echo is_home() && !is_front_page() ? esc_html(get_the_title(get_option('page_for_posts'))) : 'Latest reviews'; ?></h2>
                <p>Every tool we've reviewed — hand-picked and honest.</p>
            </div>
        </div>

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
            <p>Nothing here yet. Import <code>cloudpixel.xml</code> via <strong>Tools → Import</strong>.</p>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();
