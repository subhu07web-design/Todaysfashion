<?php
/**
 * The template for displaying all single posts
 */

get_header(); ?>

<main id="primary" class="site-main container py-20">

    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header mb-12 max-w-3xl mx-auto text-center">
                <div class="entry-meta text-xs text-emerald-600 font-bold uppercase tracking-widest mb-4">
                    <?php the_category(', '); ?>
                </div>
                <?php the_title( '<h1 class="entry-title text-5xl font-bold uppercase tracking-tighter mb-6">', '</h1>' ); ?>
                <div class="entry-meta text-sm text-gray-500">
                    By <?php the_author(); ?> | <?php echo get_the_date(); ?>
                </div>
            </header>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="post-thumbnail mb-12 rounded-3xl overflow-hidden shadow-2xl">
                    <?php the_post_thumbnail('full', array('class' => 'w-full h-auto')); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content prose max-w-3xl mx-auto leading-relaxed">
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

            <footer class="entry-footer mt-12 pt-8 border-t border-gray-100 max-w-3xl mx-auto">
                <div class="tags text-xs uppercase tracking-widest font-bold">
                    <?php the_tags('Tags: ', ', '); ?>
                </div>
            </footer>
        </article>

        <?php
        // If comments are open or we have at least one comment, load up the comment template.
        if ( comments_open() || get_comments_number() ) :
            comments_template();
        endif;

    endwhile; ?>

</main>

<?php get_footer(); ?>
