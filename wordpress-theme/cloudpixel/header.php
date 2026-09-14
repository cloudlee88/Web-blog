<?php
/**
 * Header + site navigation.
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if (has_custom_logo()) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <span class="brand-badge">C</span>
                <span><?php bloginfo('name'); ?></span>
            <?php endif; ?>
        </a>

        <nav class="main-nav" aria-label="Primary">
            <?php
            if (has_nav_menu('primary')) {
                wp_nav_menu(['theme_location' => 'primary', 'container' => false, 'items_wrap' => '<ul>%3$s</ul>', 'depth' => 1]);
            } else {
                cloudpixel_fallback_menu();
            }
            ?>
        </nav>
    </div>
</header>

<main id="main">
