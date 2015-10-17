/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: plugin.js                                                                                                                                  _
 _ last modified: 13/10/15 19.41                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

/**
 *
 * editIt plug-in: imageManager
 *
 * This plugin let you manage TABLE elements inside the editor.
 *
 * */

( function( $, d ) {
	var imageManager = {

		name: "imageManager",
		description: "Manipulate images inside a content editable",
		version: "1.0",
		author: "Pupunzi",

		activate: function() {
			var plugin = this;
			console.debug( "Activate:: ", plugin );
		},

		update: function( e ) {
			var plugin = this;

			$( d ).on( "editIt-mousedown." + plugin.name, function( e ) {

				var editor = e.editor;
				var targetIsImage = $( editor.actualTag ).is( "img" );

				if( targetIsImage ) {
					var img = $( editor.actualTag );

				}

			} )
		},

		destroy: function() {
			var plugin = this;
		},

		cleanUp: function( table ) {},

		commands: {
			image: {
				label: _( "Image" ),
				icon: "editIt-icon-image",
				action: function( editor ) {}
			}
		}
	};

	$.editIt.plugins.register( imageManager );

} )( jQuery, document );
