<?php
/* Template Name: Restoranas */
get_header(); the_post();
$map_url = 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode(koops_option('restaurant_address', 'Kauno g. 7, Ukmergė'));
?>
<main id="turinys" class="restaurant-page">
    <section class="restaurant-hero dark-section">
        <div class="shell restaurant-hero-inner"><div class="reveal"><p class="eyebrow">Restoranas „Vilkmergė“ · nuo <?php echo esc_html(koops_option('restaurant_since', '1965')); ?> metų</p><h1>Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.</h1><p class="lead">Pačiame Ukmergės centre – jūsų šventėms, renginiams ir jaukiems susitikimams.</p><div class="button-row"><?php koops_button('Siųsti užklausą', '#uzklausa'); ?><?php koops_button('Skambinti', koops_phone_href(koops_option('restaurant_mobile')), 'is-ghost-light'); ?></div></div><img class="rounded-media reveal" src="<?php echo esc_url(koops_theme_asset('vilkmerge-hall.jpg')); ?>" alt="Restorano „Vilkmergė“ pokylių salė"></div>
    </section>
    <section class="section-space"><div class="shell"><div class="section-heading reveal"><p class="eyebrow">Erdvės</p><h2>Vieta jūsų šventėms ir renginiams</h2><p class="lead">Trys skirtingo dydžio erdvės – nuo jaukaus susitikimo iki didelės šventės.</p></div><div class="hall-grid"><article class="info-card reveal"><span>01</span><h3>Didžioji salė</h3><strong>Iki 90 svečių</strong><p>Vestuvėms, jubiliejams ir įmonių vakarams.</p></article><article class="info-card reveal"><span>02</span><h3>Baras</h3><strong>Iki 40 svečių</strong><p>Krikštynoms, šeimos šventėms ir susitikimams.</p></article><article class="info-card reveal"><span>03</span><h3>Mažoji salė</h3><strong>Iki 8 svečių</strong><p>Jaukioms vakarienėms ir mažoms progoms.</p></article></div></div></section>
    <section class="restaurant-message dark-section section-space"><div class="shell reveal"><p class="eyebrow">Nuo 1965 metų</p><blockquote>Visi mes esame viena didelė šeima, o Ukmergės KOOPS tinklas – mūsų namai.</blockquote></div></section>
    <section class="section-space" id="uzklausa"><div class="shell form-split"><div class="reveal"><p class="eyebrow">Susisiekite</p><h2>Planuojate šventę?</h2><p class="lead">Parašykite datą, svečių skaičių ir renginio tipą. Susisieksime dėl erdvės, meniu ir kitų detalių.</p><dl class="contact-columns"><div><dt>Telefonas</dt><dd><a href="<?php echo esc_url(koops_phone_href(koops_option('restaurant_mobile'))); ?>"><?php echo esc_html(koops_option('restaurant_mobile')); ?></a></dd></div><div><dt>El. paštas</dt><dd><a href="mailto:<?php echo esc_attr(koops_option('restaurant_email')); ?>"><?php echo esc_html(koops_option('restaurant_email')); ?></a></dd></div><div><dt>Adresas</dt><dd><a href="<?php echo esc_url($map_url); ?>" target="_blank" rel="noopener"><?php echo esc_html(koops_option('restaurant_address')); ?></a></dd></div></dl></div><div class="reveal"><?php echo do_shortcode('[koops_form type="restaurant"]'); ?></div></div></section>
    <?php if (trim((string) get_the_content())) : ?><section class="shell entry-content section-space"><?php the_content(); ?></section><?php endif; ?>
</main>
<?php get_footer(); ?>

