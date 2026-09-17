<?php
/**
 * Plugin Name: KOOPS Core
 * Description: KOOPS turinio tipai, valdymo laukai, bendri duomenys ir formos.
 * Version: 0.20.8
 * Author: KOOPS
 * Text Domain: koops
 */

if (!defined('ABSPATH')) {
    exit;
}

define('KOOPS_CORE_VERSION', '0.20.8');
define('KOOPS_CORE_PATH', plugin_dir_path(__FILE__));
define('KOOPS_CORE_URL', plugin_dir_url(__FILE__));

/**
 * Asset version for admin/editor scripts. Optional bust option forces browsers
 * past long-lived LiteSpeed/CDN cache without a full plugin version bump.
 */
function koops_asset_version(): string
{
    $bust = (string) get_option('koops_asset_bust', '');
    return $bust !== '' ? KOOPS_CORE_VERSION . '.' . $bust : KOOPS_CORE_VERSION;
}

require_once KOOPS_CORE_PATH . 'includes/modular-pages.php';

function koops_register_content_types(): void
{
    $types = [
        'koops_store' => [
            'single' => 'Parduotuvė',
            'plural' => 'Parduotuvės',
            'slug' => 'parduotuves',
            'icon' => 'dashicons-store',
        ],
        'koops_classified' => [
            'single' => 'Skelbimas',
            'plural' => 'Skelbimai',
            'slug' => 'skelbimai',
            'icon' => 'dashicons-megaphone',
        ],
        'koops_job' => [
            'single' => 'Darbo pasiūlymas',
            'plural' => 'Darbo pasiūlymai',
            'slug' => 'karjera',
            'icon' => 'dashicons-businessperson',
        ],
        'koops_flyer' => [
            'single' => 'Leidinys',
            'plural' => 'Leidiniai',
            'slug' => 'leidiniai',
            'icon' => 'dashicons-media-document',
        ],
    ];

    foreach ($types as $type => $config) {
        register_post_type($type, [
            'labels' => [
                'name' => $config['plural'],
                'singular_name' => $config['single'],
                'add_new_item' => 'Pridėti: ' . strtolower($config['single']),
                'edit_item' => 'Redaguoti: ' . strtolower($config['single']),
                'new_item' => 'Naujas įrašas',
                'view_item' => 'Peržiūrėti',
                'search_items' => 'Ieškoti',
                'not_found' => 'Įrašų nerasta',
                'all_items' => 'Visi įrašai',
            ],
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => true,
            'rewrite' => ['slug' => $config['slug'], 'with_front' => false],
            'menu_icon' => $config['icon'],
            'menu_position' => 20,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'],
        ]);
    }

    register_post_type('koops_enquiry', [
        'labels' => [
            'name' => 'Užklausos',
            'singular_name' => 'Užklausa',
            'edit_item' => 'Peržiūrėti užklausą',
            'view_item' => 'Peržiūrėti užklausą',
            'search_items' => 'Ieškoti užklausų',
            'not_found' => 'Užklausų nerasta',
            'all_items' => 'Visos užklausos',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'koops',
        'show_in_rest' => false,
        'exclude_from_search' => true,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title'],
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_taxonomy('koops_store_area', ['koops_store'], [
        'labels' => ['name' => 'Teritorijos', 'singular_name' => 'Teritorija'],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'parduotuviu-teritorija'],
    ]);

    register_taxonomy('koops_classified_category', ['koops_classified'], [
        'labels' => ['name' => 'Skelbimų tipai', 'singular_name' => 'Skelbimo tipas'],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'skelbimu-tipas'],
    ]);
}
add_action('init', 'koops_register_content_types');

function koops_meta_schema(): array
{
    return [
        'koops_store' => [
            'koops_city' => ['label' => 'Vietovė', 'type' => 'text'],
            'koops_address' => ['label' => 'Adresas', 'type' => 'text'],
            'koops_hours' => ['label' => 'Darbo laikas', 'type' => 'textarea'],
            'koops_phone' => ['label' => 'Telefonas', 'type' => 'text'],
            'koops_phone_2' => ['label' => 'Papildomas telefonas', 'type' => 'text'],
            'koops_lat' => ['label' => 'Platuma (lat)', 'type' => 'number', 'step' => 'any'],
            'koops_lng' => ['label' => 'Ilguma (lng)', 'type' => 'number', 'step' => 'any'],
            'koops_map_url' => ['label' => 'Google Maps nuoroda', 'type' => 'url'],
            'koops_featured' => ['label' => 'Rodyti pradinio puslapio karuselėje', 'type' => 'checkbox'],
        ],
        'koops_classified' => [
            'koops_location' => ['label' => 'Vieta', 'type' => 'text'],
            'koops_area_size' => ['label' => 'Plotas', 'type' => 'text'],
            'koops_price' => ['label' => 'Kaina', 'type' => 'text'],
            'koops_status' => [
                'label' => 'Būsena',
                'type' => 'select',
                'options' => ['aktyvus' => 'Aktyvus', 'rezervuotas' => 'Rezervuotas'],
            ],
            'koops_expires_at' => ['label' => 'Galioja iki', 'type' => 'date'],
            'koops_contact_phone' => ['label' => 'Kontaktinis telefonas', 'type' => 'text'],
            'koops_contact_email' => ['label' => 'Kontaktinis el. paštas', 'type' => 'email'],
        ],
        'koops_job' => [
            'koops_location' => ['label' => 'Darbo vieta', 'type' => 'text'],
            'koops_employment' => ['label' => 'Darbo krūvis', 'type' => 'text'],
            'koops_department' => ['label' => 'Sritis', 'type' => 'text'],
            'koops_apply_url' => ['label' => 'Kandidatavimo nuoroda', 'type' => 'url'],
            'koops_deadline' => ['label' => 'Kandidatuoti iki', 'type' => 'date'],
        ],
        'koops_flyer' => [
            'koops_kind' => [
                'label' => 'Tipas',
                'type' => 'select',
                'options' => [
                    'bendras' => 'Akcijų leidinys',
                    'top3' => 'TOP pasiūlymai',
                    'kitas' => 'Kitas leidinys',
                ],
            ],
            'koops_valid_from' => ['label' => 'Galioja nuo', 'type' => 'date'],
            'koops_valid_until' => ['label' => 'Galioja iki', 'type' => 'date'],
            'koops_pdf_id' => ['label' => 'PDF leidinys', 'type' => 'file'],
            'koops_page_ids' => ['label' => 'Puslapių nuotraukos', 'type' => 'gallery_ids'],
        ],
    ];
}

function koops_register_meta_fields(): void
{
    foreach (koops_meta_schema() as $post_type => $fields) {
        foreach ($fields as $key => $field) {
            $data_type = $field['type'] === 'checkbox' ? 'boolean' : (in_array($field['type'], ['number', 'file'], true) ? 'number' : 'string');
            register_post_meta($post_type, $key, [
                'single' => true,
                'type' => $data_type,
                'show_in_rest' => true,
                'sanitize_callback' => function ($value) use ($field) {
                    if ($field['type'] === 'checkbox') {
                        return (bool) $value;
                    }
                    if ($field['type'] === 'number' || $field['type'] === 'file') {
                        return (float) $value;
                    }
                    if ($field['type'] === 'gallery_ids') {
                        return implode(',', array_filter(array_map('absint', preg_split('/[,\s]+/', (string) $value) ?: [])));
                    }
                    if ($field['type'] === 'email') {
                        return sanitize_email($value);
                    }
                    if ($field['type'] === 'url') {
                        return esc_url_raw($value);
                    }
                    if ($field['type'] === 'textarea') {
                        return sanitize_textarea_field($value);
                    }
                    return sanitize_text_field($value);
                },
                'auth_callback' => fn() => current_user_can('edit_posts'),
            ]);
        }
    }
}
add_action('init', 'koops_register_meta_fields', 20);

function koops_add_meta_boxes(): void
{
    foreach (array_keys(koops_meta_schema()) as $post_type) {
        add_meta_box(
            'koops_details',
            'KOOPS duomenys',
            'koops_render_meta_box',
            $post_type,
            'side',
            'high',
            ['__back_compat_meta_box' => true]
        );
    }
}
add_action('add_meta_boxes', 'koops_add_meta_boxes');

function koops_render_meta_box(WP_Post $post): void
{
    wp_nonce_field('koops_save_meta', 'koops_meta_nonce');
    $fields = koops_meta_schema()[$post->post_type] ?? [];
    echo '<div class="koops-admin-fields">';

    foreach ($fields as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        echo '<label>';

        if ($field['type'] === 'checkbox') {
            printf(
                '<span><input type="checkbox" name="%1$s" value="1" %2$s> %3$s</span>',
                esc_attr($key),
                checked((bool) $value, true, false),
                esc_html($field['label'])
            );
        } elseif ($field['type'] === 'textarea') {
            printf(
                '<span>%1$s</span><textarea name="%2$s" rows="3" style="width:100%%">%3$s</textarea>',
                esc_html($field['label']),
                esc_attr($key),
                esc_textarea((string) $value)
            );
        } elseif ($field['type'] === 'select') {
            printf('<span>%s</span><select name="%s">', esc_html($field['label']), esc_attr($key));
            foreach ($field['options'] as $option_value => $option_label) {
                printf(
                    '<option value="%1$s" %2$s>%3$s</option>',
                    esc_attr($option_value),
                    selected($value, $option_value, false),
                    esc_html($option_label)
                );
            }
            echo '</select>';
        } elseif ($field['type'] === 'url') {
            echo '<span>' . esc_html($field['label']) . '</span>';
            koops_render_url_picker($key, (string) $value, $key);
        } elseif ($field['type'] === 'file') {
            $file_id = absint($value);
            $file_url = $file_id ? (string) wp_get_attachment_url($file_id) : '';
            $file_name = $file_id ? (string) basename((string) get_attached_file($file_id)) : '';
            printf(
                '<span>%1$s</span><input type="hidden" class="koops-media-id" name="%2$s" value="%3$d"><div class="koops-media-control"><p class="koops-media-filename">%4$s</p><p><button type="button" class="button koops-pick-pdf">%5$s</button> %6$s</p></div>',
                esc_html($field['label']),
                esc_attr($key),
                $file_id,
                $file_name ? esc_html($file_name) : 'PDF nepasirinktas',
                $file_id ? 'Keisti PDF' : 'Įkelti PDF',
                $file_url ? '<a href="' . esc_url($file_url) . '" target="_blank" rel="noreferrer">Atidaryti</a>' : ''
            );
        } elseif ($field['type'] === 'gallery_ids') {
            $ids = koops_parse_id_list((string) $value);
            printf(
                '<span>%1$s</span><input type="hidden" class="koops-gallery-ids" name="%2$s" value="%3$s"><p>%4$s</p><p><button type="button" class="button koops-pick-pages">%5$s</button></p><p class="description">Įkėlus PDF ir išsaugojus, puslapiai sugeneruojami automatiškai. Čia galite pašalinti nereikalingus ar pakeisti eiliškumą.</p>',
                esc_html($field['label']),
                esc_attr($key),
                esc_attr(implode(',', $ids)),
                $ids ? esc_html(sprintf('%d puslapiai', count($ids))) : 'Puslapiai dar nesugeneruoti',
                $ids ? 'Redaguoti puslapius' : 'Įkelti puslapius rankiniu būdu'
            );
        } else {
            printf(
                '<span>%1$s</span><input type="%2$s" name="%3$s" value="%4$s" %5$s style="width:100%%">',
                esc_html($field['label']),
                esc_attr($field['type']),
                esc_attr($key),
                esc_attr((string) $value),
                isset($field['step']) ? 'step="' . esc_attr($field['step']) . '"' : ''
            );
        }
        echo '</label>';
    }
    echo '</div>';
}

function koops_save_meta_fields(int $post_id): void
{
    if (!isset($_POST['koops_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['koops_meta_nonce'])), 'koops_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $post_type = get_post_type($post_id);
    $fields = koops_meta_schema()[$post_type] ?? [];
    foreach ($fields as $key => $field) {
        if ($field['type'] === 'checkbox') {
            update_post_meta($post_id, $key, isset($_POST[$key]) ? '1' : '0');
            continue;
        }
        if (!isset($_POST[$key])) {
            delete_post_meta($post_id, $key);
            continue;
        }
        $value = wp_unslash($_POST[$key]);
        if ($field['type'] === 'email') {
            $value = sanitize_email($value);
        } elseif ($field['type'] === 'url') {
            $value = esc_url_raw($value);
        } elseif ($field['type'] === 'textarea') {
            $value = sanitize_textarea_field($value);
        } elseif ($field['type'] === 'number' || $field['type'] === 'file') {
            $value = absint($value);
        } elseif ($field['type'] === 'gallery_ids') {
            $value = implode(',', array_filter(array_map('absint', preg_split('/[,\s]+/', (string) $value) ?: [])));
        } else {
            $value = sanitize_text_field($value);
        }
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post', 'koops_save_meta_fields');

function koops_parse_id_list(string $value): array
{
    return array_values(array_filter(array_map('absint', preg_split('/[,\s]+/', $value) ?: [])));
}

function koops_flyer_after_save(int $post_id, WP_Post $post): void
{
    if ($post->post_type !== 'koops_flyer' || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }
    koops_flyer_generate_pages($post_id);
}

function koops_flyer_generate_pages(int $post_id): void
{
    $pdf_id = absint(get_post_meta($post_id, 'koops_pdf_id', true));
    $converted = absint(get_post_meta($post_id, '_koops_pdf_converted', true));
    $existing_pages = koops_parse_id_list((string) get_post_meta($post_id, 'koops_page_ids', true));

    if (!$pdf_id) {
        return;
    }
    if ($existing_pages && $converted === $pdf_id) {
        if (!has_post_thumbnail($post_id)) {
            set_post_thumbnail($post_id, $existing_pages[0]);
        }
        return;
    }
    if ($existing_pages && !$converted) {
        if (!has_post_thumbnail($post_id)) {
            set_post_thumbnail($post_id, $existing_pages[0]);
        }
        return;
    }
    if (!class_exists('Imagick')) {
        update_post_meta($post_id, '_koops_pdf_needs_imagick', 1);
        return;
    }
    delete_post_meta($post_id, '_koops_pdf_needs_imagick');
    $file = get_attached_file($pdf_id);
    if (!$file || !file_exists($file)) {
        return;
    }

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $slug = sanitize_file_name((string) get_post_field('post_name', $post_id) ?: 'leidinys');

    try {
        $imagick = new Imagick();
        $imagick->setResolution(144, 144);
        $imagick->readImage($file);
        $count = $imagick->getNumberImages();
        $ids = [];
        for ($index = 0; $index < $count; $index++) {
            $imagick->setIteratorIndex($index);
            $page = $imagick->getImage();
            $page->setImageFormat('jpeg');
            $page->setImageCompressionQuality(82);
            $blob = $page->getImageBlob();
            $page->clear();
            $page->destroy();
            if (!$blob) {
                continue;
            }
            $upload = wp_upload_bits(sprintf('%s-p%02d.jpg', $slug, $index + 1), null, $blob);
            if (!empty($upload['error']) || empty($upload['file'])) {
                continue;
            }
            $attachment_id = wp_insert_attachment([
                'post_mime_type' => 'image/jpeg',
                'post_title' => sprintf('%s · p. %d', get_the_title($post_id), $index + 1),
                'post_parent' => $post_id,
                'post_status' => 'inherit',
            ], $upload['file'], $post_id);
            if (is_wp_error($attachment_id) || !$attachment_id) {
                continue;
            }
            wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
            $ids[] = $attachment_id;
        }
        $imagick->clear();
        $imagick->destroy();
    } catch (Throwable $error) {
        return;
    }

    if (!$ids) {
        return;
    }
    foreach ($existing_pages as $old_id) {
        if (!in_array($old_id, $ids, true) && (int) wp_get_post_parent_id($old_id) === $post_id) {
            wp_delete_attachment($old_id, true);
        }
    }
    update_post_meta($post_id, 'koops_page_ids', implode(',', $ids));
    update_post_meta($post_id, '_koops_pdf_converted', $pdf_id);
    if (!has_post_thumbnail($post_id)) {
        set_post_thumbnail($post_id, $ids[0]);
    }
}
add_action('save_post_koops_flyer', 'koops_flyer_after_save', 20, 2);

function koops_use_block_editor_for_flyers(bool $use, string $post_type): bool
{
    if ($post_type === 'koops_flyer') {
        return true;
    }
    return $use;
}
add_filter('use_block_editor_for_post_type', 'koops_use_block_editor_for_flyers', 10, 2);

function koops_flyer_admin_notice(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== 'koops_flyer' || $screen->base !== 'post') {
        return;
    }
    $post_id = isset($_GET['post']) ? absint($_GET['post']) : 0;
    if (!$post_id) {
        return;
    }
    if (get_post_meta($post_id, '_koops_pdf_needs_imagick', true)) {
        echo '<div class="notice notice-warning"><p>PDF įkeltas, bet serveryje nėra Imagick — puslapių nuotraukų sugeneruoti nepavyko. Įkelkite puslapius rankiniu būdu lauke „Puslapiai“.</p></div>';
    }
}
add_action('admin_notices', 'koops_flyer_admin_notice');

function koops_maybe_flush_rewrites(): void
{
    if (get_option('koops_rewrite_version') === KOOPS_CORE_VERSION) {
        return;
    }
    flush_rewrite_rules(false);
    update_option('koops_rewrite_version', KOOPS_CORE_VERSION);
}
add_action('init', 'koops_maybe_flush_rewrites', 99);

function koops_default_options(): array
{
    return [
        'legal_name' => 'Ukmergės rajono vartotojų kooperatyvas',
        'address' => 'Vasario 16-osios g. 30, LT-20130 Ukmergė',
        'phone' => '0 340 53235',
        'administration_phone' => '0 340 51049',
        'email' => 'direktore@urvk.lt',
        'office_hours' => 'I–IV 8:00–16:45 · V 8:00–15:30 · VI–VII nedirbame',
        'facebook_url' => 'https://www.facebook.com/ukmergeskoops',
        'instagram_url' => 'https://www.instagram.com/ukmergeskoops/',
        'privacy_url' => '/privatumo-politika/',
        'form_recipient' => 'direktore@urvk.lt',
        'restaurant_phone' => '0 340 52079',
        'restaurant_mobile' => '+370 618 72548',
        'restaurant_email' => 'restoranas@urvk.lt',
        'restaurant_address' => 'Kauno g. 7, Ukmergė',
        'restaurant_since' => '1965',
        'restaurant_halls' => '3',
        'restaurant_capacity' => '154',
        'frontend_url' => 'https://ukmerges-koops-website.vercel.app',
    ];
}

function koops_get_option(string $key, string $fallback = ''): string
{
    $options = wp_parse_args((array) get_option('koops_options', []), koops_default_options());
    return isset($options[$key]) ? (string) $options[$key] : $fallback;
}

function koops_register_link_picker_assets(): void
{
    wp_register_style(
        'koops-admin-link-picker',
        KOOPS_CORE_URL . 'assets/admin-link-picker.css',
        ['editor'],
        koops_asset_version()
    );
    wp_register_script(
        'koops-admin-link-picker',
        KOOPS_CORE_URL . 'assets/admin-link-picker.js',
        ['jquery', 'wplink'],
        koops_asset_version(),
        true
    );
}
add_action('init', 'koops_register_link_picker_assets');

function koops_register_admin_colors(): void
{
    wp_register_style(
        'koops-admin-colors',
        KOOPS_CORE_URL . 'assets/admin-colors.css',
        [],
        koops_asset_version()
    );
}
add_action('init', 'koops_register_admin_colors');

function koops_enqueue_admin_colors(): void
{
    wp_enqueue_style('koops-admin-colors');
}
add_action('admin_enqueue_scripts', 'koops_enqueue_admin_colors', 100);
add_action('enqueue_block_editor_assets', 'koops_enqueue_admin_colors', 100);
add_action('login_enqueue_scripts', 'koops_enqueue_admin_colors', 100);

function koops_register_entry_sidebar_assets(): void
{
    wp_register_style(
        'koops-entry-sidebar',
        KOOPS_CORE_URL . 'assets/entry-sidebar.css',
        ['koops-admin-link-picker'],
        koops_asset_version()
    );
    wp_register_script(
        'koops-entry-sidebar',
        KOOPS_CORE_URL . 'assets/entry-sidebar.js',
        ['wp-plugins', 'wp-edit-post', 'wp-editor', 'wp-element', 'wp-components', 'wp-data', 'wp-core-data', 'wp-block-editor', 'koops-admin-link-picker'],
        koops_asset_version(),
        true
    );
}
add_action('init', 'koops_register_entry_sidebar_assets');

function koops_enqueue_entry_sidebar(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || !isset(koops_meta_schema()[$screen->post_type ?? ''])) {
        return;
    }

    wp_enqueue_style('koops-entry-sidebar');
    wp_enqueue_script('koops-entry-sidebar');
    wp_localize_script('koops-entry-sidebar', 'koopsEntrySidebar', [
        'schema' => koops_meta_schema(),
        'taxonomies' => [
            'koops_store' => ['name' => 'koops_store_area', 'label' => 'Teritorija'],
            'koops_classified' => ['name' => 'koops_classified_category', 'label' => 'Tipas'],
        ],
        'titles' => [
            'koops_store' => 'Parduotuvės duomenys',
            'koops_classified' => 'Skelbimo duomenys',
            'koops_job' => 'Darbo pasiūlymo duomenys',
            'koops_flyer' => 'Leidinio duomenys',
        ],
    ]);
}
add_action('enqueue_block_editor_assets', 'koops_enqueue_entry_sidebar');
add_action('admin_enqueue_scripts', static function (): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if ($screen && isset(koops_meta_schema()[$screen->post_type ?? ''])) {
        wp_enqueue_style('koops-entry-sidebar');
        wp_enqueue_media();
    }
    if ($screen && $screen->post_type === 'koops_flyer') {
        wp_enqueue_script(
            'koops-flyer-metabox',
            KOOPS_CORE_URL . 'assets/flyer-metabox.js',
            ['jquery', 'media-editor'],
            koops_asset_version(),
            true
        );
    }
});

function koops_editor_chrome_font_fix(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || !isset(koops_meta_schema()[$screen->post_type ?? ''])) {
        return;
    }

    echo '<style id="koops-editor-chrome-font-fix">
@font-face{font-family:Inter;src:local("Arial"),local("Helvetica Neue"),local("Helvetica");unicode-range:U+0000-00FF,U+0020}
body.block-editor-page .interface-interface-skeleton__sidebar,
body.block-editor-page .interface-interface-skeleton__sidebar input,
body.block-editor-page .interface-interface-skeleton__sidebar textarea,
body.block-editor-page .interface-interface-skeleton__sidebar select,
body.block-editor-page .interface-interface-skeleton__sidebar button,
body.block-editor-page .editor-sidebar,
body.block-editor-page .edit-post-sidebar{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",Arial,sans-serif!important;
  letter-spacing:0!important;
  word-spacing:.12em!important;
}
body.post-type-koops_flyer .block-editor-default-block-appender,
body.post-type-koops_flyer .block-list-appender,
body.post-type-koops_flyer .editor-collapsible-block-toolbar {
  display: none !important;
}
body.post-type-koops_flyer .edit-post-visual-editor {
  background: #f6f7f7;
}
.koops-flyer-guide {
  max-width: 640px;
  margin: 48px auto;
  padding: 28px 32px;
  background: #fff;
  border: 1px solid #dcdcde;
  border-radius: 8px;
}
.koops-flyer-guide h2 {
  margin: 0 0 12px;
  font-size: 20px;
}
.koops-flyer-guide ol {
  margin: 0;
  padding-left: 20px;
}
.koops-flyer-guide li {
  margin: 0 0 8px;
  line-height: 1.5;
}
</style>';
}
add_action('admin_head', 'koops_editor_chrome_font_fix');

function koops_enqueue_link_picker(): void
{
    if (!is_admin()) {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_script('wplink');
    wp_enqueue_style('editor');
    wp_enqueue_style('dashicons');
    wp_enqueue_style('koops-admin-link-picker');
    wp_enqueue_script('koops-admin-link-picker');
    wp_localize_script('koops-admin-link-picker', 'koopsLinkPicker', [
        'frontendUrl' => untrailingslashit(koops_get_option('frontend_url')),
    ]);
}
add_action('admin_enqueue_scripts', 'koops_enqueue_link_picker');
add_action('enqueue_block_editor_assets', 'koops_enqueue_link_picker');

function koops_print_link_dialog(): void
{
    if (!is_admin()) {
        return;
    }
    if (!wp_script_is('koops-admin-link-picker', 'enqueued') && !wp_script_is('koops-admin-link-picker', 'done')) {
        return;
    }
    if (!class_exists('_WP_Editors')) {
        require_once ABSPATH . WPINC . '/class-wp-editor.php';
    }
    _WP_Editors::wp_link_dialog();
}
add_action('admin_footer', 'koops_print_link_dialog');

function koops_link_query_site_pages(array $results, array $query): array
{
    $term = isset($query['s']) ? mb_strtolower((string) $query['s']) : '';
    $pages = [
        ['Pradinis', home_url('/')],
        ['Parduotuvės', home_url('/parduotuves/')],
        ['Naujienos', home_url('/naujienos/')],
        ['Leidiniai', home_url('/leidiniai/')],
        ['Restoranas „Vilkmergė“', home_url('/restoranas/')],
        ['Karjera', home_url('/karjera/')],
        ['Tiekėjams', home_url('/tiekejams/')],
        ['Apie KOOPS', home_url('/apie/')],
        ['Kontaktai', home_url('/kontaktai/')],
        ['Skelbimai', home_url('/skelbimai/')],
        ['Privatumo politika', home_url('/privatumo-politika/')],
    ];

    $extra = [];
    $fake_id = -1;
    foreach ($pages as [$title, $permalink]) {
        $haystack = mb_strtolower($title . ' ' . $permalink);
        if ($term !== '' && !str_contains($haystack, $term)) {
            continue;
        }
        $extra[] = [
            'ID' => $fake_id--,
            'title' => $title,
            'permalink' => $permalink,
            'info' => 'Puslapis',
        ];
    }

    $catalog = koops_section_catalog();
    $section_items = [];
    foreach (koops_default_page_sections() as $slug => $types) {
        foreach ($types as $type) {
            $section_items[$slug . ':' . $type] = [
                'slug' => $slug,
                'type' => $type,
                'anchor' => koops_default_section_anchor($type),
                'label' => $catalog[$type]['label'] ?? $type,
            ];
        }
    }
    foreach (koops_rest_pages() as $slug => $page) {
        foreach ($page['sections'] as $section) {
            $type = (string) ($section['type'] ?? '');
            if ($type === '') {
                continue;
            }
            $section_items[$slug . ':' . $type] = [
                'slug' => $slug,
                'type' => $type,
                'anchor' => (string) ($section['anchor'] ?: koops_default_section_anchor($type)),
                'label' => $catalog[$type]['label'] ?? $type,
            ];
        }
    }

    foreach ($section_items as $item) {
        $path = koops_page_public_path($item['slug']);
        $permalink = $path === '/'
            ? home_url('/#' . $item['anchor'])
            : home_url($path . '/#' . $item['anchor']);
        $haystack = mb_strtolower($item['label'] . ' ' . $item['type'] . ' ' . $item['anchor'] . ' ' . $path);
        if ($term !== '' && !str_contains($haystack, $term)) {
            continue;
        }
        $extra[] = [
            'ID' => $fake_id--,
            'title' => $item['label'] . ' (#' . $item['anchor'] . ')',
            'permalink' => $permalink,
            'info' => 'Sekcija',
        ];
    }

    return array_merge($extra, $results);
}
add_filter('wp_link_query', 'koops_link_query_site_pages', 10, 2);

function koops_render_url_picker(string $name, string $value, string $id = '', string $class = 'regular-text'): void
{
    $id = $id !== '' ? $id : sanitize_html_class(str_replace(['[', ']'], '-', $name));
    echo '<span class="koops-url-picker">';
    printf(
        '<input type="text" class="koops-url-input %1$s" id="%2$s" name="%3$s" value="%4$s" placeholder="/parduotuves">',
        esc_attr($class),
        esc_attr($id),
        esc_attr($name),
        esc_attr($value)
    );
    printf(
        '<button type="button" class="button koops-open-wplink" data-target="#%1$s" aria-label="Ieškoti nuorodos"><span class="dashicons dashicons-edit" aria-hidden="true"></span></button>',
        esc_attr($id)
    );
    echo '</span>';
}

function koops_register_settings(): void
{
    register_setting('koops_options_group', 'koops_options', [
        'type' => 'array',
        'sanitize_callback' => 'koops_sanitize_options',
        'default' => koops_default_options(),
    ]);
}
add_action('admin_init', 'koops_register_settings');

function koops_sanitize_options(array $input): array
{
    $defaults = koops_default_options();
    $clean = [];
    foreach ($defaults as $key => $default) {
        $value = isset($input[$key]) ? wp_unslash($input[$key]) : $default;
        if (str_contains($key, '_url')) {
            $clean[$key] = esc_url_raw($value);
        } elseif (str_contains($key, 'email') || $key === 'form_recipient') {
            $clean[$key] = sanitize_email($value);
        } else {
            $clean[$key] = sanitize_text_field($value);
        }
    }
    return $clean;
}

function koops_admin_menu(): void
{
    add_menu_page('KOOPS', 'KOOPS', 'manage_options', 'koops', 'koops_options_page', 'dashicons-admin-site-alt3', 3);
    add_submenu_page('koops', 'Bendri duomenys', 'Bendri duomenys', 'manage_options', 'koops', 'koops_options_page');
    add_submenu_page('koops', 'Pradinis paruošimas', 'Pradinis paruošimas', 'manage_options', 'koops-setup', 'koops_setup_page');
}
add_action('admin_menu', 'koops_admin_menu');

function koops_options_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $options = wp_parse_args((array) get_option('koops_options', []), koops_default_options());
    $groups = [
        'Organizacija' => ['legal_name', 'address', 'phone', 'administration_phone', 'email', 'office_hours'],
        'Nuorodos ir formos' => ['frontend_url', 'facebook_url', 'instagram_url', 'privacy_url', 'form_recipient'],
        'Restoranas „Vilkmergė“' => ['restaurant_phone', 'restaurant_mobile', 'restaurant_email', 'restaurant_address', 'restaurant_since', 'restaurant_halls', 'restaurant_capacity'],
    ];
    $labels = [
        'legal_name' => 'Juridinis pavadinimas', 'address' => 'Adresas', 'phone' => 'Bendras telefonas',
        'administration_phone' => 'Administracijos telefonas', 'email' => 'Bendras el. paštas',
        'office_hours' => 'Administracijos darbo laikas', 'frontend_url' => 'Viešos svetainės adresas',
        'facebook_url' => 'Facebook nuoroda',
        'instagram_url' => 'Instagram nuoroda', 'privacy_url' => 'Privatumo politikos nuoroda',
        'form_recipient' => 'Formų gavėjo el. paštas', 'restaurant_phone' => 'Restorano telefonas',
        'restaurant_mobile' => 'Restorano mobilusis', 'restaurant_email' => 'Restorano el. paštas',
        'restaurant_address' => 'Restorano adresas', 'restaurant_since' => 'Veikia nuo',
        'restaurant_halls' => 'Salių skaičius', 'restaurant_capacity' => 'Didžiausia talpa',
    ];
    ?>
    <div class="wrap">
        <h1>KOOPS bendri duomenys</h1>
        <p>Čia įvesta informacija naudojama visuose puslapiuose. Jos nereikia dubliuoti atskiruose šablonuose.</p>
        <form method="post" action="options.php">
            <?php settings_fields('koops_options_group'); ?>
            <?php foreach ($groups as $heading => $keys) : ?>
                <h2><?php echo esc_html($heading); ?></h2>
                <table class="form-table" role="presentation"><tbody>
                <?php foreach ($keys as $key) : ?>
                    <tr>
                        <th scope="row"><label for="koops-<?php echo esc_attr($key); ?>"><?php echo esc_html($labels[$key]); ?></label></th>
                        <td>
                            <?php if (str_ends_with($key, '_url') && $key !== 'frontend_url') : ?>
                                <?php koops_render_url_picker('koops_options[' . $key . ']', (string) $options[$key], 'koops-' . $key); ?>
                            <?php else : ?>
                                <input class="regular-text" id="koops-<?php echo esc_attr($key); ?>" name="koops_options[<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr($options[$key]); ?>">
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody></table>
            <?php endforeach; ?>
            <?php submit_button('Išsaugoti'); ?>
        </form>
    </div>
    <?php
}

function koops_setup_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $result = null;
    if (isset($_POST['koops_run_setup'])) {
        check_admin_referer('koops_run_setup');
        $result = koops_run_initial_setup();
    }
    ?>
    <div class="wrap">
        <h1>KOOPS pradinis paruošimas</h1>
        <p>Sukuria pagrindinius puslapius, teritorijas ir importuoja 34 patvirtintas parduotuves. Pakartotinis paleidimas nedubliuoja įrašų.</p>
        <?php if ($result) : ?>
            <div class="notice notice-success"><p><?php echo esc_html($result); ?></p></div>
        <?php endif; ?>
        <form method="post">
            <?php wp_nonce_field('koops_run_setup'); ?>
            <input type="hidden" name="koops_run_setup" value="1">
            <?php submit_button('Sukurti puslapius ir importuoti parduotuves', 'primary'); ?>
        </form>
    </div>
    <?php
}

function koops_upsert_page(string $title, string $slug, string $template = 'default'): int
{
    $existing = get_page_by_path($slug, OBJECT, 'page');
    $post_id = $existing ? (int) $existing->ID : (int) wp_insert_post([
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => $title,
        'post_name' => $slug,
    ]);
    if ($post_id && $template !== 'default') {
        update_post_meta($post_id, '_wp_page_template', $template);
    }
    return $post_id;
}

function koops_run_initial_setup(): string
{
    $pages = [
        ['Pradinis', 'pradinis', 'default'],
        ['Naujienos', 'naujienos', 'default'],
        ['Restoranas „Vilkmergė“', 'restoranas', 'page-restoranas.php'],
        ['Tiekėjams', 'tiekejams', 'page-tiekejams.php'],
        ['Apie KOOPS', 'apie', 'page-apie.php'],
        ['Kontaktai', 'kontaktai', 'page-kontaktai.php'],
        ['Privatumo politika', 'privatumo-politika', 'default'],
    ];
    $home_id = 0;
    $news_id = 0;
    foreach ($pages as [$title, $slug, $template]) {
        $page_id = koops_upsert_page($title, $slug, $template);
        if ($slug === 'pradinis') {
            $home_id = $page_id;
        }
        if ($slug === 'naujienos') {
            $news_id = $page_id;
        }
    }
    if ($home_id) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home_id);
    }
    if ($news_id) {
        update_option('page_for_posts', $news_id);
    }

    foreach (['miestas' => 'Ukmergės miestas', 'rajonas' => 'Ukmergės rajonas'] as $slug => $name) {
        if (!term_exists($slug, 'koops_store_area')) {
            wp_insert_term($name, 'koops_store_area', ['slug' => $slug]);
        }
    }
    foreach (['patalpu-nuoma' => 'Patalpų nuoma', 'turto-pardavimas' => 'Turto pardavimas', 'kita' => 'Kita'] as $slug => $name) {
        if (!term_exists($slug, 'koops_classified_category')) {
            wp_insert_term($name, 'koops_classified_category', ['slug' => $slug]);
        }
    }

    $file = KOOPS_CORE_PATH . 'data/stores.json';
    $stores = file_exists($file) ? json_decode((string) file_get_contents($file), true) : [];
    $imported = 0;
    foreach ($stores as $store) {
        $existing = get_page_by_path($store['slug'], OBJECT, 'koops_store');
        $post_id = $existing ? (int) $existing->ID : (int) wp_insert_post([
            'post_type' => 'koops_store',
            'post_status' => 'publish',
            'post_title' => $store['name'],
            'post_name' => $store['slug'],
        ]);
        if (!$post_id) {
            continue;
        }
        foreach (['city', 'address', 'hours', 'phone', 'phone_2', 'lat', 'lng', 'map_url', 'featured'] as $field) {
            if (array_key_exists($field, $store)) {
                update_post_meta($post_id, 'koops_' . $field, $store[$field]);
            }
        }
        wp_set_object_terms($post_id, $store['area'], 'koops_store_area');
        if (!empty($store['image']) && !has_post_thumbnail($post_id)) {
            koops_import_seed_image($post_id, basename($store['image']));
        }
        $imported++;
    }

    koops_create_primary_menu();

    flush_rewrite_rules(false);
    return sprintf('Paruošta: %d puslapiai ir %d parduotuvių įrašai.', count($pages), $imported);
}

