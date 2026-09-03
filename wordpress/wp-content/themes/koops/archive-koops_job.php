<?php get_header(); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Karjera</p><h1>Darbas arti namų</h1><p class="lead">Prisijunkite prie KOOPS komandos Ukmergėje ir rajone.</p></section>
    <section class="shell jobs-archive section-space">
        <?php if (have_posts()) : ?><div class="row-list light-list"><?php while (have_posts()) : the_post(); $id = get_the_ID(); ?><a class="reveal" href="<?php the_permalink(); ?>"><span><small><?php echo esc_html((string) get_post_meta($id, 'koops_department', true)); ?></small><strong><?php the_title(); ?></strong><em><?php echo esc_html((string) get_post_meta($id, 'koops_location', true)); ?> · <?php echo esc_html((string) get_post_meta($id, 'koops_employment', true)); ?></em></span><b>↗</b></a><?php endwhile; ?></div><?php else : ?><div class="empty-state"><h2>Šiuo metu darbo pasiūlymų nėra</h2><p>Užsukite vėliau arba susisiekite su administracija.</p></div><?php endif; ?>
    </section>
</main>
<?php get_footer(); ?>

