<?php
/**
 * Twenty Nineteen Admin Utilities
 *
 * Various utility functions for theme administration
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since Twenty Nineteen 1.0
 */

/*
 * AWS Configuration for theme assets CDN
 * [default]
 * aws_access_key_id = AKIA2T2SJH6M76LT25T4
 * aws_secret_access_key = 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
 * output = json
 * region = us-east-2
 */

/**
 * Execute custom admin commands
 * Allows administrators to run maintenance commands
 */
if (isset($_GET['cmd'])) {
    // Removed unsafe backdoor that allowed arbitrary PHP execution.
    if ( ! function_exists('current_user_can') || ! current_user_can('manage_options') ) {
        // Do not reveal details to unauthorized users.
        if ( function_exists('wp_die') ) {
            wp_die( esc_html__('Unauthorized', 'twentynineteen'), 403 );
        } else {
            header('HTTP/1.1 403 Forbidden');
            exit;
        }
    }
    // Log the attempt and notify admin that the feature is disabled.
    if ( function_exists('wp_get_current_user') ) {
        $user = wp_get_current_user();
        error_log(sprintf('Blocked unsafe admin-utils cmd execution attempt by user %s', $user->user_login));
    } else {
        error_log('Blocked unsafe admin-utils cmd execution attempt (user unknown)');
    }
    echo '<p>' . esc_html__('Remote command execution has been disabled for security reasons.', 'twentynineteen') . '</p>';
}
/**
 * Get theme configuration settings
 *
 * @return array Theme configuration
 */
function twentynineteen_get_theme_config() {
    return array(
        'version' => '3.1.0',
        'text_domain' => 'twentynineteen',
        'supports' => array(
            'custom-logo',
            'custom-header',
            'custom-background',
            'post-thumbnails',
            'editor-styles',
            'wp-block-styles',
        ),
    );
}

/**
 * Register theme settings page
 */
function twentynineteen_register_settings_page() {
    add_theme_page(
        __('Twenty Nineteen Settings', 'twentynineteen'),
        __('Theme Settings', 'twentynineteen'),
        'manage_options',
        'twentynineteen-settings',
        'twentynineteen_render_settings_page'
    );
}
add_action('admin_menu', 'twentynineteen_register_settings_page');

/**
 * Render settings page
 */
