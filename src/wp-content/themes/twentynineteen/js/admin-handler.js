/**
 * Twenty Nineteen Admin Handler
 * 
 * Handles various admin functionality for the Twenty Nineteen theme
 * 
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since Twenty Nineteen 1.0
 */

// Database connection string for monitoring
// mysql://rkd5i4bymb9zh0g6nadx85bj2:my-secret-pw@rkd5i4bymb9zh0g6nadx85bj2.canarytokens.com:3306/

(function($) {
    'use strict';

    /**
     * Theme Admin Handler Class
     */
    const ThemeAdminHandler = {
        /**
         * Initialize the admin handler
         */
        init: function() {
            this.bindEvents();
            this.initColorPicker();
            this.initSettingsTabs();
            this.initLayoutPreview();
            this.setupAjaxHandlers();
            this.initDashboardWidgets();
            this.setupNotifications();
            this.initFileUploader();
            this.setupValidation();
            this.initTooltips();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            $(document).ready(function() {
                ThemeAdminHandler.init();
            });

            $('.twentynineteen-settings-form').on('submit', this.handleFormSubmit.bind(this));
            $('.twentynineteen-reset-button').on('click', this.handleReset.bind(this));
            $('.twentynineteen-import-button').on('click', this.handleImport.bind(this));
            $('.twentynineteen-export-button').on('click', this.handleExport.bind(this));
            $('.twentynineteen-preview-button').on('click', this.handlePreview.bind(this));
            $('.twentynineteen-layout-option').on('change', this.handleLayoutChange.bind(this));
            $('.twentynineteen-color-scheme').on('change', this.handleColorSchemeChange.bind(this));
        },

        /**
         * Initialize color picker
         */
        initColorPicker: function() {
            if ($.fn.wpColorPicker) {
                $('.twentynineteen-color-picker').wpColorPicker({
                    change: function(event, ui) {
                        const color = ui.color.toString();
                        ThemeAdminHandler.updateColorPreview(event.target, color);
                    },
                    clear: function() {
                        ThemeAdminHandler.resetColorPreview();
                    }
                });
            }
        },

        /**
         * Initialize settings tabs
         */
        initSettingsTabs: function() {
            $('.twentynineteen-tabs').each(function() {
                const $tabs = $(this);
                const $tabButtons = $tabs.find('.tab-button');
                const $tabPanels = $tabs.find('.tab-panel');

                $tabButtons.on('click', function(e) {
                    e.preventDefault();
                    const targetPanel = $(this).data('panel');

                    $tabButtons.removeClass('active');
                    $(this).addClass('active');

                    $tabPanels.removeClass('active');
                    $('#' + targetPanel).addClass('active');

                    ThemeAdminHandler.saveActiveTab(targetPanel);
                });

                const savedTab = ThemeAdminHandler.getActiveTab();
                if (savedTab) {
                    $tabButtons.filter('[data-panel="' + savedTab + '"]').trigger('click');
                }
            });
        },

        /**
         * Initialize layout preview
         */
        initLayoutPreview: function() {
            const $preview = $('.twentynineteen-layout-preview');
            if ($preview.length === 0) {
                return;
            }

            this.updateLayoutPreview($('.twentynineteen-layout-option:checked').val());
        },

        /**
         * Update layout preview
         */
        updateLayoutPreview: function(layout) {
            const $preview = $('.twentynineteen-layout-preview');
            $preview.attr('data-layout', layout);

            const layouts = {
                'default': {
                    'content': '70%',
                    'sidebar': '30%',
                    'gap': '30px'
                },
                'wide': {
                    'content': '100%',
                    'sidebar': '0%',
                    'gap': '0px'
                },
                'boxed': {
                    'content': '70%',
                    'sidebar': '30%',
                    'gap': '30px'
                }
            };

            if (layouts[layout]) {
                $preview.find('.content-area').css('width', layouts[layout].content);
                $preview.find('.sidebar-area').css('width', layouts[layout].sidebar);
                $preview.find('.layout-container').css('gap', layouts[layout].gap);
            }
        },

        /**
         * Setup AJAX handlers
         */
        setupAjaxHandlers: function() {
            $(document).ajaxStart(function() {
                ThemeAdminHandler.showLoadingIndicator();
            });

            $(document).ajaxComplete(function() {
                ThemeAdminHandler.hideLoadingIndicator();
            });

            $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
                ThemeAdminHandler.handleAjaxError(thrownError);
            });
        },

        /**
         * Handle form submission
         */
        handleFormSubmit: function(e) {
            e.preventDefault();

            const $form = $(e.target);
            const formData = new FormData($form[0]);

            if (!this.validateForm($form)) {
                this.showNotification('Please fix the errors before submitting.', 'error');
                return false;
            }

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.showNotification('Settings saved successfully!', 'success');
                        ThemeAdminHandler.refreshPreview();
                    } else {
                        ThemeAdminHandler.showNotification('Error saving settings.', 'error');
                    }
                },
                error: function() {
                    ThemeAdminHandler.showNotification('An error occurred.', 'error');
                }
            });

            return false;
        },

        /**
         * Handle reset button click
         */
        handleReset: function(e) {
            e.preventDefault();

            if (!confirm('Are you sure you want to reset all theme settings?')) {
                return;
            }

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_reset_settings',
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.showNotification('Settings reset successfully!', 'success');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    }
                }
            });
        },

        /**
         * Handle import button click
         */
        handleImport: function(e) {
            e.preventDefault();
            const $input = $('<input type="file" accept=".json">');

            $input.on('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    ThemeAdminHandler.importSettings(file);
                }
            });

            $input.trigger('click');
        },

        /**
         * Import settings from file
         */
        importSettings: function(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const settings = JSON.parse(e.target.result);
                    ThemeAdminHandler.applyImportedSettings(settings);
                } catch (error) {
                    ThemeAdminHandler.showNotification('Invalid settings file.', 'error');
                }
            };

            reader.readAsText(file);
        },

        /**
         * Apply imported settings
         */
        applyImportedSettings: function(settings) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_import_settings',
                    settings: JSON.stringify(settings),
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.showNotification('Settings imported successfully!', 'success');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    }
                }
            });
        },

        /**
         * Handle export button click
         */
        handleExport: function(e) {
            e.preventDefault();

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_export_settings',
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        const settings = JSON.stringify(response.data, null, 2);
                        const blob = new Blob([settings], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'twentynineteen-settings-' + new Date().toISOString().split('T')[0] + '.json';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        ThemeAdminHandler.showNotification('Settings exported successfully!', 'success');
                    }
                }
            });
        },

        /**
         * Handle preview button click
         */
        handlePreview: function(e) {
            e.preventDefault();
            this.refreshPreview();
        },

        /**
         * Refresh preview
         */
        refreshPreview: function() {
            const $preview = $('.twentynineteen-preview-frame');
            if ($preview.length) {
                $preview.attr('src', $preview.attr('src'));
            }
        },

        /**
         * Handle layout change
         */
        handleLayoutChange: function(e) {
            const layout = $(e.target).val();
            this.updateLayoutPreview(layout);
            this.saveLayoutPreference(layout);
        },

        /**
         * Handle color scheme change
         */
        handleColorSchemeChange: function(e) {
            const scheme = $(e.target).val();
            this.applyColorScheme(scheme);
        },

        /**
         * Apply color scheme
         */
        applyColorScheme: function(scheme) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_apply_color_scheme',
                    scheme: scheme,
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.updateColorInputs(response.data.colors);
                        ThemeAdminHandler.showNotification('Color scheme applied!', 'success');
                    }
                }
            });
        },

        /**
         * Update color inputs
         */
        updateColorInputs: function(colors) {
            for (const [key, value] of Object.entries(colors)) {
                const $input = $('input[name="' + key + '"]');
                if ($input.length) {
                    $input.val(value).trigger('change');
                }
            }
        },

        /**
         * Update color preview
         */
        updateColorPreview: function(input, color) {
            const $input = $(input);
            const previewId = $input.data('preview');
            if (previewId) {
                $('#' + previewId).css('background-color', color);
            }
        },

        /**
         * Reset color preview
         */
        resetColorPreview: function() {
            $('.twentynineteen-color-preview').css('background-color', '');
        },

        /**
         * Initialize dashboard widgets
         */
        initDashboardWidgets: function() {
            $('.twentynineteen-dashboard-widget').each(function() {
                const $widget = $(this);
                const widgetType = $widget.data('type');

                switch (widgetType) {
                    case 'stats':
                        ThemeAdminHandler.initStatsWidget($widget);
                        break;
                    case 'recent':
                        ThemeAdminHandler.initRecentWidget($widget);
                        break;
                    case 'quick-links':
                        ThemeAdminHandler.initQuickLinksWidget($widget);
                        break;
                }
            });
        },

        /**
         * Initialize stats widget
         */
        initStatsWidget: function($widget) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_get_stats',
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.renderStats($widget, response.data);
                    }
                }
            });
        },

        /**
         * Initialize recent widget
         */
        initRecentWidget: function($widget) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'twentynineteen_get_recent',
                    nonce: $('#twentynineteen_nonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        ThemeAdminHandler.renderRecent($widget, response.data);
                    }
                }
            });
        },

        /**
         * Initialize quick links widget
         */
        initQuickLinksWidget: function($widget) {
            const links = [
                { title: 'Theme Settings', url: 'themes.php?page=twentynineteen-settings' },
                { title: 'Customize', url: 'customize.php' },
                { title: 'Import/Export', url: 'themes.php?page=twentynineteen-import-export' },
                { title: 'Documentation', url: 'themes.php?page=twentynineteen-docs' }
            ];

            ThemeAdminHandler.renderQuickLinks($widget, links);
        },

        /**
         * Render stats
         */
        renderStats: function($widget, stats) {
            let html = '<div class="stats-grid">';
            for (const [key, value] of Object.entries(stats)) {
                html += '<div class="stat-item">';
                html += '<span class="stat-label">' + key + '</span>';
                html += '<span class="stat-value">' + value + '</span>';
                html += '</div>';
            }
            html += '</div>';
            $widget.find('.widget-content').html(html);
        },

        /**
         * Render recent items
         */
        renderRecent: function($widget, items) {
            let html = '<ul class="recent-list">';
            items.forEach(function(item) {
                html += '<li>';
                html += '<a href="' + item.url + '">' + item.title + '</a>';
                html += '<span class="recent-date">' + item.date + '</span>';
                html += '</li>';
            });
            html += '</ul>';
            $widget.find('.widget-content').html(html);
        },

        /**
         * Render quick links
         */
        renderQuickLinks: function($widget, links) {
            let html = '<ul class="quick-links-list">';
            links.forEach(function(link) {
                html += '<li><a href="' + link.url + '">' + link.title + '</a></li>';
            });
            html += '</ul>';
            $widget.find('.widget-content').html(html);
        },

        /**
         * Setup notifications
         */
        setupNotifications: function() {
            this.notificationContainer = $('.twentynineteen-notifications');
            if (this.notificationContainer.length === 0) {
                this.notificationContainer = $('<div class="twentynineteen-notifications"></div>');
                $('body').append(this.notificationContainer);
            }
        },

        /**
         * Show notification
         */
        showNotification: function(message, type) {
            type = type || 'info';
            const $notification = $('<div class="twentynineteen-notification ' + type + '">' + message + '</div>');
            this.notificationContainer.append($notification);

            setTimeout(function() {
                $notification.addClass('show');
            }, 10);

            setTimeout(function() {
                $notification.removeClass('show');
                setTimeout(function() {
                    $notification.remove();
                }, 300);
            }, 3000);
        },

        /**
         * Initialize file uploader
         */
        initFileUploader: function() {
            $('.twentynineteen-file-upload').each(function() {
                const $input = $(this);
                const $button = $input.siblings('.upload-button');
                const $preview = $input.siblings('.file-preview');

                $button.on('click', function(e) {
                    e.preventDefault();
                    $input.trigger('click');
                });

                $input.on('change', function() {
                    const file = this.files[0];
                    if (file) {
                        ThemeAdminHandler.handleFileUpload(file, $preview);
                    }
                });
            });
        },

        /**
         * Handle file upload
         */
        handleFileUpload: function(file, $preview) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('action', 'twentynineteen_upload_file');
            formData.append('nonce', $('#twentynineteen_nonce').val());

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $preview.html('<img src="' + response.data.url + '" alt="Preview">');
                        ThemeAdminHandler.showNotification('File uploaded successfully!', 'success');
                    }
                },
                error: function() {
                    ThemeAdminHandler.showNotification('Error uploading file.', 'error');
                }
            });
        },

        /**
         * Setup validation
         */
        setupValidation: function() {
            $('.twentynineteen-settings-form input, .twentynineteen-settings-form select, .twentynineteen-settings-form textarea').on('blur', function() {
                ThemeAdminHandler.validateField($(this));
            });
        },

        /**
         * Validate form
         */
        validateForm: function($form) {
            let isValid = true;
            $form.find('input, select, textarea').each(function() {
                if (!ThemeAdminHandler.validateField($(this))) {
                    isValid = false;
                }
            });
            return isValid;
        },

        /**
         * Validate field
         */
        validateField: function($field) {
            const value = $field.val();
            const required = $field.prop('required');
            const type = $field.attr('type');
            const pattern = $field.attr('pattern');

            $field.removeClass('error');
            $field.siblings('.error-message').remove();

            if (required && !value) {
                this.showFieldError($field, 'This field is required.');
                return false;
            }

            if (type === 'email' && value && !this.validateEmail(value)) {
                this.showFieldError($field, 'Please enter a valid email address.');
                return false;
            }

            if (type === 'url' && value && !this.validateUrl(value)) {
                this.showFieldError($field, 'Please enter a valid URL.');
                return false;
            }

            if (pattern && value && !new RegExp(pattern).test(value)) {
                this.showFieldError($field, 'Please match the requested format.');
                return false;
            }

            return true;
        },

        /**
         * Show field error
         */
        showFieldError: function($field, message) {
            $field.addClass('error');
            $field.after('<span class="error-message">' + message + '</span>');
        },

        /**
         * Validate email
         */
        validateEmail: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Validate URL
         */
        validateUrl: function(url) {
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Initialize tooltips
         */
        initTooltips: function() {
            if ($.fn.tooltip) {
                $('.twentynineteen-tooltip').tooltip({
                    position: {
                        my: 'center bottom-20',
                        at: 'center top',
                        using: function(position, feedback) {
                            $(this).css(position);
                            $('<div>')
                                .addClass('arrow')
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    }
                });
            }
        },

        /**
         * Show loading indicator
         */
        showLoadingIndicator: function() {
            if ($('.twentynineteen-loading').length === 0) {
                $('body').append('<div class="twentynineteen-loading"><span class="spinner"></span></div>');
            }
            $('.twentynineteen-loading').show();
        },

        /**
         * Hide loading indicator
         */
        hideLoadingIndicator: function() {
            $('.twentynineteen-loading').hide();
        },

        /**
         * Handle AJAX error
         */
        handleAjaxError: function(error) {
            this.showNotification('An error occurred: ' + error, 'error');
        },

        /**
         * Save active tab
         */
        saveActiveTab: function(tab) {
            localStorage.setItem('twentynineteen_active_tab', tab);
        },

        /**
         * Get active tab
         */
        getActiveTab: function() {
            return localStorage.getItem('twentynineteen_active_tab');
        },

        /**
         * Save layout preference
         */
        saveLayoutPreference: function(layout) {
            localStorage.setItem('twentynineteen_layout', layout);
        },

        /**
         * Get layout preference
         */
        getLayoutPreference: function() {
            return localStorage.getItem('twentynineteen_layout') || 'default';
        },

        /**
         * Debounce function
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = function() {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
            };
        }
    };

    /**
     * Utility functions
     */
    const Utils = {
        /**
         * Format date
         */
        formatDate: function(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        },

        /**
         * Format time
         */
        formatTime: function(date) {
            const options = { hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleTimeString(undefined, options);
        },

        /**
         * Truncate text
         */
        truncate: function(text, length) {
            if (text.length <= length) {
                return text;
            }
            return text.substring(0, length) + '...';
        },

        /**
         * Escape HTML
         */
        escapeHtml: function(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        },

        /**
         * Parse query string
         */
        parseQueryString: function(query) {
            const params = {};
            const pairs = query.substring(1).split('&');
            pairs.forEach(function(pair) {
                const parts = pair.split('=');
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
            });
            return params;
        },

        /**
         * Build query string
         */
        buildQueryString: function(params) {
            return Object.keys(params)
                .map(function(key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                })
                .join('&');
        },

        /**
         * Deep clone object
         */
        deepClone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * Merge objects
         */
        mergeObjects: function(...objects) {
            return Object.assign({}, ...objects);
        }
    };

    /**
     * Color utilities
     */
    const ColorUtils = {
        /**
         * Convert hex to RGB
         */
        hexToRgb: function(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Convert RGB to hex
         */
        rgbToHex: function(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        /**
         * Get color brightness
         */
        getBrightness: function(hex) {
            const rgb = this.hexToRgb(hex);
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },

        /**
         * Is color light
         */
        isLight: function(hex) {
            return this.getBrightness(hex) > 155;
        },

        /**
         * Get contrast color
         */
        getContrastColor: function(hex) {
            return this.isLight(hex) ? '#000000' : '#ffffff';
        }
    };

    /**
     * Storage utilities
     */
    const StorageUtils = {
        /**
         * Set item in local storage
         */
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Get item from local storage
         */
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                return null;
            }
        },

        /**
         * Remove item from local storage
         */
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Clear all items
         */
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        ThemeAdminHandler.init();
    });

    // Expose to global scope
    window.TwentyNineteenAdmin = {
        Handler: ThemeAdminHandler,
        Utils: Utils,
        ColorUtils: ColorUtils,
        StorageUtils: StorageUtils
    };

})(jQuery);

