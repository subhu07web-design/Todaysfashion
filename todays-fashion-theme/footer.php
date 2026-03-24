    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-widget">
                    <h3 class="text-xl font-bold mb-6 tracking-tighter uppercase">Today's Fashion</h3>
                    <p class="mb-6">Premium fashion for the modern individual. Quality, style, and comfort delivered to your doorstep.</p>
                </div>

                <div class="footer-widget">
                    <h4>Quick Links</h4>
                    <?php
                    wp_nav_menu(
                        array(
                            'theme_location' => 'footer',
                            'menu_class'     => 'footer-menu',
                            'fallback_cb'    => false,
                        )
                    );
                    ?>
                </div>

                <div class="footer-widget">
                    <h4>Contact Info</h4>
                    <ul class="space-y-4">
                        <li>NT Rd, near North Lakhimpur, Assam, India</li>
                        <li>+91 87618 65300</li>
                        <li>Open daily: 10 AM - 10 PM</li>
                    </ul>
                </div>

                <div class="footer-widget">
                    <h4>Newsletter</h4>
                    <p class="mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
                    <form class="flex">
                        <input type="email" placeholder="Your email" class="bg-zinc-900 border-none px-4 py-2 text-sm w-full outline-none">
                        <button class="bg-emerald-600 px-4 py-2 hover:bg-emerald-700 transition-colors">Go</button>
                    </form>
                </div>
            </div>

            <div class="site-info mt-20 pt-8 border-t border-zinc-800 text-center text-xs text-gray-500">
                &copy; <?php echo date('Y'); ?> Today's Fashion. All rights reserved.
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
