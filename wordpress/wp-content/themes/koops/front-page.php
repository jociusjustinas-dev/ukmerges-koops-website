<?php
get_header();
$stores = new WP_Query([
    'post_type' => 'koops_store',
    'posts_per_page' => 5,
    'meta_key' => 'koops_featured',
    'meta_value' => '1',
    'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
]);
if (!$stores->have_posts()) {
    $stores = new WP_Query(['post_type' => 'koops_store', 'posts_per_page' => 5, 'orderby' => 'title', 'order' => 'ASC']);
}
$news = new WP_Query(['post_type' => 'post', 'posts_per_page' => 3, 'ignore_sticky_posts' => false]);
$jobs = new WP_Query(['post_type' => 'koops_job', 'posts_per_page' => 3]);
$restaurant_url = home_url('/restoranas/');
?>
<main id="turinys">
    <section class="home-hero dark-section">
        <img class="home-hero-bg" src="<?php echo esc_url(koops_theme_asset('koops-hero-market.jpg')); ?>" alt="">
        <div class="home-hero-shade"></div>
        <div class="shell home-hero-inner">
            <div class="home-hero-copy reveal">
                <p class="eyebrow">Ukmergėje ir rajone</p>
                <h1><span>KOOPS</span><span>parduotuvės</span><span class="heading-rule"></span><span>arčiau jūsų.</span></h1>
                <p class="lead">Raskite artimiausią parduotuvę, jos darbo laiką ir maršrutą.</p>
                <?php koops_button('Rasti parduotuvę', get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/')); ?>
            </div>
            <a class="hero-news-card reveal" href="<?php echo esc_url($restaurant_url); ?>">
                <img src="<?php echo esc_url(koops_theme_asset('vilkmerge.jpg')); ?>" alt="Restoranas „Vilkmergė“">
                <span class="tag">Aktualu</span>
                <span class="eyebrow">Restoranas</span>
                <strong>Planuojate šventę „Vilkmergėje“?</strong>
                <span class="text-link">Plačiau <b>→</b></span>
            </a>
        </div>
    </section>

    <section class="path-section section-space">
        <div class="shell">
            <div class="section-heading reveal"><p class="eyebrow">Vienas tinklas, keli aiškūs keliai</p><h2>Ko ieškote šiandien?</h2></div>
            <div class="path-grid">
                <a class="path-card is-bone reveal" href="<?php echo esc_url(get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/')); ?>"><span class="eyebrow">Parduotuvės</span><strong>Raskite arčiausią</strong><p>Adresai, darbo laikas ir kelio nuorodos.</p><span>Rasti parduotuvę →</span></a>
                <a class="path-card has-image reveal" href="<?php echo esc_url($restaurant_url); ?>"><img src="<?php echo esc_url(koops_theme_asset('vilkmerge.jpg')); ?>" alt="Restorano „Vilkmergė“ lauko erdvė"><span class="path-overlay"><span class="eyebrow">Restoranas</span><strong>Vieta jūsų šventei</strong><span>Plačiau →</span></span></a>
                <a class="path-card is-green reveal" href="<?php echo esc_url(get_post_type_archive_link('koops_job') ?: home_url('/karjera/')); ?>"><span class="eyebrow">Karjera</span><strong>Darbas arti namų</strong><p>Darbo pasiūlymai Ukmergėje ir rajone.</p><span>Peržiūrėti →</span></a>
                <a class="path-card is-honey reveal" href="<?php echo esc_url(home_url('/tiekejams/')); ?>"><span class="eyebrow">Tiekėjams</span><strong>Auginkime vietos pasiūlą</strong><p>Pasiūlykite savo produkciją KOOPS tinklui.</p><span>Siųsti pasiūlymą →</span></a>
            </div>
        </div>
    </section>

    <section class="stores-preview dark-section section-space" aria-labelledby="stores-preview-heading">
        <div class="shell">
            <div class="display-heading reveal" id="stores-preview-heading"><span>Raskite</span><span>artimiausią</span><i></i><span>KOOPS parduotuvę</span></div>
        </div>
        <div class="edge-carousel reveal" data-carousel>
            <div class="edge-carousel-track">
                <?php while ($stores->have_posts()) : $stores->the_post(); $id = get_the_ID(); ?>
                    <article class="store-card">
                        <a class="store-card-media" href="<?php the_permalink(); ?>">
                            <?php $image = koops_post_image($id, 'koops-card', 'koops-bento-local-shopping.jpg'); ?>
                            <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>">
                        </a>
                        <div class="store-card-body">
                            <h3><?php the_title(); ?></h3>
                            <p><?php echo esc_html((string) get_post_meta($id, 'koops_address', true)); ?></p>
                            <dl><div><dt>Darbo laikas</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_hours', true)); ?></dd></div><div><dt>Telefonas</dt><dd><?php echo esc_html((string) get_post_meta($id, 'koops_phone', true)); ?></dd></div></dl>
                            <a class="text-link" href="<?php echo esc_url((string) get_post_meta($id, 'koops_map_url', true)); ?>" target="_blank" rel="noopener">Rodyti žemėlapyje <b>→</b></a>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <div class="carousel-controls"><div class="carousel-progress"><span></span></div><div><button type="button" data-carousel-prev aria-label="Ankstesnė parduotuvė">←</button><button type="button" data-carousel-next aria-label="Kita parduotuvė">→</button></div></div>
        </div>
        <div class="shell section-action"><?php koops_button('Visos parduotuvės', get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/')); ?></div>
    </section>

    <?php if ($news->have_posts()) : ?>
    <section class="news-preview section-space" aria-labelledby="news-heading">
        <div class="shell">
            <div class="section-heading reveal"><p class="eyebrow">Aktualu</p><h2 id="news-heading">Naujienos ir akcijos</h2></div>
            <div class="news-grid">
                <?php $index = 0; while ($news->have_posts()) : $news->the_post(); $index++; ?>
                    <a class="news-card <?php echo $index === 1 ? 'is-featured' : ($index === 2 ? 'is-honey' : 'is-green'); ?> reveal" href="<?php the_permalink(); ?>">
                        <?php if ($index === 1) : ?><img src="<?php echo esc_url(koops_post_image(get_the_ID(), 'koops-card', 'local-produce-couple.jpg')); ?>" alt=""><?php endif; ?>
                        <span class="eyebrow"><?php echo esc_html(get_the_category()[0]->name ?? 'Naujienos'); ?></span>
                        <h3><?php the_title(); ?></h3>
                        <?php if ($index === 1) : ?><p><?php echo esc_html(koops_excerpt(get_the_ID())); ?></p><?php endif; ?>
                        <span class="text-link">Skaityti <b>→</b></span>
                    </a>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <div class="section-action"><?php koops_button('Visos naujienos', home_url('/naujienos/'), 'is-dark'); ?></div>
        </div>
    </section>
    <?php endif; ?>

    <section class="restaurant-preview dark-section section-space" aria-labelledby="restaurant-heading">
        <div class="shell">
            <div class="section-heading reveal"><p class="eyebrow">Restoranas „Vilkmergė“ · nuo <?php echo esc_html(koops_option('restaurant_since', '1965')); ?> metų</p><h2 id="restaurant-heading">Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.</h2></div>
            <div class="restaurant-preview-grid">
                <img class="rounded-media reveal" src="<?php echo esc_url(koops_theme_asset('vilkmerge-hall.jpg')); ?>" alt="Restorano „Vilkmergė“ pokylių salė">
                <div class="restaurant-preview-copy reveal">
                    <p class="lead">Miesto širdyje įsikūręs restoranas laukia jūsų.</p>
                    <p>Restorane galime priimti iki <?php echo esc_html(koops_option('restaurant_capacity', '154')); ?> svečių. Siūlome <?php echo esc_html(koops_option('restaurant_halls', '3')); ?> skirtingo dydžio erdves.</p>
                    <dl class="stats"><div><dt>Pokylių salės</dt><dd><?php echo esc_html(koops_option('restaurant_halls', '3')); ?></dd></div><div><dt>Talpa</dt><dd>Iki <?php echo esc_html(koops_option('restaurant_capacity', '154')); ?> svečių</dd></div></dl>
                    <div class="button-row"><?php koops_button('Siųsti užklausą', $restaurant_url . '#uzklausa'); ?><?php koops_button('Apie restoraną', $restaurant_url, 'is-ghost-light'); ?></div>
                </div>
            </div>
        </div>
    </section>

    <section class="jobs-preview dark-section section-space" aria-labelledby="jobs-heading">
        <div class="shell split-layout">
            <div class="sticky-copy reveal"><p class="eyebrow">Karjera</p><h2 id="jobs-heading">Darbas arti namų</h2><p>Prisijunkite prie KOOPS komandos Ukmergėje ir rajone.</p><?php koops_button('Visi darbo pasiūlymai', get_post_type_archive_link('koops_job') ?: home_url('/karjera/')); ?></div>
            <div class="row-list reveal">
                <?php if ($jobs->have_posts()) : while ($jobs->have_posts()) : $jobs->the_post(); ?>
                    <a href="<?php the_permalink(); ?>"><span><strong><?php the_title(); ?></strong><small><?php echo esc_html((string) get_post_meta(get_the_ID(), 'koops_location', true)); ?></small></span><b>↗</b></a>
                <?php endwhile; wp_reset_postdata(); else : ?>
                    <div class="empty-state"><strong>Šiuo metu darbo pasiūlymų nėra.</strong><p>Užsukite vėliau arba susisiekite bendruoju KOOPS telefonu.</p></div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <section class="supplier-preview section-space" aria-labelledby="supplier-heading">
        <div class="shell form-split">
            <div class="reveal"><p class="eyebrow">Tiekėjams</p><h2 id="supplier-heading">Auginkime vietos pasiūlą kartu</h2><p class="lead">Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.</p><p><strong>Adresas</strong><br><?php echo esc_html(koops_option('address')); ?></p><p><strong>El. paštas</strong><br><a href="mailto:<?php echo esc_attr(koops_option('email')); ?>"><?php echo esc_html(koops_option('email')); ?></a></p></div>
            <div class="reveal"><?php echo do_shortcode('[koops_form type="supplier"]'); ?></div>
        </div>
    </section>
</main>
<?php get_footer(); ?>

