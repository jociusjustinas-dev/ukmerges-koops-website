<?php
get_header();
the_post();
$id = get_the_ID();
$pdf_id = absint(get_post_meta($id, 'koops_pdf_id', true));
$pdf_url = $pdf_id ? wp_get_attachment_url($pdf_id) : '';
$page_ids = array_filter(array_map('absint', explode(',', (string) get_post_meta($id, 'koops_page_ids', true))));
?>
<main id="turinys">
    <section class="page-hero shell reveal">
        <p class="eyebrow">Leidinys</p>
        <h1><?php the_title(); ?></h1>
        <p class="lead"><?php echo esc_html((string) get_the_excerpt()); ?></p>
        <?php if ($pdf_url) : koops_button('Atsisiųsti PDF', $pdf_url, 'is-accent', ['target' => '_blank', 'rel' => 'noopener']); endif; ?>
    </section>
    <section class="shell section-space">
        <?php foreach ($page_ids as $page_id) : ?>
            <figure class="reveal"><?php echo wp_get_attachment_image($page_id, 'full'); ?></figure>
        <?php endforeach; ?>
    </section>
</main>
<?php get_footer(); ?>
