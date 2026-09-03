<?php
get_header();
$area = isset($_GET['teritorija']) ? sanitize_key(wp_unslash($_GET['teritorija'])) : '';
$search = isset($_GET['paieska']) ? sanitize_text_field(wp_unslash($_GET['paieska'])) : '';
$args = ['post_type' => 'koops_store', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC'];
if (in_array($area, ['miestas', 'rajonas'], true)) {
    $args['tax_query'] = [['taxonomy' => 'koops_store_area', 'field' => 'slug', 'terms' => $area]];
}
if ($search) {
    $args['s'] = $search;
}
$stores = new WP_Query($args);
?>
<main id="turinys" class="dark-page stores-page">
    <section class="page-hero shell reveal">
        <p class="eyebrow">34 vietos Ukmergėje ir rajone</p>
        <h1>Raskite artimiausią KOOPS parduotuvę</h1>
        <p class="lead">Adresai, darbo laikas, telefonai ir maršrutas vienoje vietoje.</p>
    </section>
    <section class="shell stores-directory">
        <form class="directory-filter" method="get">
            <label><span class="screen-reader-text">Ieškoti pagal pavadinimą ar vietovę</span><input type="search" name="paieska" value="<?php echo esc_attr($search); ?>" placeholder="Parduotuvė arba vietovė"></label>
            <select name="teritorija" aria-label="Teritorija"><option value="">Visos teritorijos</option><option value="miestas" <?php selected($area, 'miestas'); ?>>Ukmergės miestas</option><option value="rajonas" <?php selected($area, 'rajonas'); ?>>Ukmergės rajonas</option></select>
            <button class="koops-button is-accent" type="submit">Rodyti</button>
        </form>
        <div class="directory-grid">
            <?php if ($stores->have_posts()) : while ($stores->have_posts()) : $stores->the_post(); $id = get_the_ID(); ?>
                <article class="directory-card reveal">
                    <?php $image = koops_post_image($id, 'koops-card'); if ($image) : ?><a class="directory-card-media" href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"></a><?php endif; ?>
                    <div><p class="eyebrow"><?php echo esc_html((string) get_post_meta($id, 'koops_city', true)); ?></p><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html((string) get_post_meta($id, 'koops_address', true)); ?></p><p class="muted"><?php echo esc_html((string) get_post_meta($id, 'koops_hours', true)); ?></p><div class="card-links"><a href="<?php echo esc_url(koops_phone_href((string) get_post_meta($id, 'koops_phone', true))); ?>"><?php echo esc_html((string) get_post_meta($id, 'koops_phone', true)); ?></a><a href="<?php echo esc_url((string) get_post_meta($id, 'koops_map_url', true)); ?>" target="_blank" rel="noopener">Maršrutas ↗</a></div></div>
                </article>
            <?php endwhile; else : ?><div class="empty-state"><h2>Parduotuvių nerasta</h2><p>Pakeiskite paieškos žodį arba teritorijos filtrą.</p></div><?php endif; wp_reset_postdata(); ?>
        </div>
    </section>
</main>
<?php get_footer(); ?>