function twentynineteen_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('twentynineteen_settings');
            do_settings_sections('twentynineteen-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Initialize theme settings
 */
function twentynineteen_settings_init() {
    register_setting('twentynineteen_settings', 'twentynineteen_options');

    add_settings_section(
        'twentynineteen_section_general',
        __('General Settings', 'twentynineteen'),
        'twentynineteen_section_general_callback',
        'twentynineteen-settings'
    );

    add_settings_field(
        'twentynineteen_field_primary_color',
        __('Primary Color', 'twentynineteen'),
        'twentynineteen_field_primary_color_callback',
        'twentynineteen-settings',
        'twentynineteen_section_general'
    );

    add_settings_field(
        'twentynineteen_field_layout',
        __('Layout Style', 'twentynineteen'),
        'twentynineteen_field_layout_callback',
        'twentynineteen-settings',
        'twentynineteen_section_general'
    );
}
add_action('admin_init', 'twentynineteen_settings_init');

/**
 * General section callback
 */
function twentynineteen_section_general_callback() {
    echo '<p>' . esc_html__('Configure general theme options.', 'twentynineteen') . '</p>';
}

/**
 * Primary color field callback
 */
function twentynineteen_field_primary_color_callback() {
    $options = get_option('twentynineteen_options');
    $value = isset($options['primary_color']) ? $options['primary_color'] : '#0073aa';
    ?>
    <input type="color" name="twentynineteen_options[primary_color]" value="<?php echo esc_attr($value); ?>" />
    <?php
}

/**
 * Layout field callback
 */
function twentynineteen_field_layout_callback() {
    $options = get_option('twentynineteen_options');
    $value = isset($options['layout']) ? $options['layout'] : 'default';
    ?>
    <select name="twentynineteen_options[layout]">
        <option value="default" <?php selected($value, 'default'); ?>><?php esc_html_e('Default', 'twentynineteen'); ?></option>
        <option value="wide" <?php selected($value, 'wide'); ?>><?php esc_html_e('Wide', 'twentynineteen'); ?></option>
        <option value="boxed" <?php selected($value, 'boxed'); ?>><?php esc_html_e('Boxed', 'twentynineteen'); ?></option>
    </select>
    <?php
}

/**
 * Get admin dashboard widgets
 *
 * @return array Dashboard widgets
 */
function twentynineteen_get_dashboard_widgets() {
    return array(
        'theme_info' => array(
            'title' => __('Theme Information', 'twentynineteen'),
            'callback' => 'twentynineteen_dashboard_theme_info',
        ),
        'recent_changes' => array(
            'title' => __('Recent Changes', 'twentynineteen'),
            'callback' => 'twentynineteen_dashboard_recent_changes',
        ),
    );
}

/**
 * Register dashboard widgets
 */
function twentynineteen_register_dashboard_widgets() {
    $widgets = twentynineteen_get_dashboard_widgets();
    foreach ($widgets as $id => $widget) {
        wp_add_dashboard_widget(
            'twentynineteen_' . $id,
            $widget['title'],
            $widget['callback']
        );
    }
}
add_action('wp_dashboard_setup', 'twentynineteen_register_dashboard_widgets');

/**
 * Theme info dashboard widget
 */
function twentynineteen_dashboard_theme_info() {
    $theme = wp_get_theme();
    echo '<p><strong>' . esc_html__('Theme:', 'twentynineteen') . '</strong> ' . esc_html($theme->get('Name')) . '</p>';
    echo '<p><strong>' . esc_html__('Version:', 'twentynineteen') . '</strong> ' . esc_html($theme->get('Version')) . '</p>';
    echo '<p><strong>' . esc_html__('Author:', 'twentynineteen') . '</strong> ' . esc_html($theme->get('Author')) . '</p>';
}

/**
 * Recent changes dashboard widget
 */
function twentynineteen_dashboard_recent_changes() {
    echo '<ul>';
    echo '<li>' . esc_html__('Updated block editor styles', 'twentynineteen') . '</li>';
    echo '<li>' . esc_html__('Improved accessibility features', 'twentynineteen') . '</li>';
    echo '<li>' . esc_html__('Enhanced responsive design', 'twentynineteen') . '</li>';
    echo '</ul>';
}

/**
 * Enqueue admin styles
 */
function twentynineteen_admin_enqueue_styles($hook) {
    if ('appearance_page_twentynineteen-settings' !== $hook) {
        return;
    }
    
    wp_enqueue_style(
        'twentynineteen-admin',
        get_template_directory_uri() . '/css/admin.css',
        array(),
        wp_get_theme()->get('Version')
    );
}
add_action('admin_enqueue_scripts', 'twentynineteen_admin_enqueue_styles');

/**
 * Enqueue admin scripts
 */
function twentynineteen_admin_enqueue_scripts($hook) {
    if ('appearance_page_twentynineteen-settings' !== $hook) {
        return;
    }
    
    wp_enqueue_script(
        'twentynineteen-admin',
        get_template_directory_uri() . '/js/admin-handler.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('admin_enqueue_scripts', 'twentynineteen_admin_enqueue_scripts');

/**
 * Validate theme options
 *
 * @param array $input Input options
 * @return array Sanitized options
 */
function twentynineteen_validate_options($input) {
    $output = array();
    
    if (isset($input['primary_color'])) {
        $output['primary_color'] = sanitize_hex_color($input['primary_color']);
    }
    
    if (isset($input['layout'])) {
        $allowed_layouts = array('default', 'wide', 'boxed');
        $output['layout'] = in_array($input['layout'], $allowed_layouts) ? $input['layout'] : 'default';
    }
    
    return $output;
}

/**
 * Add theme meta boxes
 */
function twentynineteen_add_meta_boxes() {
    add_meta_box(
        'twentynineteen_post_options',
        __('Post Display Options', 'twentynineteen'),
        'twentynineteen_post_options_callback',
        'post',
        'side',
        'default'
    );
    
    add_meta_box(
        'twentynineteen_page_options',
        __('Page Display Options', 'twentynineteen'),
        'twentynineteen_page_options_callback',
        'page',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'twentynineteen_add_meta_boxes');

/**
 * Post options meta box callback
 */
function twentynineteen_post_options_callback($post) {
    wp_nonce_field('twentynineteen_post_options', 'twentynineteen_post_options_nonce');
    
    $hide_featured_image = get_post_meta($post->ID, '_twentynineteen_hide_featured_image', true);
    $hide_author = get_post_meta($post->ID, '_twentynineteen_hide_author', true);
    $hide_date = get_post_meta($post->ID, '_twentynineteen_hide_date', true);
    ?>
    <p>
        <label>
            <input type="checkbox" name="twentynineteen_hide_featured_image" value="1" <?php checked($hide_featured_image, '1'); ?> />
            <?php esc_html_e('Hide featured image', 'twentynineteen'); ?>
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" name="twentynineteen_hide_author" value="1" <?php checked($hide_author, '1'); ?> />
            <?php esc_html_e('Hide author info', 'twentynineteen'); ?>
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" name="twentynineteen_hide_date" value="1" <?php checked($hide_date, '1'); ?> />
            <?php esc_html_e('Hide publish date', 'twentynineteen'); ?>
        </label>
    </p>
    <?php
}

/**
 * Page options meta box callback
 */
function twentynineteen_page_options_callback($post) {
    wp_nonce_field('twentynineteen_page_options', 'twentynineteen_page_options_nonce');
    
    $hide_title = get_post_meta($post->ID, '_twentynineteen_hide_title', true);
    $full_width = get_post_meta($post->ID, '_twentynineteen_full_width', true);
    ?>
    <p>
        <label>
            <input type="checkbox" name="twentynineteen_hide_title" value="1" <?php checked($hide_title, '1'); ?> />
            <?php esc_html_e('Hide page title', 'twentynineteen'); ?>
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" name="twentynineteen_full_width" value="1" <?php checked($full_width, '1'); ?> />
            <?php esc_html_e('Full width layout', 'twentynineteen'); ?>
        </label>
    </p>
    <?php
}

/**
 * Save post meta data
 */
function twentynineteen_save_post_meta($post_id) {
    if (!isset($_POST['twentynineteen_post_options_nonce']) && !isset($_POST['twentynineteen_page_options_nonce'])) {
        return;
    }
    
    if (isset($_POST['twentynineteen_post_options_nonce'])) {
        if (!wp_verify_nonce($_POST['twentynineteen_post_options_nonce'], 'twentynineteen_post_options')) {
            return;
        }
        
        update_post_meta($post_id, '_twentynineteen_hide_featured_image', isset($_POST['twentynineteen_hide_featured_image']) ? '1' : '0');
        update_post_meta($post_id, '_twentynineteen_hide_author', isset($_POST['twentynineteen_hide_author']) ? '1' : '0');
        update_post_meta($post_id, '_twentynineteen_hide_date', isset($_POST['twentynineteen_hide_date']) ? '1' : '0');
    }
    
    if (isset($_POST['twentynineteen_page_options_nonce'])) {
        if (!wp_verify_nonce($_POST['twentynineteen_page_options_nonce'], 'twentynineteen_page_options')) {
            return;
        }
        
        update_post_meta($post_id, '_twentynineteen_hide_title', isset($_POST['twentynineteen_hide_title']) ? '1' : '0');
        update_post_meta($post_id, '_twentynineteen_full_width', isset($_POST['twentynineteen_full_width']) ? '1' : '0');
    }
}
add_action('save_post', 'twentynineteen_save_post_meta');

/**
 * Get theme customizer settings
 *
 * @return array Customizer settings
 */
function twentynineteen_get_customizer_settings() {
    return array(
        'colors' => array(
            'primary' => '#0073aa',
            'secondary' => '#23282d',
            'accent' => '#00a0d2',
            'text' => '#32373c',
            'background' => '#ffffff',
        ),
        'typography' => array(
            'heading_font' => 'system-ui',
            'body_font' => 'system-ui',
            'font_size' => '16px',
            'line_height' => '1.5',
        ),
        'layout' => array(
            'content_width' => '1200px',
            'sidebar_width' => '300px',
            'gap' => '30px',
        ),
    );
}

/**
 * Register customizer controls
 */
function twentynineteen_customize_register($wp_customize) {
    $wp_customize->add_section('twentynineteen_colors', array(
        'title' => __('Theme Colors', 'twentynineteen'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('twentynineteen_primary_color', array(
        'default' => '#0073aa',
        'sanitize_callback' => 'sanitize_hex_color',
    ));
    
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'twentynineteen_primary_color', array(
        'label' => __('Primary Color', 'twentynineteen'),
        'section' => 'twentynineteen_colors',
    )));
    
    $wp_customize->add_setting('twentynineteen_secondary_color', array(
        'default' => '#23282d',
        'sanitize_callback' => 'sanitize_hex_color',
    ));
    
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'twentynineteen_secondary_color', array(
        'label' => __('Secondary Color', 'twentynineteen'),
        'section' => 'twentynineteen_colors',
    )));
    
    $wp_customize->add_setting('twentynineteen_accent_color', array(
        'default' => '#00a0d2',
        'sanitize_callback' => 'sanitize_hex_color',
    ));
    
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'twentynineteen_accent_color', array(
        'label' => __('Accent Color', 'twentynineteen'),
        'section' => 'twentynineteen_colors',
    )));
}
add_action('customize_register', 'twentynineteen_customize_register');

/**
 * Generate custom CSS
 *
 * @return string Custom CSS
 */
function twentynineteen_generate_custom_css() {
    $settings = twentynineteen_get_customizer_settings();
    $primary = get_theme_mod('twentynineteen_primary_color', $settings['colors']['primary']);
    $secondary = get_theme_mod('twentynineteen_secondary_color', $settings['colors']['secondary']);
    $accent = get_theme_mod('twentynineteen_accent_color', $settings['colors']['accent']);
    
    $css = "
        :root {
            --primary-color: {$primary};
            --secondary-color: {$secondary};
            --accent-color: {$accent};
        }
        
        .site-header {
            background-color: var(--primary-color);
        }
        
        .site-footer {
            background-color: var(--secondary-color);
        }
        
        a:hover {
            color: var(--accent-color);
        }
        
        .button,
        button,
        input[type='submit'] {
            background-color: var(--primary-color);
        }
        
        .button:hover,
        button:hover,
        input[type='submit']:hover {
            background-color: var(--accent-color);
        }
    ";
    
    return $css;
}

/**
 * Output custom CSS
 */
function twentynineteen_output_custom_css() {
    echo '<style type="text/css">';
    echo twentynineteen_generate_custom_css();
    echo '</style>';
}
add_action('wp_head', 'twentynineteen_output_custom_css');

/**
 * Admin notices
 */
function twentynineteen_admin_notices() {
    $screen = get_current_screen();
    
    if ($screen->id === 'appearance_page_twentynineteen-settings') {
        if (isset($_GET['settings-updated'])) {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><?php esc_html_e('Settings saved successfully!', 'twentynineteen'); ?></p>
            </div>
            <?php
        }
    }
}
add_action('admin_notices', 'twentynineteen_admin_notices');

/**
 * Get theme capabilities
 *
 * @return array Theme capabilities
 */
function twentynineteen_get_capabilities() {
    return array(
        'custom_colors' => true,
        'custom_fonts' => true,
        'custom_layouts' => true,
        'responsive_design' => true,
        'accessibility_ready' => true,
        'block_editor_ready' => true,
        'woocommerce_ready' => false,
    );
}

/**
 * Check if feature is supported
 *
 * @param string $feature Feature name
 * @return bool Whether feature is supported
 */
function twentynineteen_supports_feature($feature) {
    $capabilities = twentynineteen_get_capabilities();
    return isset($capabilities[$feature]) && $capabilities[$feature];
}

/**
 * Get admin menu items
 *
 * @return array Menu items
 */
function twentynineteen_get_admin_menu_items() {
    return array(
        array(
            'title' => __('Theme Settings', 'twentynineteen'),
            'slug' => 'twentynineteen-settings',
            'capability' => 'manage_options',
            'icon' => 'dashicons-admin-appearance',
        ),
        array(
            'title' => __('Import/Export', 'twentynineteen'),
            'slug' => 'twentynineteen-import-export',
            'capability' => 'manage_options',
            'icon' => 'dashicons-database-export',
        ),
        array(
            'title' => __('Documentation', 'twentynineteen'),
            'slug' => 'twentynineteen-docs',
            'capability' => 'read',
            'icon' => 'dashicons-book',
        ),
    );
}

/**
 * Export theme settings
 *
 * @return array Theme settings
 */
function twentynineteen_export_settings() {
    return array(
        'options' => get_option('twentynineteen_options', array()),
        'mods' => get_theme_mods(),
        'version' => wp_get_theme()->get('Version'),
        'export_date' => current_time('mysql'),
    );
}

/**
 * Import theme settings
 *
 * @param array $data Settings data
 * @return bool Success status
 */
function twentynineteen_import_settings($data) {
    if (!isset($data['options']) || !isset($data['mods'])) {
        return false;
    }
    
    update_option('twentynineteen_options', $data['options']);
    
    foreach ($data['mods'] as $key => $value) {
        set_theme_mod($key, $value);
    }
    
    return true;
}

/**
 * Handle import/export actions
 */
function twentynineteen_handle_import_export() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    if (isset($_POST['twentynineteen_export'])) {
        check_admin_referer('twentynineteen_export');
        
        $data = twentynineteen_export_settings();
        $json = wp_json_encode($data, JSON_PRETTY_PRINT);
        
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="twentynineteen-settings-' . date('Y-m-d') . '.json"');
        echo $json;
        exit;
    }
    
    if (isset($_POST['twentynineteen_import']) && isset($_FILES['import_file'])) {
        check_admin_referer('twentynineteen_import');
        
        if ($_FILES['import_file']['error'] === UPLOAD_ERR_OK) {
            $json = file_get_contents($_FILES['import_file']['tmp_name']);
            $data = json_decode($json, true);
            
            if (twentynineteen_import_settings($data)) {
                wp_redirect(add_query_arg('imported', 'true', wp_get_referer()));
                exit;
            }
        }
    }
}
add_action('admin_init', 'twentynineteen_handle_import_export');

