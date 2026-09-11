<?php
/**
 * KOOPS modular page sections for Gutenberg and the headless REST API.
 */

if (!defined('ABSPATH')) {
    exit;
}

function koops_section_preview_url(string $type): string
{
    return KOOPS_CORE_URL . 'assets/previews/' . rawurlencode($type) . '.jpg?ver=' . rawurlencode((string) KOOPS_CORE_VERSION);
}

function koops_section_catalog(): array
{
    $items = [
        'home-hero' => ['page' => 'pradinis', 'label' => 'Pradinis · Hero'],
        'home-bento' => ['page' => 'pradinis', 'label' => 'Pradinis · KOOPS paslaugos'],
        'home-stores' => ['page' => 'pradinis', 'label' => 'Pradinis · Parduotuvių karuselė'],
        'home-news' => ['page' => 'pradinis', 'label' => 'Pradinis · Naujienos'],
        'home-restaurant' => ['page' => 'pradinis', 'label' => 'Pradinis · Restoranas'],
        'home-jobs' => ['page' => 'pradinis', 'label' => 'Pradinis · Karjera'],
        'home-values' => ['page' => 'pradinis', 'label' => 'Pradinis · KOOPS vertės'],
        'home-suppliers' => ['page' => 'pradinis', 'label' => 'Pradinis · Tiekėjų forma'],
        'footer-cta' => ['page' => 'global', 'label' => 'Poraštės kvietimas'],

        'stores-directory' => ['page' => 'parduotuves', 'label' => 'Parduotuvės · Sąrašas ir žemėlapis'],
        'stores-faq' => ['page' => 'parduotuves', 'label' => 'Parduotuvės · Klausimai'],
        'news-listing' => ['page' => 'naujienos', 'label' => 'Naujienos · Sąrašas'],
        'classifieds-listing' => ['page' => 'skelbimai', 'label' => 'Skelbimai · Sąrašas'],

        'restaurant-hero' => ['page' => 'restoranas', 'label' => 'Restoranas · Hero'],
        'restaurant-features' => ['page' => 'restoranas', 'label' => 'Restoranas · Privalumai'],
        'restaurant-halls' => ['page' => 'restoranas', 'label' => 'Restoranas · Salės'],
        'restaurant-enquiry' => ['page' => 'restoranas', 'label' => 'Restoranas · Kontaktai ir užklausa'],

        'careers-hero' => ['page' => 'karjera', 'label' => 'Karjera · Hero'],
        'careers-features' => ['page' => 'karjera', 'label' => 'Karjera · Privalumai'],
        'careers-jobs' => ['page' => 'karjera', 'label' => 'Karjera · Darbo pasiūlymai'],
        'careers-enquiry' => ['page' => 'karjera', 'label' => 'Karjera · Kandidato užklausa'],

        'suppliers-hero' => ['page' => 'tiekejams', 'label' => 'Tiekėjams · Hero'],
        'suppliers-looking' => ['page' => 'tiekejams', 'label' => 'Tiekėjams · Ko ieškome'],
        'suppliers-process' => ['page' => 'tiekejams', 'label' => 'Tiekėjams · Procesas'],
        'suppliers-enquiry' => ['page' => 'tiekejams', 'label' => 'Tiekėjams · Pasiūlymo forma'],

        'about-hero' => ['page' => 'apie', 'label' => 'Apie · Hero'],
        'about-story' => ['page' => 'apie', 'label' => 'Apie · Istorija'],
        'about-pillars' => ['page' => 'apie', 'label' => 'Apie · Trys atramos'],
        'about-bento' => ['page' => 'apie', 'label' => 'Apie · Veiklos kryptys'],

        'contact-form' => ['page' => 'kontaktai', 'label' => 'Kontaktai · Forma ir rekvizitai'],
        'contact-channels' => ['page' => 'kontaktai', 'label' => 'Kontaktai · Kur kreiptis'],
    ];

    $media = [
        'home-hero' => 'image',
        'home-bento' => 'gallery',
        'home-restaurant' => 'gallery',
        'home-suppliers' => 'image',
        'restaurant-hero' => 'gallery',
        'restaurant-halls' => 'gallery',
        'careers-hero' => 'gallery',
        'suppliers-hero' => 'gallery',
        'suppliers-looking' => 'gallery',
        'suppliers-enquiry' => 'image',
        'about-hero' => 'gallery',
        'about-story' => 'image',
        'about-bento' => 'gallery',
        'contact-form' => 'image',
    ];
    foreach ($media as $type => $kind) {
        if (isset($items[$type])) {
            $items[$type]['media'] = $kind;
        }
    }

    foreach ($items as $type => &$item) {
        $item['preview'] = koops_section_preview_url($type);
    }
    unset($item);

    return $items;
}

function koops_section_catalog_for_page(string $slug): array
{
    unset($slug);
    return koops_section_catalog();
}

function koops_page_public_path(string $slug): string
{
    $paths = [
        'pradinis' => '/',
        'parduotuves' => '/parduotuves',
        'naujienos' => '/naujienos',
        'restoranas' => '/restoranas',
        'karjera' => '/karjera',
        'tiekejams' => '/tiekejams',
        'apie' => '/apie',
        'kontaktai' => '/kontaktai',
        'skelbimai' => '/skelbimai',
        'privatumo-politika' => '/privatumo-politika',
    ];
    return $paths[$slug] ?? '/' . sanitize_title($slug);
}

function koops_section_anchor_defaults(): array
{
    return [
        'home-hero' => 'pradzia',
        'home-stores' => 'parduotuves',
        'home-news' => 'naujienos',
        'home-restaurant' => 'restoranas',
        'home-jobs' => 'karjera',
        'home-values' => 'apie',
        'home-suppliers' => 'tiekejams',
        'stores-directory' => 'sarasas',
        'restaurant-enquiry' => 'uzklausa',
        'careers-jobs' => 'pozicijos',
        'careers-enquiry' => 'susisiekti',
        'suppliers-enquiry' => 'forma',
        'suppliers-looking' => 'ko-ieskome',
        'suppliers-process' => 'kaip-veikia',
        'contact-form' => 'forma',
        'contact-channels' => 'keliai',
        'footer-cta' => 'footer-cta',
    ];
}

function koops_default_section_anchor(string $type): string
{
    $defaults = koops_section_anchor_defaults();
    return $defaults[$type] ?? $type;
}

function koops_sanitize_section_anchor(string $value, string $type = ''): string
{
    $anchor = sanitize_title($value);
    return $anchor !== '' ? $anchor : koops_default_section_anchor($type);
}

