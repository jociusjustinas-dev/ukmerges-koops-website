<?php /* Template Name: Apie KOOPS */ get_header(); the_post(); ?>
<main id="turinys">
    <section class="page-hero shell reveal"><p class="eyebrow">Apie KOOPS</p><h1>Arti miesto ir rajono žmonių kasdien</h1><p class="lead">Ukmergės KOOPS jungia parduotuves, vietos gamintojus, komandą ir bendruomenę.</p></section>
    <section class="dark-section section-space"><div class="shell story-layout"><img class="rounded-media reveal" src="<?php echo esc_url(koops_theme_asset('koops-community.jpg')); ?>" alt="Ukmergės krašto bendruomenė"><article class="entry-content reveal"><?php if (trim((string) get_the_content())) : the_content(); else : ?><h2>Vieta žmonėms, vieta verslui</h2><p>Kooperatyvas veikia ten, kur susitinka kasdienis pirkėjas, vietos gamintojas ir savo kraštą pažįstanti komanda.</p><p>Mūsų tikslas – išlaikyti aiškų, artimą ir patikimą ryšį su Ukmergės miesto bei rajono žmonėmis.</p><?php endif; ?></article></div></section>
    <section class="shell hall-grid section-space"><article class="info-card reveal"><span>01</span><h2>34 parduotuvės</h2><p>Ukmergės mieste ir rajone.</p></article><article class="info-card is-honey reveal"><span>02</span><h2>Vietos gamintojai</h2><p>Trumpesnis kelias nuo ūkio iki lentynos.</p></article><article class="info-card is-green reveal"><span>03</span><h2>Žmonės</h2><p>Ryšys, kuris kuriamas kasdien.</p></article></section>
</main>
<?php get_footer(); ?>

