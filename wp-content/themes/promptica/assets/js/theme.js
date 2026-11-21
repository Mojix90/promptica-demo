/* Promptica theme: colour mode + mobile menu. */
( function () {
	'use strict';
	var root = document.documentElement;
	var toggle = document.querySelector( '.theme-toggle' );
	var menu = document.querySelector( '.mobile-menu-toggle' );
	var mobile = document.getElementById( 'mobile-navigation' );

	if ( toggle ) {
		toggle.setAttribute( 'aria-pressed', root.classList.contains( 'dark-mode' ) ? 'true' : 'false' );
		toggle.addEventListener( 'click', function () {
			var dark = root.classList.toggle( 'dark-mode' );
			toggle.setAttribute( 'aria-pressed', dark ? 'true' : 'false' );
			try {
				localStorage.setItem( 'promptica-mode', dark ? 'dark' : 'light' );
			} catch ( e ) {}
		} );
	}

	if ( menu && mobile ) {
		var close = function () {
			menu.setAttribute( 'aria-expanded', 'false' );
			mobile.hidden = true;
		};
		menu.addEventListener( 'click', function () {
			var open = menu.getAttribute( 'aria-expanded' ) === 'true';
			menu.setAttribute( 'aria-expanded', open ? 'false' : 'true' );
			mobile.hidden = open;
		} );
		document.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Escape' && ! mobile.hidden ) {
				close();
				menu.focus();
			}
		} );
		window.matchMedia( '(min-width: 1001px)' ).addEventListener( 'change', function ( mq ) {
			if ( mq.matches ) {
				close();
			}
		} );
	}
}() );