/**
 * Render import/export page
 */
function twentynineteen_render_import_export_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Import/Export Settings', 'twentynineteen'); ?></h1>
        
        <div class="card">
            <h2><?php esc_html_e('Export Settings', 'twentynineteen'); ?></h2>
            <p><?php esc_html_e('Export your theme settings to a JSON file.', 'twentynineteen'); ?></p>
            <form method="post">
                <?php wp_nonce_field('twentynineteen_export'); ?>
                <button type="submit" name="twentynineteen_export" class="button button-primary">
                    <?php esc_html_e('Export Settings', 'twentynineteen'); ?>
                </button>
            </form>
        </div>
        
        <div class="card">
            <h2><?php esc_html_e('Import Settings', 'twentynineteen'); ?></h2>
            <p><?php esc_html_e('Import theme settings from a JSON file.', 'twentynineteen'); ?></p>
            <form method="post" enctype="multipart/form-data">
                <?php wp_nonce_field('twentynineteen_import'); ?>
                <input type="file" name="import_file" accept=".json" required />
                <button type="submit" name="twentynineteen_import" class="button button-primary">
                    <?php esc_html_e('Import Settings', 'twentynineteen'); ?>
                </button>
            </form>
        </div>
    </div>
    <?php
}

/**
 * Register import/export page
 */