function koops_import_seed_image(int $post_id, string $filename): void
{
    $source = get_theme_file_path('/assets/images/' . $filename);
    if (!$source || !file_exists($source)) {
        return;
    }
    $upload = wp_upload_bits($filename, null, (string) file_get_contents($source));
    if (!empty($upload['error'])) {
        return;
    }
    $filetype = wp_check_filetype($upload['file']);
    $attachment_id = wp_insert_attachment([
        'post_mime_type' => $filetype['type'],
        'post_title' => get_the_title($post_id),
        'post_status' => 'inherit',
    ], $upload['file'], $post_id);
    if (is_wp_error($attachment_id)) {
        return;
    }
    require_once ABSPATH . 'wp-admin/includes/image.php';
    wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
    set_post_thumbnail($post_id, $attachment_id);
}

function koops_create_primary_menu(): void
{
    $menu_name = 'Pagrindinis meniu';
    $menu = wp_get_nav_menu_object($menu_name);
    $menu_id = $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($menu_name);
    if (!$menu_id || is_wp_error($menu_id)) {
        return;
    }
    $existing = wp_get_nav_menu_items($menu_id);
    if (!$existing) {
        $items = [
            ['Parduotuvės', get_post_type_archive_link('koops_store')],
            ['Leidiniai', home_url('/leidiniai/')],
            ['Naujienos', home_url('/naujienos/')],
            ['Skelbimai', get_post_type_archive_link('koops_classified')],
            ['Restoranas', home_url('/restoranas/')],
            ['Karjera', get_post_type_archive_link('koops_job')],
            ['Tiekėjams', home_url('/tiekejams/')],
            ['Apie mus', home_url('/apie/')],
            ['Kontaktai', home_url('/kontaktai/')],
        ];
        foreach ($items as [$title, $url]) {
            wp_update_nav_menu_item($menu_id, 0, [
                'menu-item-title' => $title,
                'menu-item-url' => $url,
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom',
            ]);
        }
    }
    $locations = (array) get_theme_mod('nav_menu_locations', []);
    $locations['primary'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);
}

