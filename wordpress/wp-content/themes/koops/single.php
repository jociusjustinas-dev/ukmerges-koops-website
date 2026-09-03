<?php get_header(); the_post(); ?>
<main id="turinys"><article class="article-page"><header class="article-header shell reveal"><p class="eyebrow"><?php echo esc_html(get_the_category()[0]->name ?? 'Naujienos'); ?> · <?php echo esc_html(get_the_date('Y-m-d')); ?></p><h1><?php the_title(); ?></h1><?php if (has_excerpt()) : ?><p class="lead"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?></header><?php if (has_post_thumbnail()) : ?><div class="shell-wide article-cover reveal"><?php the_post_thumbnail('koops-hero'); ?></div><?php endif; ?><div class="entry-content article-content reveal"><?php the_content(); ?></div></article></main>
<?php get_footer(); ?>

