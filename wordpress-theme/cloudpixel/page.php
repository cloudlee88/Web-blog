<?php
/**
 * Static pages (About, Affiliate Disclosure, Methodology, Contact…).
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();

while (have_posts()) :
    the_post();
    ?>
    <article class="entry">
        <h1 class="entry-title"><?php the_title(); ?></h1>
        <div class="entry-content"><?php the_content(); ?></div>
    </article>
    <?php
endwhile;

get_footer();
