<?php
/**
 * Twenty Nineteen Template Functions
 *
 * Template helper functions and custom template tags
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since Twenty Nineteen 1.0
 */

/**
 * Get post excerpt with custom length
 *
 * @param int $length Excerpt length
 * @return string Post excerpt
 */
function twentynineteen_get_excerpt($length = 55) {
    $excerpt = get_the_excerpt();
    $excerpt = wp_trim_words($excerpt, $length, '...');
    return $excerpt;
}

/**
 * Display post excerpt
 *
 * @param int $length Excerpt length
 */
function twentynineteen_the_excerpt($length = 55) {
    echo esc_html(twentynineteen_get_excerpt($length));
}

/**
 * Get post reading time
 *
 * @param int $post_id Post ID
 * @return int Reading time in minutes
 */
function twentynineteen_get_reading_time($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200);
    
    return $reading_time;
}

/**
 * Display post reading time
 *
 * @param int $post_id Post ID
 */
function twentynineteen_the_reading_time($post_id = null) {
    $time = twentynineteen_get_reading_time($post_id);
    printf(
        esc_html(_n('%s min read', '%s mins read', $time, 'twentynineteen')),
        number_format_i18n($time)
    );
}

/**
 * Get post views count
 *
 * @param int $post_id Post ID
 * @return int Views count
 */
function twentynineteen_get_post_views($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $count = get_post_meta($post_id, '_twentynineteen_post_views', true);
    return $count ? intval($count) : 0;
}

/**
 * Set post views count
 *
 * @param int $post_id Post ID
 */
function twentynineteen_set_post_views($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $count = twentynineteen_get_post_views($post_id);
    $count++;
    update_post_meta($post_id, '_twentynineteen_post_views', $count);
}

/**
 * Track post views
 */
function twentynineteen_track_post_views() {
    if (is_single() && !is_user_logged_in()) {
        twentynineteen_set_post_views();
    }
}
add_action('wp_head', 'twentynineteen_track_post_views');

/**
 * Get popular posts
 *
 * @param int $limit Number of posts
 * @return array Popular posts
 */
function twentynineteen_get_popular_posts($limit = 5) {
    $args = array(
        'posts_per_page' => $limit,
        'meta_key' => '_twentynineteen_post_views',
        'orderby' => 'meta_value_num',
        'order' => 'DESC',
        'post_status' => 'publish',
    );
    
    return get_posts($args);
}

/**
 * Display popular posts
 *
 * @param int $limit Number of posts
 */
function twentynineteen_popular_posts($limit = 5) {
    $posts = twentynineteen_get_popular_posts($limit);
    
    if (empty($posts)) {
        return;
    }
    
    echo '<ul class="popular-posts">';
    foreach ($posts as $post) {
        setup_postdata($post);
        printf(
            '<li><a href="%s">%s</a> <span class="views">%s views</span></li>',
            esc_url(get_permalink($post->ID)),
            esc_html(get_the_title($post->ID)),
            number_format_i18n(twentynineteen_get_post_views($post->ID))
        );
    }
    echo '</ul>';
    wp_reset_postdata();
}

/**
 * Get related posts
 *
 * @param int $post_id Post ID
 * @param int $limit Number of posts
 * @return array Related posts
 */
function twentynineteen_get_related_posts($post_id = null, $limit = 3) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $categories = wp_get_post_categories($post_id);
    
    if (empty($categories)) {
        return array();
    }
    
    $args = array(
        'category__in' => $categories,
        'post__not_in' => array($post_id),
        'posts_per_page' => $limit,
        'orderby' => 'rand',
        'post_status' => 'publish',
    );
    
    return get_posts($args);
}

/**
 * Display related posts
 *
 * @param int $post_id Post ID
 * @param int $limit Number of posts
 */
function twentynineteen_related_posts($post_id = null, $limit = 3) {
    $posts = twentynineteen_get_related_posts($post_id, $limit);
    
    if (empty($posts)) {
        return;
    }
    
    echo '<div class="related-posts">';
    echo '<h3>' . esc_html__('Related Posts', 'twentynineteen') . '</h3>';
    echo '<div class="related-posts-grid">';
    
    foreach ($posts as $post) {
        setup_postdata($post);
        ?>
        <article class="related-post">
            <?php if (has_post_thumbnail($post->ID)): ?>
                <a href="<?php echo esc_url(get_permalink($post->ID)); ?>">
                    <?php echo get_the_post_thumbnail($post->ID, 'medium'); ?>
                </a>
            <?php endif; ?>
            <h4><a href="<?php echo esc_url(get_permalink($post->ID)); ?>"><?php echo esc_html(get_the_title($post->ID)); ?></a></h4>
            <div class="post-meta">
                <span class="post-date"><?php echo esc_html(get_the_date('', $post->ID)); ?></span>
            </div>
        </article>
        <?php
    }
    
    echo '</div>';
    echo '</div>';
    wp_reset_postdata();
}