function koops_filter_expired_classifieds(WP_Query $query): void
{
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive('koops_classified')) {
        return;
    }
    $today = current_time('Y-m-d');
    $query->set('meta_query', [
        'relation' => 'OR',
        ['key' => 'koops_expires_at', 'compare' => 'NOT EXISTS'],
        ['key' => 'koops_expires_at', 'value' => '', 'compare' => '='],
        ['key' => 'koops_expires_at', 'value' => $today, 'compare' => '>=', 'type' => 'DATE'],
    ]);
}
add_action('pre_get_posts', 'koops_filter_expired_classifieds');

function koops_enquiry_type_labels(): array
{
    return [
        'contact' => 'Kontaktų',
        'supplier' => 'Tiekėjo',
        'restaurant' => 'Restorano',
        'job' => 'Karjeros',
    ];
}

function koops_create_enquiry(array $data, array $attachments = [])
{
    $labels = koops_enquiry_type_labels();
    $type = sanitize_key((string) ($data['type'] ?? 'contact'));
    $name = sanitize_text_field((string) ($data['name'] ?? ''));
    $email = sanitize_email((string) ($data['email'] ?? ''));
    $phone = sanitize_text_field((string) ($data['phone'] ?? ''));
    $message = sanitize_textarea_field((string) ($data['message'] ?? ''));
    $consent = !empty($data['consent']);

    if (
        !isset($labels[$type])
        || mb_strlen($name) < 2
        || mb_strlen($name) > 120
        || !is_email($email)
        || mb_strlen($email) > 190
        || mb_strlen($phone) > 80
        || mb_strlen($message) < 10
        || mb_strlen($message) > 5000
        || !$consent
    ) {
        return new WP_Error('koops_invalid_enquiry', 'Patikrinkite privalomus formos laukus.', ['status' => 422]);
    }

    $details = [
        'Svečiai' => sanitize_text_field((string) ($data['sveciai'] ?? '')),
        'Data' => sanitize_text_field((string) ($data['data'] ?? '')),
        'Renginio tipas' => sanitize_text_field((string) ($data['tipas'] ?? '')),
    ];
    $recipient = $type === 'restaurant'
        ? koops_get_option('restaurant_email', 'restoranas@urvk.lt')
        : koops_get_option('form_recipient', 'direktore@urvk.lt');
    $subject = sprintf('[KOOPS] %s užklausa – %s', $labels[$type], $name);
    $body_lines = [
        'Užklausos tipas: ' . $labels[$type],
        'Vardas: ' . $name,
        'El. paštas: ' . $email,
        'Telefonas: ' . ($phone ?: 'Nenurodytas'),
    ];
    foreach ($details as $label => $value) {
        if ($value !== '') {
            $body_lines[] = $label . ': ' . $value;
        }
    }
    $body_lines[] = '';
    $body_lines[] = $message;

    $attachment_paths = [];
    $attachment_name = '';
    if (!empty($attachments['attachment']) && is_array($attachments['attachment'])) {
        $file = $attachments['attachment'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return new WP_Error('koops_attachment_failed', 'Priedo įkelti nepavyko.', ['status' => 422]);
        }
        if ((int) ($file['size'] ?? 0) > 5 * MB_IN_BYTES) {
            return new WP_Error('koops_attachment_too_large', 'Priedas gali būti iki 5 MB.', ['status' => 413]);
        }
        $attachment_name = sanitize_file_name((string) ($file['name'] ?? ''));
        $allowed_mimes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        $file_type = wp_check_filetype_and_ext((string) $file['tmp_name'], $attachment_name, $allowed_mimes);
        if (empty($file_type['ext']) || empty($file_type['type'])) {
            return new WP_Error('koops_attachment_type', 'Galima pridėti tik PDF, DOC arba DOCX failą.', ['status' => 422]);
        }
        $attachment_paths[] = (string) $file['tmp_name'];
    }

    $post_id = wp_insert_post([
        'post_type' => 'koops_enquiry',
        'post_status' => 'private',
        'post_title' => sprintf('%s – %s', $labels[$type], $name),
        'meta_input' => [
            '_koops_enquiry_type' => $type,
            '_koops_enquiry_name' => $name,
            '_koops_enquiry_email' => $email,
            '_koops_enquiry_phone' => $phone,
            '_koops_enquiry_message' => $message,
            '_koops_enquiry_details' => array_filter($details),
            '_koops_enquiry_attachment' => $attachment_name,
            '_koops_enquiry_consent_at' => current_time('mysql'),
            '_koops_enquiry_recipient' => $recipient,
        ],
    ], true);
    if (is_wp_error($post_id)) {
        return new WP_Error('koops_enquiry_save_failed', 'Užklausos išsaugoti nepavyko.', ['status' => 500]);
    }

    $headers = ['Reply-To: ' . $name . ' <' . $email . '>'];
    $sent = wp_mail($recipient, $subject, implode("\n", $body_lines), $headers, $attachment_paths);
    update_post_meta($post_id, '_koops_enquiry_mail_status', $sent ? 'sent' : 'failed');

    return ['id' => (int) $post_id, 'mailSent' => (bool) $sent];
}

