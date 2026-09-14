<?php
/**
 * Footer.
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
</main>

<footer class="site-footer">
    <div class="container">
        <div>
            <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
                <span class="brand-badge">C</span><span><?php bloginfo('name'); ?></span>
            </a>
            <p style="color:var(--muted-fg);max-width:280px;margin-top:12px;font-size:.92rem">
                <?php echo esc_html(get_bloginfo('description') ?: 'Honest, in-depth reviews of AI tools.'); ?>
            </p>
        </div>
        <?php
        /* Category link by slug (stable regardless of term IDs). */
        $cat_link = static function (string $slug, string $fallback): string {
            $c = get_category_by_slug($slug);
            return $c ? get_category_link($c->term_id) : home_url($fallback);
        };
        ?>
        <div>
            <h4>Explore</h4>
            <ul>
                <li><a href="<?php echo esc_url($cat_link('buying-guides', '/category/buying-guides/')); ?>">Best Guides</a></li>
                <li><a href="<?php echo esc_url($cat_link('blog', '/category/blog/')); ?>">Cloudlee Review</a></li>
                <li><a href="<?php echo esc_url(home_url('/?s=')); ?>">Search</a></li>
            </ul>
        </div>
        <div>
            <h4>Categories</h4>
            <ul>
                <li><a href="<?php echo esc_url($cat_link('tech', '/category/tech/')); ?>">Tech</a></li>
                <li><a href="<?php echo esc_url($cat_link('ai', '/category/ai/')); ?>">AI</a></li>
                <li><a href="<?php echo esc_url($cat_link('digital-products', '/category/digital-products/')); ?>">Digital Products</a></li>
            </ul>
        </div>
        <div>
            <h4>Site</h4>
            <?php
            if (has_nav_menu('footer')) {
                wp_nav_menu(['theme_location' => 'footer', 'container' => false, 'items_wrap' => '<ul>%3$s</ul>', 'depth' => 1]);
            } else {
                echo '<ul>';
                echo '<li><a href="' . esc_url(home_url('/')) . '">Home</a></li>';
                wp_list_pages(['title_li' => '']);
                echo '</ul>';
            }
            ?>
        </div>
    </div>
    <div class="footer-bottom">
        © <?php echo esc_html(date('Y')); ?> <?php bloginfo('name'); ?>. All reviews are independent opinions. Some links are affiliate links.
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
