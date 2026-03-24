<?php
/**
 * Theme functions and definitions
 */

if ( ! function_exists( 'todays_fashion_setup' ) ) :
    function todays_fashion_setup() {
        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        // Let WordPress manage the document title.
        add_theme_support( 'title-tag' );

        // Enable support for Post Thumbnails on posts and pages.
        add_theme_support( 'post-thumbnails' );

        // Register Navigation Menus
        register_nav_menus(
            array(
                'menu-1' => esc_html__( 'Primary', 'todays-fashion' ),
                'footer' => esc_html__( 'Footer Menu', 'todays-fashion' ),
            )
        );

        // Switch default core markup to output valid HTML5.
        add_theme_support(
            'html5',
            array(
                'search-form',
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
                'style',
                'script',
            )
        );

        // Add WooCommerce Support
        add_theme_support( 'woocommerce' );
        add_theme_support( 'wc-product-gallery-zoom' );
        add_theme_support( 'wc-product-gallery-lightbox' );
        add_theme_support( 'wc-product-gallery-slider' );
    }
endif;
add_action( 'after_setup_theme', 'todays_fashion_setup' );

/**
 * Enqueue scripts and styles.
 */
function todays_fashion_scripts() {
    wp_enqueue_style( 'todays-fashion-style', get_stylesheet_uri(), array(), '1.0.0' );
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', array(), null );
    
    // Tailwind via CDN for theme preview (Optional, usually compiled in production)
    wp_enqueue_script( 'tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null, false );

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'todays_fashion_scripts' );

/**
 * WooCommerce Customizations
 */
if ( class_exists( 'WooCommerce' ) ) {
    // Remove default WooCommerce wrapper
    remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
    remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

    add_action( 'woocommerce_before_main_content', 'todays_fashion_wrapper_start', 10 );
    add_action( 'woocommerce_after_main_content', 'todays_fashion_wrapper_end', 10 );

    function todays_fashion_wrapper_start() {
        echo '<div class="container py-20">';
    }

    function todays_fashion_wrapper_end() {
        echo '</div>';
    }
}