function koops_enquiry_meta_box(): void
{
    add_meta_box('koops_enquiry_details', 'Užklausos duomenys', 'koops_render_enquiry_meta_box', 'koops_enquiry', 'normal', 'high');
}
add_action('add_meta_boxes_koops_enquiry', 'koops_enquiry_meta_box');

function koops_render_enquiry_meta_box(WP_Post $post): void
{
    $labels = koops_enquiry_type_labels();
    $type = (string) get_post_meta($post->ID, '_koops_enquiry_type', true);
    $details = (array) get_post_meta($post->ID, '_koops_enquiry_details', true);
    $rows = array_merge([
        'Tipas' => $labels[$type] ?? $type,
        'Vardas' => get_post_meta($post->ID, '_koops_enquiry_name', true),
        'El. paštas' => get_post_meta($post->ID, '_koops_enquiry_email', true),
        'Telefonas' => get_post_meta($post->ID, '_koops_enquiry_phone', true),
    ], $details, [
        'Priedas' => get_post_meta($post->ID, '_koops_enquiry_attachment', true),
        'Gavėjas' => get_post_meta($post->ID, '_koops_enquiry_recipient', true),
        'Laiško būsena' => get_post_meta($post->ID, '_koops_enquiry_mail_status', true) === 'sent' ? 'Perduotas siųsti' : 'Siuntimo klaida',
        'Privatumo sutikimas' => get_post_meta($post->ID, '_koops_enquiry_consent_at', true),
    ]);
    echo '<table class="widefat striped"><tbody>';
    foreach ($rows as $label => $value) {
        if ((string) $value === '') continue;
        echo '<tr><th style="width:190px">' . esc_html($label) . '</th><td>' . esc_html((string) $value) . '</td></tr>';
    }
    echo '</tbody></table>';
    echo '<h3>Žinutė</h3><p style="white-space:pre-wrap">' . esc_html((string) get_post_meta($post->ID, '_koops_enquiry_message', true)) . '</p>';
}

