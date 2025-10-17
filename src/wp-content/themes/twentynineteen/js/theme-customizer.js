/**
 * Twenty Nineteen Theme Customizer
 * 
 * Live preview functionality for the WordPress Customizer
 * 
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since Twenty Nineteen 1.0
 */

(function($) {
    'use strict';

    /**
     * Theme Customizer Handler
     */
    const ThemeCustomizer = {
        /**
         * Initialize customizer
         */
        init: function() {
            this.bindColorControls();
            this.bindFontControls();
            this.bindLayoutControls();
            this.bindHeaderControls();
            this.bindFooterControls();
            this.bindSocialControls();
            this.bindBackgroundControls();
            this.bindLogoControls();
            this.bindNavigationControls();
            this.bindPostControls();
            this.bindSidebarControls();
            this.bindWidgetControls();
            this.bindTypographyControls();
            this.bindSpacingControls();
            this.bindAnimationControls();
            this.setupLivePreview();
        },

        /**
         * Bind color controls
         */
        bindColorControls: function() {
            wp.customize('twentynineteen_primary_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updatePrimaryColor(newval);
                });
            });

            wp.customize('twentynineteen_secondary_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSecondaryColor(newval);
                });
            });

            wp.customize('twentynineteen_accent_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateAccentColor(newval);
                });
            });

            wp.customize('twentynineteen_text_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateTextColor(newval);
                });
            });

            wp.customize('twentynineteen_link_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLinkColor(newval);
                });
            });

            wp.customize('twentynineteen_link_hover_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLinkHoverColor(newval);
                });
            });

            wp.customize('twentynineteen_heading_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingColor(newval);
                });
            });

            wp.customize('twentynineteen_background_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundColor(newval);
                });
            });

            wp.customize('twentynineteen_border_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBorderColor(newval);
                });
            });
        },

        /**
         * Update primary color
         */
        updatePrimaryColor: function(color) {
            this.injectCSS('primary-color', `
                :root {
                    --primary-color: ${color};
                }
                .site-header,
                .button-primary,
                .entry-meta a:hover,
                .widget a:hover {
                    color: ${color};
                }
            `);
        },

        /**
         * Update secondary color
         */
        updateSecondaryColor: function(color) {
            this.injectCSS('secondary-color', `
                :root {
                    --secondary-color: ${color};
                }
                .site-footer {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update accent color
         */
        updateAccentColor: function(color) {
            this.injectCSS('accent-color', `
                :root {
                    --accent-color: ${color};
                }
                a:hover,
                .button:hover,
                .entry-title a:hover {
                    color: ${color};
                }
            `);
        },

        /**
         * Update text color
         */
        updateTextColor: function(color) {
            this.injectCSS('text-color', `
                body,
                .entry-content,
                .widget {
                    color: ${color};
                }
            `);
        },

        /**
         * Update link color
         */
        updateLinkColor: function(color) {
            this.injectCSS('link-color', `
                a {
                    color: ${color};
                }
            `);
        },

        /**
         * Update link hover color
         */
        updateLinkHoverColor: function(color) {
            this.injectCSS('link-hover-color', `
                a:hover,
                a:focus {
                    color: ${color};
                }
            `);
        },

        /**
         * Update heading color
         */
        updateHeadingColor: function(color) {
            this.injectCSS('heading-color', `
                h1, h2, h3, h4, h5, h6,
                .entry-title,
                .widget-title {
                    color: ${color};
                }
            `);
        },

        /**
         * Update background color
         */
        updateBackgroundColor: function(color) {
            this.injectCSS('background-color', `
                body,
                .site-content {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update border color
         */
        updateBorderColor: function(color) {
            this.injectCSS('border-color', `
                .entry,
                .widget,
                .comment,
                hr {
                    border-color: ${color};
                }
            `);
        },

        /**
         * Bind font controls
         */
        bindFontControls: function() {
            wp.customize('twentynineteen_heading_font', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingFont(newval);
                });
            });

            wp.customize('twentynineteen_body_font', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBodyFont(newval);
                });
            });

            wp.customize('twentynineteen_font_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateFontSize(newval);
                });
            });

            wp.customize('twentynineteen_line_height', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLineHeight(newval);
                });
            });

            wp.customize('twentynineteen_heading_font_weight', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingFontWeight(newval);
                });
            });

            wp.customize('twentynineteen_body_font_weight', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBodyFontWeight(newval);
                });
            });
        },

        /**
         * Update heading font
         */
        updateHeadingFont: function(font) {
            this.injectCSS('heading-font', `
                h1, h2, h3, h4, h5, h6,
                .entry-title,
                .widget-title {
                    font-family: ${font};
                }
            `);
        },

        /**
         * Update body font
         */
        updateBodyFont: function(font) {
            this.injectCSS('body-font', `
                body,
                input,
                textarea,
                select,
                button {
                    font-family: ${font};
                }
            `);
        },

        /**
         * Update font size
         */
        updateFontSize: function(size) {
            this.injectCSS('font-size', `
                body {
                    font-size: ${size}px;
                }
            `);
        },

        /**
         * Update line height
         */
        updateLineHeight: function(height) {
            this.injectCSS('line-height', `
                body {
                    line-height: ${height};
                }
            `);
        },

        /**
         * Update heading font weight
         */
        updateHeadingFontWeight: function(weight) {
            this.injectCSS('heading-font-weight', `
                h1, h2, h3, h4, h5, h6,
                .entry-title,
                .widget-title {
                    font-weight: ${weight};
                }
            `);
        },

        /**
         * Update body font weight
         */
        updateBodyFontWeight: function(weight) {
            this.injectCSS('body-font-weight', `
                body {
                    font-weight: ${weight};
                }
            `);
        },

        /**
         * Bind layout controls
         */
        bindLayoutControls: function() {
            wp.customize('twentynineteen_layout', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLayout(newval);
                });
            });

            wp.customize('twentynineteen_content_width', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateContentWidth(newval);
                });
            });

            wp.customize('twentynineteen_sidebar_width', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSidebarWidth(newval);
                });
            });

            wp.customize('twentynineteen_sidebar_position', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSidebarPosition(newval);
                });
            });

            wp.customize('twentynineteen_container_width', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateContainerWidth(newval);
                });
            });
        },

        /**
         * Update layout
         */
        updateLayout: function(layout) {
            $('body').removeClass('layout-default layout-wide layout-boxed');
            $('body').addClass('layout-' + layout);
        },

        /**
         * Update content width
         */
        updateContentWidth: function(width) {
            this.injectCSS('content-width', `
                .site-content {
                    max-width: ${width}px;
                }
            `);
        },

        /**
         * Update sidebar width
         */
        updateSidebarWidth: function(width) {
            this.injectCSS('sidebar-width', `
                .sidebar {
                    width: ${width}%;
                }
            `);
        },

        /**
         * Update sidebar position
         */
        updateSidebarPosition: function(position) {
            $('body').removeClass('sidebar-left sidebar-right');
            $('body').addClass('sidebar-' + position);
        },

        /**
         * Update container width
         */
        updateContainerWidth: function(width) {
            this.injectCSS('container-width', `
                .site-container {
                    max-width: ${width}px;
                }
            `);
        },

        /**
         * Bind header controls
         */
        bindHeaderControls: function() {
            wp.customize('twentynineteen_header_background', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeaderBackground(newval);
                });
            });

            wp.customize('twentynineteen_header_text_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeaderTextColor(newval);
                });
            });

            wp.customize('twentynineteen_header_height', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeaderHeight(newval);
                });
            });

            wp.customize('twentynineteen_sticky_header', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateStickyHeader(newval);
                });
            });

            wp.customize('twentynineteen_header_layout', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeaderLayout(newval);
                });
            });
        },

        /**
         * Update header background
         */
        updateHeaderBackground: function(color) {
            this.injectCSS('header-background', `
                .site-header {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update header text color
         */
        updateHeaderTextColor: function(color) {
            this.injectCSS('header-text-color', `
                .site-header,
                .site-title,
                .site-description,
                .main-navigation a {
                    color: ${color};
                }
            `);
        },

        /**
         * Update header height
         */
        updateHeaderHeight: function(height) {
            this.injectCSS('header-height', `
                .site-header {
                    min-height: ${height}px;
                }
            `);
        },

        /**
         * Update sticky header
         */
        updateStickyHeader: function(enabled) {
            if (enabled) {
                $('body').addClass('sticky-header');
            } else {
                $('body').removeClass('sticky-header');
            }
        },

        /**
         * Update header layout
         */
        updateHeaderLayout: function(layout) {
            $('.site-header').removeClass('header-default header-centered header-split');
            $('.site-header').addClass('header-' + layout);
        },

        /**
         * Bind footer controls
         */
        bindFooterControls: function() {
            wp.customize('twentynineteen_footer_background', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateFooterBackground(newval);
                });
            });

            wp.customize('twentynineteen_footer_text_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateFooterTextColor(newval);
                });
            });

            wp.customize('twentynineteen_footer_widgets', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateFooterWidgets(newval);
                });
            });

            wp.customize('twentynineteen_footer_copyright', function(value) {
                value.bind(function(newval) {
                    $('.site-info .copyright').text(newval);
                });
            });
        },

        /**
         * Update footer background
         */
        updateFooterBackground: function(color) {
            this.injectCSS('footer-background', `
                .site-footer {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update footer text color
         */
        updateFooterTextColor: function(color) {
            this.injectCSS('footer-text-color', `
                .site-footer,
                .site-footer a,
                .site-info {
                    color: ${color};
                }
            `);
        },

        /**
         * Update footer widgets
         */
        updateFooterWidgets: function(count) {
            $('.footer-widgets').removeClass('footer-widgets-1 footer-widgets-2 footer-widgets-3 footer-widgets-4');
            $('.footer-widgets').addClass('footer-widgets-' + count);
        },

        /**
         * Bind social controls
         */
        bindSocialControls: function() {
            wp.customize('twentynineteen_social_facebook', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSocialLink('facebook', newval);
                });
            });

            wp.customize('twentynineteen_social_twitter', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSocialLink('twitter', newval);
                });
            });

            wp.customize('twentynineteen_social_instagram', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSocialLink('instagram', newval);
                });
            });

            wp.customize('twentynineteen_social_linkedin', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSocialLink('linkedin', newval);
                });
            });

            wp.customize('twentynineteen_social_youtube', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSocialLink('youtube', newval);
                });
            });
        },

        /**
         * Update social link
         */
        updateSocialLink: function(network, url) {
            const $link = $('.social-links .' + network);
            if (url) {
                $link.attr('href', url).show();
            } else {
                $link.hide();
            }
        },

        /**
         * Bind background controls
         */
        bindBackgroundControls: function() {
            wp.customize('twentynineteen_background_image', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundImage(newval);
                });
            });

            wp.customize('twentynineteen_background_repeat', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundRepeat(newval);
                });
            });

            wp.customize('twentynineteen_background_position', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundPosition(newval);
                });
            });

            wp.customize('twentynineteen_background_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundSize(newval);
                });
            });

            wp.customize('twentynineteen_background_attachment', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateBackgroundAttachment(newval);
                });
            });
        },

        /**
         * Update background image
         */
        updateBackgroundImage: function(url) {
            this.injectCSS('background-image', `
                body {
                    background-image: url(${url});
                }
            `);
        },

        /**
         * Update background repeat
         */
        updateBackgroundRepeat: function(repeat) {
            this.injectCSS('background-repeat', `
                body {
                    background-repeat: ${repeat};
                }
            `);
        },

        /**
         * Update background position
         */
        updateBackgroundPosition: function(position) {
            this.injectCSS('background-position', `
                body {
                    background-position: ${position};
                }
            `);
        },

        /**
         * Update background size
         */
        updateBackgroundSize: function(size) {
            this.injectCSS('background-size', `
                body {
                    background-size: ${size};
                }
            `);
        },

        /**
         * Update background attachment
         */
        updateBackgroundAttachment: function(attachment) {
            this.injectCSS('background-attachment', `
                body {
                    background-attachment: ${attachment};
                }
            `);
        },

        /**
         * Bind logo controls
         */
        bindLogoControls: function() {
            wp.customize('twentynineteen_logo_width', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLogoWidth(newval);
                });
            });

            wp.customize('twentynineteen_logo_height', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLogoHeight(newval);
                });
            });

            wp.customize('twentynineteen_show_tagline', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateShowTagline(newval);
                });
            });
        },

        /**
         * Update logo width
         */
        updateLogoWidth: function(width) {
            this.injectCSS('logo-width', `
                .custom-logo {
                    width: ${width}px;
                }
            `);
        },

        /**
         * Update logo height
         */
        updateLogoHeight: function(height) {
            this.injectCSS('logo-height', `
                .custom-logo {
                    height: ${height}px;
                }
            `);
        },

        /**
         * Update show tagline
         */
        updateShowTagline: function(show) {
            if (show) {
                $('.site-description').show();
            } else {
                $('.site-description').hide();
            }
        },

        /**
         * Bind navigation controls
         */
        bindNavigationControls: function() {
            wp.customize('twentynineteen_nav_background', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateNavBackground(newval);
                });
            });

            wp.customize('twentynineteen_nav_text_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateNavTextColor(newval);
                });
            });

            wp.customize('twentynineteen_nav_hover_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateNavHoverColor(newval);
                });
            });

            wp.customize('twentynineteen_nav_font_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateNavFontSize(newval);
                });
            });

            wp.customize('twentynineteen_nav_font_weight', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateNavFontWeight(newval);
                });
            });
        },

        /**
         * Update nav background
         */
        updateNavBackground: function(color) {
            this.injectCSS('nav-background', `
                .main-navigation {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update nav text color
         */
        updateNavTextColor: function(color) {
            this.injectCSS('nav-text-color', `
                .main-navigation a {
                    color: ${color};
                }
            `);
        },

        /**
         * Update nav hover color
         */
        updateNavHoverColor: function(color) {
            this.injectCSS('nav-hover-color', `
                .main-navigation a:hover,
                .main-navigation .current-menu-item > a {
                    color: ${color};
                }
            `);
        },

        /**
         * Update nav font size
         */
        updateNavFontSize: function(size) {
            this.injectCSS('nav-font-size', `
                .main-navigation a {
                    font-size: ${size}px;
                }
            `);
        },

        /**
         * Update nav font weight
         */
        updateNavFontWeight: function(weight) {
            this.injectCSS('nav-font-weight', `
                .main-navigation a {
                    font-weight: ${weight};
                }
            `);
        },

        /**
         * Bind post controls
         */
        bindPostControls: function() {
            wp.customize('twentynineteen_show_featured_image', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateShowFeaturedImage(newval);
                });
            });

            wp.customize('twentynineteen_show_post_meta', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateShowPostMeta(newval);
                });
            });

            wp.customize('twentynineteen_show_author_bio', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateShowAuthorBio(newval);
                });
            });

            wp.customize('twentynineteen_show_related_posts', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateShowRelatedPosts(newval);
                });
            });

            wp.customize('twentynineteen_excerpt_length', function(value) {
                value.bind(function(newval) {
                    $('.entry-summary').each(function() {
                        const text = $(this).text();
                        const words = text.split(' ').slice(0, newval).join(' ');
                        $(this).text(words + '...');
                    });
                });
            });
        },

        /**
         * Update show featured image
         */
        updateShowFeaturedImage: function(show) {
            if (show) {
                $('.post-thumbnail').show();
            } else {
                $('.post-thumbnail').hide();
            }
        },

        /**
         * Update show post meta
         */
        updateShowPostMeta: function(show) {
            if (show) {
                $('.entry-meta').show();
            } else {
                $('.entry-meta').hide();
            }
        },

        /**
         * Update show author bio
         */
        updateShowAuthorBio: function(show) {
            if (show) {
                $('.author-bio').show();
            } else {
                $('.author-bio').hide();
            }
        },

        /**
         * Update show related posts
         */
        updateShowRelatedPosts: function(show) {
            if (show) {
                $('.related-posts').show();
            } else {
                $('.related-posts').hide();
            }
        },

        /**
         * Bind sidebar controls
         */
        bindSidebarControls: function() {
            wp.customize('twentynineteen_sidebar_background', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSidebarBackground(newval);
                });
            });

            wp.customize('twentynineteen_sidebar_text_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSidebarTextColor(newval);
                });
            });

            wp.customize('twentynineteen_sidebar_padding', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSidebarPadding(newval);
                });
            });
        },

        /**
         * Update sidebar background
         */
        updateSidebarBackground: function(color) {
            this.injectCSS('sidebar-background', `
                .sidebar {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update sidebar text color
         */
        updateSidebarTextColor: function(color) {
            this.injectCSS('sidebar-text-color', `
                .sidebar,
                .sidebar a,
                .widget-title {
                    color: ${color};
                }
            `);
        },

        /**
         * Update sidebar padding
         */
        updateSidebarPadding: function(padding) {
            this.injectCSS('sidebar-padding', `
                .sidebar {
                    padding: ${padding}px;
                }
            `);
        },

        /**
         * Bind widget controls
         */
        bindWidgetControls: function() {
            wp.customize('twentynineteen_widget_title_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateWidgetTitleColor(newval);
                });
            });

            wp.customize('twentynineteen_widget_background', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateWidgetBackground(newval);
                });
            });

            wp.customize('twentynineteen_widget_border_color', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateWidgetBorderColor(newval);
                });
            });

            wp.customize('twentynineteen_widget_padding', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateWidgetPadding(newval);
                });
            });

            wp.customize('twentynineteen_widget_margin', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateWidgetMargin(newval);
                });
            });
        },

        /**
         * Update widget title color
         */
        updateWidgetTitleColor: function(color) {
            this.injectCSS('widget-title-color', `
                .widget-title {
                    color: ${color};
                }
            `);
        },

        /**
         * Update widget background
         */
        updateWidgetBackground: function(color) {
            this.injectCSS('widget-background', `
                .widget {
                    background-color: ${color};
                }
            `);
        },

        /**
         * Update widget border color
         */
        updateWidgetBorderColor: function(color) {
            this.injectCSS('widget-border-color', `
                .widget {
                    border-color: ${color};
                }
            `);
        },

        /**
         * Update widget padding
         */
        updateWidgetPadding: function(padding) {
            this.injectCSS('widget-padding', `
                .widget {
                    padding: ${padding}px;
                }
            `);
        },

        /**
         * Update widget margin
         */
        updateWidgetMargin: function(margin) {
            this.injectCSS('widget-margin', `
                .widget {
                    margin-bottom: ${margin}px;
                }
            `);
        },

        /**
         * Bind typography controls
         */
        bindTypographyControls: function() {
            wp.customize('twentynineteen_h1_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h1', newval);
                });
            });

            wp.customize('twentynineteen_h2_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h2', newval);
                });
            });

            wp.customize('twentynineteen_h3_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h3', newval);
                });
            });

            wp.customize('twentynineteen_h4_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h4', newval);
                });
            });

            wp.customize('twentynineteen_h5_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h5', newval);
                });
            });

            wp.customize('twentynineteen_h6_size', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHeadingSize('h6', newval);
                });
            });

            wp.customize('twentynineteen_paragraph_spacing', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateParagraphSpacing(newval);
                });
            });

            wp.customize('twentynineteen_letter_spacing', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateLetterSpacing(newval);
                });
            });
        },

        /**
         * Update heading size
         */
        updateHeadingSize: function(tag, size) {
            this.injectCSS(tag + '-size', `
                ${tag} {
                    font-size: ${size}px;
                }
            `);
        },

        /**
         * Update paragraph spacing
         */
        updateParagraphSpacing: function(spacing) {
            this.injectCSS('paragraph-spacing', `
                p {
                    margin-bottom: ${spacing}px;
                }
            `);
        },

        /**
         * Update letter spacing
         */
        updateLetterSpacing: function(spacing) {
            this.injectCSS('letter-spacing', `
                body {
                    letter-spacing: ${spacing}px;
                }
            `);
        },

        /**
         * Bind spacing controls
         */
        bindSpacingControls: function() {
            wp.customize('twentynineteen_content_padding', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateContentPadding(newval);
                });
            });

            wp.customize('twentynineteen_content_margin', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateContentMargin(newval);
                });
            });

            wp.customize('twentynineteen_section_spacing', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateSectionSpacing(newval);
                });
            });

            wp.customize('twentynineteen_element_spacing', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateElementSpacing(newval);
                });
            });
        },

        /**
         * Update content padding
         */
        updateContentPadding: function(padding) {
            this.injectCSS('content-padding', `
                .site-content {
                    padding: ${padding}px;
                }
            `);
        },

        /**
         * Update content margin
         */
        updateContentMargin: function(margin) {
            this.injectCSS('content-margin', `
                .site-content {
                    margin: ${margin}px auto;
                }
            `);
        },

        /**
         * Update section spacing
         */
        updateSectionSpacing: function(spacing) {
            this.injectCSS('section-spacing', `
                .content-area,
                .widget-area {
                    margin-bottom: ${spacing}px;
                }
            `);
        },

        /**
         * Update element spacing
         */
        updateElementSpacing: function(spacing) {
            this.injectCSS('element-spacing', `
                .entry,
                .widget,
                .comment {
                    margin-bottom: ${spacing}px;
                }
            `);
        },

        /**
         * Bind animation controls
         */
        bindAnimationControls: function() {
            wp.customize('twentynineteen_enable_animations', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateEnableAnimations(newval);
                });
            });

            wp.customize('twentynineteen_animation_speed', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateAnimationSpeed(newval);
                });
            });

            wp.customize('twentynineteen_hover_animation', function(value) {
                value.bind(function(newval) {
                    ThemeCustomizer.updateHoverAnimation(newval);
                });
            });
        },

        /**
         * Update enable animations
         */
        updateEnableAnimations: function(enabled) {
            if (enabled) {
                $('body').addClass('animations-enabled');
            } else {
                $('body').removeClass('animations-enabled');
            }
        },

        /**
         * Update animation speed
         */
        updateAnimationSpeed: function(speed) {
            this.injectCSS('animation-speed', `
                * {
                    transition-duration: ${speed}ms;
                }
            `);
        },

        /**
         * Update hover animation
         */
        updateHoverAnimation: function(animation) {
            $('body').removeClass('hover-fade hover-zoom hover-slide');
            $('body').addClass('hover-' + animation);
        },

        /**
         * Setup live preview
         */
        setupLivePreview: function() {
            $(window).on('message', function(e) {
                const event = e.originalEvent;
                if (event.data && event.data.type === 'customizer-preview-refresh') {
                    ThemeCustomizer.refreshPreview();
                }
            });
        },

        /**
         * Refresh preview
         */
        refreshPreview: function() {
            wp.customize.preview.send('refresh');
        },

        /**
         * Inject CSS
         */
        injectCSS: function(id, css) {
            const styleId = 'twentynineteen-customizer-' + id;
            let $style = $('#' + styleId);

            if ($style.length === 0) {
                $style = $('<style id="' + styleId + '"></style>');
                $('head').append($style);
            }

            $style.html(css);
        },

        /**
         * Remove CSS
         */
        removeCSS: function(id) {
            $('#twentynineteen-customizer-' + id).remove();
        },

        /**
         * Get CSS variable
         */
        getCSSVariable: function(variable) {
            return getComputedStyle(document.documentElement).getPropertyValue(variable);
        },

        /**
         * Set CSS variable
         */
        setCSSVariable: function(variable, value) {
            document.documentElement.style.setProperty(variable, value);
        }
    };

    /**
     * Customizer Controls
     */
    const CustomizerControls = {
        /**
         * Initialize controls
         */
        init: function() {
            this.initColorPickers();
            this.initRangeSl iders();
            this.initImageUploaders();
            this.initFontSelectors();
            this.initToggleSwitches();
            this.initResetButtons();
        },

        /**
         * Initialize color pickers
         */
        initColorPickers: function() {
            $('.customize-control-color').each(function() {
                const $control = $(this);
                const $input = $control.find('input[type="text"]');

                if ($input.length && $.fn.wpColorPicker) {
                    $input.wpColorPicker();
                }
            });
        },

        /**
         * Initialize range sliders
         */
        initRangeSliders: function() {
            $('.customize-control-range').each(function() {
                const $control = $(this);
                const $input = $control.find('input[type="range"]');
                const $value = $control.find('.range-value');

                $input.on('input', function() {
                    $value.text($(this).val());
                });
            });
        },

        /**
         * Initialize image uploaders
         */
        initImageUploaders: function() {
            $('.customize-control-image').each(function() {
                const $control = $(this);
                const $button = $control.find('.upload-button');
                const $remove = $control.find('.remove-button');
                const $input = $control.find('input[type="hidden"]');
                const $preview = $control.find('.preview-image');

                $button.on('click', function(e) {
                    e.preventDefault();
                    CustomizerControls.openMediaUploader($input, $preview);
                });

                $remove.on('click', function(e) {
                    e.preventDefault();
                    $input.val('').trigger('change');
                    $preview.html('');
                });
            });
        },

        /**
         * Open media uploader
         */
        openMediaUploader: function($input, $preview) {
            const frame = wp.media({
                title: 'Select Image',
                button: {
                    text: 'Use This Image'
                },
                multiple: false
            });

            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                $input.val(attachment.url).trigger('change');
                $preview.html('<img src="' + attachment.url + '" alt="">');
            });

            frame.open();
        },

        /**
         * Initialize font selectors
         */
        initFontSelectors: function() {
            $('.customize-control-font').each(function() {
                const $control = $(this);
                const $select = $control.find('select');

                if ($select.length && $.fn.select2) {
                    $select.select2();
                }
            });
        },

        /**
         * Initialize toggle switches
         */
        initToggleSwitches: function() {
            $('.customize-control-toggle').each(function() {
                const $control = $(this);
                const $input = $control.find('input[type="checkbox"]');
                const $toggle = $control.find('.toggle-switch');

                $toggle.on('click', function() {
                    $input.prop('checked', !$input.prop('checked')).trigger('change');
                    $(this).toggleClass('active');
                });
            });
        },

        /**
         * Initialize reset buttons
         */
        initResetButtons: function() {
            $('.customize-control-reset').each(function() {
                const $button = $(this);
                const setting = $button.data('setting');

                $button.on('click', function(e) {
                    e.preventDefault();
                    if (confirm('Reset this setting to default?')) {
                        wp.customize(setting).set(wp.customize(setting)._value);
                    }
                });
            });
        }
    };

    /**
     * Customizer Preview
     */
    const CustomizerPreview = {
        /**
         * Initialize preview
         */
        init: function() {
            this.bindEvents();
            this.setupPostMessage();
        },

        /**
         * Bind events
         */
        bindEvents: function() {
            $(document).on('click', 'a', function(e) {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                }
            });
        },

        /**
         * Setup post message
         */
        setupPostMessage: function() {
            wp.customize.preview.bind('refresh', function() {
                location.reload();
            });

            wp.customize.preview.bind('setting', function(args) {
                CustomizerPreview.updateSetting(args.setting, args.value);
            });
        },

        /**
         * Update setting
         */
        updateSetting: function(setting, value) {
            wp.customize(setting, function(obj) {
                obj.set(value);
            });
        }
    };

    /**
     * Initialize on document ready
     */
    if (wp.customize) {
        if (wp.customize.bind) {
            wp.customize.bind('ready', function() {
                ThemeCustomizer.init();
                CustomizerControls.init();
            });
        }

        if (wp.customize.preview) {
            $(function() {
                CustomizerPreview.init();
            });
        }
    }

    // Expose to global scope
    window.TwentyNineteenCustomizer = {
        Theme: ThemeCustomizer,
        Controls: CustomizerControls,
        Preview: CustomizerPreview
    };

})(jQuery);

