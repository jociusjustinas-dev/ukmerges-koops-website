<?php get_header(); ?>
<main id="turinys" class="dark-page classifieds-page">
    <section class="page-hero shell reveal"><p class="eyebrow">Skelbimai</p><h1>KOOPS skelbimai</h1><p class="lead">Nuomojamos patalpos, parduodamas turtas ir kita aktuali informacija.</p></section>
    <section class="shell directory-grid section-space">
        <?php if (have_posts()) : while (have_posts()) : the_post(); $id = get_the_ID(); ?>
            <article class="classified-card reveal">
                <?php $image = koops_post_image($id, 'koops-card'); if ($image) : ?><a class="classified-media" href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image); ?>" alt=""></a><?php endif; ?>
                <div><p class="eyebrow"><?php $terms = get_the_terms($id, 'koops_classified_category'); echo esc_html($terms[0]->name ?? 'Skelbimas'); ?></p><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(koops_excerpt($id)); ?></p><dl class="mini-facts"><div><dt>Vieta</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_location', true)); ?></dd></div><?php if (get_post_meta($id, 'koops_area_size', true)) : ?><div><dt>Plotas</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_area_size', true)); ?></dd></div><?php endif; ?><?php if (get_post_meta($id, 'koops_price', true)) : ?><div><dt>Kaina</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_price', true)); ?></dd></div><?php endif; ?></dl><a class="text-link" href="<?php the_permalink(); ?>">Peržiūrėti skelbimą →</a></div>
            </article>
        <?php endwhile; the_posts_pagination(); else : ?><div class="empty-state"><h2>Šiuo metu aktyvių skelbimų nėra</h2><p>Nauji skelbimai čia atsiras iškart juos paskelbus administracijoje.</p></div><?php endif; ?>
    </section>
</main>
<?php get_footer(); ?>

