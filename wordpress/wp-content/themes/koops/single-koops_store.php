<?php get_header(); the_post(); $id = get_the_ID(); ?>
<main id="turinys" class="dark-page single-store">
    <section class="detail-hero shell">
        <div class="reveal"><p class="eyebrow">KOOPS parduotuvė · <?php echo esc_html((string) get_post_meta($id, 'koops_city', true)); ?></p><h1><?php the_title(); ?></h1><p class="lead"><?php echo esc_html((string) get_post_meta($id, 'koops_address', true)); ?></p></div>
        <?php $image = koops_post_image($id, 'koops-hero', 'koops-hero.jpg'); ?><img class="rounded-media reveal" src="<?php echo esc_url($image); ?>" alt="Parduotuvė „<?php echo esc_attr(get_the_title()); ?>“">
    </section>
    <section class="shell detail-grid section-space">
        <div class="detail-facts reveal"><dl><div><dt>Darbo laikas</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_hours', true)); ?></dd></div><div><dt>Telefonas</dt><dd><a href="<?php echo esc_url(koops_phone_href((string) get_post_meta($id, 'koops_phone', true))); ?>"><?php echo esc_html((string) get_post_meta($id, 'koops_phone', true)); ?></a></dd></div><div><dt>Adresas</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_address', true)); ?></dd></div></dl><?php koops_button('Rodyti žemėlapyje', (string) get_post_meta($id, 'koops_map_url', true), 'is-accent', ['target' => '_blank', 'rel' => 'noopener']); ?></div>
        <article class="entry-content reveal"><?php the_content(); ?></article>
    </section>
</main>
<?php get_footer(); ?>