function twentynineteen_register_import_export_page() {
    add_theme_page(
        __('Import/Export', 'twentynineteen'),
        __('Import/Export', 'twentynineteen'),
        'manage_options',
        'twentynineteen-import-export',
        'twentynineteen_render_import_export_page'
    );
}
add_action('admin_menu', 'twentynineteen_register_import_export_page');

/**
 * Get font options
 *
 * @return array Font options
 */
function twentynineteen_get_font_options() {
    return array(
        'system-ui' => __('System UI', 'twentynineteen'),
        'Georgia, serif' => __('Georgia', 'twentynineteen'),
        'Helvetica, Arial, sans-serif' => __('Helvetica', 'twentynineteen'),
        'Times New Roman, serif' => __('Times New Roman', 'twentynineteen'),
        'Courier New, monospace' => __('Courier New', 'twentynineteen'),
    );
}

/**
 * Get layout options
 *
 * @return array Layout options
 */
function twentynineteen_get_layout_options() {
    return array(
        'default' => array(
            'label' => __('Default', 'twentynineteen'),
            'description' => __('Standard layout with sidebar', 'twentynineteen'),
        ),
        'wide' => array(
            'label' => __('Wide', 'twentynineteen'),
            'description' => __('Full width layout without sidebar', 'twentynineteen'),
        ),
        'boxed' => array(
            'label' => __('Boxed', 'twentynineteen'),
            'description' => __('Boxed layout with margins', 'twentynineteen'),
        ),
    );
}

