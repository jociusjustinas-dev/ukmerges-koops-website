<?php get_header(); the_post(); $id = get_the_ID(); ?>
<main id="turinys" class="dark-page">
    <section class="detail-hero shell"><div class="reveal"><p class="eyebrow">KOOPS skelbimas</p><h1><?php the_title(); ?></h1><p class="lead"><?php echo esc_html((string) get_post_meta($id, 'koops_location', true)); ?></p></div><?php $image = koops_post_image($id, 'koops-hero'); if ($image) : ?><img class="rounded-media reveal" src="<?php echo esc_url($image); ?>" alt=""><?php endif; ?></section>
    <section class="shell detail-grid section-space"><div class="detail-facts reveal"><dl><?php foreach (['koops_location' => 'Vieta', 'koops_area_size' => 'Plotas', 'koops_price' => 'Kaina', 'koops_expires_at' => 'Galioja iki'] as $key => $label) : $value = get_post_meta($id, $key, true); if ($value) : ?><div><dt><?php echo esc_html($label); ?></dt><dd><?php echo esc_html((string) $value); ?></dd></div><?php endif; endforeach; ?></dl><?php $email = get_post_meta($id, 'koops_contact_email', true) ?: koops_option('email'); koops_button('Teirautis', 'mailto:' . $email); ?></div><article class="entry-content reveal"><?php the_content(); ?></article></section>
</main>
<?php get_footer(); ?>