/**
 * Get post thumbnail with fallback
 *
 * @param int $post_id Post ID
 * @param string $size Image size
 * @return string Thumbnail HTML
 */
function twentynineteen_get_post_thumbnail($post_id = null, $size = 'large') {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    if (has_post_thumbnail($post_id)) {
        return get_the_post_thumbnail($post_id, $size);
    }
    
    $placeholder = get_template_directory_uri() . '/assets/images/placeholder.jpg';
    return '<img src="' . esc_url($placeholder) . '" alt="' . esc_attr(get_the_title($post_id)) . '" class="attachment-' . esc_attr($size) . '">';
}

/**
 * Display breadcrumbs
 */
function twentynineteen_breadcrumbs() {
    if (is_front_page()) {
        return;
    }
    
    $separator = ' &raquo; ';
    $home_title = __('Home', 'twentynineteen');
    
    echo '<nav class="breadcrumbs">';
    echo '<a href="' . esc_url(home_url('/')) . '">' . esc_html($home_title) . '</a>';
    
    if (is_category() || is_single()) {
        echo $separator;
        the_category(' &bull; ');
        if (is_single()) {
            echo $separator;
            the_title();
        }
    } elseif (is_page()) {
        echo $separator;
        the_title();
    } elseif (is_search()) {
        echo $separator;
        printf(esc_html__('Search Results for: %s', 'twentynineteen'), get_search_query());
    } elseif (is_tag()) {
        echo $separator;
        single_tag_title();
    } elseif (is_author()) {
        echo $separator;
        printf(esc_html__('Posts by %s', 'twentynineteen'), get_the_author());
    } elseif (is_404()) {
        echo $separator;
        esc_html_e('404 Not Found', 'twentynineteen');
    }
    
    echo '</nav>';
}

/**
 * Get post meta HTML
 *
 * @param int $post_id Post ID
 * @return string Post meta HTML
 */