add_filter('manage_koops_enquiry_posts_columns', static function (array $columns): array {
    return [
        'cb' => $columns['cb'],
        'title' => 'Užklausa',
        'koops_type' => 'Tipas',
        'koops_contact' => 'Kontaktas',
        'koops_mail' => 'Laiškas',
        'date' => 'Gauta',
    ];
});

add_action('manage_koops_enquiry_posts_custom_column', static function (string $column, int $post_id): void {
    if ($column === 'koops_type') {
        $labels = koops_enquiry_type_labels();
        $type = (string) get_post_meta($post_id, '_koops_enquiry_type', true);
        echo esc_html($labels[$type] ?? $type);
    } elseif ($column === 'koops_contact') {
        echo esc_html((string) get_post_meta($post_id, '_koops_enquiry_email', true));
    } elseif ($column === 'koops_mail') {
        echo get_post_meta($post_id, '_koops_enquiry_mail_status', true) === 'sent' ? 'Perduotas siųsti' : 'Klaida';
    }
}, 10, 2);

function koops_form_shortcode(array $atts = []): string
{
    $atts = shortcode_atts(['type' => 'contact'], $atts, 'koops_form');
    $type = in_array($atts['type'], ['contact', 'supplier', 'restaurant', 'job'], true) ? $atts['type'] : 'contact';
    $status = isset($_GET['koops_form']) ? sanitize_key(wp_unslash($_GET['koops_form'])) : '';
    ob_start();
    ?>
    <form class="koops-form" method="post" action="">
        <?php if ($status === 'success') : ?><p class="form-notice success" role="status">Ačiū. Jūsų žinutė išsiųsta.</p><?php endif; ?>
        <?php if ($status === 'error') : ?><p class="form-notice error" role="alert">Žinutės išsiųsti nepavyko. Pabandykite dar kartą arba susisiekite telefonu.</p><?php endif; ?>
        <?php wp_nonce_field('koops_submit_form', 'koops_form_nonce'); ?>
        <input type="hidden" name="koops_form_type" value="<?php echo esc_attr($type); ?>">
        <input class="koops-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label><span>Jūsų vardas</span><input name="name" required autocomplete="name" placeholder="Pvz., Antanas"></label>
        <label><span>El. paštas</span><input type="email" name="email" required autocomplete="email" placeholder="Pvz., vardas@pastas.lt"></label>
        <label><span>Telefonas</span><input type="tel" name="phone" autocomplete="tel" placeholder="Pvz., +370 600 00000"></label>
        <label class="form-wide"><span>Žinutė</span><textarea name="message" rows="6" required placeholder="Trumpai aprašykite savo klausimą arba pasiūlymą"></textarea></label>
        <label class="form-consent form-wide"><input type="checkbox" name="consent" value="1" required><span>Patvirtinu, kad susipažinau su <a href="<?php echo esc_url(koops_get_option('privacy_url')); ?>">privatumo politika</a>.</span></label>
        <div class="form-wide"><button class="koops-button is-accent" type="submit">Siųsti</button></div>
    </form>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('koops_form', 'koops_form_shortcode');

function koops_handle_form_submission(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['koops_form_nonce'])) {
        return;
    }
    $nonce = sanitize_text_field(wp_unslash($_POST['koops_form_nonce']));
    if (!wp_verify_nonce($nonce, 'koops_submit_form') || !empty($_POST['website']) || empty($_POST['consent'])) {
        koops_redirect_form_status('error');
    }
    $name = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $phone = sanitize_text_field(wp_unslash($_POST['phone'] ?? ''));
    $message = sanitize_textarea_field(wp_unslash($_POST['message'] ?? ''));
    $type = sanitize_key(wp_unslash($_POST['koops_form_type'] ?? 'contact'));
    if (!$name || !is_email($email) || !$message) {
        koops_redirect_form_status('error');
    }
    $result = koops_create_enquiry([
        'type' => $type,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'consent' => true,
    ]);
    koops_redirect_form_status(is_wp_error($result) ? 'error' : 'success');
}
add_action('template_redirect', 'koops_handle_form_submission');

