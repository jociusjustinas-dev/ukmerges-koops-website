<?php /* Template Name: Tiekėjams */ get_header(); the_post(); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Tiekėjams</p><h1>Auginkime vietos pasiūlą kartu</h1><p class="lead">Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.</p></section>
    <section class="dark-section section-space"><div class="shell"><div class="section-heading reveal"><p class="eyebrow">Procesas</p><h2>Aiškus kelias nuo pasiūlymo iki lentynos</h2></div><div class="hall-grid"><article class="info-card reveal"><span>01</span><h3>Pateikite pasiūlymą</h3><p>Nurodykite produktą, jo kilmę, kainą ir tiekimo galimybes.</p></article><article class="info-card reveal"><span>02</span><h3>Įvertinsime</h3><p>Peržiūrėsime asortimento tinkamumą ir susisieksime dėl detalių.</p></article><article class="info-card reveal"><span>03</span><h3>Suderinsime</h3><p>Jei pasiūlymas tinka, aptarsime pristatymą ir tolesnius žingsnius.</p></article></div></div></section>
    <section class="section-space"><div class="shell form-split"><div class="reveal"><p class="eyebrow">Pasiūlymas</p><h2>Pristatykite savo produkciją</h2><p class="lead">Trumpai aprašykite, ką siūlote. Jei turite kainoraštį ar specifikaciją, ją galėsite atsiųsti atsakydami į mūsų laišką.</p><?php if (trim((string) get_the_content())) : ?><div class="entry-content"><?php the_content(); ?></div><?php endif; ?></div><div class="reveal"><?php echo do_shortcode('[koops_form type="supplier"]'); ?></div></div></section>
</main>
<?php get_footer(); ?>

