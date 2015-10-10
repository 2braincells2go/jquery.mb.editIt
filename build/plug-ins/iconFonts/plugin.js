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

		},

		i18n: {
			"it-IT": {
				"Add emoticon": "Aggiungi un'emoticon"
			}
		}

	};

	$.editIt.plugins.register( iconFont );

} )( jQuery, document );