/**
 * Viešas turinio sluoksnis Next.js svetainei. WordPress lieka vienintelis
 * redaguojamų įrašų ir bendrų kontaktinių duomenų šaltinis.
 */
function koops_rest_image(int $post_id): string
{
    $image = get_the_post_thumbnail_url($post_id, 'full');
    return $image ? esc_url_raw($image) : '';
}

function koops_rest_terms(int $post_id, string $taxonomy): array
{
    $terms = wp_get_post_terms($post_id, $taxonomy);
    if (is_wp_error($terms)) {
        return [];
    }
    return array_map(static fn(WP_Term $term): array => [
        'name' => $term->name,
        'slug' => $term->slug,
    ], $terms);
}

function koops_rest_posts(string $post_type): array
{
    $query = new WP_Query([
        'post_type' => $post_type,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => $post_type === 'post' ? 'date' : ['menu_order' => 'ASC', 'date' => 'DESC'],
        'order' => 'DESC',
        'no_found_rows' => true,
    ]);

    return array_map(static function (WP_Post $post) use ($post_type): array {
        $base = [
            'id' => (int) $post->ID,
            'slug' => $post->post_name,
            'title' => get_the_title($post),
            'excerpt' => wp_strip_all_tags(get_the_excerpt($post)),
            'content' => apply_filters('the_content', $post->post_content),
            'publishedAt' => get_the_date('Y-m-d', $post),
            'image' => koops_rest_image((int) $post->ID),
        ];

        if ($post_type === 'koops_store') {
            $base['city'] = (string) get_post_meta($post->ID, 'koops_city', true);
            $base['address'] = (string) get_post_meta($post->ID, 'koops_address', true);
            $base['hours'] = (string) get_post_meta($post->ID, 'koops_hours', true);
            $base['phone'] = (string) get_post_meta($post->ID, 'koops_phone', true);
            $base['extraPhone'] = (string) get_post_meta($post->ID, 'koops_phone_2', true);
            $base['lat'] = (float) get_post_meta($post->ID, 'koops_lat', true);
            $base['lng'] = (float) get_post_meta($post->ID, 'koops_lng', true);
            $base['map'] = (string) get_post_meta($post->ID, 'koops_map_url', true);
            $base['featured'] = (bool) get_post_meta($post->ID, 'koops_featured', true);
            $base['areas'] = koops_rest_terms((int) $post->ID, 'koops_store_area');
        } elseif ($post_type === 'koops_classified') {
            $base['location'] = (string) get_post_meta($post->ID, 'koops_location', true);
            $base['area'] = (string) get_post_meta($post->ID, 'koops_area_size', true);
            $base['price'] = (string) get_post_meta($post->ID, 'koops_price', true);
            $base['status'] = (string) get_post_meta($post->ID, 'koops_status', true);
            $base['expiresAt'] = (string) get_post_meta($post->ID, 'koops_expires_at', true);
            $base['contactPhone'] = (string) get_post_meta($post->ID, 'koops_contact_phone', true);
            $base['contactEmail'] = (string) get_post_meta($post->ID, 'koops_contact_email', true);
            $base['categories'] = koops_rest_terms((int) $post->ID, 'koops_classified_category');
        } elseif ($post_type === 'koops_job') {
            $base['location'] = (string) get_post_meta($post->ID, 'koops_location', true);
            $base['employment'] = (string) get_post_meta($post->ID, 'koops_employment', true);
            $base['department'] = (string) get_post_meta($post->ID, 'koops_department', true);
            $base['applyUrl'] = (string) get_post_meta($post->ID, 'koops_apply_url', true);
            $base['deadline'] = (string) get_post_meta($post->ID, 'koops_deadline', true);
        } elseif ($post_type === 'koops_flyer') {
            $pdf_id = absint(get_post_meta($post->ID, 'koops_pdf_id', true));
            $page_ids = array_filter(array_map('absint', explode(',', (string) get_post_meta($post->ID, 'koops_page_ids', true))));
            $base['kind'] = (string) get_post_meta($post->ID, 'koops_kind', true) ?: 'bendras';
            $base['validFrom'] = (string) get_post_meta($post->ID, 'koops_valid_from', true);
            $base['validUntil'] = (string) get_post_meta($post->ID, 'koops_valid_until', true);
            $base['pdfUrl'] = $pdf_id ? (string) wp_get_attachment_url($pdf_id) : '';
            $base['pages'] = array_values(array_filter(array_map(
                static fn(int $id): string => (string) (wp_get_attachment_image_url($id, 'full') ?: ''),
                $page_ids
            )));
        } elseif ($post_type === 'post') {
            $categories = get_the_category($post->ID);
            $base['category'] = $categories ? $categories[0]->name : 'Naujienos';
        }

        return $base;
    }, $query->posts);
}