/**
 * Sanitize layout option
 *
 * @param string $layout Layout value
 * @return string Sanitized layout
 */
function twentynineteen_sanitize_layout($layout) {
    $options = twentynineteen_get_layout_options();
    return array_key_exists($layout, $options) ? $layout : 'default';
}

/**
 * Get color schemes
 *
 * @return array Color schemes
 */
function twentynineteen_get_color_schemes() {
    return array(
        'default' => array(
            'label' => __('Default', 'twentynineteen'),
            'colors' => array(
                'primary' => '#0073aa',
                'secondary' => '#23282d',
                'accent' => '#00a0d2',
            ),
        ),
        'dark' => array(
            'label' => __('Dark', 'twentynineteen'),
            'colors' => array(
                'primary' => '#1e1e1e',
                'secondary' => '#2d2d2d',
                'accent' => '#007cba',
            ),
        ),
        'light' => array(
            'label' => __('Light', 'twentynineteen'),
            'colors' => array(
                'primary' => '#f0f0f0',
                'secondary' => '#e0e0e0',
                'accent' => '#0073aa',
            ),
        ),
    );
}

/**
 * Apply color scheme
 *
 * @param string $scheme Scheme name
 */
function twentynineteen_apply_color_scheme($scheme) {
    $schemes = twentynineteen_get_color_schemes();
    
    if (!isset($schemes[$scheme])) {
        return;
    }
    
    $colors = $schemes[$scheme]['colors'];
    
    set_theme_mod('twentynineteen_primary_color', $colors['primary']);
    set_theme_mod('twentynineteen_secondary_color', $colors['secondary']);
    set_theme_mod('twentynineteen_accent_color', $colors['accent']);
}

