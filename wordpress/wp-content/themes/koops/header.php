<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#turinys">Pereiti prie turinio</a>
<header class="site-header" data-site-header>
    <div class="site-header-inner">
        <a class="site-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="KOOPS – pradinis puslapis">
            <?php if (has_custom_logo()) : ?>
                <?php $logo_id = get_theme_mod('custom_logo'); echo wp_get_attachment_image($logo_id, 'full', false, ['alt' => 'KOOPS']); ?>
            <?php else : ?>
                <img src="<?php echo esc_url(koops_theme_asset('koops-logo.png')); ?>" alt="KOOPS">
            <?php endif; ?>
        </a>
        <nav class="site-nav" id="site-navigation" aria-label="Pagrindinė navigacija" data-menu-panel>
            <?php koops_primary_navigation(); ?>
            <div class="mobile-menu-footer">
                <a href="<?php echo esc_url(koops_phone_href(koops_option('phone', '0 340 53235'))); ?>"><?php echo esc_html(koops_option('phone', '0 340 53235')); ?></a>
                <a href="mailto:<?php echo esc_attr(koops_option('email', 'direktore@urvk.lt')); ?>"><?php echo esc_html(koops_option('email', 'direktore@urvk.lt')); ?></a>
                <div><a href="<?php echo esc_url(koops_option('facebook_url')); ?>" target="_blank" rel="noopener">Facebook</a><a href="<?php echo esc_url(koops_option('instagram_url')); ?>" target="_blank" rel="noopener">Instagram</a></div>
            </div>
        </nav>
        <div class="site-header-actions">
            <?php koops_button('Rasti parduotuvę', get_post_type_archive_link('koops_store') ?: home_url('/parduotuves/'), 'is-accent header-store-button'); ?>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Atverti meniu" data-menu-toggle>
                <span></span><span></span>
            </button>
        </div>
    </div>
</header>