function koops_rest_site_data(): WP_REST_Response
{
    do_action('litespeed_control_set_nocache', 'KOOPS headless API');
    $options = wp_parse_args((array) get_option('koops_options', []), koops_default_options());
    unset($options['form_recipient'], $options['frontend_url']);

    $response = new WP_REST_Response([
        'version' => KOOPS_CORE_VERSION,
        'updatedAt' => gmdate('c'),
        'options' => $options,
        'stores' => koops_rest_posts('koops_store'),
        'news' => array_values(array_filter(
            koops_rest_posts('post'),
            static fn(array $item): bool => $item['slug'] !== 'hello-world'
        )),
        'classifieds' => koops_rest_posts('koops_classified'),
        'jobs' => koops_rest_posts('koops_job'),
        'flyers' => koops_rest_posts('koops_flyer'),
        'pages' => koops_rest_pages(),
    ]);
    $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return $response;
}

function koops_rest_can_manage_options(): bool
{
    return current_user_can('manage_options');
}

function koops_rest_can_edit_pages(): bool
{
    return current_user_can('edit_pages');
}

function koops_rest_submit_enquiry(WP_REST_Request $request)
{
    if ((string) $request->get_param('website') !== '') {
        return new WP_REST_Response(['success' => true], 201);
    }

    $client_key = preg_replace('/[^a-f0-9]/', '', strtolower((string) $request->get_param('client_key')));
    if (strlen($client_key) < 32) {
        $client_key = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    }
    $rate_key = 'koops_enquiry_' . substr($client_key, 0, 32);
    $attempts = (int) get_transient($rate_key);
    if ($attempts >= 8) {
        return new WP_Error('koops_enquiry_rate_limit', 'Per daug bandymų. Pabandykite po 10 minučių.', ['status' => 429]);
    }
    set_transient($rate_key, $attempts + 1, 10 * MINUTE_IN_SECONDS);

    $result = koops_create_enquiry([
        'type' => $request->get_param('type'),
        'name' => $request->get_param('name'),
        'email' => $request->get_param('email'),
        'phone' => $request->get_param('phone'),
        'message' => $request->get_param('message'),
        'consent' => $request->get_param('consent'),
        'sveciai' => $request->get_param('sveciai'),
        'data' => $request->get_param('data'),
        'tipas' => $request->get_param('tipas'),
    ], $request->get_file_params());
    if (is_wp_error($result)) {
        return $result;
    }

    $response = new WP_REST_Response([
        'success' => true,
        'id' => $result['id'],
        'mailSent' => $result['mailSent'],
    ], 201);
    $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return $response;
}

