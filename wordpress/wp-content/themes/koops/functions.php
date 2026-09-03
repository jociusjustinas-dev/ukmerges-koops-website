<?php

if (!defined('ABSPATH')) {
    exit;
}

function koops_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', ['height' => 160, 'width' => 220, 'flex-height' => true, 'flex-width' => true]);
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_editor_style('assets/css/theme.css');
    register_nav_menus(['primary' => 'Pagrindinė navigacija', 'footer' => 'Poraštės navigacija']);
    add_image_size('koops-card', 900, 720, true);
    add_image_size('koops-hero', 1920, 1200, true);
}
add_action('after_setup_theme', 'koops_theme_setup');

function koops_theme_assets(): void
{
    wp_enqueue_style('koops-theme', get_theme_file_uri('/assets/css/theme.css'), [], '0.1.0');
    wp_enqueue_script('koops-theme', get_theme_file_uri('/assets/js/theme.js'), [], '0.1.0', true);
}
add_action('wp_enqueue_scripts', 'koops_theme_assets');

function koops_theme_asset(string $file): string
{
    return get_theme_file_uri('/assets/images/' . ltrim($file, '/'));
}

function koops_option(string $key, string $fallback = ''): string
{
    if (function_exists('koops_get_option')) {
        return koops_get_option($key, $fallback);
    }
    return $fallback;
}

function koops_phone_href(string $phone): string
{
    $digits = preg_replace('/[^0-9+]/', '', $phone);
    if (str_starts_with($digits, '0')) {
        $digits = '+370' . substr($digits, 1);
    }
    return 'tel:' . $digits;
}

function koops_primary_navigation(): void
{
    if (has_nav_menu('primary')) {
        wp_nav_menu([
            'theme_location' => 'primary',
            'container' => false,
            'menu_class' => 'site-nav-list',
            'fallback_cb' => false,
        ]);
        return;
    }
    $items = [
        ['Parduotuvės', get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/')],
        ['Naujienos', home_url('/naujienos/')],
        ['Skelbimai', get_post_type_archive_link('koops_classified') ?: home_url('/skelbimai/')],
        ['Restoranas', home_url('/restoranas/')],
        ['Karjera', get_post_type_archive_link('koops_job') ?: home_url('/karjera/')],
        ['Tiekėjams', home_url('/tiekejams/')],
        ['Apie mus', home_url('/apie/')],
        ['Kontaktai', home_url('/kontaktai/')],
    ];
    echo '<ul class="site-nav-list">';
    foreach ($items as [$label, $url]) {
        printf('<li><a href="%s">%s</a></li>', esc_url($url), esc_html($label));
    }
    echo '</ul>';
}

function koops_button(string $label, string $url, string $class = 'is-accent', array $attrs = []): void
{
    $extra = '';
    foreach ($attrs as $name => $value) {
        $extra .= sprintf(' %s="%s"', esc_attr($name), esc_attr($value));
    }
    printf(
        '<a class="koops-button %1$s" href="%2$s"%3$s><span>%4$s</span><span aria-hidden="true">↗</span></a>',
        esc_attr($class),
        esc_url($url),
        $extra,
        esc_html($label)
    );
}

function koops_post_image(int $post_id, string $size = 'koops-card', string $fallback = ''): string
{
    if (has_post_thumbnail($post_id)) {
        return (string) get_the_post_thumbnail_url($post_id, $size);
    }
    return $fallback ? koops_theme_asset($fallback) : '';
}

function koops_excerpt(int $post_id, int $words = 24): string
{
    $post = get_post($post_id);
    if (!$post) {
        return '';
    }
    $text = $post->post_excerpt ?: wp_strip_all_tags(strip_shortcodes($post->post_content));
    return wp_trim_words($text, $words);
}

function koops_body_classes(array $classes): array
{
    if (is_front_page()) {
        $classes[] = 'is-front-page';
    }
    if (is_post_type_archive(['koops_store', 'koops_classified']) || is_singular(['koops_store', 'koops_classified'])) {
        $classes[] = 'has-dark-page';
    }
    return $classes;
}
add_filter('body_class', 'koops_body_classes');

function koops_document_title_separator(): string
{
    return '—';
}
add_filter('document_title_separator', 'koops_document_title_separator');

