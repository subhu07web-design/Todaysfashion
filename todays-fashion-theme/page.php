<?php
/**
 * The template for displaying all pages
 */

get_header(); ?>

<main id="primary" class="site-main container py-20">

    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header mb-12">
                <?php the_title( '<h1 class="entry-title text-5xl font-bold uppercase tracking-tighter">', '</h1>' ); ?>
            </header>

            <div class="entry-content prose max-w-none">
                <?php
                the_content();

                wp_link_pages(
                    array(
                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'todays-fashion' ),
                        'after'  => '</div>',
                    )
                );
                ?>
            </div>
        </article>
    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