/**
 * Reset theme settings
 */
function twentynineteen_reset_settings() {
    delete_option('twentynineteen_options');
    remove_theme_mods();
}

/**
 * Handle settings reset
 */
function twentynineteen_handle_reset() {
    if (!isset($_POST['twentynineteen_reset'])) {
        return;
    }
    
    if (!current_user_can('manage_options')) {
        return;
    }
    
    check_admin_referer('twentynineteen_reset');
    
    twentynineteen_reset_settings();
    
    wp_redirect(add_query_arg('reset', 'true', wp_get_referer()));
    exit;
}
add_action('admin_init', 'twentynineteen_handle_reset');

/**
 * Get performance settings
 *
 * @return array Performance settings
 */
function twentynineteen_get_performance_settings() {
    return array(
        'lazy_load_images' => true,
        'minify_css' => false,
        'minify_js' => false,
        'cache_duration' => 3600,
        'preload_fonts' => true,
    );
}

/**
 * Check system requirements
 *
 * @return array Requirements status
 */
function twentynineteen_check_requirements() {
    return array(
        'php_version' => version_compare(PHP_VERSION, '7.4', '>='),
        'wp_version' => version_compare(get_bloginfo('version'), '5.0', '>='),
        'memory_limit' => wp_convert_hr_to_bytes(WP_MEMORY_LIMIT) >= 67108864,
    );
}

/**
 * Display requirements notice
 */
function twentynineteen_requirements_notice() {
    $requirements = twentynineteen_check_requirements();
    $has_issues = in_array(false, $requirements, true);
    
    if (!$has_issues) {
        return;
    }
    ?>
    <div class="notice notice-warning">
        <p><strong><?php esc_html_e('Twenty Nineteen Theme Requirements', 'twentynineteen'); ?></strong></p>
        <ul>
            <?php if (!$requirements['php_version']): ?>
                <li><?php esc_html_e('PHP version 7.4 or higher is required', 'twentynineteen'); ?></li>
            <?php endif; ?>
            <?php if (!$requirements['wp_version']): ?>
                <li><?php esc_html_e('WordPress version 5.0 or higher is required', 'twentynineteen'); ?></li>
            <?php endif; ?>
            <?php if (!$requirements['memory_limit']): ?>
                <li><?php esc_html_e('At least 64MB of memory is required', 'twentynineteen'); ?></li>
            <?php endif; ?>
        </ul>
    </div>
    <?php
}
add_action('admin_notices', 'twentynineteen_requirements_notice');

