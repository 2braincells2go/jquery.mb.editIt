/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: plugin.js                                                                                                                                  _
 _ last modified: 12/10/15 20.51                                                                                                                    _
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
 * editIt plug-in: variablesReplace
 *
 * This plugin let you insert placeholders that will be replaced with specific client-entries
 *
 * You can define variables either
 * as form fields adding the "data-content-replace" attribute to the TAG
 * or defining them in the variablesReplace.variables object.
 * */

( function( $, d ) {
	var variablesReplace = {

		name: "variablesReplace",
		description: "Replace variables with the corresponding cliententry. ",
		version: "1.0",
		author: "Pupunzi",

		command: {
			label: _( "Insert Variable" ),
			icon: "editIt-icon-crosshairs",
			type: "plugin",
			action: function( editor ) {

				$.get( variablesReplace.path + "prompt.html?_=" + new Date().getTime(), function( html ) {
					$.editIt.prompt.draw( editor, html, variablesReplace, function( data ) {
						d.execCommand( 'insertText', false, "%%" + data[ "variable-name" ] + "%%" );

					}, null, null, true );
				} );
			}
		},

		activate: function() {

			console.debug( "Activate:: ", this );
			var plugin = this;

			$.editIt.setVariables = plugin.setVariables;
			$.editIt.getVariables = plugin.getVariables;

		},

		update: function( e ) {
			var plugin = this;
			var editor = e.editor;

			$( d ).on( "editIt-preview." + plugin.name, function( e ) {

				var c = plugin.replace( e.content.html(), plugin.variables );
				e.content.html( c );

			} );

			$.editIt.commands.extend( "variablesReplace", plugin.command );
			var defaultToolBar = editor.editorsContainer.opt.toolBar;
			$.editIt.toolBar.extend( defaultToolBar, "|", 1000 );
			$.editIt.toolBar.extend( defaultToolBar, "variablesReplace", 1000 );

		},

		destroy: function( e ) {
			var plugin = this;
		},

		getVariables: function() {
			return variablesReplace.variables;
		},

		setVariables: function( obj ) {

			$.extend( variablesReplace.variables, obj );

			for( var v in obj ) {

				if( $( "[name=" + v + "]" ).length )
					$( "[name=" + v + "]" ).remove();

				var inpt = $( "<input/>" ).attr( {
					type: "hidden",
					value: obj[ v ],
					name: v,
					"data-content-replace": true
				} );

				$( "body" ).append( inpt );

			}

		},

		replace: function( txt, vars ) {

			var replacer = function( str ) {
				str = str.replace( /%%/g, "" );

				var input = $( "[name=" + str + "]" );
				var val = input.length ? input.val() : vars[ str ];

				return val;

			};

			/* var extract = str.match(/%%(.*)%%/).pop(); */
			return txt.replace( /%%([^>%%]+)%%/g, replacer );

		},

		/*		i18n: {
					"it-IT": {
						"Insert Variable": "Inserisci una variabile",

						// i18n for prompt
						"Dynamic content": "Contenuti dinamici",
						"Choose the variable:": "Scegli una variabile da inserire:",
						"There're no available variables.": "Non ci sono variabili da utilizzare."

					}
				},*/

		variables: {}

	};

	$.editIt.plugins.register( variablesReplace );

} )( jQuery, document );
