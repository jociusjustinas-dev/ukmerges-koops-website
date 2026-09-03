<?php get_header(); ?>
<main id="turinys"><section class="page-hero shell"><p class="eyebrow">404</p><h1>Puslapis nerastas</h1><p class="lead">Nuoroda galėjo pasikeisti. Grįžkite į pradžią arba raskite artimiausią parduotuvę.</p><div class="button-row"><?php koops_button('Į pradžią', home_url('/')); ?><?php koops_button('Parduotuvės', get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/'), 'is-dark'); ?></div></section></main>
<?php get_footer(); ?>

