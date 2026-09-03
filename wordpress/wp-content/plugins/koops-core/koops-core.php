<?php
/**
 * Plugin Name: KOOPS Core
 * Description: KOOPS turinio tipai, valdymo laukai, bendri duomenys ir formos.
 * Version: 0.10.0
 * Author: KOOPS
 * Text Domain: koops
 */

if (!defined('ABSPATH')) {
    exit;
}

define('KOOPS_CORE_VERSION', '0.10.0');
define('KOOPS_CORE_PATH', plugin_dir_path(__FILE__));
define('KOOPS_CORE_URL', plugin_dir_url(__FILE__));

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
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
        ]);
    }

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
    ];
}

function koops_register_meta_fields(): void
{
    foreach (koops_meta_schema() as $post_type => $fields) {
        foreach ($fields as $key => $field) {
            $data_type = $field['type'] === 'checkbox' ? 'boolean' : ($field['type'] === 'number' ? 'number' : 'string');
            register_post_meta($post_type, $key, [
                'single' => true,
                'type' => $data_type,
                'show_in_rest' => true,
                'sanitize_callback' => function ($value) use ($field) {
                    if ($field['type'] === 'checkbox') {
                        return (bool) $value;
                    }
                    if ($field['type'] === 'number') {
                        return (float) $value;
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
        add_meta_box('koops_details', 'KOOPS informacija', 'koops_render_meta_box', $post_type, 'normal', 'high');
    }
}
add_action('add_meta_boxes', 'koops_add_meta_boxes');

function koops_render_meta_box(WP_Post $post): void
{
    wp_nonce_field('koops_save_meta', 'koops_meta_nonce');
    $fields = koops_meta_schema()[$post->post_type] ?? [];
    echo '<div class="koops-admin-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px">';

    foreach ($fields as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        echo '<label style="display:flex;flex-direction:column;gap:6px;font-weight:600">';

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
        } elseif ($field['type'] === 'number') {
            $value = (float) $value;
        } else {
            $value = sanitize_text_field($value);
        }
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post', 'koops_save_meta_fields');

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
                        <td><input class="regular-text" id="koops-<?php echo esc_attr($key); ?>" name="koops_options[<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr($options[$key]); ?>"></td>
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
    $labels = ['contact' => 'Kontaktų', 'supplier' => 'Tiekėjo', 'restaurant' => 'Restorano', 'job' => 'Karjeros'];
    $subject = sprintf('[KOOPS] %s užklausa – %s', $labels[$type] ?? 'Svetainės', $name);
    $body = "Vardas: {$name}\nEl. paštas: {$email}\nTelefonas: {$phone}\n\n{$message}";
    $headers = ['Reply-To: ' . $name . ' <' . $email . '>'];
    $sent = wp_mail(koops_get_option('form_recipient'), $subject, $body, $headers);
    koops_redirect_form_status($sent ? 'success' : 'error');
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
    unset($options['form_recipient']);

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
