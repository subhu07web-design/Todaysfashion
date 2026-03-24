<?php
/**
 * The template for displaying archive pages
 */

get_header(); ?>

<main id="primary" class="site-main container py-20">

    <?php if ( have_posts() ) : ?>

        <header class="page-header mb-12">
            <?php
            the_archive_title( '<h1 class="page-title text-4xl font-bold uppercase tracking-tighter">', '</h1>' );
            the_archive_description( '<div class="archive-description text-gray-500 mt-2">', '</div>' );
            ?>
        </header>

        <div class="post-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <?php
            while ( have_posts() ) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('group'); ?>>
                    <?php if ( has_post_thumbnail() ) : ?>
                        <div class="post-thumbnail mb-4 overflow-hidden rounded-xl">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('large', array('class' => 'w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110')); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <header class="entry-header">
                        <h2 class="entry-title text-xl font-bold mb-2">
                            <a href="<?php the_permalink(); ?>" class="hover:text-emerald-600 transition-colors"><?php the_title(); ?></a>
                        </h2>
                        <div class="entry-meta text-xs text-gray-500 uppercase tracking-widest mb-4">
                            <?php echo get_the_date(); ?>
                        </div>
                    </header>

                    <div class="entry-summary text-gray-600 text-sm mb-4">
                        <?php the_excerpt(); ?>
                    </div>

                    <a href="<?php the_permalink(); ?>" class="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">Read More</a>
                </article>
            <?php endwhile; ?>
        </div>

        <?php the_posts_navigation(); ?>

    <?php else : ?>
        <p>No posts found.</p>
    <?php endif; ?>

</main>

<?php get_footer(); ?>
