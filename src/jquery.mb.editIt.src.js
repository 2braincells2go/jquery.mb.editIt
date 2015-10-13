/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.editIt.src.js                                                                                                                    _
 _ last modified: 12/10/15 19.45                                                                                                                    _
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
 * Description:
 * A simple editor for HTML contenteditable elements.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands
 *
 * built in commands:
 *
 * blockquote
 * bold
 * createlink
 * h1
 * h2
 * h3
 * h4
 * indent
 * insertOrderedList
 * insertUnorderedList
 * italic
 * justifyCenter
 * justifyFull
 * justifyLeft
 * justifyRight
 * outdent
 * p
 * paragraph
 * redo
 * removeFormat
 * strikeThrough
 * underline
 * undo
 * unlink
 *
 *
 * Events:
 *
 * editIt-mouseup
 * editIt-mouseover
 * editIt-focus
 * editIt-blur
 * editIt-keyup
 * editIt-create-mainBB
 * editIt-preview
 * editIt-remove
 * editIt-apply
 *
 *
 **/

( function( $, d ) {

	$.editIt = {

		author: "Matteo Bicocchi (Pupunzi)",
		version: "{{ version }}",
		build: "{{ build }}",

		/**
		 *
		 * Defaults options
		 *
		 */
		defaults: {

			textareaName: null,
			pasteAs: "cleanHTML", // "cleanHTML", "text", "HTML", "none"
			blockImages: true,
			enablePreview: true,
			toolBar: "default",
			toolBarIcon: true,
			enableSourceMode: true,
			styleWithCSS: false,

			lang: "it-IT" //null //"it-IT" //fr-FR

		},

		/**
		 *
		 * Toolbar
		 *
		 */
		toolBar: {
			none: "",
			default: [ "bold", "italic", "underline", "strikeThrough", "|", "removeFormat", "|", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "|", "paragraph", "|", "createlink", "|", "insertOrderedList", "insertUnorderedList", "|", "outdent", "indent", "|", "undo", "redo" ],
			small: [ "bold", "italic", "underline", "strikeThrough", "removeFormat", "|", "undo", "redo" ],

			/**
			 * $.editIt.toolBar.draw()
			 *
			 * Draws the toolbar
			 *
			 * @param editor
			 * @param fade
			 */
			draw: function( editor, fade ) {

				if( !$( editor ).is( "[contenteditable]" ) || !editor.editorsContainer )
					return;

				$.extend( editor.editorsContainer.cmnds, $.editIt.commands );
				$.extend( editor.editorsContainer.opt.toolBar, $.editIt.defaults.toolBar );

				$.editIt.toolBar.clear( editor );

				var tbe = $.editIt.toolBar.getElements( editor );

				editor.editorsContainer.toolBar = $( "<div/>" ).addClass( "editIt-toolbar" ).attr( {
					id: "editIt-toolbar"
				} );

				/**
				 * Loops the chosen toolBar elements and create the buttons
				 */

				for( var x in tbe ) {
					if( tbe.hasOwnProperty( x ) )
						var btn = tbe[ x ].trim();

					if( btn == "|" ) {
						var separator = $( "<span/>" ).addClass( "separator" ).html( "&nbsp;" );
						editor.editorsContainer.toolBar.append( separator );
						continue;
					}

					var cmnd = editor.editorsContainer.cmnds[ btn ];
					if( !cmnd || ( cmnd.availableFor && editor.actualTag.tagName.toUpperCase() != cmnd.availableFor ) ) {
						continue;
					}

					var toolBarIcon = editor.editorsContainer.opt.toolBarIcon && cmnd.icon;
					var label = toolBarIcon ? "" : cmnd.label;

					var command = $( "<button>" ).html( _( label ) ).data( "action", btn ).addClass( ( toolBarIcon ? "icon " : "textual " ) + btn );

					if( toolBarIcon ) {
						command.addClass( cmnd.icon );
						command.attr( {
							title: _( cmnd.label )
						} );
					}

					if( !cmnd.type )
						cmnd.type = "default";

					var canCheck = typeof d.queryCommandState != "undefined";

					switch( cmnd.type ) {

						case "dropdown":
							var arr = $( "<span/>" ).addClass( "editIt-icon-sort-desc" ).css( {
								paddingLeft: 10
							} );
							command[ 0 ].isDropDown = true;
							command.append( arr );
							break;

						case "plugin":
							try {
								if( canCheck && d.queryCommandState( btn ) )
									command.addClass( "sel" );
							} catch( err ) {
								console.debug( err )
							}
							break;

						default:
							try {
								if( canCheck && !d.queryCommandEnabled( btn ) )
									command.addClass( "disabled" );
								if( canCheck && ( btn == "createlink" ) && $.editIt.util.isSelectionInsideElement( "A" ) || ( btn != "removeFormat" && d.queryCommandState( btn ) ) )
									command.addClass( "sel" );
							} catch( err ) {
								console.debug( err )
							}
							break;
					}

					command.on( "mousedown", function( e ) {

						e.stopPropagation();

						var el = this;
						var $el = $( el );

						clearTimeout( $.editIt.hidetimer );

						setTimeout( function() {
							$( editor ).focus();
							var args = [ editor ];
							editor.editorsContainer.cmnds[ $el.data( "action" ) ].action.apply( el, args );
							if( el.isDropDown )
								return;
							$.editIt.toolBar.draw( editor );
							if( editor.editorsContainer.opt.textareaName )
								$.editIt.util.updateTextarea( editor );
						}, 50 );

					} );

					editor.editorsContainer.toolBar.append( command );
				}

				if( fade )
					editor.editorsContainer.toolBar.fadeIn( 200 );
				else
					editor.editorsContainer.toolBar.show();

				editor.editorsContainer.toolBar.unselectable();

				var scrollLeft = $( window ).scrollLeft();
				var scrollTop = $( window ).scrollTop();
				var pos = $.editIt.util.getSelectionCoords();

				$( "body" ).after( editor.editorsContainer.toolBar );
				var arrow = $( "<div/>" ).addClass( "arrow_box" );
				editor.editorsContainer.toolBar.append( arrow );

				pos.left = pos.left - ( editor.editorsContainer.toolBar.outerWidth() / 2 );
				pos.top = pos.top - 20;

				var toolBarLeftIsInWin = ( pos.left - scrollLeft ) + editor.editorsContainer.toolBar.width() < $( window ).width();
				var toolBarTopIsInWin = ( pos.top - scrollTop ) + editor.editorsContainer.toolBar.height() < $( window ).height();

				pos.left = toolBarLeftIsInWin ? pos.left : pos.left - ( ( pos.left - scrollLeft ) + editor.editorsContainer.toolBar.width() - $( window ).width() ) - 10;
				pos.left = pos.left > 10 ? pos.left : 10;

				pos.top = toolBarTopIsInWin ? pos.top : pos.top - ( ( pos.top - scrollTop ) + editor.editorsContainer.toolBar.height() - $( window ).height() ) - 10;
				pos.top = pos.top <= scrollTop + editor.editorsContainer.toolBar.height() ? pos.top + editor.editorsContainer.toolBar.outerHeight() + 20 : pos.top;

				editor.editorsContainer.toolBar.css( {
					left: pos.left,
					top: pos.top
				} );

				arrow.css( {
					left: $.editIt.util.getSelectionCoords().left - pos.left + ( pos.width / 2 ) - 5,
					top: pos.top - editor.editorsContainer.toolBar.position().top + editor.editorsContainer.toolBar.outerHeight() - 10
				} );

				$( ".editIt-tooltip" ).remove();
			},

			clear: function( editor ) {
				if( !editor || !editor.editorsContainer || !editor.editorsContainer.toolBar || !editor.editorsContainer.toolBar.is( ":visible" ) )
					return;
				editor.editorsContainer.toolBar.remove();
			},

			getElements: function( editor ) {
				var toolBarElements = $.editIt.toolBar[ ( $( editor ).data( "toolbar" ) || editor.editorsContainer.opt.toolBar ) ].slice( 0 );

				/**
				 *
				 * Manage exceptions in toolBar elements
				 */

				var isA = $.editIt.util.isSelectionInsideElement( "A" );

				if( isA && toolBarElements.indexOf( "createlink" ) > 0 ) {
					toolBarElements.splice( toolBarElements.indexOf( "createlink" ) + 1, 0, "unlink" );
				}

				return toolBarElements;

			},

			/**
			 * $.editIt.toolBar.add()
			 *
			 * Add a new toolbar
			 *
			 * @param toolbarName
			 * @param array of commands name
			 */
			add: function( toolbarName, array ) {
				$.editIt.toolBar[ toolbarName ] = array;
			},

			/**
			 * $.editIt.toolBar.extend()
			 *
			 * Extends a defined toolbar with a new command.
			 *
			 * A corresponding command should be defined first.
			 *
			 * @param toolbarName
			 * @param newElementName
			 * @param position
			 */
			extend: function( toolbarName, newElementName, position ) {
				var toolBar = $.editIt.toolBar[ toolbarName ];
				if( toolBar.indexOf( newElementName ) < 0 )
					toolBar.splice( position, 0, newElementName );
			}

		},

		/**
		 * Built in commands
		 *
		 */
		commands: {

			/**
			 * $.editIt.commands.extend()
			 *
			 * Adds a new command Object to be used in the toolbar element
			 *
			 * @param name
			 * @param command (Object)
			 */
			extend: function( name, command ) {

				if( typeof name == "object" ) {
					for( var n in name ) {

						if( name.hasOwnProperty( n ) )
							$.editIt.commands[ n ] = name[ n ];
					}

				} else
					$.editIt.commands[ name ] = command;
			},

			redo: {
				label: "Redo",
				icon: "editIt-icon-mail-forward",
				action: function() {
					if( d.queryCommandEnabled( "redo" ) )
						d.execCommand( 'redo', false, null );
				}
			},

			undo: {
				label: "Undo",
				icon: "editIt-icon-mail-reply",
				action: function() {
					if( d.queryCommandEnabled( "undo" ) )
						d.execCommand( 'undo', false, null );

				}
			},

			bold: {
				label: "Bold",
				icon: "editIt-icon-bold",
				action: function() {
					d.execCommand( 'bold', false, null );
				}
			},

			italic: {
				label: "Italic",
				icon: "editIt-icon-italic",
				action: function() {
					d.execCommand( 'italic', false, null );
				}
			},

			underline: {
				label: "Underline",
				icon: "editIt-icon-underline",
				action: function() {
					d.execCommand( 'underline', false, null );
				}
			},

			strikeThrough: {
				label: "Stroke",
				icon: "editIt-icon-strikethrough",
				action: function() {
					d.execCommand( 'strikeThrough', false, null );
				}
			},

			removeFormat: {
				label: "Clear",
				icon: "editIt-icon-eraser",
				action: function() {
					d.execCommand( 'removeFormat', false, null );
				}
			},

			createlink: {
				label: "Link",
				icon: "editIt-icon-chain",
				action: function( editor ) {

					var text = d.getSelection().toString();
					var pageUrl = self.location.href;

					/*
					 console.log("document.URL : "+document.URL);
					 console.log("document.location.href : "+document.location.href);
					 console.log("document.location.origin : "+document.location.origin);
					 console.log("document.location.hostname : "+document.location.hostname);
					 console.log("document.location.host : "+document.location.host);
					 console.log("document.location.pathname : "+document.location.pathname);
					 */

					if( text.length > 30 )
						text = text.substring( 0, 28 ) + "...";

					var url = editor.actualTag.tagName.toUpperCase() == "A" ? editor.actualTag.href.replace( d.URL, "" ).replace( d.location.origin, "" ) : '';
					var title = editor.actualTag.tagName.toUpperCase() == "A" ? editor.actualTag.title : '';
					var targ = editor.actualTag.tagName.toUpperCase() == "A" && editor.actualTag.target ? "checked" : '';

					promptContent =
						"<h2>" + _( "Write here the URL for:" ) + " <span style='opacity:.6'>" + text + "</span></h2> \n" +
						"<input type='text' data-required='true' id='editItlink' name='link' placeholder='http://' value='" + url + "'>" +
						"<br><br>" +
						"<input type='text' id='editItlinkTitle' name='title' placeholder='" + _( "Add a title" ) + "' value='" + title + "'>" +
						"<br><br>" +
						"<input type='checkbox' id='editItlinkTarget' name='target' value='_blank' " + targ + "> <label for='editItlinkTarget'>" + _( "Open the link in a new window" ) + "</label>";

					$.editIt.prompt.draw( editor, promptContent, null, function( data ) {

						if( data[ "link" ] && data[ "link" ] != "http://" ) {

							var url = data[ "link" ].replace( pageUrl, "" );
							d.execCommand( 'createlink', false, url );
							if( data[ "target" ] )
								d.getSelection().anchorNode.parentNode.target = data[ "target" ];

							if( data[ "title" ] )
								d.getSelection().anchorNode.parentNode.title = data[ "title" ];

						} else {
							d.execCommand( 'unlink', false, "" );
						}
					}, null, null, true );

				}
			},

			justifyFull: {
				label: "Justify",
				icon: "editIt-icon-align-justify",
				action: function() {
					d.execCommand( 'justifyFull', false, "" );
				}
			},

			justifyCenter: {
				label: "Center",
				icon: "editIt-icon-align-center",
				action: function() {
					d.execCommand( 'justifyCenter', false, "" );
				}
			},

			justifyLeft: {
				label: "Left",
				icon: "editIt-icon-align-left",
				action: function() {
					d.execCommand( 'justifyLeft', false, "" );
				}
			},

			justifyRight: {
				label: "Right",
				icon: "editIt-icon-align-right",
				action: function() {
					d.execCommand( 'justifyRight', false, "" );
				}
			},

			unlink: {
				label: "Unlink",
				icon: "editIt-icon-chain-broken",
				action: function() {
					d.execCommand( 'unlink', false, "" );
				}
			},

			/**
			 *
			 * Paragraph format dropdown
			 *
			 * */
			paragraph: {
				label: "Paragraph",
				icon: "editIt-icon-paragraph",
				type: "dropdown",
				action: function( editor ) {
					var elements = [ "h1", "h2", "h3", "h4", "h5", "h6", "-", "p", "blockquote" ];
					$.editIt.dropDown.draw.apply( this, [ editor, elements ] );
				}
			},

			h1: {
				label: "Title H1",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H1>" );
				}
			},

			h2: {
				label: "Title H2",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H2>" );
				}
			},

			h3: {
				label: "Title H3",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H3>" );
				}
			},

			h4: {
				label: "Title H4",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H4>" );
				}
			},

			h5: {
				label: "Title H5",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H5>" );
				}
			},

			h6: {
				label: "Title H6",
				icon: false,
				action: function() {
					d.execCommand( 'formatBlock', false, "<H6>" );
				}
			},

			p: {
				label: "Paragraph P",
				icon: "editIt-icon-paragraph",
				action: function() {
					d.execCommand( 'formatBlock', false, "<P>" );
				}
			},

			blockquote: {
				label: "Blockquote",
				icon: "editIt-icon-quote-left",
				action: function() {
					d.execCommand( 'formatBlock', false, "<BLOCKQUOTE>" );
				}
			},

			insertOrderedList: {
				label: "Ordered list",
				icon: "editIt-icon-list-ol",
				action: function() {
					d.execCommand( 'insertOrderedList', false, null )
				}
			},

			insertUnorderedList: {
				label: "Unordered list",
				icon: "editIt-icon-list-ul",
				action: function() {
					d.execCommand( 'insertUnorderedList', false, null )
				}
			},

			indent: {
				label: "Indent",
				icon: "editIt-icon-indent",
				action: function() {
					d.execCommand( 'indent', false, null )
				}
			},

			outdent: {
				label: "Outdent",
				icon: "editIt-icon-dedent",
				action: function() {
					d.execCommand( 'outdent', false, null )
				}
			}

		},

		/**
		 *
		 * Plug-ins Manager
		 *
		 * */

		plugins: {

			load: function( name, useMin ) {

				$( d ).on( "registered", function( e ) {
					e.plugin.UID = name.asId();
					e.plugin.path = $.editIt.plugins.path + name + "/";
				} );

				jQuery.ajax( {
					async: false,
					type: 'GET',
					url: $.editIt.plugins.path + name + "/plugin" + ( useMin ? ".min" : "" ) + ".js?_=" + new Date().getTime(),
					data: null,
					dataType: 'script',
					error: function() {
						$.editIt.alert.draw( null, _( "There's been an error loading the plugin:<br> %%", [ name ] ) )
					}
				} );
			},

			register: function( plugin ) {

				$.editIt._plugins = $.editIt.plugins || {};
				$.editIt._plugins[ plugin.name ] = plugin;

				var registered = $.Event( "registered" );
				registered.plugin = $.editIt._plugins[ plugin.name ];
				$( d ).trigger( registered );

				$.editIt.i18n.loadfile( plugin );

				$( '<link/>', {
					rel: 'stylesheet',
					href: plugin.path + "/style.css",
					id: "style_" + plugin.name
				} ).appendTo( 'head' );

				$.editIt._plugins[ plugin.name ].activate.apply( plugin );

				$( d ).on( "editIt-apply", function( e ) {
					if( typeof plugin.update == "function" )
						plugin.update.apply( plugin, [ e ] );
				} );

				$( d ).on( "editIt-remove", function() {
					if( typeof plugin.destroy == "function" )
						plugin.destroy.apply( plugin );
					$( d ).off( "." + plugin.name );
				} );
			}

		},

		/**
		 *
		 * Editor container buttonbar
		 *
		 */
		mainButtonBar: {

			draw: function( editor ) {

				$( ".editIt-main-buttonBar" ).remove();

				editor._buttonBar = editor._buttonBar || {};

				editor.mainButtonBar = $( "<div/>" ).addClass( "editIt-main-buttonBar" );
				$( editor ).append( editor.mainButtonBar );

				var mainBBCreateEv = $.Event( "editIt-create-mainBB" );
				mainBBCreateEv.editor = editor;
				$( editor ).trigger( mainBBCreateEv );

			},

			clear: function() {
				$( ".editIt-main-buttonBar" ).remove();
			},

			addButton: function( editor, opt ) {

				var options = {
					label: "button",
					icon: false,
					className: null,
					action: function() {}
				};

				$.extend( options, opt );

				var $newBtn = $.editIt.util.drawButton( options.label, "main-color " + options.className || "", options.icon, function( e ) {
					e.preventDefault();
					options.action.apply( editor, [ editor ] );
				} );

				editor.mainButtonBar.append( $newBtn );
				editor._buttonBar[ options.label ] = $newBtn;

			}

		},

		/**
		 *
		 * Alert window
		 *
		 */
		alert: {

			draw: function( editor, content ) {

				if( !editor )
					editor = $.editIt.actualEditor;

				editor.actualSelection = $.editIt.util.saveSelection();
				$.editIt.toolBar.clear( editor );

				editor.alert = $( "<div/>" ).addClass( "editIt-alert" ).hide();
				var alertBox = $( "<div/>" ).addClass( "editIt-alert-box" );

				var alertButtonsBar = $( "<div/>" ).addClass( "editIt-alert-buttonBar" );
				var alertApply = $.editIt.util.drawButton( "Ok", "apply", "editIt-icon-check big", function() {
					editor.alert.remove();
					$( "body" ).removeClass( "blur" );

					setTimeout( function() {
						$.editIt.toolBar.draw( editor );
						$( editor ).focus();
					}, 50 );

					$( d ).off( "keydown.alert" );

				} );

				alertButtonsBar.append( alertApply );

				alertBox.append( content );

				editor.alert.append( alertBox );
				alertBox.append( alertButtonsBar );

				$( "body" ).after( editor.alert );
				$( "body" ).addClass( "blur" );

				editor.alert.fadeIn( 120 );

				$( d ).on( "keydown.alert", function( e ) {

					var k = e.keyCode;

					switch( k ) {

						case 13:
							e.preventDefault();
							alertApply.mouseup();
							break;
					}

				} )
			}

		},

		/**
		 *
		 * Prompt window
		 *
		 */
		prompt: {

			/**
			 *
			 * @param editor
			 * @param content
			 * @param plugin
			 * @param action
			 * @param applyName
			 * @param className
			 * @param mustReturnData
			 */
			draw: function( editor, content, plugin, applyAction, applyName, className, mustReturnData ) {

				editor.actualSelection = $.editIt.util.saveSelection();
				$.editIt.toolBar.clear( editor );

				editor.prompt = $( "<div/>" ).addClass( "editIt-prompt" ).hide();
				var promptBox = $( "<div/>" ).addClass( "editIt-prompt-box" );

				var promptCancel = $.editIt.util.drawButton( "Cancel", "text-modality", null, null );
				var promptApply = $.editIt.util.drawButton( ( applyName || "Apply" ), ( className || "apply" ) + " big", null, null );

				var promptButtonsBar = $( "<div/>" ).addClass( "editIt-prompt-buttonBar" );
				promptButtonsBar.append( promptCancel ).append( promptApply );

				promptBox.append( content );

				promptApply.on( "click", function() {

					var data = {};
					$( "input, textarea", editor.prompt ).each( function() {

						switch( this.type ) {

							case "checkbox":
								if( $( this ).is( ":checked" ) )
									data[ this.name ] = $( this ).val();
								break;

							case "radio":
								if( $( this ).is( ":checked" ) )
									data[ this.name ] = $( this ).val();
								break;

							default:
								if( this.value.length )
									data[ this.name ] = $( this ).val();
						}

						/**
						 * data-required
						 */
						if( $( this ).is( "[data-required]" ) && !this.value.length ) {
							data = "empty-required";
							$( this ).addClass( "required" );
							return false;
						}
					} );
					/**
					 * isEmptyObject
					 */
					if( $.isEmptyObject( data ) && mustReturnData ) {
						$.editIt.prompt.highlight( editor, _( "Make your choice first..." ) );
						return;
					}
					/**
					 * data-required
					 */
					if( data == "empty-required" ) {
						$.editIt.prompt.highlight( editor, _( "A required field is empty" ) );
						$( ".required", editor.prompt ).one( "focus", function() {
							$( this ).removeClass( "required" );
						} );
						return;
					}

					$.editIt.util.restoreSelection( editor.actualSelection );
					applyAction( data );

					editor.prompt.remove();
					$( "body" ).removeClass( "blur" );

					setTimeout( function() {
						$.editIt.toolBar.draw( editor );
						$( editor ).focus();
					}, 50 );

					$( d ).off( "keydown.prompt" );

				} );

				promptCancel.on( "click", function() {
					editor.prompt.remove();
					$( "body" ).removeClass( "blur" );

					//	$.editIt.util.restoreSelection( editor.actualSelection );
					//					$( editor ).focus();

					$.editIt.toolBar.draw( editor, true );
					$( d ).off( "keydown.prompt" );
				} );

				editor.prompt.append( promptBox );
				promptBox.append( promptButtonsBar );

				$( "body" ).after( editor.prompt );
				$( "body" ).addClass( "blur" );

				/* ON LOAD */
				if( typeof $.editIt.prompt.onLoad == "function" ) {
					$.editIt.prompt.onLoad( editor, plugin );
					$.editIt.prompt.onLoad = null;
				}

				editor.prompt.fadeIn( 200, function() {
					promptBox.find( "input" ).eq( 0 ).focus().select();
				} );

				$( d ).on( "keydown.prompt", function( e ) {

					var k = e.keyCode;

					switch( k ) {

						case 13:
							e.preventDefault();
							promptApply.click();
							break;

						case 27:
							e.preventDefault();
							promptCancel.click();
							break;
					}

				} );

			},

			highlight: function( editor, message ) {

				editor.prompt.addClass( "highlight" );
				var msg = $( "<div/>" ).addClass( "editIt-prompt-message" ).html( message );
				$( ".editIt-prompt-buttonBar" ).before( msg );

				setTimeout(
					function() {
						editor.prompt.removeClass( "highlight" );
						msg.remove();
					}, 3000
				)

			},

			onLoad: function( editor, action ) {}

		},

		/**
		 *
		 * Tooltip
		 *
		 */
		tooltip: {

			/**
			 *
			 * @param editor
			 * @param content
			 * @param tryToCenter
			 */
			draw: function( editor, content, tryToCenter ) {

				$( ".editIt-tooltip" ).remove();
				editor.tooltip = $( "<div/>" ).addClass( "editIt-tooltip" ).hide();
				editor.tooltip.append( content );

				$( "body" ).append( editor.tooltip );

				var pos = $.editIt.util.getSelectionCoords();

				if( tryToCenter )
					pos.left -= editor.tooltip.outerWidth() / 2;

				editor.tooltip.css( {
					left: pos.left,
					top: pos.top
				} );

				editor.tooltip.slideDown( 300 )

			}
		},

		/**
		 *
		 * Dropdown
		 *
		 */
		dropDown: {

			/**
			 *
			 * @param editor
			 * @param elements
			 */
			draw: function( editor, elements ) {

				var buttonOpener = this;
				var dropDown = $( ".editIt-dropdown" );
				if( dropDown.is( ":visible" ) ) {
					var opener = dropDown[ 0 ].opener;
					dropDown.remove();
					if( opener == buttonOpener )
						return;
				}

				clearTimeout( $.editIt.hidetimer );

				editor.dropDown = $( "<div/>" ).addClass( "editIt-dropdown" );

				editor.dropDown[ 0 ].opener = buttonOpener;

				editor.dropDown.css( {
					position: "absolute",
					left: $( buttonOpener ).position().left,
					marginTop: 0
				} );

				$( editor ).focus();
				editor.actualSelection = $.editIt.util.saveSelection();

				for( var x in elements ) {

					if( elements.hasOwnProperty( x ) )
						if( elements[ x ] == "-" ) {
							var separator = $( "<div/>" ).addClass( "row_separator" );
							editor.dropDown.append( separator );
							continue;
						}

					var command = editor.editorsContainer.cmnds[ elements[ x ] ];
					if( !command || ( command.availableFor && editor.actualTag.tagName.toUpperCase() != command.availableFor ) )
						continue;

					var icon = command.icon ? "<span class='" + command.icon + "'></span>" : "";
					var row = $( "<div/>" ).addClass( "row" + elements[ x ] ).html( _( command.label ) + " " + icon ).data( "action", elements[ x ] );

					editor.dropDown.append( row );

					row.on( "mousedown", function() {

						var el = $( this );

						editor.actualSelection = $.editIt.util.saveSelection();

						setTimeout( function() {
							var args = [ editor ];
							$.editIt.util.restoreSelection( editor.actualSelection );
							editor.editorsContainer.cmnds[ el.data( "action" ) ].action.apply( el[ 0 ], args );
							$( editor ).focus();

							$.editIt.toolBar.draw( editor );

						}, 50 )

					} );

				}

				$( buttonOpener ).after( editor.dropDown );

			}
		},

		i18n: {

			loadfile: function( obj ) {

				if( obj.i18n ) {

					for( var lang in obj.i18n ) {
						$.editIt.i18n[ lang ] = $.editIt.i18n[ lang ] || {};
						$.extend( $.editIt.i18n[ lang ], obj[ lang ] );
					}

				} else {

					var path = obj ? obj.path : "";

					$.getJSON( path + "i18n.json?_={{ build }}", function( i18n ) {
						for( var lang in i18n ) {
							$.editIt.i18n[ lang ] = $.editIt.i18n[ lang ] || {};
							$.extend( $.editIt.i18n[ lang ], i18n[ lang ] );
						}

						console.debug( path + "i18n.json file loaded" );

					} ).fail( function( err ) {
						console.debug( "i18n for " + path + "i18n.json?_={{ build }}" + " faild ", err );
					} )

				}

			},

			setLabel: function( label, variables ) {
				var i18n = $.editIt.i18n;
				var lang = i18n.lang || ( navigator.language || navigator.userLanguage );
				var trans = label;

				if( i18n[ lang ] && i18n[ lang ][ label ] ) {
					trans = i18n[ lang ][ label ];
				}

				if( variables ) {
					for( var x in variables ) {
						trans = trans.replace( "%%", variables[ x ] );
					}
				}

				return trans;
			}

		},

		/**
		 *
		 * Utilities
		 *
		 */
		util: {

			/**
			 *
			 * @param editor
			 * @returns {HTML}
			 */
			getContent: function( editor ) {
				$.editIt.util.setUneditable( editor );
				var c = $( editor ).html();

				var opt = $( editor )[ 0 ].editorsContainer.opt;
				$( $( editor )[ 0 ].editorsContainer ).editIt( opt );

				return c;
			},

			getClearContent: function( editor ) {

				if( !editor && !editor.editorsContainer )
					return;

				var tmp = $( editor.editorsContainer ).clone();

				$( "[id*=editIt_]", tmp ).removeAttr( "id" );
				$( ".editIt-main-buttonBar", tmp ).remove();
				$( "[data-editable]", tmp ).removeClass( "editIt" ).removeAttr( "contenteditable" );
				$( ".editIt-wrapper", tmp ).removeClass( "inEditMode" );
				$( ".focusedEditor", tmp ).removeClass( "focusedEditor" );
				$( ".editIt-buttonBar", tmp ).remove();

				return tmp.html();

			},

			updateTextarea: function( editor ) {

				var $editor = $( editor );

				if( !$editor.length )
					return;

				editor = $editor[ 0 ];

				if( editor.editorsContainer && editor.editorsContainer.textarea )
					editor.editorsContainer.textarea.val( $.editIt.util.getClearContent( editor ) );
			},

			/**
			 *
			 * @param editor
			 */
			setUneditable: function( editor ) {

				var removeEv = $.Event( "editIt-remove" );
				removeEv.editor = editor;

				$( editor ).trigger( removeEv );

				$.editIt.mainButtonBar.clear();

				$.editIt.toolBar.clear( editor );

				$( "[id*=editIt_]" ).removeAttr( "id" );

				$( "[data-editable]", $( editor ) ).removeClass( "editIt" ).removeAttr( "contenteditable" ).off();
				$( ".editIt-wrapper" ).removeClass( "inEditMode" );

				$( "[class*=-toolbar]" ).remove();
				$( "[class*=-buttonBar]" ).remove();

				$.editIt.util.updateTextarea( editor );

			},

			handlePaste: function( e, editor ) {

				e = ( e.originalEvent || e );

				var text = "";

				function processPaste( text ) {
					//Remove images if blockImages
					if( editor.editorsContainer.opt.blockImages ) {
						var tmp = $( "<div/>" ).html( text );
						var images = tmp.find( "img" );
						if( images.length ) {
							$.editIt.alert.draw( editor, _( "<b>Attention!</b><br><br> Images insertion has been disabled in this editor.<br><br> <b>%%</b> images have been removed from the pasted source.", [ images.length ] ) );
							images.remove();
							text = tmp.html();
							tmp.remove();
						}
					}
					// get text representation of clipboard
					if( editor.editorsContainer.opt.pasteAs == "text" || e.shiftKey ) {
						text = $( text ).text();
					} else if( editor.editorsContainer.opt.pasteAs == "cleanHTML" ) {
						text = $.htmlClean( text );
					}

					return text;
				}

				if( e && e.clipboardData && e.clipboardData.getData ) { // Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
					if( /text\/html/.test( e.clipboardData.types ) ) {
						text = e.clipboardData.getData( 'text/html' );
					}
					/*else if( /text\/plain/.test( e.clipboardData.types ) ) {
					 text = e.clipboardData.getData( 'text/plain' );
					 }*/
					else {

						window.pasteTarget = $( e.target ).parents( ".editIt" );
						window.selection = window.getSelection();
						window.range = selection.getRangeAt( 0 );

						$.fn.getPasteContent = function() {
							var sanitizeDiv = this;

							return setTimeout( function() {
								var lastNode, node, range, selection;
								selection = window.selection;
								range = window.range;
								originalHtml = sanitizeDiv.html();

								$( window.target ).focus();
								selection.removeAllRanges();
								selection.addRange( range );
								range.deleteContents();
								var sanitizedHtml = document.createDocumentFragment();
								while( node = sanitizeDiv.firstChild ) {
									lastNode = sanitizedHtml.appendChild( node );
								}
								range.insertNode( sanitizedHtml );
								if( lastNode ) {
									range = range.cloneRange();
									range.setStartAfter( lastNode );
									range.collapse( true );
									selection.removeAllRanges();
									selection.addRange( range );
								}

								d.execCommand( "insertHTML", false, processPaste( sanitizeDiv.html() ) );

								sanitizeDiv.remove();
								//return $( this ).html( originalHtml );
							}, 1 );
						};

						var tmp = $( "<div/>" ).attr( {
							id: "pasteTmp",
							contenteditable: true
						} ).css( {
							position: "absolute",
							top: -3000
						} );

						$( "body" ).append( tmp );

						tmp.on( "focus", function() {
							$( this ).getPasteContent();
						} );

						tmp.html( '' ).focus();
						return;

					}
				}

				if( !editor.editorsContainer.opt.pasteAs )
					return;

				e.stopPropagation();
				e.preventDefault();

				if( editor.editorsContainer.opt.pasteAs == "none" ) {
					return;
				}

				// insert text manually
				d.execCommand( "insertHTML", false, processPaste( text ) );

			},

			enablePreview: function() {

				var editor = this;

				$.editIt.mainButtonBar.addButton( editor, {
					label: _( "Preview" ),
					icon: "editIt-icon-eye",
					action: function( editor ) {

						editor.editorsContainer.previewMode = true;

						var preview = $( "<div/>" ).addClass( "editIt-preview" ).hide();
						var tmp = $( "<div/>" ).html( $.editIt.util.getClearContent( editor ) ).addClass( "preview-content" );
						preview.append( tmp );

						var previewEv = $.Event( "editIt-preview" );
						previewEv.content = preview;
						$( d ).trigger( previewEv );

						var closePreview = $.editIt.util.drawButton( "Close", "previewMode-close main-color big", "editIt-icon-close", function() {
							preview.slideUp( 400, function() {
								$( this ).remove();
								$( "body" ).removeClass( "blur" );
							} );

							var opt = editor.editorsContainer.opt;

							$( editor.editorsContainer ).editIt( opt );
						} );

						preview.append( closePreview );

						$( "body" ).after( preview );
						$( "body" ).addClass( "blur" );

						preview.slideDown( 400, function() {
							$.editIt.util.setUneditable( editor.editorsContainer );
						} );

					}
				} );

			},

			enableSourceMode: function() {

				var editor = this;
				var $editor = $( editor );

				var action = function() {

					if( editor.mainButtonBar )
						editor.mainButtonBar.remove();

					$editor.addClass( "inSourceMode" );
					$( "body" ).addClass( "sourceMode" );

					editor.isInSourceMode = true;

					$.editIt.util.setUneditable( editor.editorsContainer );

					var source = $editor.html();

					if( editor.sourceMode )
						editor.sourceMode.remove();

					if( editor.editorsContainer.buttonBar )
						editor.editorsContainer.buttonBar.remove();

					$( "#HTML_" + editor.id ).remove();

					var overlay = $( "<div/>" ).addClass( "editIt-source-overlay" ).css( {
						position: "fixed",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						margin: "auto"
					} );
					var sourceContainer = $( "<div/>" ).addClass( "editIt-source" ).attr( {
						id: "HTML_" + editor.id
					} );
					var textArea = $( "<textarea/>" );
					var closeSwitcher = $.editIt.util.drawButton( "Close", "white align-right", "editIt-icon-close", function() {
						editor.isInSourceMode = false;

						var opt = editor.editorsContainer.opt;
						$( editor.editorsContainer ).editIt( opt );

						$editor.removeClass( "inSourceMode" );
						$( "body" ).removeClass( "inSourceMode" );

						sourceContainer.removeClass( "in" );
						overlay.delay( 10 ).removeClass( "in" );

						setTimeout( function() {
							sourceContainer.remove();
							overlay.remove();
						}, 1000 );

					} );

					textArea.html( source );
					sourceContainer.append( textArea );
					sourceContainer.data( "owner", editor );
					$( "body" ).append( overlay ).append( sourceContainer );

					sourceContainer.prepend( closeSwitcher );

					setTimeout( function() {
						sourceContainer.addClass( "in" );
						overlay.addClass( "in" );
						textArea.focus();
					}, 100 );

					textArea.on( "change mouseup keyup", function() {
						var content = $( this ).val();
						$editor.html( content );

					} );
				};

				if( $( editor.editorsContainer ).is( editor ) ) {

					$.editIt.mainButtonBar.addButton( editor, {
						label: _( "Edit source" ),
						icon: "editIt-icon-code",
						action: function() {
							action()
						}
					} );

				} else {
					editor.sourceMode = $.editIt.util.drawButton( "Edit source", "align-right main-color only-icon", "editIt-icon-code", action );

					if( editor.buttonBar )
						editor.buttonBar.append( editor.sourceMode );
				}
			},

			drawButton: function( label, className, icon, action, data, onlyIcon ) {

				className = className ? " " + className : "";
				icon = icon ? " " + icon : "";
				var button = $( "<button/>" ).attr( {
					label: onlyIcon ? "" : _( label ),
					title: onlyIcon ? _( label ) : ""
				} ).addClass( "editIt-button" + className + icon + ( onlyIcon ? " only-icon" : "" ) );

				if( action )
					button.on( "click", function( e ) {
						action( e )
					} );

				if( data )
					button.data( data.key, data.value );

				return button;

			},

			/**
			 *
			 * @returns {{left: *, top: *}}
			 */
			getSelectionCoords: function() {
				var sel = d.selection,
					range, rect;
				var x = 0,
					y = 0,
					w = 0;

				if( sel ) {

					if( sel.type != "Control" ) {
						range = sel.createRange();
						range.collapse( false );
						x = range.boundingLeft;
						y = range.boundingTop;
						w = range.right - range.left;
					}
				} else if( window.getSelection ) {

					sel = window.getSelection();

					if( sel.rangeCount ) {

						range = sel.getRangeAt( 0 );

						if( range.getClientRects ) {
							if( range.getClientRects().length > 0 ) {
								var r = range.getClientRects();
								x = r[ 0 ].left;
								y = r[ 0 ].top;
								w = r.length == 1 ? r[ 0 ].width : r[ 1 ].width;
								var parentWidth = $( sel.anchorNode.parentNode ).outerWidth();
								if( w > parentWidth )
									w = parentWidth;
							}

						}
					}
				}

				var scrollLeft = $( window ).scrollLeft();
				var scrollTop = $( window ).scrollTop();

				return {
					left: x + scrollLeft,
					top: y + scrollTop,
					width: w
				};

			},
			/**
			 *
			 * @returns {string}
			 */
			getSelectedText: function() {

				if( window.getSelection ) {
					return window.getSelection().toString();
				} else if( d.selection ) {
					return d.selection.createRange().text;
				}

				return '';
			},

			/**
			 *
			 * @returns {string}
			 */
			getSelectedElement: function() {

				var sel, containerNode;

				sel = window.getSelection();

				if( sel.focusNode ) {
					containerNode = sel.focusNode.children ? sel.focusNode.children[ 0 ] : sel.focusNode.actualTag || sel.focusNode.parentNode;
				}

				if( sel.rangeCount > 0 )
					containerNode = sel.getRangeAt( 0 ).commonAncestorContainer;

				while( containerNode ) {

					if( containerNode.nodeType == 1 ) {
						return containerNode;
					}

					containerNode = containerNode.parentNode;
				}
				return false;

			},

			/**
			 *
			 * @param tagName
			 * @returns {*}
			 */
			isSelectionInsideElement: function( tagName ) {

				var sel, containerNode;
				tagName = tagName.toUpperCase();

				sel = window.getSelection();

				if( sel.rangeCount > 0 ) {
					containerNode = sel.getRangeAt( 0 ).commonAncestorContainer;
				}

				if( sel.focusNode ) {
					containerNode = sel.focusNode.children ? sel.focusNode.children[ 0 ] : sel.focusNode.actualTag || sel.focusNode.parentNode;
				}

				while( containerNode ) {

					if( containerNode.nodeType == 1 && ( containerNode.tagName.toUpperCase() == tagName ) ) {
						return containerNode;
					}
					containerNode = containerNode.parentNode;
				}

				return false;
			},
			/**
			 *
			 * @returns {*}
			 */
			saveSelection: function() {
				if( window.getSelection ) {
					sel = window.getSelection();
					if( sel.getRangeAt && sel.rangeCount ) {
						return sel.getRangeAt( 0 );
					}
				} else if( d.selection && d.selection.createRange ) {
					return d.selection.createRange();
				}
				return null;
			},
			/**
			 *
			 * @param range
			 */
			restoreSelection: function( range ) {
				if( range ) {
					if( window.getSelection ) {
						sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange( range );
					} else if( d.selection && range.select ) {
						range.select();
					}
				}
			},
			/**
			 *
			 * @param el
			 */
			selectElementContents: function( el ) {
				var range = d.createRange();
				range.selectNodeContents( el );
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange( range );
			},

			fullScreen: function( editor ) {

				editor.addClass( "full-screen" );

			}

		},

		/**
		 *
		 * @param opt
		 * @param cmnds
		 * @returns {*}
		 */
		init: function( opt, cmnds ) {

			return this.each( function() {

				var self = this;
				var $self = $( self );

				$self.off();

				self.opt = {};
				self.cmnds = {};
				self.editorsContainer = self;

				$.extend( self.opt, $.editIt.defaults, opt );
				$.extend( self.cmnds, $.editIt.commands, cmnds );

				$.editIt.i18n.lang = self.opt.lang;

				if( !self.editItIdx ) {
					self.editItIdx = self.id || "editIt_" + new Date().getTime();
					$.editIt.editors = $.editIt.editors || {};
					$.editIt.editors[ self.editItIdx ] = {};
					$.editIt.editors[ self.editItIdx ].opt = self.opt;
				}

				$.extend( self.opt, $.editIt.editors[ self.editItIdx ].opt );

				$.editIt.mainButtonBar.draw( self );

				if( $self.css( "position" ) == "static" )
					$self.css( "position", "relative" );

				self.opt.textareaName = $self.data( "textarea-name" ) || self.opt.textareaName;

				if( self.opt.textareaName ) {
					if( !$( "textarea[name=" + self.opt.textareaName + "]" ).length ) {
						var textarea = $( "<textarea/>" ).attr( {
							name: self.opt.textareaName,
							id: self.opt.textareaName
						} ).hide();
						$self.after( textarea );
					}
					self.textarea = $( "#" + self.opt.textareaName );
					self.textarea.hide();
				}

				if( self.opt.enableSourceMode )
					$.editIt.util.enableSourceMode.apply( self );

				if( self.opt.enablePreview )
					$.editIt.util.enablePreview.apply( self );

				$( self ).addClass( "editIt-wrapper inEditMode" );

				if( $self.css( "position" ) == "static" )
					$self.css( "position", "relative" );

				var editors = $self.is( "[data-editable]" ) ? $( this ) : $( "[data-editable]", $self );

				editors.each( function() {

					var editor = this;
					var $editor = $( editor );

					// Clear all binded events
					$editor.off();

					if( $editor.css( "position" ) == "static" )
						$editor.css( "position", "relative" );

					editor.buttonBar = $( "<div/>" ).addClass( "editIt-buttonBar" );
					$editor.prepend( editor.buttonBar );

					if( $editor.parents().is( "[data-editable]" ) )
						return;

					if( $editor.data( "enablesourcemode" ) )
						$.editIt.util.enableSourceMode.apply( editor );

					if( !editor.id )
						editor.id = "editIt_" + new Date().getTime();

					editor.editorsContainer = self.editorsContainer;

					$editor.addClass( "editIt" );

					$editor.attr( "contenteditable", true );

					if( self.opt.styleWithCSS )
						d.execCommand( "styleWithCSS", false, null );
					/**
					 * PASTE event
					 */

					$editor.on( "paste", function( e ) {
						$.editIt.util.handlePaste( e, editor );
					} )

					/**
					 * MOUSE down event
					 */
					.on( "mousedown", function( e ) {

						/*
						 if( e.button == 2 ) {
						 e.preventDefault();
						 e.stopPropagation();
						 return false;
						 }
						 */

						editor.actualTag = e.target;

						$( d ).one( "mouseup", function() {
							$editor.trigger( "mouseup" );
						} );

						var mousedownEv = $.Event( "editIt-mousedown" );
						mousedownEv.editor = editor;
						$editor.trigger( mousedownEv );

					} )

					/**
					 * MOUSE UP event
					 */
					.on( "mouseup keyup", function( e ) {

						e.stopPropagation();

						/*
						 if( e.button == 2 ) {
						 e.preventDefault();
						 e.stopPropagation();
						 return false;
						 }
						 */

						clearTimeout( editor.mouseupTimer );

						editor.actualTag = e.target;

						$.editIt.actualEditor = editor.editorsContainer;

						editor.mouseupTimer = setTimeout( function() {

							if( $.editIt.util.getSelectedText().length == 0 ) { //.trim()

								$.editIt.toolBar.clear( editor );

								$( ".editIt-tooltip" ).remove();

								var anchor = editor.actualTag.tagName.toUpperCase() == "A";

								if( anchor ) {
									var anchorLink = editor.actualTag.href;

									$.editIt.tooltip.draw.apply( editor.actualTag, [ editor, "<a href='" + anchorLink + "' target='_blank'>" + anchorLink + "</a>", true ] );
								}

							} else {

								clearTimeout( $.editIt.hidetimer );

								if( !$( ".editIt-dropdown" ).is( ":visible" ) )
									$.editIt.toolBar.draw( editor );

							}

							var mouseupEv = $.Event( "editIt-mouseup" );
							mouseupEv.editor = editor;

							$editor.trigger( mouseupEv );

						}, e.type == "mouseup" ? 50 : 500 )
					} )

					.on( "contextmenu", function( e ) {
						/*
						 e.preventDefault();
						 if( !$( ".editIt-dropdown" ).is( ":visible" ) )
						 return false;
						 */
					} )

					/**
					 * FOCUS event
					 */
					.on( "focus", function() {

						if( editor.editorsContainer.toolBar && editor.editorsContainer.toolBar.is( ":visible" ) )
							clearTimeout( $.editIt.hidetimer );

						$( ".focusedEditor" ).removeClass( "focusedEditor" );
						$( this ).addClass( "focusedEditor" );

						if( editor.buttonBar ) {
							editor.buttonBar.fadeIn( 100 );
						}

						var focusEv = $.Event( "editIt-focus" );
						focusEv.editor = editor;

						$editor.trigger( focusEv );

					} )

					/**
					 * BLUR event
					 */
					.on( "blur", function() {
						$.editIt.hidetimer = setTimeout( function() {

							$.editIt.toolBar.clear( editor );

							if( editor.buttonBar ) {
								editor.buttonBar.fadeOut( 100 );
							}

							$( ".focusedEditor" ).removeClass( "focusedEditor" );

							setTimeout( function() {
								$( ".editIt-tooltip" ).remove();
							}, 30 );

							var blurEv = $.Event( "editIt-blur" );
							blurEv.editor = editor;

							$editor.trigger( blurEv );

						}, 150 );

					} )

					/**
					 * KEYDOWN event
					 */
					.on( "keydown", function( e ) {

						var k = e.keyCode;

						//console.debug(k);

						switch( k ) {

							case 8:
								$.editIt.toolBar.clear( editor );
								break;

							case 13: // return

								var isInsideList = $.editIt.util.isSelectionInsideElement( "OL" ) || $.editIt.util.isSelectionInsideElement( "UL" );
								if( isInsideList ) {
									return;
								}

								e.preventDefault();

								var selection = window.getSelection(),
									range = selection.getRangeAt( 0 ),
									el = d.createElement( "br" ),
									textNode = d.createTextNode( "\u00a0" );

								range.collapse( false );
								range.insertNode( textNode );
								range.insertNode( el );
								range.selectNodeContents( textNode );
								selection.removeAllRanges();
								selection.addRange( range );
								d.execCommand( "forwardDelete", false, null );

								if( !e.shiftKey )
									d.execCommand( "formatBlock", false, "p" );
								break;

							case 65: //A
								if( e.ctrlKey || e.metaKey )
									setTimeout( function() {
										$.editIt.toolBar.draw( editor )
									}, 50 );
								break;

							case 66: //B
								if( e.ctrlKey || e.metaKey ) {
									d.execCommand( "bold", false, null );
									e.preventDefault();
								}
								break;

							case 73: //I
								if( e.ctrlKey || e.metaKey ) {
									d.execCommand( "italic", false, null );
									e.preventDefault();
								}
								break;

							case 85: //U
								if( e.ctrlKey || e.metaKey ) {
									d.execCommand( "underline", false, null );
									e.preventDefault();
								}
								break;

							default:
								$.editIt.toolBar.clear( editor );
								break;
						}

						var keyupEv = $.Event( "editIt-keyup" );
						keyupEv.editor = editor;
						keyupEv.key = k;

						$editor.trigger( keyupEv );

					} )

					.on( "keyup", function() {

						if( self.editorsContainer.opt.textareaName )
							$.editIt.util.updateTextarea( self );
					} )

					/**
					 * MOUSEOVER event
					 */
					.on( "mouseover", function( e ) {

						var hoverElement = e.target;
						var $hoverElement = $( hoverElement );

						if( !$hoverElement.parents( ".focusedEditor" ).length )
							return;

						switch( hoverElement.tagName.toUpperCase() ) {

							case "IMG":
								//console.debug($hoverElement.attr("src"));
								break;

							case "TD":
								//console.debug("TABLE");
								break;

							case "A":
								//console.debug("A");
								$hoverElement.click();
								break;
						}

						editor.hoverTag = hoverElement.tagName.toUpperCase();
						var mouseoverEv = $.Event( "editIt-mouseover" );
						mouseoverEv.editor = editor;
						mouseoverEv.hoverElement = hoverElement;
						$editor.trigger( mouseoverEv );

					} );

				} );

				var initEv = $.Event( "editIt-apply" );
				initEv.editor = self;
				$( d ).trigger( initEv );

				if( self.editorsContainer.opt.textareaName )
					$.editIt.util.updateTextarea( self );

				d.execCommand( "enableInlineTableEditing", false, false );
				d.execCommand( "enableObjectResizing", false, false );

			} )
		}

	};

	$.fn.editIt = $.editIt.init;
	$.fn.sourceMode = $.editIt.sourceMode;

	function getRootPath() {
		var scripts = d.querySelectorAll( 'script[src]' );
		var currentScript = scripts[ scripts.length - 1 ].src;
		var currentScriptChunks = currentScript.split( '/' );
		var currentScriptFile = currentScriptChunks[ currentScriptChunks.length - 1 ];
		var rootPath = currentScript.replace( currentScriptFile, '' ).replace( "inc/", "" );

		return rootPath;
	};

	$.editIt.defaults.path = getRootPath() + "inc/";
	$.editIt.plugins.path = getRootPath() + "plug-ins/";

	$.editIt.i18n.loadfile( $.editIt.defaults );

} )( jQuery, document );

/************************************************************************************* UTILITIES ****/

function _( label, variables ) {
	return $.editIt.i18n.setLabel( label, variables )
};

$.fn.unselectable = function() {
	return this.each( function() {
		$( this ).css( {
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"user-select": "none"
		} ).attr( "unselectable", "on" );
	} );
};

$.fn.selectable = function() {
	return this.each( function() {
		$( this ).css( {
			"-moz-user-select": "text",
			"-webkit-user-select": "text",
			"user-select": "text"
		} ).removeAttr( "unselectable" );
	} );
};

String.prototype.asId = function() {
	return this.replace( /[^a-zA-Z0-9_]+/g, '' );
};
