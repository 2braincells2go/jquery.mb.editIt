/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: plugin.js                                                                                                                                  _
 _ last modified: 12/10/15 20.52                                                                                                                    _
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
 * editIt plug-in: deleteBlock
 *
 * This plugin let you delete editable blocks
 *
 * */

( function( $, d ) {
	var deleteBlock = {

		name: "deleteBlock",
		description: "",
		version: "1.0",
		author: "Pupunzi",

		activate: function() {

			console.debug( "Activate:: ", this );
			var plugin = this;

			$( d ).on( "editIt-mouseup." + plugin.name, function( e ) {} );

		},
		update: function() {

			var plugin = this;

			$( d ).on( "editIt-mousedown." + plugin.name, function( e ) {
				var editor = e.editor;

				var action = function() {
					var promptContent = _( "<h2>Do you really want to delete this content?</h2>" );
					$.editIt.prompt.draw( editor, promptContent, null, function() {
						$( editor ).remove();

						setTimeout( function() {
							$.editIt.toolBar.clear( editor );
						}, 300 )

					}, null, null, false );

					return false;
				};
				editor.deleteBlock = $.editIt.util.drawButton( "remove this block", "align-right main-color editIt-delete-block", "editIt-icon-close only-icon", function(){
					action();
					return false;

				} );

				if( editor.buttonBar && !$( ".editIt-delete-block", editor.buttonBar ).length )
					editor.buttonBar.append( editor.deleteBlock );

			} );

		},

		destroy: function() {
			var plugin = this;
		}

	};

	$.editIt.plugins.register( deleteBlock );

} )( jQuery, document );
