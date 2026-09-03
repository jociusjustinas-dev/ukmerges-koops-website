<?php get_header(); the_post(); $id = get_the_ID(); $apply_url = (string) get_post_meta($id, 'koops_apply_url', true); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Darbo pasiūlymas</p><h1><?php the_title(); ?></h1><p class="lead"><?php echo esc_html((string) get_post_meta($id, 'koops_location', true)); ?> · <?php echo esc_html((string) get_post_meta($id, 'koops_employment', true)); ?></p></section>
    <section class="shell detail-grid section-space"><article class="entry-content reveal"><?php the_content(); ?></article><aside class="application-card reveal"><p class="eyebrow">Kandidatuoti</p><h2>Norite prisijungti?</h2><?php if ($apply_url) : koops_button('Kandidatuoti', $apply_url, 'is-accent', ['target' => '_blank', 'rel' => 'noopener']); else : koops_button('Susisiekti', 'mailto:' . koops_option('email')); endif; ?><?php $deadline = get_post_meta($id, 'koops_deadline', true); if ($deadline) : ?><p>Kandidatuoti iki <?php echo esc_html((string) $deadline); ?></p><?php endif; ?></aside></section>
</main>
<?php get_footer(); ?>