function koops_rest_update_options(WP_REST_Request $request)
{
    $payload = $request->get_json_params();
    $changes = is_array($payload) ? ($payload['changes'] ?? null) : null;
    if (!is_array($changes)) {
        return new WP_Error('koops_invalid_changes', 'Laukas „changes“ turi būti objektas.', ['status' => 400]);
    }

    $blocked = ['frontend_url', 'form_recipient'];
    $defaults = koops_default_options();
    $current = wp_parse_args((array) get_option('koops_options', []), $defaults);
    foreach ($changes as $key => $value) {
        if (!array_key_exists($key, $defaults) || in_array($key, $blocked, true)) {
            return new WP_Error('koops_option_not_allowed', 'Šio bendro lauko negalima keisti per turinio API: ' . sanitize_key((string) $key), ['status' => 400]);
        }
        if (!is_scalar($value) && $value !== null) {
            return new WP_Error('koops_option_value_invalid', 'Bendro lauko reikšmė turi būti tekstas arba skaičius.', ['status' => 400]);
        }
        $current[$key] = $value;
    }

    $clean = koops_sanitize_options($current);
    update_option('koops_options', $clean);
    unset($clean['form_recipient'], $clean['frontend_url']);
    return rest_ensure_response(['updated' => array_keys($changes), 'options' => $clean]);
}

function koops_register_rest_routes(): void
{
    register_rest_route('koops/v1', '/site', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'koops_rest_site_data',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('koops/v1', '/enquiries', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'koops_rest_submit_enquiry',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('koops/v1', '/manage/options', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'koops_rest_update_options',
        'permission_callback' => 'koops_rest_can_manage_options',
    ]);
    register_rest_route('koops/v1', '/manage/pages/(?P<slug>[a-z0-9-]+)', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'koops_rest_replace_page_sections',
        'permission_callback' => 'koops_rest_can_edit_pages',
    ]);
    register_rest_route('koops/v1', '/manage/pages/(?P<slug>[a-z0-9-]+)/sections/(?P<section>[a-z0-9-]+)', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'koops_rest_update_page_section',
        'permission_callback' => 'koops_rest_can_edit_pages',
    ]);
    register_rest_route('koops/v1', '/manage/media/ensure', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'koops_rest_ensure_media',
        'permission_callback' => static fn(): bool => current_user_can('upload_files'),
    ]);
}
add_action('rest_api_init', 'koops_register_rest_routes');

/**
 * Viešas WordPress adresas nėra antras frontendas. Jis nukreipia į tą pačią
 * Next.js svetainę, o administracija ir REST API lieka pasiekiami WordPress'e.
 */
function koops_redirect_public_frontend(): void
{
    if (is_admin() || wp_doing_ajax() || wp_is_json_request() || defined('XMLRPC_REQUEST')) {
        return;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        return;
    }

    $frontend = untrailingslashit(koops_get_option('frontend_url'));
    if (!$frontend) {
        return;
    }

    $path = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '/';
    if (str_starts_with($path, '/wp-admin') || str_starts_with($path, '/wp-login.php') || str_starts_with($path, '/wp-json')) {
        return;
    }

    wp_redirect($frontend . $path, 302, 'KOOPS Headless WordPress');
    exit;
}
add_action('template_redirect', 'koops_redirect_public_frontend', 0);

function koops_redirect_form_status(string $status): void
{
    $url = wp_get_referer() ?: home_url('/');
    wp_safe_redirect(add_query_arg('koops_form', $status, $url));
    exit;
}

register_activation_hook(__FILE__, function (): void {
    koops_register_content_types();
    add_option('koops_options', koops_default_options());
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
