<?php get_header(); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Akcijos</p><h1>Leidiniai</h1><p class="lead">Aktualūs KOOPS akcijų leidiniai.</p></section>
    <section class="shell news-archive section-space">
        <?php if (have_posts()) : ?>
            <div class="news-listing">
                <?php while (have_posts()) : the_post(); $id = get_the_ID(); ?>
                    <article class="news-list-card reveal">
                        <a href="<?php the_permalink(); ?>">
                            <?php if (has_post_thumbnail()) : the_post_thumbnail('koops-card'); endif; ?>
                        </a>
                        <div>
                            <p class="eyebrow"><?php echo esc_html((string) get_post_meta($id, 'koops_kind', true)); ?></p>
                            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p><?php echo esc_html(koops_excerpt(get_the_ID(), 28)); ?></p>
                            <a class="text-link" href="<?php the_permalink(); ?>">Peržiūrėti →</a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
        <?php else : ?>
            <div class="empty-state"><h2>Leidinių šiuo metu nėra</h2><p>Užsukite vėliau.</p></div>
        <?php endif; ?>
    </section>
</main>
<?php get_footer(); ?>
