<?php /* Template Name: Kontaktai */ get_header(); the_post(); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Kontaktai</p><h1>Susisiekime</h1><p class="lead">Pasirinkite klausimo temą arba susisiekite tiesiogiai.</p></section>
    <section class="shell contact-card-grid"><article class="info-card reveal"><p class="eyebrow">Telefonas</p><h2><a href="<?php echo esc_url(koops_phone_href(koops_option('phone'))); ?>"><?php echo esc_html(koops_option('phone')); ?></a></h2><p>Administracija: <a href="<?php echo esc_url(koops_phone_href(koops_option('administration_phone'))); ?>"><?php echo esc_html(koops_option('administration_phone')); ?></a></p></article><article class="info-card is-honey reveal"><p class="eyebrow">El. paštas</p><h2><a href="mailto:<?php echo esc_attr(koops_option('email')); ?>"><?php echo esc_html(koops_option('email')); ?></a></h2><p><?php echo esc_html(koops_option('office_hours')); ?></p></article><article class="info-card is-green reveal"><p class="eyebrow">Adresas</p><h2><?php echo esc_html(koops_option('address')); ?></h2></article></section>
    <section class="section-space"><div class="shell form-split"><div class="reveal"><p class="eyebrow">Užklausa</p><h2>Parašykite mums</h2><div class="entry-content"><?php the_content(); ?></div></div><div class="reveal"><?php echo do_shortcode('[koops_form type="contact"]'); ?></div></div></section>
</main>
<?php get_footer(); ?>

