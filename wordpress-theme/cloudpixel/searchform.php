<?php
/**
 * Search form (pill style).
 *
 * @package CloudPixel
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <input type="search" name="s" placeholder="Search AI tools, e.g. &ldquo;image generator&rdquo;…"
           value="<?php echo esc_attr(get_search_query()); ?>" aria-label="Search">
    <button type="submit">Search</button>
</form>
