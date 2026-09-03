<?php $store_url = get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/'); ?>
<footer class="site-footer">
    <section class="footer-cta" aria-labelledby="footer-cta-heading">
        <span class="footer-orbit" aria-hidden="true"></span>
        <p class="eyebrow">KOOPS</p>
        <h2 id="footer-cta-heading">Parduotuvė gali būti<br>arčiau, nei manote</h2>
        <?php koops_button('Rasti parduotuvę', $store_url); ?>
    </section>
    <div class="footer-main shell">
        <div class="footer-brand">
            <img src="<?php echo esc_url(koops_theme_asset('koops-logo.png')); ?>" alt="KOOPS">
            <p>Arti miesto ir rajono žmonių kasdien.</p>
            <div class="footer-socials">
                <a href="<?php echo esc_url(koops_option('facebook_url')); ?>" target="_blank" rel="noopener"><b>f</b><span>Facebook</span></a>
                <a href="<?php echo esc_url(koops_option('instagram_url')); ?>" target="_blank" rel="noopener"><b>ig</b><span>Instagram</span></a>
            </div>
        </div>
        <nav class="footer-nav" aria-label="Poraštės navigacija">
            <div><strong>Pagrindiniai</strong><a href="<?php echo esc_url($store_url); ?>">Parduotuvės</a><a href="<?php echo esc_url(home_url('/naujienos/')); ?>">Naujienos</a><a href="<?php echo esc_url(get_post_type_archive_link('koops_classified') ?: home_url('/skelbimai/')); ?>">Skelbimai</a><a href="<?php echo esc_url(home_url('/restoranas/')); ?>">Restoranas</a></div>
            <div><strong>KOOPS</strong><a href="<?php echo esc_url(home_url('/karjera/')); ?>">Karjera</a><a href="<?php echo esc_url(home_url('/tiekejams/')); ?>">Tiekėjams</a><a href="<?php echo esc_url(home_url('/apie/')); ?>">Apie mus</a><a href="<?php echo esc_url(home_url('/kontaktai/')); ?>">Kontaktai</a></div>
            <div><strong>Kontaktai</strong><a href="<?php echo esc_url(koops_phone_href(koops_option('phone'))); ?>"><?php echo esc_html(koops_option('phone')); ?></a><a href="mailto:<?php echo esc_attr(koops_option('email')); ?>"><?php echo esc_html(koops_option('email')); ?></a><a href="<?php echo esc_url(koops_option('privacy_url')); ?>">Privatumo politika</a></div>
        </nav>
    </div>
    <div class="footer-bottom shell">
        <p>© <?php echo esc_html(wp_date('Y')); ?> <?php echo esc_html(koops_option('legal_name', 'Ukmergės rajono vartotojų kooperatyvas')); ?></p>
        <a href="#turinys">Į puslapio viršų <span>↑</span></a>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