function twentynineteen_get_post_meta($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $output = '<div class="post-meta">';
    
    $output .= '<span class="post-author">';
    $output .= sprintf(
        '<a href="%s">%s</a>',
        esc_url(get_author_posts_url(get_the_author_meta('ID'))),
        esc_html(get_the_author())
    );
    $output .= '</span>';
    
    $output .= '<span class="post-date">';
    $output .= esc_html(get_the_date());
    $output .= '</span>';
    
    if (get_comments_number()) {
        $output .= '<span class="post-comments">';
        $output .= sprintf(
            '<a href="%s">%s</a>',
            esc_url(get_comments_link()),
            sprintf(
                esc_html(_n('%s Comment', '%s Comments', get_comments_number(), 'twentynineteen')),
                number_format_i18n(get_comments_number())
            )
        );
        $output .= '</span>';
    }
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Display post meta
 *
 * @param int $post_id Post ID
 */
function twentynineteen_post_meta($post_id = null) {
    echo twentynineteen_get_post_meta($post_id);
}

/**
 * Get author bio
 *
 * @param int $author_id Author ID
 * @return string Author bio HTML
 */
function twentynineteen_get_author_bio($author_id = null) {
    if (!$author_id) {
        $author_id = get_the_author_meta('ID');
    }
    
    $description = get_the_author_meta('description', $author_id);
    
    if (!$description) {
        return '';
    }
    
    $output = '<div class="author-bio">';
    $output .= '<div class="author-avatar">';
    $output .= get_avatar($author_id, 80);
    $output .= '</div>';
    $output .= '<div class="author-info">';
    $output .= '<h3 class="author-name">' . esc_html(get_the_author_meta('display_name', $author_id)) . '</h3>';
    $output .= '<p class="author-description">' . wp_kses_post($description) . '</p>';
    $output .= '<a href="' . esc_url(get_author_posts_url($author_id)) . '" class="author-link">' . esc_html__('View all posts', 'twentynineteen') . '</a>';
    $output .= '</div>';
    $output .= '</div>';
    
    return $output;
}

/**
 * Display author bio
 *
 * @param int $author_id Author ID
 */
function twentynineteen_author_bio($author_id = null) {
    echo twentynineteen_get_author_bio($author_id);
}

/**
 * Get social sharing buttons
 *
 * @param int $post_id Post ID
 * @return string Sharing buttons HTML
 */
function twentynineteen_get_social_sharing($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $url = urlencode(get_permalink($post_id));
    $title = urlencode(get_the_title($post_id));
    
    $output = '<div class="social-sharing">';
    $output .= '<span class="share-label">' . esc_html__('Share:', 'twentynineteen') . '</span>';
    
    $output .= sprintf(
        '<a href="https://twitter.com/intent/tweet?text=%s&url=%s" target="_blank" rel="noopener" class="share-twitter">Twitter</a>',
        $title,
        $url
    );
    
    $output .= sprintf(
        '<a href="https://www.facebook.com/sharer/sharer.php?u=%s" target="_blank" rel="noopener" class="share-facebook">Facebook</a>',
        $url
    );
    
    $output .= sprintf(
        '<a href="https://www.linkedin.com/shareArticle?mini=true&url=%s&title=%s" target="_blank" rel="noopener" class="share-linkedin">LinkedIn</a>',
        $url,
        $title
    );
    
    $output .= sprintf(
        '<a href="mailto:?subject=%s&body=%s" class="share-email">Email</a>',
        $title,
        $url
    );
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Display social sharing buttons
 *
 * @param int $post_id Post ID
 */
function twentynineteen_social_sharing($post_id = null) {
    echo twentynineteen_get_social_sharing($post_id);
}

/**
 * Get post navigation
 *
 * @return string Navigation HTML
 */
function twentynineteen_get_post_navigation() {
    $prev_post = get_previous_post();
    $next_post = get_next_post();
    
    if (!$prev_post && !$next_post) {
        return '';
    }
    
    $output = '<nav class="post-navigation">';
    
    if ($prev_post) {
        $output .= '<div class="nav-previous">';
        $output .= '<span class="nav-label">' . esc_html__('Previous', 'twentynineteen') . '</span>';
        $output .= '<a href="' . esc_url(get_permalink($prev_post)) . '">' . esc_html(get_the_title($prev_post)) . '</a>';
        $output .= '</div>';
    }
    
    if ($next_post) {
        $output .= '<div class="nav-next">';
        $output .= '<span class="nav-label">' . esc_html__('Next', 'twentynineteen') . '</span>';
        $output .= '<a href="' . esc_url(get_permalink($next_post)) . '">' . esc_html(get_the_title($next_post)) . '</a>';
        $output .= '</div>';
    }
    
    $output .= '</nav>';
    
    return $output;
}

/**
 * Display post navigation
 */
function twentynineteen_post_navigation() {
    echo twentynineteen_get_post_navigation();
}

/**
 * Get pagination
 *
 * @param array $args Pagination arguments
 * @return string Pagination HTML
 */
function twentynineteen_get_pagination($args = array()) {
    global $wp_query;
    
    $defaults = array(
        'prev_text' => __('&laquo; Previous', 'twentynineteen'),
        'next_text' => __('Next &raquo;', 'twentynineteen'),
        'type' => 'list',
        'mid_size' => 2,
        'end_size' => 1,
    );
    
    $args = wp_parse_args($args, $defaults);
    
    return paginate_links($args);
}

/**
 * Display pagination
 *
 * @param array $args Pagination arguments
 */
function twentynineteen_pagination($args = array()) {
    $pagination = twentynineteen_get_pagination($args);
    
    if ($pagination) {
        echo '<nav class="pagination">';
        echo $pagination;
        echo '</nav>';
    }
}

/**
 * Get archive title
 *
 * @return string Archive title
 */
function twentynineteen_get_archive_title() {
    if (is_category()) {
        $title = single_cat_title('', false);
    } elseif (is_tag()) {
        $title = single_tag_title('', false);
    } elseif (is_author()) {
        $title = sprintf(__('Posts by %s', 'twentynineteen'), get_the_author());
    } elseif (is_year()) {
        $title = sprintf(__('Year: %s', 'twentynineteen'), get_the_date('Y'));
    } elseif (is_month()) {
        $title = sprintf(__('Month: %s', 'twentynineteen'), get_the_date('F Y'));
    } elseif (is_day()) {
        $title = sprintf(__('Day: %s', 'twentynineteen'), get_the_date('F j, Y'));
    } elseif (is_post_type_archive()) {
        $title = post_type_archive_title('', false);
    } elseif (is_tax()) {
        $title = single_term_title('', false);
    } else {
        $title = __('Archives', 'twentynineteen');
    }
    
    return $title;
}

/**
 * Display archive title
 */
function twentynineteen_archive_title() {
    echo '<h1 class="archive-title">' . esc_html(twentynineteen_get_archive_title()) . '</h1>';
}

/**
 * Get archive description
 *
 * @return string Archive description
 */
function twentynineteen_get_archive_description() {
    $description = '';
    
    if (is_category() || is_tag() || is_tax()) {
        $description = term_description();
    } elseif (is_author()) {
        $description = get_the_author_meta('description');
    }
    
    return $description;
}

/**
 * Display archive description
 */
function twentynineteen_archive_description() {
    $description = twentynineteen_get_archive_description();
    
    if ($description) {
        echo '<div class="archive-description">' . wp_kses_post($description) . '</div>';
    }
}

/**
 * Get comment count text
 *
 * @param int $post_id Post ID
 * @return string Comment count text
 */
function twentynineteen_get_comment_count_text($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $count = get_comments_number($post_id);
    
    if ($count == 0) {
        return __('No Comments', 'twentynineteen');
    } elseif ($count == 1) {
        return __('1 Comment', 'twentynineteen');
    } else {
        return sprintf(__('%s Comments', 'twentynineteen'), number_format_i18n($count));
    }
}

/**
 * Display comment count
 *
 * @param int $post_id Post ID
 */
function twentynineteen_comment_count($post_id = null) {
    echo esc_html(twentynineteen_get_comment_count_text($post_id));
}

/**
 * Custom comment callback
 *
 * @param object $comment Comment object
 * @param array $args Comment arguments
 * @param int $depth Comment depth
 */
function twentynineteen_comment($comment, $args, $depth) {
    $GLOBALS['comment'] = $comment;
    ?>
    <li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
        <article class="comment-body">
            <div class="comment-author vcard">
                <?php echo get_avatar($comment, 60); ?>
                <b class="fn"><?php echo get_comment_author_link(); ?></b>
                <span class="says"><?php esc_html_e('says:', 'twentynineteen'); ?></span>
            </div>
            
            <?php if ('0' == $comment->comment_approved): ?>
                <p class="comment-awaiting-moderation"><?php esc_html_e('Your comment is awaiting moderation.', 'twentynineteen'); ?></p>
            <?php endif; ?>
            
            <div class="comment-meta">
                <a href="<?php echo esc_url(get_comment_link($comment, $args)); ?>">
                    <time datetime="<?php echo get_comment_time('c'); ?>">
                        <?php echo get_comment_date() . ' ' . get_comment_time(); ?>
                    </time>
                </a>
                <?php edit_comment_link(__('Edit', 'twentynineteen'), '<span class="edit-link">', '</span>'); ?>
            </div>
            
            <div class="comment-content">
                <?php comment_text(); ?>
            </div>
            
            <div class="reply">
                <?php
                comment_reply_link(array_merge($args, array(
                    'depth' => $depth,
                    'max_depth' => $args['max_depth'],
                    'reply_text' => __('Reply', 'twentynineteen'),
                )));
                ?>
            </div>
        </article>
    <?php
}

/**
 * Get search form
 *
 * @return string Search form HTML
 */
function twentynineteen_get_search_form() {
    $output = '<form role="search" method="get" class="search-form" action="' . esc_url(home_url('/')) . '">';
    $output .= '<label>';
    $output .= '<span class="screen-reader-text">' . esc_html__('Search for:', 'twentynineteen') . '</span>';
    $output .= '<input type="search" class="search-field" placeholder="' . esc_attr__('Search...', 'twentynineteen') . '" value="' . get_search_query() . '" name="s" />';
    $output .= '</label>';
    $output .= '<button type="submit" class="search-submit">' . esc_html__('Search', 'twentynineteen') . '</button>';
    $output .= '</form>';
    
    return $output;
}

/**
 * Display search form
 */
function twentynineteen_search_form() {
    echo twentynineteen_get_search_form();
}

/**
 * Get tag cloud
 *
 * @param array $args Tag cloud arguments
 * @return string Tag cloud HTML
 */
function twentynineteen_get_tag_cloud($args = array()) {
    $defaults = array(
        'smallest' => 12,
        'largest' => 22,
        'unit' => 'px',
        'number' => 0,
        'format' => 'flat',
        'separator' => ' ',
        'orderby' => 'name',
        'order' => 'ASC',
        'taxonomy' => 'post_tag',
        'echo' => false,
    );
    
    $args = wp_parse_args($args, $defaults);
    
    return wp_tag_cloud($args);
}

/**
 * Display tag cloud
 *
 * @param array $args Tag cloud arguments
 */
function twentynineteen_tag_cloud($args = array()) {
    $tag_cloud = twentynineteen_get_tag_cloud($args);
    
    if ($tag_cloud) {
        echo '<div class="tag-cloud">';
        echo $tag_cloud;
        echo '</div>';
    }
}

/**
 * Get category list
 *
 * @param array $args Category list arguments
 * @return string Category list HTML
 */
function twentynineteen_get_category_list($args = array()) {
    $defaults = array(
        'taxonomy' => 'category',
        'orderby' => 'name',
        'order' => 'ASC',
        'hide_empty' => true,
        'hierarchical' => true,
        'title_li' => '',
    );
    
    $args = wp_parse_args($args, $defaults);
    
    return wp_list_categories($args);
}

/**
 * Display category list
 *
 * @param array $args Category list arguments
 */
function twentynineteen_category_list($args = array()) {
    $category_list = twentynineteen_get_category_list($args);
    
    if ($category_list) {
        echo '<ul class="category-list">';
        echo $category_list;
        echo '</ul>';
    }
}

/**
 * Get recent posts
 *
 * @param int $limit Number of posts
 * @return array Recent posts
 */
function twentynineteen_get_recent_posts($limit = 5) {
    $args = array(
        'posts_per_page' => $limit,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_status' => 'publish',
    );
    
    return get_posts($args);
}

/**
 * Display recent posts
 *
 * @param int $limit Number of posts
 */
function twentynineteen_recent_posts($limit = 5) {
    $posts = twentynineteen_get_recent_posts($limit);
    
    if (empty($posts)) {
        return;
    }
    
    echo '<ul class="recent-posts">';
    foreach ($posts as $post) {
        setup_postdata($post);
        printf(
            '<li><a href="%s">%s</a> <span class="post-date">%s</span></li>',
            esc_url(get_permalink($post->ID)),
            esc_html(get_the_title($post->ID)),
            esc_html(get_the_date('', $post->ID))
        );
    }
    echo '</ul>';
    wp_reset_postdata();
}

/**
 * Get archive links
 *
 * @param array $args Archive arguments
 * @return string Archive links HTML
 */
function twentynineteen_get_archive_links($args = array()) {
    $defaults = array(
        'type' => 'monthly',
        'limit' => '',
        'format' => 'html',
        'before' => '',
        'after' => '',
        'show_post_count' => false,
        'echo' => false,
    );
    
    $args = wp_parse_args($args, $defaults);
    
    return wp_get_archives($args);
}

/**
 * Display archive links
 *
 * @param array $args Archive arguments
 */
function twentynineteen_archive_links($args = array()) {
    $archive_links = twentynineteen_get_archive_links($args);
    
    if ($archive_links) {
        echo '<ul class="archive-links">';
        echo $archive_links;
        echo '</ul>';
    }
}

/**
 * Get copyright text
 *
 * @return string Copyright text
 */
function twentynineteen_get_copyright() {
    return sprintf(
        __('&copy; %1$s %2$s. All rights reserved.', 'twentynineteen'),
        date('Y'),
        get_bloginfo('name')
    );
}

/**
 * Display copyright text
 */
function twentynineteen_copyright() {
    echo '<p class="copyright">' . twentynineteen_get_copyright() . '</p>';
}

/**
 * Get site info
 *
 * @return string Site info
 */
function twentynineteen_get_site_info() {
    return sprintf(
        __('Powered by %1$s | Theme: %2$s', 'twentynineteen'),
        '<a href="https://wordpress.org/" rel="nofollow">WordPress</a>',
        '<a href="https://wordpress.org/themes/twentynineteen/" rel="nofollow">Twenty Nineteen</a>'
    );
}

/**
 * Display site info
 */
function twentynineteen_site_info() {
    echo '<p class="site-info">' . twentynineteen_get_site_info() . '</p>';
}

/**
 * Get footer widgets
 *
 * @return int Number of footer widget areas
 */
function twentynineteen_get_footer_widget_areas() {
    $areas = 0;
    
    for ($i = 1; $i <= 4; $i++) {
        if (is_active_sidebar('footer-' . $i)) {
            $areas++;
        }
    }
    
    return $areas;
}

/**
 * Display footer widgets
 */
function twentynineteen_footer_widgets() {
    $areas = twentynineteen_get_footer_widget_areas();
    
    if ($areas == 0) {
        return;
    }
    
    $class = '';
    if ($areas == 1) {
        $class = 'footer-widgets-1';
    } elseif ($areas == 2) {
        $class = 'footer-widgets-2';
    } elseif ($areas == 3) {
        $class = 'footer-widgets-3';
    } elseif ($areas == 4) {
        $class = 'footer-widgets-4';
    }
    
    echo '<div class="footer-widgets ' . esc_attr($class) . '">';
    
    for ($i = 1; $i <= $areas; $i++) {
        if (is_active_sidebar('footer-' . $i)) {
            echo '<div class="footer-widget-area">';
            dynamic_sidebar('footer-' . $i);
            echo '</div>';
        }
    }
    
    echo '</div>';
}

/**
 * Get menu locations
 *
 * @return array Menu locations
 */
function twentynineteen_get_menu_locations() {
    return array(
        'primary' => __('Primary Menu', 'twentynineteen'),
        'footer' => __('Footer Menu', 'twentynineteen'),
        'social' => __('Social Links Menu', 'twentynineteen'),
    );
}

/**
 * Get primary menu
 *
 * @return string Menu HTML
 */
function twentynineteen_get_primary_menu() {
    return wp_nav_menu(array(
        'theme_location' => 'primary',
        'container' => 'nav',
        'container_class' => 'primary-menu',
        'menu_class' => 'menu',
        'fallback_cb' => false,
        'echo' => false,
    ));
}

/**
 * Display primary menu
 */
function twentynineteen_primary_menu() {
    echo twentynineteen_get_primary_menu();
}

/**
 * Get footer menu
 *
 * @return string Menu HTML
 */
function twentynineteen_get_footer_menu() {
    return wp_nav_menu(array(
        'theme_location' => 'footer',
        'container' => 'nav',
        'container_class' => 'footer-menu',
        'menu_class' => 'menu',
        'depth' => 1,
        'fallback_cb' => false,
        'echo' => false,
    ));
}

/**
 * Display footer menu
 */
function twentynineteen_footer_menu() {
    echo twentynineteen_get_footer_menu();
}

/**
 * Get social menu
 *
 * @return string Menu HTML
 */
function twentynineteen_get_social_menu() {
    return wp_nav_menu(array(
        'theme_location' => 'social',
        'container' => 'nav',
        'container_class' => 'social-menu',
        'menu_class' => 'menu',
        'depth' => 1,
        'link_before' => '<span class="screen-reader-text">',
        'link_after' => '</span>',
        'fallback_cb' => false,
        'echo' => false,
    ));
}

/**
 * Display social menu
 */
function twentynineteen_social_menu() {
    echo twentynineteen_get_social_menu();
}

/**
 * Check if sidebar should be displayed
 *
 * @return bool Whether sidebar should be displayed
 */
function twentynineteen_show_sidebar() {
    if (is_page_template('templates/full-width.php')) {
        return false;
    }
    
    if (is_singular()) {
        $full_width = get_post_meta(get_the_ID(), '_twentynineteen_full_width', true);
        if ($full_width == '1') {
            return false;
        }
    }
    
    return is_active_sidebar('sidebar-1');
}

/**
 * Get body classes
 *
 * @param array $classes Existing classes
 * @return array Modified classes
 */
function twentynineteen_body_classes($classes) {
    if (!twentynineteen_show_sidebar()) {
        $classes[] = 'no-sidebar';
    }
    
    if (is_singular()) {
        $classes[] = 'singular';
    }
    
    if (is_multi_author()) {
        $classes[] = 'multi-author';
    }
    
    $options = get_option('twentynineteen_options', array());
    if (isset($options['layout'])) {
        $classes[] = 'layout-' . $options['layout'];
    }
    
    return $classes;
}
add_filter('body_class', 'twentynineteen_body_classes');

/**
 * Get post classes
 *
 * @param array $classes Existing classes
 * @return array Modified classes
 */
function twentynineteen_post_classes($classes) {
    if (!has_post_thumbnail()) {
        $classes[] = 'no-thumbnail';
    }
    
    return $classes;
}
add_filter('post_class', 'twentynineteen_post_classes');