function koops_section_content_defaults(): array
{
    return [
        'home-hero' => ['eyebrow' => 'UKMERGĖJE IR RAJONE', 'title' => 'KOOPS parduotuvės arčiau jūsų.', 'description' => 'Raskite artimiausią parduotuvę, jos darbo laiką ir maršrutą.', 'primaryLabel' => 'Rasti parduotuvę', 'primaryUrl' => '/parduotuves', 'imageUrl' => '/koops-hero-market.jpg'],
        'home-bento' => ['eyebrow' => 'KOOPS KASDIEN', 'title' => 'Viskas, ko reikia — arčiau jūsų', 'description' => 'Parduotuvės, restoranas, darbo pasiūlymai ir tiekėjų informacija vienoje vietoje.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/koops-hero.jpg', 'galleryUrls' => ['/koops-hero.jpg', '/local-produce-couple.jpg']],
        'home-stores' => ['eyebrow' => 'PARDUOTUVĖS', 'title' => 'Raskite artimiausią KOOPS parduotuvę', 'description' => 'Adresai, darbo laikas ir kelio nuorodos.', 'primaryLabel' => 'Visos parduotuvės', 'primaryUrl' => '/parduotuves', 'imageUrl' => ''],
        'home-news' => ['eyebrow' => 'AKTUALU', 'title' => 'Naujienos ir akcijos', 'description' => '', 'primaryLabel' => 'Visos naujienos', 'primaryUrl' => '/naujienos', 'imageUrl' => '/local-produce-couple.jpg'],
        'home-restaurant' => ['eyebrow' => 'RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ', 'title' => 'Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.', 'description' => 'Miesto širdyje įsikūręs restoranas laukia Jūsų.', 'primaryLabel' => 'Siųsti užklausą', 'primaryUrl' => '/restoranas#uzklausa', 'imageUrl' => '/vilkmerge-hall.jpg', 'galleryUrls' => ['/vilkmerge-hall.jpg', '/vilkmerge-table.jpg', '/vilkmerge-menu.jpg']],
        'home-jobs' => ['eyebrow' => 'KARJERA', 'title' => 'Darbas arti namų', 'description' => 'Prisijunkite prie KOOPS komandos Ukmergėje ir rajone. Susipažinkite su šiuo metu siūlomomis darbo vietomis.', 'primaryLabel' => 'Visi darbo pasiūlymai', 'primaryUrl' => '/karjera', 'imageUrl' => ''],
        'home-values' => ['eyebrow' => 'APIE KOOPS', 'title' => 'Vietos žmonėms. Vietos verslui.', 'description' => 'Ukmergės rajono vartotojų kooperatyvas savo istoriją skaičiuoja nuo 1996 metų, kai buvo reorganizuota Ukmergės rajkoopsąjunga. Bendrovė vykdo mažmeninę prekybą, nuomoja nekilnojamąjį turtą ir teikia depozito surinkimo, Perlo, Olifejos, pinigų išgryninimo bei kitas paslaugas.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'home-suppliers' => ['eyebrow' => 'TIEKĖJAMS', 'title' => 'Auginkime vietos pasiūlą kartu', 'description' => 'Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/ukmerge-fields-2.jpg'],
        'footer-cta' => ['eyebrow' => 'KOOPS', 'title' => 'Parduotuvė gali būti arčiau, nei manote', 'description' => '', 'primaryLabel' => 'Rasti parduotuvę', 'primaryUrl' => '/parduotuves', 'imageUrl' => ''],

        'stores-directory' => ['eyebrow' => 'PARDUOTUVĖS', 'title' => 'Raskite artimiausią KOOPS parduotuvę', 'description' => '34 parduotuvės Ukmergėje ir rajone.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'stores-faq' => ['eyebrow' => 'GREITI ATSAKYMAI', 'title' => 'Kur, kada ir kaip — be spėliojimo.', 'description' => 'Atsakymai apie parduotuvių vietas, darbo laiką, maršrutą ir kontaktus.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'news-listing' => ['eyebrow' => 'AKTUALU', 'title' => 'Naujienos ir akcijos', 'description' => 'KOOPS naujienos, akcijos ir Ukmergės krašto aktualijos.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/local-produce-couple.jpg'],
        'classifieds-listing' => ['eyebrow' => 'KOOPS SKELBIMAI', 'title' => 'Skelbimai', 'description' => 'Nuomojamos patalpos, turto pasiūlymai ir kita aktuali KOOPS informacija vienoje vietoje.', 'primaryLabel' => 'Susisiekti', 'primaryUrl' => '/kontaktai', 'imageUrl' => ''],

        'restaurant-hero' => ['eyebrow' => 'RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ', 'title' => 'Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.', 'description' => 'Vieta šventėms, renginiams ir susitikimams Ukmergės centre.', 'primaryLabel' => 'Siųsti užklausą', 'primaryUrl' => '#uzklausa', 'imageUrl' => '/vilkmerge.jpg', 'galleryUrls' => ['/vilkmerge.jpg']],
        'restaurant-features' => ['eyebrow' => 'ERDVĖ RENGINIUI', 'title' => 'Trys salės Ukmergės centre — viskas, ko reikia šventei', 'description' => 'Skirtingiems formatams — nuo jaukios vakarienės iki didesnės šventės ar įmonės vakaro.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'restaurant-halls' => ['eyebrow' => 'SALĖS', 'title' => 'Salės ir talpa', 'description' => 'Vestuvės, jubiliejai, įmonių vakarai.', 'primaryLabel' => 'Siųsti užklausą', 'primaryUrl' => '#uzklausa', 'imageUrl' => '/vilkmerge-hall.jpg', 'galleryUrls' => ['/vilkmerge-hall.jpg', '/vilkmerge-table.jpg', '/vilkmerge-menu.jpg']],
        'restaurant-enquiry' => ['eyebrow' => 'KONTAKTAI IR UŽKLAUSA', 'title' => 'Susisiekite arba parašykite', 'description' => 'Skambinkite tiesiogiai arba užpildykite trumpą formą — suderinsime salę, datą ir meniu.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],

        'careers-hero' => ['eyebrow' => 'KARJERA', 'title' => 'Darbas arti namų Ukmergėje ir rajone', 'description' => 'KOOPS ieško žmonių parduotuvėse, restorane „Vilkmergė“ ir logistikoje. Aiškus skelbimas, vieta ir paprastas kandidatavimo kelias — be spėliojimo.', 'primaryLabel' => 'Laisvos pozicijos', 'primaryUrl' => '#pozicijos', 'imageUrl' => '/local-produce-customer.jpg', 'galleryUrls' => ['/local-produce-customer.jpg', '/koops-community.jpg', '/store-pivonija.jpeg', '/local-produce-couple.jpg']],
        'careers-features' => ['eyebrow' => 'KODĖL KOOPS', 'title' => 'Vietos darbas, aiškus kelias ir komanda šalia', 'description' => 'Darbas Ukmergėje ir rajone — be ilgos kelionės į didesnį miestą.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'careers-jobs' => ['eyebrow' => 'LAISVOS POZICIJOS', 'title' => 'Darbas arti namų', 'description' => 'Pasirinkite skelbimą — kandidatuosite išorinėje nuorodoje. Nerandate tinkamos pozicijos? Parašykite forma apačioje.', 'primaryLabel' => 'Neradau pozicijos', 'primaryUrl' => '#susisiekti', 'imageUrl' => ''],
        'careers-enquiry' => ['eyebrow' => 'NERADOTE POZICIJOS?', 'title' => 'Parašykite mums', 'description' => 'Jei sąraše nėra jums tinkamo skelbimo — palikite kontaktus ir trumpą žinutę. Galite prisegti CV. Arba paskambinkite.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],

        'suppliers-hero' => ['eyebrow' => 'TIEKĖJAMS', 'title' => 'Auginkime vietos pasiūlą kartu', 'description' => 'Ieškome patikimų gamintojų ir tiekėjų. Aišku, ką pateikti, kam rašyti ir kas vyks po užklausos — be spėliojimo.', 'primaryLabel' => 'Siųsti pasiūlymą', 'primaryUrl' => '#forma', 'imageUrl' => '/ukmerge-fields-3.jpg', 'galleryUrls' => ['/ukmerge-fields-3.jpg', '/ukmerge-fields-2.jpg', '/ukmerge-fields-6.jpg', '/ukmerge-fields-1.jpg']],
        'suppliers-looking' => ['eyebrow' => 'KO IEŠKOME', 'title' => 'Produkcija, kuri tinka KOOPS lentynoms', 'description' => 'Sezoninė produkcija iš Ukmergės krašto ir aplinkinių ūkių.', 'primaryLabel' => 'Siųsti pasiūlymą', 'primaryUrl' => '#forma', 'imageUrl' => '/ukmerge-fields-4.jpg', 'galleryUrls' => ['/ukmerge-fields-4.jpg', '/ukmerge-fields-5.jpg']],
        'suppliers-process' => ['eyebrow' => 'KAIP VEIKIA', 'title' => 'Trys žingsniai iki kontakto', 'description' => 'Aiškus kelias: ką pateikti, ką darome mes ir kas vyks po užklausos — be spėliojimo.', 'primaryLabel' => 'Siųsti pasiūlymą', 'primaryUrl' => '#forma', 'imageUrl' => ''],
        'suppliers-enquiry' => ['eyebrow' => 'PASIŪLYMO FORMA', 'title' => 'Pasiūlykite savo produkciją', 'description' => 'Užpildykite trumpą formą — paruošime laišką.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/local-produce-couple.jpg'],

        'about-hero' => ['eyebrow' => 'APIE KOOPS', 'title' => 'Vietos žmonėms. Vietos verslui.', 'description' => 'Ukmergės rajono vartotojų kooperatyvas — parduotuvės, restoranas ir partnerystė su vietos žmonėmis kasdien.', 'primaryLabel' => 'Rasti parduotuvę', 'primaryUrl' => '/parduotuves', 'imageUrl' => '/koops-bento-local-shopping.jpg', 'galleryUrls' => ['/koops-bento-local-shopping.jpg', '/ukmerge-fields-2.jpg', '/ukmerge-fields-6.jpg', '/ukmerge-fields-1.jpg']],
        'about-story' => ['eyebrow' => 'ŽMONĖS · VIETA · ISTORIJA', 'title' => 'Kooperatyvas, augęs kartu su Ukmergės kraštu', 'description' => 'KOOPS jungia parduotuves, restoraną „Vilkmergė“ ir vietos partnerius. Dirbame tam, kad kasdienės prekės, darbas ir šventės būtų arčiau namų.', 'primaryLabel' => 'Rasti parduotuvę', 'primaryUrl' => '/parduotuves', 'imageUrl' => '/ukmerge-fields-5.jpg'],
        'about-pillars' => ['eyebrow' => 'KAS ESAME', 'title' => 'Trys atramos, ant kurių stovi KOOPS', 'description' => 'Pirkėjai, komanda ir vietos gamintojai — kooperatyvas gyvas dėl kasdienių santykių Ukmergėje ir rajone.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
        'about-bento' => ['eyebrow' => 'KOOPS KASDIEN', 'title' => 'Viskas, ko reikia — arčiau jūsų', 'description' => 'Parduotuvės, restoranas, darbo pasiūlymai ir tiekėjų informacija vienoje vietoje.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/koops-hero.jpg', 'galleryUrls' => ['/koops-hero.jpg', '/store-uosis.jpeg']],

        'contact-form' => ['eyebrow' => 'KONTAKTAI', 'title' => 'Susisiekite su KOOPS', 'description' => 'Adresas, telefonas ar trumpa žinutė — be spėliojimo.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => '/ukmerge-fields-1.jpg'],
        'contact-channels' => ['eyebrow' => 'KONTAKTŲ KELIAI', 'title' => 'Kur kreiptis', 'description' => 'Pasirinkite temą — greičiau rasite adresą, užklausą ar darbo pasiūlymą.', 'primaryLabel' => '', 'primaryUrl' => '', 'imageUrl' => ''],
    ];
}

function koops_sanitize_url_list($value): array
{
    if (!is_array($value)) {
        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            $value = is_array($decoded) ? $decoded : [$value];
        } else {
            return [];
        }
    }

    $urls = [];
    foreach ($value as $item) {
        $url = esc_url_raw((string) $item);
        if ($url !== '') {
            $urls[] = $url;
        }
    }
    return array_values($urls);
}

function koops_sanitize_id_list($value): array
{
    if (!is_array($value)) {
        return [];
    }

    return array_values(array_filter(array_map('absint', $value)));
}

function koops_public_media_url(string $url): string
{
    if ($url === '') {
        return '';
    }
    if (preg_match('#^(https?:)?//#', $url)) {
        return $url;
    }
    if (str_starts_with($url, '/')) {
        return untrailingslashit(koops_get_option('frontend_url', 'https://ukmerges-koops-website.vercel.app')) . $url;
    }
    return $url;
}

function koops_remember_media_id(string $url, int $id): void
{
    if ($url === '' || $id < 1) {
        return;
    }
    $map = (array) get_option('koops_media_map', []);
    if (($map[$url] ?? 0) === $id) {
        return;
    }
    $map[$url] = $id;
    update_option('koops_media_map', $map, false);
}

function koops_lookup_attachment_id(string $url): int
{
    $url = trim($url);
    if ($url === '') {
        return 0;
    }

    $map = (array) get_option('koops_media_map', []);
    if (!empty($map[$url])) {
        $id = absint($map[$url]);
        if ($id && get_post_type($id) === 'attachment') {
            return $id;
        }
    }

    $absolute = koops_public_media_url($url);
    $existing = attachment_url_to_postid($absolute);
    if ($existing) {
        koops_remember_media_id($url, $existing);
        return $existing;
    }

    $filename = wp_basename((string) (wp_parse_url($absolute, PHP_URL_PATH) ?: $url));
    if ($filename === '') {
        return 0;
    }

    global $wpdb;
    $id = (int) $wpdb->get_var($wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_wp_attached_file' AND meta_value LIKE %s ORDER BY post_id DESC LIMIT 1",
        '%' . $wpdb->esc_like($filename)
    ));
    if ($id && get_post_type($id) === 'attachment') {
        koops_remember_media_id($url, $id);
        return $id;
    }

    return 0;
}

function koops_ensure_attachment_items(array $urls): array
{
    if (!function_exists('media_sideload_image')) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
    }

    $items = [];
    foreach ($urls as $url) {
        $url = (string) $url;
        $id = koops_lookup_attachment_id($url);
        if (!$id) {
            $sideloaded = media_sideload_image(koops_public_media_url($url), 0, null, 'id');
            if (is_wp_error($sideloaded)) {
                continue;
            }
            $id = absint($sideloaded);
            koops_remember_media_id($url, $id);
        }
        if (!$id) {
            continue;
        }
        $source = wp_get_attachment_image_url($id, 'full') ?: wp_get_attachment_url($id);
        $items[] = [
            'id' => $id,
            'url' => $source ?: $url,
        ];
    }
    return $items;
}

function koops_rest_ensure_media(WP_REST_Request $request)
{
    $urls = koops_sanitize_url_list($request->get_param('urls'));
    return rest_ensure_response(koops_ensure_attachment_items($urls));
}

function koops_defaults_for_editor(): array
{
    $defaults = koops_section_content_defaults();
    foreach ($defaults as $type => &$item) {
        $item['anchor'] = koops_default_section_anchor($type);
        $urls = koops_sanitize_url_list($item['galleryUrls'] ?? []);
        if (!$urls) {
            continue;
        }
        $ids = [];
        foreach ($urls as $url) {
            $id = koops_lookup_attachment_id($url);
            if (!$id) {
                $ids = [];
                break;
            }
            $ids[] = $id;
        }
        if ($ids) {
            $item['galleryIds'] = $ids;
        }
    }
    unset($item);
    return $defaults;
}

function koops_section_default(string $type): array
{
    $empty = [
        'anchor' => '',
        'eyebrow' => '',
        'title' => '',
        'description' => '',
        'primaryLabel' => '',
        'primaryUrl' => '',
        'imageUrl' => '',
        'imageId' => 0,
        'galleryUrls' => [],
        'galleryIds' => [],
    ];
    $defaults = array_merge($empty, koops_section_content_defaults()[$type] ?? []);
    $defaults['anchor'] = koops_sanitize_section_anchor((string) ($defaults['anchor'] ?? ''), $type);
    $defaults['imageId'] = absint($defaults['imageId'] ?? 0);
    $defaults['galleryUrls'] = koops_sanitize_url_list($defaults['galleryUrls'] ?? []);
    $defaults['galleryIds'] = koops_sanitize_id_list($defaults['galleryIds'] ?? []);
    return $defaults;
}

function koops_section_block_variations(): array
{
    $defaults = koops_defaults_for_editor();
    $variations = [];

    foreach (koops_section_catalog() as $type => $item) {
        $page = (string) ($item['page'] ?? '');
        $preview = koops_section_preview_url($type);
        $variations[] = [
            'name' => $type,
            'title' => (string) $item['label'],
            'description' => 'Galima įterpti į bet kurį puslapį',
            'category' => 'koops',
            'icon' => 'layout',
            'keywords' => array_values(array_filter([$page, $type, 'koops', 'sekcija'])),
            'attributes' => array_merge(
                [
                    'sectionType' => $type,
                    'enabled' => true,
                ],
                is_array($defaults[$type] ?? null) ? $defaults[$type] : []
            ),
            'example' => [
                'attributes' => [
                    'sectionType' => $type,
                    'imageUrl' => $preview,
                ],
                'viewportWidth' => 1280,
            ],
            'scope' => ['inserter', 'transform'],
            'isActive' => ['sectionType'],
        ];
    }

    return $variations;
}

function koops_register_section_block(): void
{
    register_block_type(KOOPS_CORE_PATH . 'blocks', [
        'render_callback' => static fn(): string => '',
        'variations' => koops_section_block_variations(),
    ]);

    $options = get_option('koops_options', []);
    $frontend_url = is_array($options) && !empty($options['frontend_url'])
        ? esc_url_raw((string) $options['frontend_url'])
        : 'https://ukmerges-koops-website.vercel.app';

    wp_localize_script('koops-section-editor-script', 'koopsSectionEditor', [
        'catalog' => koops_section_catalog(),
        'defaults' => koops_defaults_for_editor(),
        'frontendUrl' => untrailingslashit($frontend_url),
        'previewBase' => KOOPS_CORE_URL . 'assets/previews/',
        'previewVersion' => KOOPS_CORE_VERSION,
        'restNonce' => wp_create_nonce('wp_rest'),
        'ensureMediaUrl' => rest_url('koops/v1/manage/media/ensure'),
        'pageSlug' => '',
    ]);
}
add_action('init', 'koops_register_section_block', 30);

function koops_localize_editor_page_slug(): void
{
    $slug = '';
    $post = get_post();
    if ($post instanceof WP_Post && $post->post_type === 'page') {
        $slug = (string) $post->post_name;
    }

    wp_add_inline_script(
        'koops-section-editor-script',
        'window.koopsSectionEditor=Object.assign({},window.koopsSectionEditor||{},{pageSlug:'.wp_json_encode($slug).'});',
        'after'
    );
}
add_action('enqueue_block_editor_assets', 'koops_localize_editor_page_slug', 40);

function koops_section_inserter_preview_css(): string
{
    $item = '[class*="editor-block-list-item-koops-section/"],'
        . '[class*="editor-block-list-item-koops-section-"]';
    $css = $item . '{align-items:stretch!important;}'
        . $item . ' .block-editor-block-icon,'
        . $item . ' .block-editor-block-types-list-item__icon,'
        . $item . ' .block-editor-block-types-list__item-icon{'
        . 'display:block!important;width:100%!important;height:88px!important;min-width:0!important;'
        . 'padding:0!important;border-radius:8px;overflow:hidden;background:#15190d center/cover no-repeat!important;'
        . '}'
        . $item . ' .block-editor-block-icon svg,'
        . $item . ' .dashicon{opacity:0!important;}'
        . '.block-editor-block-types-list:has([class*="editor-block-list-item-koops-section"]){display:grid!important;grid-template-columns:1fr!important;gap:10px!important;}'
        . '.koops-section-inserter-thumb,.koops-section-inserter-preview{display:block;width:100%;height:100%;object-fit:cover;border-radius:8px;pointer-events:none;}'
        . '.block-editor-inserter__preview-content-missing:has(img){padding:0;background:transparent;color:transparent;font-size:0;min-height:0;}';

    foreach (koops_section_catalog() as $type => $item_data) {
        $url = esc_url((string) ($item_data['preview'] ?? koops_section_preview_url($type)));
        $safe = sanitize_html_class($type);
        $targets = '[class*="koops-section/' . $safe . '"] .block-editor-block-icon,'
            . '[class*="koops-section-' . $safe . '"] .block-editor-block-icon,'
            . '[class*="koops-section/' . $safe . '"] .block-editor-block-types-list-item__icon,'
            . '[class*="koops-section-' . $safe . '"] .block-editor-block-types-list-item__icon';
        $css .= $targets . '{background-image:url("' . $url . '")!important;}';
    }

    return $css;
}

function koops_enqueue_section_inserter_previews(): void
{
    wp_register_style('koops-section-inserter-previews', false, [], KOOPS_CORE_VERSION);
    wp_enqueue_style('koops-section-inserter-previews');
    wp_add_inline_style('koops-section-inserter-previews', koops_section_inserter_preview_css());
}
add_action('enqueue_block_editor_assets', 'koops_enqueue_section_inserter_previews', 30);

function koops_block_category(array $categories): array
{
    array_unshift($categories, ['slug' => 'koops', 'title' => 'KOOPS sekcijos']);
    return $categories;
}
add_filter('block_categories_all', 'koops_block_category');

function koops_allowed_page_blocks($allowed, $context)
{
    if (!empty($context->post) && $context->post->post_type === 'page') {
        return ['koops/section', 'core/paragraph', 'core/heading', 'core/list', 'core/image'];
    }
    return $allowed;
}
add_filter('allowed_block_types_all', 'koops_allowed_page_blocks', 10, 2);

function koops_default_page_sections(): array
{
    return [
        'pradinis' => ['home-hero', 'home-bento', 'home-stores', 'home-news', 'home-restaurant', 'home-jobs', 'home-values', 'home-suppliers', 'footer-cta'],
        'parduotuves' => ['stores-directory', 'stores-faq', 'footer-cta'],
        'naujienos' => ['news-listing', 'footer-cta'],
        'skelbimai' => ['classifieds-listing'],
        'restoranas' => ['restaurant-hero', 'restaurant-features', 'restaurant-halls', 'restaurant-enquiry'],
        'karjera' => ['careers-hero', 'careers-features', 'careers-jobs', 'careers-enquiry'],
        'tiekejams' => ['suppliers-hero', 'suppliers-looking', 'suppliers-process', 'suppliers-enquiry'],
        'apie' => ['about-hero', 'about-story', 'about-pillars', 'about-bento'],
        'kontaktai' => ['contact-form', 'contact-channels'],
    ];
}

function koops_serialize_section_blocks(array $types): string
{
    return implode("\n\n", array_map(static function (string $type): string {
        $attrs = wp_json_encode(array_merge(
            ['sectionType' => $type, 'enabled' => true],
            koops_section_default($type)
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return '<!-- wp:koops/section ' . $attrs . ' /-->';
    }, $types));
}

function koops_backfill_section_content(): void
{
    if (get_option('koops_section_content_seed_version') === '2') {
        return;
    }

    $legacy_corrupt_titles = [
        'home-hero' => 'KOOPSnparduotuvėsnarčiaunjūsų.',
        'footer-cta' => 'Parduotuvė gali būtinarčiau, nei manote',
        'stores-directory' => 'RaskitenartimiausiąnKOOPSnparduotuvę',
        'news-listing' => 'Naujienosnir akcijos',
        'restaurant-hero' => 'Restoranas „Vilkmergė“ –nvieta, kur gyvena atsiminimai.',
        'careers-hero' => 'Darbas arti namųnUkmergėje ir rajone',
        'suppliers-hero' => 'Auginkimenvietos pasiūląnkartu',
        'about-hero' => 'Vietos žmonėms.nVietos verslui.',
        'contact-form' => 'Susisiekitensu KOOPS',
    ];

    foreach (array_keys(koops_default_page_sections()) as $slug) {
        $page = get_page_by_path($slug, OBJECT, 'page');
        if (!$page) {
            continue;
        }
        $blocks = parse_blocks($page->post_content);
        $changed = false;
        foreach ($blocks as &$block) {
            if (($block['blockName'] ?? '') !== 'koops/section') {
                continue;
            }
            $type = sanitize_key((string) ($block['attrs']['sectionType'] ?? ''));
            if (!$type) {
                continue;
            }
            $defaults = koops_section_default($type);
            foreach ($defaults as $key => $value) {
                $current = (string) ($block['attrs'][$key] ?? '');
                $is_legacy_corrupt_title = $key === 'title'
                    && isset($legacy_corrupt_titles[$type])
                    && $current === $legacy_corrupt_titles[$type];
                if ($current === '' || $is_legacy_corrupt_title) {
                    $block['attrs'][$key] = $value;
                    $changed = true;
                }
            }
        }
        unset($block);
        if ($changed) {
            wp_update_post(['ID' => $page->ID, 'post_content' => serialize_blocks($blocks)]);
        }
    }
    update_option('koops_section_content_seed_version', '2');
}
add_action('admin_init', 'koops_backfill_section_content', 30);

function koops_seed_modular_pages(): void
{
    if (get_option('koops_modular_pages_version') === KOOPS_CORE_VERSION) {
        return;
    }

    $titles = [
        'pradinis' => 'Pradinis',
        'parduotuves' => 'Parduotuvės',
        'naujienos' => 'Naujienos',
        'skelbimai' => 'Skelbimai',
        'restoranas' => 'Restoranas „Vilkmergė“',
        'karjera' => 'Karjera',
        'tiekejams' => 'Tiekėjams',
        'apie' => 'Apie KOOPS',
        'kontaktai' => 'Kontaktai',
    ];

    foreach (koops_default_page_sections() as $slug => $sections) {
        $page = get_page_by_path($slug, OBJECT, 'page');
        $post_id = $page ? (int) $page->ID : (int) wp_insert_post([
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_title' => $titles[$slug],
            'post_name' => $slug,
        ]);
        if (!$post_id) {
            continue;
        }

        $content = (string) get_post_field('post_content', $post_id);
        if (trim($content) === '') {
            wp_update_post([
                'ID' => $post_id,
                'post_content' => koops_serialize_section_blocks($sections),
            ]);
        }
    }

    update_option('koops_modular_pages_version', KOOPS_CORE_VERSION);
}
add_action('admin_init', 'koops_seed_modular_pages', 20);

function koops_normalize_page_sections(WP_Post $page): array
{
    $catalog = koops_section_catalog();
    $sections = [];

    foreach (parse_blocks($page->post_content) as $index => $block) {
        if (($block['blockName'] ?? '') !== 'koops/section') {
            continue;
        }
        $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];
        $type = sanitize_key((string) ($attrs['sectionType'] ?? ''));
        if (!$type || !isset($catalog[$type])) {
            continue;
        }

        $defaults = koops_section_default($type);
        $image_url = esc_url_raw((string) ($attrs['imageUrl'] ?? $defaults['imageUrl']));
        if ($image_url === '') {
            $image_url = (string) $defaults['imageUrl'];
        }

        $gallery_urls = koops_sanitize_url_list($attrs['galleryUrls'] ?? []);
        if (!$gallery_urls) {
            $gallery_urls = $defaults['galleryUrls'];
        }

        $anchor = koops_sanitize_section_anchor((string) ($attrs['anchor'] ?? ''), $type);

        $override_fields = [];
        foreach (['anchor', 'eyebrow', 'title', 'description', 'primaryLabel', 'primaryUrl', 'imageUrl'] as $field) {
            $value = $field === 'imageUrl' ? $image_url : ($field === 'anchor' ? $anchor : ($attrs[$field] ?? null));
            if (isset($attrs[$field]) && (string) $value !== '' && (string) $value !== (string) $defaults[$field]) {
                $override_fields[] = $field;
            }
        }
        if ($gallery_urls && $gallery_urls !== $defaults['galleryUrls']) {
            $override_fields[] = 'galleryUrls';
        }

        $sections[] = [
            'id' => $type . '-' . ($index + 1),
            'type' => $type,
            'enabled' => !array_key_exists('enabled', $attrs) || (bool) $attrs['enabled'],
            'anchor' => $anchor,
            'eyebrow' => sanitize_text_field((string) ($attrs['eyebrow'] ?? $defaults['eyebrow'])),
            'title' => sanitize_textarea_field((string) ($attrs['title'] ?? $defaults['title'])),
            'description' => sanitize_textarea_field((string) ($attrs['description'] ?? $defaults['description'])),
            'primaryLabel' => sanitize_text_field((string) ($attrs['primaryLabel'] ?? $defaults['primaryLabel'])),
            'primaryUrl' => esc_url_raw((string) ($attrs['primaryUrl'] ?? $defaults['primaryUrl'])),
            'imageUrl' => $image_url,
            'imageId' => absint($attrs['imageId'] ?? $defaults['imageId']),
            'galleryUrls' => $gallery_urls,
            'galleryIds' => koops_sanitize_id_list($attrs['galleryIds'] ?? $defaults['galleryIds']),
            'overrides' => $override_fields,
        ];
    }
    return $sections;
}

function koops_rest_pages(): array
{
    $pages = get_posts([
        'post_type' => 'page',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'menu_order title',
        'order' => 'ASC',
    ]);
    $result = [];
    foreach ($pages as $page) {
        $sections = koops_normalize_page_sections($page);
        if ($sections) {
            $result[$page->post_name] = [
                'id' => (int) $page->ID,
                'title' => get_the_title($page),
                'sections' => $sections,
            ];
        }
    }
    return $result;
}

function koops_rest_replace_page_sections(WP_REST_Request $request)
{
    $slug = sanitize_key((string) $request['slug']);
    $page = get_page_by_path($slug, OBJECT, 'page');
    if (!$page) {
        return new WP_Error('koops_page_not_found', 'Puslapis nerastas.', ['status' => 404]);
    }

    $payload = $request->get_json_params();
    $submitted = is_array($payload) ? ($payload['sections'] ?? null) : null;
    if (!is_array($submitted)) {
        return new WP_Error('koops_invalid_sections', 'Laukas „sections“ turi būti masyvas.', ['status' => 400]);
    }

    $catalog = koops_section_catalog_for_page($slug);
    $sections = [];
    $seen = [];
    foreach ($submitted as $input) {
        if (!is_array($input)) {
            continue;
        }
        $section = koops_sanitize_builder_section($input);
        $type = $section['sectionType'];
        if (!$type || !isset($catalog[$type]) || isset($seen[$type])) {
            return new WP_Error('koops_invalid_section', 'Nežinomas arba pasikartojantis sekcijos tipas.', ['status' => 400]);
        }
        $seen[$type] = true;
        $sections[] = $section;
    }

    $updated = wp_update_post([
        'ID' => (int) $page->ID,
        'post_content' => koops_serialize_builder_sections($sections),
    ], true);
    if (is_wp_error($updated)) {
        return $updated;
    }
    clean_post_cache((int) $page->ID);
    $page = get_post((int) $page->ID);
    return rest_ensure_response([
        'id' => (int) $page->ID,
        'slug' => $slug,
        'sections' => koops_normalize_page_sections($page),
    ]);
}

function koops_rest_update_page_section(WP_REST_Request $request)
{
    $slug = sanitize_key((string) $request['slug']);
    $section_type = sanitize_key((string) $request['section']);
    $page = get_page_by_path($slug, OBJECT, 'page');
    if (!$page) {
        return new WP_Error('koops_page_not_found', 'Puslapis nerastas.', ['status' => 404]);
    }
    $catalog = koops_section_catalog_for_page($slug);
    if (!isset($catalog[$section_type])) {
        return new WP_Error('koops_section_not_found', 'Nežinoma sekcija.', ['status' => 400]);
    }

    $payload = $request->get_json_params();
    $changes = is_array($payload) ? ($payload['changes'] ?? null) : null;
    if (!is_array($changes)) {
        return new WP_Error('koops_invalid_changes', 'Laukas „changes“ turi būti objektas.', ['status' => 400]);
    }
    $allowed = ['enabled', 'anchor', 'eyebrow', 'title', 'description', 'primaryLabel', 'primaryUrl', 'imageUrl', 'imageId', 'galleryUrls', 'galleryIds'];
    foreach (array_keys($changes) as $key) {
        if (!in_array($key, $allowed, true)) {
            return new WP_Error('koops_section_field_not_allowed', 'Neleistinas sekcijos laukas: ' . sanitize_key((string) $key), ['status' => 400]);
        }
    }
    foreach ($changes as $key => $value) {
        if ($key === 'enabled') {
            if (!is_bool($value) && !in_array($value, [0, 1, '0', '1'], true)) {
                return new WP_Error('koops_section_value_invalid', 'Laukas „enabled“ turi būti loginė reikšmė.', ['status' => 400]);
            }
            continue;
        }
        if ($key === 'imageId') {
            if (!is_numeric($value) && $value !== null) {
                return new WP_Error('koops_section_value_invalid', 'Laukas „imageId“ turi būti skaičius.', ['status' => 400]);
            }
            continue;
        }
        if ($key === 'galleryIds' || $key === 'galleryUrls') {
            if (!is_array($value) && $value !== null) {
                return new WP_Error('koops_section_value_invalid', 'Galerijos laukas turi būti masyvas.', ['status' => 400]);
            }
            continue;
        }
        if (!is_scalar($value) && $value !== null) {
            return new WP_Error('koops_section_value_invalid', 'Sekcijos lauko reikšmė turi būti tekstas.', ['status' => 400]);
        }
    }

    $blocks = parse_blocks($page->post_content);
    $found = false;
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'koops/section') {
            continue;
        }
        $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];
        if (sanitize_key((string) ($attrs['sectionType'] ?? '')) !== $section_type) {
            continue;
        }
        $merged = array_merge(koops_section_default($section_type), $attrs, $changes, ['sectionType' => $section_type]);
        $block['attrs'] = koops_sanitize_builder_section($merged);
        $found = true;
        break;
    }
    unset($block);
    if (!$found) {
        return new WP_Error('koops_section_not_found', 'Sekcija puslapyje nerasta.', ['status' => 404]);
    }

    $updated = wp_update_post([
        'ID' => (int) $page->ID,
        'post_content' => serialize_blocks($blocks),
    ], true);
    if (is_wp_error($updated)) {
        return $updated;
    }
    clean_post_cache((int) $page->ID);
    $page = get_post((int) $page->ID);
    $section = array_values(array_filter(
        koops_normalize_page_sections($page),
        static fn(array $item): bool => ($item['type'] ?? '') === $section_type
    ));
    return rest_ensure_response([
        'id' => (int) $page->ID,
        'slug' => $slug,
        'section' => $section[0] ?? null,
    ]);
}

function koops_modular_pages_menu(): void
{
    add_submenu_page(
        'koops',
        'Puslapių sekcijos',
        'Puslapių sekcijos',
        'edit_pages',
        'koops-sections',
        'koops_modular_pages_screen'
    );
}
add_action('admin_menu', 'koops_modular_pages_menu', 20);

function koops_modular_pages_screen(): void
{
    if (!current_user_can('edit_pages')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>KOOPS puslapių sekcijos</h1>
        <p>Pasirinkite puslapį. Modulius galėsite perrikiuoti, išjungti, pašalinti, vėl pridėti ir redaguoti jų turinį.</p>
        <table class="widefat striped" style="max-width:960px">
            <thead><tr><th>Puslapis</th><th>Sekcijų skaičius</th><th></th></tr></thead>
            <tbody>
            <?php foreach (koops_default_page_sections() as $slug => $defaults) :
                $page = get_page_by_path($slug, OBJECT, 'page');
                if (!$page) {
                    continue;
                }
                $sections = koops_normalize_page_sections($page);
                ?>
                <tr>
                    <td><strong><?php echo esc_html(get_the_title($page)); ?></strong></td>
                    <td><?php echo esc_html((string) count($sections)); ?></td>
                    <td style="text-align:right"><a class="button button-primary" href="<?php echo esc_url((string) get_edit_post_link($page->ID, '')); ?>">Redaguoti puslapį</a></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

function koops_sanitize_builder_section(array $input): array
{
    $type = sanitize_key((string) ($input['sectionType'] ?? ''));
    return [
        'sectionType' => $type,
        'enabled' => !empty($input['enabled']),
        'anchor' => koops_sanitize_section_anchor((string) ($input['anchor'] ?? ''), $type),
        'eyebrow' => sanitize_text_field((string) ($input['eyebrow'] ?? '')),
        'title' => sanitize_textarea_field((string) ($input['title'] ?? '')),
        'description' => sanitize_textarea_field((string) ($input['description'] ?? '')),
        'primaryLabel' => sanitize_text_field((string) ($input['primaryLabel'] ?? '')),
        'primaryUrl' => esc_url_raw((string) ($input['primaryUrl'] ?? '')),
        'imageUrl' => esc_url_raw((string) ($input['imageUrl'] ?? '')),
        'imageId' => absint($input['imageId'] ?? 0),
        'galleryUrls' => koops_sanitize_url_list($input['galleryUrls'] ?? []),
        'galleryIds' => koops_sanitize_id_list($input['galleryIds'] ?? []),
    ];
}

function koops_serialize_builder_sections(array $sections): string
{
    return implode("\n\n", array_map(static function (array $section): string {
        $attrs = wp_json_encode($section, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return '<!-- wp:koops/section ' . $attrs . ' /-->';
    }, $sections));
}

function koops_page_builder_card(array $section, string $index, array $catalog): void
{
    $type = $section['sectionType'] ?? '';
    $label = $catalog[$type]['label'] ?? 'Nauja KOOPS sekcija';
    $preview = $type ? add_query_arg('ver', KOOPS_CORE_VERSION, KOOPS_CORE_URL . 'assets/previews/' . $type . '.jpg') : '';
    ?>
    <details class="koops-builder-card" data-index="<?php echo esc_attr($index); ?>" open>
        <summary>
            <span class="dashicons dashicons-move" aria-hidden="true"></span>
            <strong data-card-title><?php echo esc_html($label); ?></strong>
            <span class="koops-builder-state"><?php echo !empty($section['enabled']) ? 'Rodoma' : 'Išjungta'; ?></span>
        </summary>
        <div class="koops-builder-card__body">
            <figure class="koops-builder-preview"<?php echo $preview ? '' : ' hidden'; ?>>
                <img src="<?php echo esc_url($preview); ?>" alt="<?php echo esc_attr($label . ' peržiūra'); ?>" data-section-preview>
                <figcaption>Dabartinės sekcijos peržiūra</figcaption>
            </figure>
            <div class="koops-builder-grid">
                <label class="koops-builder-field koops-builder-field--wide">
                    <span>Sekcijos tipas</span>
                    <select name="sections[<?php echo esc_attr($index); ?>][sectionType]" data-section-type>
                        <?php foreach ($catalog as $value => $item) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php selected($type, $value); ?>><?php echo esc_html($item['label']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>
                <label class="koops-builder-toggle">
                    <input type="checkbox" name="sections[<?php echo esc_attr($index); ?>][enabled]" value="1" <?php checked(!empty($section['enabled'])); ?>>
                    <span>Rodyti svetainėje</span>
                </label>
                <label class="koops-builder-field">
                    <span>Sekcijos ID</span>
                    <input type="text" name="sections[<?php echo esc_attr($index); ?>][anchor]" value="<?php echo esc_attr((string) ($section['anchor'] ?? '')); ?>" placeholder="<?php echo esc_attr($type ? koops_default_section_anchor($type) : 'sekcijos-tipas'); ?>">
                </label>
                <label class="koops-builder-field">
                    <span>Mažoji antraštė</span>
                    <input type="text" name="sections[<?php echo esc_attr($index); ?>][eyebrow]" value="<?php echo esc_attr($section['eyebrow'] ?? ''); ?>">
                </label>
                <label class="koops-builder-field koops-builder-field--wide">
                    <span>Antraštė</span>
                    <textarea rows="3" name="sections[<?php echo esc_attr($index); ?>][title]"><?php echo esc_textarea($section['title'] ?? ''); ?></textarea>
                </label>
                <label class="koops-builder-field koops-builder-field--wide">
                    <span>Aprašymas</span>
                    <textarea rows="4" name="sections[<?php echo esc_attr($index); ?>][description]"><?php echo esc_textarea($section['description'] ?? ''); ?></textarea>
                </label>
                <label class="koops-builder-field">
                    <span>Mygtuko tekstas</span>
                    <input type="text" name="sections[<?php echo esc_attr($index); ?>][primaryLabel]" value="<?php echo esc_attr($section['primaryLabel'] ?? ''); ?>">
                </label>
                <label class="koops-builder-field">
                    <span>Mygtuko nuoroda</span>
                    <?php koops_render_url_picker('sections[' . $index . '][primaryUrl]', (string) ($section['primaryUrl'] ?? ''), 'koops-section-url-' . $index); ?>
                </label>
                <?php
                $media_kind = $catalog[$type]['media'] ?? '';
                $gallery_urls = koops_sanitize_url_list($section['galleryUrls'] ?? []);
                $gallery_ids = koops_sanitize_id_list($section['galleryIds'] ?? []);
                $preview_urls = $media_kind === 'gallery' && $gallery_urls ? $gallery_urls : array_filter([(string) ($section['imageUrl'] ?? '')]);
                ?>
                <div class="koops-builder-field koops-builder-field--wide koops-builder-media-field" data-media-kind="<?php echo esc_attr($media_kind); ?>"<?php echo $media_kind ? '' : ' hidden'; ?>>
                    <span data-media-label><?php echo $media_kind === 'gallery' ? 'Galerija' : 'Nuotrauka'; ?></span>
                    <div class="koops-builder-media-previews" data-media-previews>
                        <?php foreach ($preview_urls as $preview_url) : ?>
                            <img src="<?php echo esc_url(koops_public_media_url($preview_url)); ?>" alt="">
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="sections[<?php echo esc_attr($index); ?>][imageUrl]" value="<?php echo esc_attr((string) ($section['imageUrl'] ?? '')); ?>" data-image-url>
                    <input type="hidden" name="sections[<?php echo esc_attr($index); ?>][imageId]" value="<?php echo esc_attr((string) absint($section['imageId'] ?? 0)); ?>" data-image-id>
                    <div data-gallery-urls>
                        <?php foreach ($gallery_urls as $gallery_url) : ?>
                            <input type="hidden" name="sections[<?php echo esc_attr($index); ?>][galleryUrls][]" value="<?php echo esc_attr($gallery_url); ?>">
                        <?php endforeach; ?>
                    </div>
                    <div data-gallery-ids>
                        <?php foreach ($gallery_ids as $gallery_id) : ?>
                            <input type="hidden" name="sections[<?php echo esc_attr($index); ?>][galleryIds][]" value="<?php echo esc_attr((string) $gallery_id); ?>">
                        <?php endforeach; ?>
                    </div>
                    <span class="koops-builder-media">
                        <button type="button" class="button" data-pick-image><?php echo $media_kind === 'gallery' ? 'Keisti galeriją' : 'Keisti nuotrauką'; ?></button>
                    </span>
                </div>
            </div>
            <div class="koops-builder-actions">
                <button type="button" class="button" data-move-up>↑ Aukštyn</button>
                <button type="button" class="button" data-move-down>↓ Žemyn</button>
                <button type="button" class="button button-link-delete" data-remove>Pašalinti</button>
            </div>
        </div>
    </details>
    <?php
}

function koops_page_builder_screen(): void
{
    if (!current_user_can('edit_pages')) {
        wp_die('Neturite teisės redaguoti puslapių.');
    }

    $post_id = absint($_GET['post'] ?? $_POST['post_id'] ?? 0);
    $page = $post_id ? get_post($post_id) : null;
    if (!$page || $page->post_type !== 'page') {
        echo '<div class="wrap"><h1>Modulinis redaktorius</h1><p>Puslapį pasirinkite skiltyje <a href="' . esc_url(admin_url('admin.php?page=koops-sections')) . '">Puslapių sekcijos</a>.</p></div>';
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('koops_save_builder_' . $post_id)) {
        $catalog = koops_section_catalog_for_page($page->post_name);
        $submitted = isset($_POST['sections']) && is_array($_POST['sections']) ? wp_unslash($_POST['sections']) : [];
        $sections = [];
        $seen = [];
        foreach ($submitted as $input) {
            if (!is_array($input)) {
                continue;
            }
            $section = koops_sanitize_builder_section($input);
            $type = $section['sectionType'];
            if (!$type || !isset($catalog[$type]) || isset($seen[$type])) {
                continue;
            }
            $seen[$type] = true;
            $sections[] = $section;
        }
        wp_update_post([
            'ID' => $post_id,
            'post_content' => koops_serialize_builder_sections($sections),
        ]);
        clean_post_cache($post_id);
        echo '<div class="notice notice-success is-dismissible"><p>Sekcijos išsaugotos.</p></div>';
        $page = get_post($post_id);
    }

    wp_enqueue_media();
    $catalog = koops_section_catalog_for_page($page->post_name);
    $sections = koops_normalize_page_sections($page);
    ?>
    <div class="wrap koops-builder">
        <div class="koops-builder-heading">
            <div>
                <a href="<?php echo esc_url(admin_url('admin.php?page=koops-sections')); ?>">← Visi puslapiai</a>
                <h1><?php echo esc_html(get_the_title($page)); ?> · sekcijos</h1>
                <p>Matote dabartinį sekcijos turinį ir jos peržiūrą. Pakeitimai svetainėje atsinaujina automatiškai.</p>
            </div>
            <button class="button button-primary button-hero" type="submit" form="koops-builder-form">Išsaugoti sekcijas</button>
        </div>
        <form method="post" id="koops-builder-form">
            <?php wp_nonce_field('koops_save_builder_' . $post_id); ?>
            <input type="hidden" name="post_id" value="<?php echo esc_attr((string) $post_id); ?>">
            <div id="koops-builder-sections">
                <?php foreach ($sections as $index => $section) {
                    $section['sectionType'] = $section['type'];
                    koops_page_builder_card($section, (string) $index, $catalog);
                } ?>
            </div>
            <div class="koops-builder-add">
                <select id="koops-builder-new-type">
                    <?php foreach ($catalog as $value => $item) : ?>
                        <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($item['label']); ?></option>
                    <?php endforeach; ?>
                </select>
                <button type="button" class="button button-secondary" id="koops-builder-add">Pridėti sekciją</button>
            </div>
        </form>
    </div>
    <script type="text/template" id="koops-builder-card-template">
        <?php koops_page_builder_card(['sectionType' => '', 'enabled' => true], '__INDEX__', $catalog); ?>
    </script>
    <style>
        .koops-builder{max-width:1180px}.koops-builder-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin:24px 0 28px}.koops-builder-heading h1{font-size:36px;line-height:1.08;margin:12px 0}.koops-builder-heading p{color:#646970;margin:0}.koops-builder .button-hero{min-height:44px;padding:0 22px}.koops-builder-card{background:#10180d;color:#fff;border:1px solid #4c5946;border-radius:22px;margin:0 0 14px;overflow:hidden}.koops-builder-card summary{display:flex;align-items:center;gap:14px;padding:20px 22px;cursor:pointer;list-style:none}.koops-builder-card summary::-webkit-details-marker{display:none}.koops-builder-card summary strong{font-size:17px;flex:1}.koops-builder-state{color:#ffe08a;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.koops-builder-card__body{border-top:1px solid #3d4938;padding:22px}.koops-builder-preview{display:grid;grid-template-columns:minmax(220px,360px) 1fr;align-items:end;gap:18px;margin:0 0 24px}.koops-builder-preview[hidden]{display:none}.koops-builder-preview img{display:block;width:100%;max-height:260px;object-fit:cover;object-position:center;border:1px solid #5e6a58;border-radius:16px}.koops-builder-preview figcaption{color:#adb3a8;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.koops-builder-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.koops-builder-field{display:flex;flex-direction:column;gap:7px}.koops-builder-field--wide{grid-column:1/-1}.koops-builder-field>span:first-child,.koops-builder-toggle span{font-weight:600;color:#c5cabf}.koops-builder input[type=text],.koops-builder input[type=url],.koops-builder textarea,.koops-builder select{width:100%;max-width:none;border:1px solid #64705f;border-radius:10px;background:#fff;color:#10180d;padding:9px 12px}.koops-builder-toggle{display:flex;align-items:center;gap:9px}.koops-builder-media{display:flex;gap:8px}.koops-builder-media-previews{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 10px}.koops-builder-media-previews img{width:92px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #5e6a58;background:#1b2416}.koops-builder-actions{display:flex;gap:8px;align-items:center;margin-top:20px}.koops-builder-actions .button-link-delete{margin-left:auto}.koops-builder-add{display:flex;gap:10px;background:#fff;border:1px solid #c3c4c7;border-radius:16px;padding:18px;margin-top:20px}.koops-builder-add select{max-width:460px}.koops-builder-card.is-dragging{opacity:.4}@media(max-width:782px){.koops-builder-heading{align-items:flex-start;flex-direction:column}.koops-builder-grid{grid-template-columns:1fr}.koops-builder-field--wide{grid-column:auto}.koops-builder-preview{grid-template-columns:1fr}.koops-builder-add{flex-direction:column}}
    </style>
    <script>
    (function($){
        var $list=$('#koops-builder-sections'), template=$('#koops-builder-card-template').html(), next=Date.now();
        var defaults=<?php echo wp_json_encode(koops_defaults_for_editor(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
        var previewBase=<?php echo wp_json_encode(KOOPS_CORE_URL . 'assets/previews/', JSON_UNESCAPED_SLASHES); ?>;
        var previewVersion=<?php echo wp_json_encode(KOOPS_CORE_VERSION); ?>;
        var catalog=<?php echo wp_json_encode($catalog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
        var frontendUrl=<?php echo wp_json_encode(untrailingslashit(koops_get_option('frontend_url', 'https://ukmerges-koops-website.vercel.app'))); ?>;
        function publicUrl(url){if(!url)return '';if(/^(https?:)?\/\//.test(url))return url;if(url.charAt(0)==='/')return frontendUrl+url;return url;}
        function setMediaFields($card,urls,ids){
            var prefix=$card.find('[data-image-url]').attr('name').replace('[imageUrl]','');
            $card.find('[data-image-url]').val(urls[0]||'');
            $card.find('[data-image-id]').val(ids[0]||0);
            var $urls=$card.find('[data-gallery-urls]').empty();
            var $ids=$card.find('[data-gallery-ids]').empty();
            urls.forEach(function(url){$urls.append($('<input>',{type:'hidden',name:prefix+'[galleryUrls][]',value:url}));});
            ids.forEach(function(id){$ids.append($('<input>',{type:'hidden',name:prefix+'[galleryIds][]',value:id}));});
            var $previews=$card.find('[data-media-previews]').empty();
            urls.forEach(function(url){$previews.append($('<img>',{src:publicUrl(url),alt:''}));});
        }
        function fillDefaults($card,type){var values=defaults[type]||{};Object.keys(values).forEach(function(key){if(key==='galleryUrls'||key==='galleryIds')return;$card.find('[name$="['+key+']"]').val(values[key]);});setMediaFields($card,values.galleryUrls||(values.imageUrl?[values.imageUrl]:[]),values.galleryIds||[]);}
        function title($card,fill){var $select=$card.find('[data-section-type]');var type=$select.val();var label=$select.find('option:selected').text();$card.find('[data-card-title]').text(label);var $preview=$card.find('[data-section-preview]');$preview.attr({src:previewBase+type+'.jpg?ver='+encodeURIComponent(previewVersion),alt:label+' peržiūra'}).closest('figure').prop('hidden',!type);var media=(catalog[type]&&catalog[type].media)||'';var $media=$card.find('[data-media-kind]');$media.attr('data-media-kind',media).prop('hidden',!media);$card.find('[data-media-label]').text(media==='gallery'?'Galerija':'Nuotrauka');$card.find('[data-pick-image]').text(media==='gallery'?'Keisti galeriją':'Keisti nuotrauką');if(fill)fillDefaults($card,type);}
        $list.on('change','[data-section-type]',function(){title($(this).closest('.koops-builder-card'),true);});
        $list.on('change','input[type=checkbox]',function(){var $card=$(this).closest('.koops-builder-card');$card.find('.koops-builder-state').text(this.checked?'Rodoma':'Išjungta');});
        $list.on('click','[data-remove]',function(){$(this).closest('.koops-builder-card').remove();});
        $list.on('click','[data-move-up]',function(){var $card=$(this).closest('.koops-builder-card');$card.prev().before($card);});
        $list.on('click','[data-move-down]',function(){var $card=$(this).closest('.koops-builder-card');$card.next().after($card);});
        function openNativeGallery(ids, onChange){
            function save(selection){
                if(!selection)return;
                var items=typeof selection.toJSON==='function'?selection.toJSON():selection.map(function(model){return model.toJSON?model.toJSON():model;});
                onChange(items);
            }
            if(ids.length && wp.media.gallery && wp.media.gallery.edit){
                wp.media.gallery.edit('[gallery ids="'+ids.join(',')+'"]').state('gallery-edit').on('update', save);
                return;
            }
            var frame=wp.media({frame:'post',state:'gallery-library',title:'Sukurti galeriją',multiple:true,library:{type:'image'}});
            frame.on('update', save);
            frame.open();
        }
        $list.on('click','[data-pick-image]',function(){
            var $card=$(this).closest('.koops-builder-card');
            var gallery=$card.find('[data-media-kind]').attr('data-media-kind')==='gallery';
            if(!gallery){
                var frame=wp.media({title:'Pasirinkite nuotrauką',multiple:false,library:{type:'image'},button:{text:'Naudoti nuotrauką'}});
                frame.on('select',function(){
                    var items=frame.state().get('selection').toJSON();
                    setMediaFields($card, items.map(function(item){return item.url;}), items.map(function(item){return item.id;}));
                });
                frame.open();
                return;
            }
            var urls=$card.find('[data-gallery-urls] input').map(function(){return this.value;}).get();
            var ids=$card.find('[data-gallery-ids] input').map(function(){return parseInt(this.value,10)||0;}).get().filter(Boolean);
            var $button=$(this).prop('disabled',true).text('Ruošiama galerija…');
            var finish=function(resolved){
                $button.prop('disabled',false).text('Redaguoti galeriją');
                openNativeGallery(resolved, function(items){
                    setMediaFields($card, items.map(function(item){return item.url;}), items.map(function(item){return item.id;}));
                });
            };
            if(ids.length && ids.length===urls.length){finish(ids);return;}
            fetch(<?php echo wp_json_encode(rest_url('koops/v1/manage/media/ensure')); ?>,{
                method:'POST',
                credentials:'same-origin',
                headers:{'Content-Type':'application/json','X-WP-Nonce':<?php echo wp_json_encode(wp_create_nonce('wp_rest')); ?>},
                body:JSON.stringify({urls:urls})
            }).then(function(response){return response.ok?response.json():[];}).then(function(items){
                finish(Array.isArray(items)?items.map(function(item){return item.id;}).filter(Boolean):ids);
            }).catch(function(){finish(ids);});
        });
        $('#koops-builder-add').on('click',function(){var type=$('#koops-builder-new-type').val();if($list.find('[data-section-type]').filter(function(){return this.value===type;}).length){alert('Ši sekcija jau yra puslapyje.');return;}var html=template.replaceAll('__INDEX__','new'+(next++));var $card=$(html);$card.find('[data-section-type]').val(type);title($card,true);$list.append($card);$card[0].scrollIntoView({behavior:'smooth',block:'center'});});
    })(jQuery);
    </script>
    <?php
}
