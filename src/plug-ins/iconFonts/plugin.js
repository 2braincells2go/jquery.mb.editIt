/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: plugin.js                                                                                                                                  _
 _ last modified: 10/10/15 22.44                                                                                                                    _
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
 * editIt plug-in: iconFont
 *
 * This plugin let you insert emoticons
 *
 * You can define variables either
 * as form fields adding the "data-content-replace" attribute to the TAG
 * or defining them in the variablesReplace.variables object.
 * */

( function( $, d ) {
	var iconFont = {

		name: "iconFont",
		description: "",
		version: "1.0",
		author: "Pupunzi",

		command: {
			label: _( "Add emoticon" ),
			icon: "emoticons-smile",
			type: "dropdown",
			action: function( editor ) {
				var elements = [ "h1", "h2", "h3", "h4", "p" ];
				$.editIt.dropDown.draw.apply( this, [ editor, elements ] );
			}
		},

		activate: function() {

			console.debug( "Activate:: ", this );
			var plugin = this;

			$.editIt.commands.extend( "iconfont", this.command );
			$( d ).on( "editIt-mouseup." + plugin.name, function( e ) {} );

		}
	};

	$.editIt.plugins.register( iconFont );

} )( jQuery, document );
