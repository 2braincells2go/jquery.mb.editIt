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
 * editIt plug-in: blockTool
 *
 * This plugin let you add delit, copy, cut and paste for each editIt block
 *
 * */

( function( $, d ) {
	var blockTool = {

		name: "blockTool",
		description: "This plugin let you add delit, copy, cut and paste for each editIt block",
		version: "1.0",
		author: "Pupunzi",

		activate: function() {

			console.debug( "Activate:: ", this );
			var plugin = this;

			$.editIt.commands.extend( plugin.commands );

			$( d ).on( "editIt-mouseup." + plugin.name, function( e ) {} );

		},

		update: function() {

			var plugin = this;

			$( d ).on( "editIt-mousedown." + plugin.name, function( e ) {
				var editor = e.editor;

				/*
				 var action = function() {
				 var promptContent = _( "<h2>Do you really want to delete this content?</h2>" );
				 $.editIt.prompt.draw( editor, promptContent, null, function() {
				 $( editor ).remove();

				 setTimeout( function() {
				 $.editIt.toolBar.clear( editor );
				 }, 300 )

				 }, null, null, false );
				 };
				 */

				editor.blockTool = $.editIt.util.drawButton( "remove this block", "align-right main-color editIt-delete-block only-icon", "editIt-icon-cog", function() {
					var elements = [ "removeBlock", "-", "copyBlock", "cutBlock" ];

					if( $.editIt.clipboard )
						elements.push( "-", "pasteBlockBefore", "pasteBlockAfter" );

					console.debug( elements )
					$.editIt.dropDown.draw.apply( this, [ editor, elements ] );
				} );

				if( editor.buttonBar && !$( ".editIt-delete-block", editor.buttonBar ).length )
					editor.buttonBar.append( editor.blockTool );

			} );

		},

		destroy: function() {
			var plugin = this;
		},

		commands: {
			removeBlock: {
				label: _( "Delete" ),
				icon: "editIt-icon-trash-o",
				action: function( editor ) {
					var promptContent = "<h2>" + _( "Do you really want to delete this content?" ) + "</h2>";
					$.editIt.prompt.draw( editor, promptContent, null, function() {
						$( editor ).remove();

						setTimeout( function() {
							$.editIt.toolBar.clear( editor );
						}, 300 )

					}, "Delete", "delete", false );
				}
			},

			copyBlock: {
				label: _( "Copy" ),
				icon: "editIt-icon-copy",
				action: function( editor ) {
					var element = $( editor ).clone();
					$.editIt.clipboard = element;
					$( editor ).addClass( "editIt-copied" );
					$( editor ).blur();
				}
			},

			cutBlock: {
				label: _( "Cut" ),
				icon: "editIt-icon-cut",
				action: function( editor ) {
					$.editIt.clipboard = $( editor );
					$( editor ).addClass( "editIt-cutted" );
					$( editor ).blur();
				}
			},

			pasteBlockBefore: {
				label: _( "Paste before" ),
				icon: "editIt-icon-clipboard",
				action: function( editor ) {

					$.editIt.clipboard.hide();
					$( editor ).before( $.editIt.clipboard );
					$.editIt.clipboard.slideDown();
					$( ".editIt-cutted" ).removeClass( "editIt-cutted" );
					$( ".editIt-copied" ).removeClass( "editIt-copied" );

					$.editIt.clipboard = null;
					$.editIt.util.setUneditable( editor );
					$( editor.editorsContainer ).editIt();
				}
			},

			pasteBlockAfter: {
				label: _( "Paste after" ),
				icon: "editIt-icon-clipboard",
				action: function( editor ) {
					$.editIt.clipboard.hide();
					$( editor ).after( $.editIt.clipboard );
					$.editIt.clipboard.slideDown();
					$( ".editIt-cutted" ).removeClass( "editIt-cutted" );
					$( ".editIt-copied" ).removeClass( "editIt-copied" );

					$.editIt.clipboard = null;
					$.editIt.util.setUneditable( editor );
					$( editor.editorsContainer ).editIt();
				}
			}

		}

	};

	$.editIt.plugins.register( blockTool );

} )( jQuery, document );
