/**
 *
 * editIt plug-in: modulesManager
 *
 * This plugin let you insert predefined HTML block contents inside the editor
 *
 * */

( function( $, d ) {
	var modulesManager = {

		name: "modulesManager",
		description: "Add the capability to place snippets of code into the editor context",
		version: "1.0",
		author: "Pupunzi",

		activate: function() {

			var plugin = this;
			console.debug( "Activate:: ", plugin );
			/**
			 * Load template list from the json
			 */
			$.getJSON( plugin.path + "/modules/modules.json?_=" + new Date().getTime(), function( data ) {
				plugin.templates = data.templates;
			} );
		},

		update: function( e ) {

			$( ".modulesManager-buttonBar" ).remove();

			var plugin = this;
			$( "[data-group]" ).each( function() {

				var block = this;
				var editor = $( block ).is( "[data-editable]" ) ? block : $( block ).children( "[data-editable]" ).eq( 0 );

				var buttonBar = $( "<div/>" ).addClass( "modulesManager-buttonBar" ).css( {
					opacity: 0
				} );

				var addBlock = $.editIt.util.drawButton( "Add block", "apply", "editIt-icon-plus", null, null, true );
				var removeBlock = $.editIt.util.drawButton( "Remove block", "red", "editIt-icon-minus", null, null, true );

				addBlock.on( "click", function() {
					$.get( plugin.path + "/prompt.html?_=" + new Date().getTime(), function( html ) {
						var main_editor = $( block ).parents( ".editIt-wrapper" ).eq( 0 );
						$.editIt.prompt.draw( main_editor, html, plugin, function( data ) {
							plugin.insert.apply( plugin, [ data[ "template-url" ], block, data[ "position" ], null ] )
						} );
					} );
				} );

				removeBlock.on( "click", function() {

					var main_editor = $( block ).parents( ".editIt-wrapper" ).eq( 0 );

					$.editIt.prompt.draw( main_editor, "<h2>" + _( "Do you really want to delete this content?" ) + "</h2>", plugin, function() {
						$( block ).remove();
						$.editIt.util.setUneditable( main_editor );
						main_editor.editIt();
					}, "Delete", "delete" );

				} );

				buttonBar.append( addBlock );
				if( $( block ).data( "removable" ) )
					buttonBar.append( removeBlock );

				$( editor ).append( buttonBar );

				buttonBar.on( "mouseenter", function() {
					buttonBar.fadeTo( 100, 1 );
				} ).on( "mouseleave", function() {
					buttonBar.fadeTo( 100, 0 );
				} )

			} )

		},

		destroy: function() {

			$( ".modulesManager-buttonBar" ).remove();

		},

		insert: function( template, where, position ) {

			var plugin = this;
			var editor = $( where ).parents( ".editIt-wrapper" ).eq( 0 );

			$.get( plugin.path + "/modules/" + template + "?_=" + new Date().getTime() ).done( function( html ) {

				$( where )[ position ]( html );

				$.editIt.util.setUneditable( editor );
				var opt = editor.opt;
				editor.editIt( opt );

			} ).fail( function( error ) {
				$.editIt.alert.draw( editor, _( "There's been an error loading the template:<br> %%", [ template ] ) )
			} );

		},

		i18n: {
			"it-IT": {
				"Add block": "Aggiungi un blocco",
				"Remove block": "elimina il blocco",
				"Do you really want to delete this content?": "Vuoi veramente rimuovere questo contenuto?",
				"There's been an error loading the template: <br> %%": "C'è stato un errore caricando il template:<br> %% ",

				// i18n for prompt
				"Template manager": "Gestione templates",
				"Choose a template:": "Scegli un template:",
				"table 3 columns": "Tabella a 3 colonne",
				"3 box line": "3 box in linea",
				"simple text box": "box di testo",
				"After the current block": "Dopo il blocco corrente",
				"Before the current bloclk": "Prima del blocco corrente",
				"Where?": "Dove?"

			}
		}

	};

	$.editIt.plugins.register( modulesManager );

} )( jQuery, document );
