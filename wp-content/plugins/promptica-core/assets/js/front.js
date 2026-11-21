/* Promptica Core front-end: copy prompt + lesson progress without page reload. */
( function () {
	'use strict';
	var cfg = window.prompticaCore || {};

	function format( tpl, a, b ) {
		var fa = function ( n ) {
			return String( n ).replace( /\d/g, function ( d ) {
				return '۰۱۲۳۴۵۶۷۸۹'[ d ];
			} );
		};
		return String( tpl || '' ).replace( '%1$s', fa( a ) ).replace( '%2$s', fa( b ) );
	}

	function copyText( text ) {
		if ( navigator.clipboard && window.isSecureContext ) {
			return navigator.clipboard.writeText( text );
		}
		// Fallback for http:// sites and older browsers.
		return new Promise( function ( resolve, reject ) {
			var area = document.createElement( 'textarea' );
			area.value = text;
			area.setAttribute( 'readonly', '' );
			area.style.position = 'fixed';
			area.style.opacity = '0';
			document.body.appendChild( area );
			area.select();
			var ok = false;
			try {
				ok = document.execCommand( 'copy' );
			} catch ( e ) {}
			document.body.removeChild( area );
			if ( ok ) {
				resolve();
			} else {
				reject();
			}
		} );
	}

	document.addEventListener( 'click', function ( event ) {
		var button = event.target.closest( '.promptica-copy' );
		if ( ! button ) {
			return;
		}
		var source = document.getElementById( button.dataset.target || '' );
		if ( ! source ) {
			return;
		}
		var original = button.textContent;
		copyText( source.textContent ).then(
			function () {
				button.textContent = button.dataset.done || '✓';
			},
			function () {
				button.textContent = button.dataset.fail || '×';
			}
		).then( function () {
			setTimeout( function () {
				button.textContent = original;
			}, 1800 );
		} );
	} );

	document.addEventListener( 'change', function ( event ) {
		var box = event.target;
		if ( ! ( box instanceof HTMLInputElement ) || ! box.matches( '.promptica-lesson-check' ) || ! cfg.ajaxUrl ) {
			return;
		}
		var data = new FormData();
		data.append( 'action', 'promptica_save_progress' );
		data.append( 'course', box.dataset.course || '' );
		data.append( 'lesson', box.dataset.lesson || '' );
		data.append( 'nonce', box.dataset.nonce || '' );
		data.append( 'complete', box.checked ? '1' : '0' );
		box.disabled = true;
		fetch( cfg.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: data } )
			.then( function ( r ) {
				return r.json();
			} )
			.then( function ( result ) {
				if ( ! result || ! result.success ) {
					throw new Error( 'save failed' );
				}
				var wrap = document.querySelector( '.promptica-course-progress[data-course="' + box.dataset.course + '"]' );
				if ( wrap ) {
					var bar = wrap.querySelector( '.promptica-progress-track' );
					var fill = wrap.querySelector( '.promptica-progress-track span' );
					var text = wrap.querySelector( '.promptica-progress-text' );
					if ( fill ) {
						fill.style.width = result.data.percent + '%';
					}
					if ( bar ) {
						bar.setAttribute( 'aria-valuenow', result.data.percent );
					}
					if ( text ) {
						text.textContent = format( cfg.doneTpl, result.data.completed, result.data.total );
					}
				}
			} )
			.catch( function () {
				box.checked = ! box.checked;
				if ( cfg.error ) {
					window.alert( cfg.error );
				}
			} )
			.then( function () {
				box.disabled = false;
			} );
	} );
}() );
