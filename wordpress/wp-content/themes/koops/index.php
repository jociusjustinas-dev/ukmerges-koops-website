<?php get_header(); ?>
<main id="turinys"><section class="page-hero shell"><h1><?php bloginfo('name'); ?></h1></section><section class="shell section-space"><?php if (have_posts()) : while (have_posts()) : the_post(); ?><article class="entry-content"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article><?php endwhile; endif; ?></section></main>
<?php get_footer(); ?>

