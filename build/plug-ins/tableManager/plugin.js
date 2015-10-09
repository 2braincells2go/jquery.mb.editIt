(function ($, d) {
	var tableManager = {

		name       : "tableManager",
		description: "Manipulate tables inside a content editable",
		version    : "1.0",
		author     : "Pupunzi",

		activate: function () {

			var plugin = this;
			console.debug("Activate:: ", plugin);

			$('<link/>', {rel: 'stylesheet', href: this.path + "/style.css", id: "style_" + this.name}).appendTo('head');

			$(d).on("editIt-apply", function (e) {
				var editor = e.editor;
				var defaultToolBar = editor.editorsContainer.opt.toolBar;

				$.editIt.commands.extend(plugin.commands);
				$.editIt.toolBar.extend(defaultToolBar, "table",22);
				plugin.update.apply(plugin, [e]);

			});

			$(d).on("editIt-remove", function () {
				plugin.destroy.apply(plugin);
			});



		},

		update  : function (e) {

			var plugin = this;

			$(d).on("editIt-mousedown.table", function (e) {

				var editor = $(plugin.actualTag).parents("[data-editable]");

				plugin.actualTag = e.editor.actualTag || plugin.hoverElement;

				if(plugin.actualTag && plugin.actualTag.tagName.toUpperCase() == "TD"){
					plugin.actualTable = $(plugin.actualTag).parents("table");
					editor.actualSelection = $.editIt.util.saveSelection();
					plugin.actualTable.find("td, th").unselectable();
					$(plugin.actualTag).selectable();

				} else if(plugin.actualTable)
					plugin.cleanUp(plugin.actualTable);

			});

			$(d).on("editIt-blur.table", function(e){

				if (e.editor.actualTag.tagName.toUpperCase() == "TD")
					return;

//				plugin.cleanUp(plugin.actualTable);

			});

			$(d).on("editIt-mouseover.table", function (e) {
				plugin.hoverElement = e.hoverElement;
			});

			function moveToTD(x) {

				var editor = $(plugin.actualTag).parents("[data-editable]");
				var el = plugin.actualTable.find("td");

				if(x<0)
					return;

				if(!el.eq(x).length){
					plugin.commands.addRowBelow.action(editor);
					el = plugin.actualTable.find("td")
				}

				plugin.actualTable.find("td").selectable();
				var range = d.createRange();
				var sel = window.getSelection();
				var refNode = el.eq(x).get(0);
				range.setStart(refNode, 0);
				range.collapse(true);
				range.selectNodeContents(refNode);
				sel.removeAllRanges();
				sel.addRange(range);

				el.eq(x).focus();

				plugin.actualTag = refNode;
				plugin.actualTable.find("td, th").unselectable();
				$(plugin.actualTag).selectable();

			}

			$(d).off("keydown.table").on("keydown.table", function(e){
				var k = e.keyCode;

				if( $(plugin.actualTag).is("td")){

					switch( k ) {

						case 9:
							e.preventDefault();
							var idx = plugin.actualTable.find("td").index($(plugin.actualTag));
							var x = e.shiftKey ? idx-1 : idx+1;
							moveToTD(x);
							break;
					}
				}
			})

		},

		destroy: function () {

			var plugin = this;

			// Unbind update events
			$(d).off("editIt-mouseover.table");
			$(d).off("editIt-mousedown.table");
			$(d).off("editIt-remove.table");

		},

		cleanUp: function(table){
			table.find("td").removeAttr("style").removeAttr("unselectable");
		},

		commands: {
			table: {
				label       : _("Table"),
				icon        : "editIt-icon-table",
				type        : "dropdown",
				action      : function (editor) {
					var elements = [ "addTable", "deleteTable", "-", "addRowAbove", "addRowBelow", "removeRow", "-", "addColBefore", "addColAfter", "removeCol" ];
					$.editIt.dropDown.draw.apply(this, [ editor, elements ]);
				}
			},

			addRowAbove: {
				label : _("Add row︎"),
				icon  : "editIt-icon-sort-asc",
				availableFor: "TABLE",
				action: function (editor) {
					var tr = $(tableManager.actualTag).parents("tr");
					var newRow = tr.clone();
					newRow.find("td").empty().html("&nbsp;");
					tr.before(newRow);
					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			addRowBelow: {
				label : _("Add row︎"),
				availableFor: "TABLE",
				icon  : "editIt-icon-sort-desc",
				action: function (editor) {
					var tr = $(tableManager.actualTag).parents("tr");
					var newRow = tr.clone();
					newRow.find("td").empty().html("&nbsp;");
					tr.after(newRow);
					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			removeRow: {
				label : _("Remove row︎"),
				availableFor: "TABLE",
				icon  : "editIt-icon-close",
				action: function (editor) {
					var tr = $(tableManager.actualTag).parents("tr");
					tr.remove();
					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			addColBefore: {
				label : _("Add column"),
				availableFor: "TABLE",
				icon  : "editIt-icon-caret-left",
				action: function (editor) {
					var table = $(tableManager.actualTag).parents("table");
					var idx = $(tableManager.actualTag).index();

					table.find("tr, th, tf").each(function () {
						var td = $(this).find("td").eq(idx).clone().html("&nbsp;");
						$(this).find("td").eq(idx).before(td);
					});

					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			addColAfter: {
				label : _("Add column"),
				availableFor: "TABLE",
				icon  : "editIt-icon-caret-right",
				action: function (editor) {
					var table = $(tableManager.actualTag).parents("table");
					var idx = $(tableManager.actualTag).index();

					table.find("tr, th, tf").each(function () {
						var td = $(this).find("td").eq(idx).clone().html("&nbsp;");
						$(this).find("td").eq(idx).after(td);
					});

					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			removeCol: {
				label : _("remove column"),
				availableFor: "TABLE",
				icon  : "editIt-icon-close",
				action: function (editor) {
					var table = $(tableManager.actualTag).parents("table");
					var idx = $(tableManager.actualTag).index();

					table.find("tr, th, tf").each(function () {
						$(this).find("td").eq(idx).remove();
					});

					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			addTable: {
				label : _("Add table"),
				icon  : "editIt-icon-plus",
				action: function (editor) {
					$.get(tableManager.path + "/add-table-prompt.html?_=" + new Date().getTime(), function (html) {
						var main_editor = editor.editorsContainer;
						$.editIt.prompt.draw(main_editor, html, tableManager, function (data) {

							var rows = data.rows;
							var columns = data.columns;
							var hasHeader = data.header;

							var tmp = $("<div/>");
							var table = $("<table/>");
							tmp.append(table);

							if (hasHeader){

								var header = $("<thead/>");
								table.append(header);
								var trH = $("<tr/>");

								header.append(trH);

								for (var c = 0; c < columns; c++){
									var tdH = $("<td/>").html("&nbsp;");
									trH.append(tdH);
								}

							}

							for (var a = 0; a<rows; a++){

								var tr = $("<tr/>");
								table.append(tr);

								for (var b = 0; b<columns; b++){

									var td = $("<td/>").html("&nbsp;");
									tr.append(td);

								}

							}

							tmp.append("<br>")

							var text = tmp.html();

							d.execCommand( "insertHTML", false, text );

						});
					});

					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			},

			deleteTable: {
				label : _("Delete table"),
				icon  : "editIt-icon-close",
				availableFor: "TABLE",
				action: function (editor) {
					var main_editor = editor.editorsContainer;
					$.editIt.prompt.draw(main_editor, _( "<h2>Are you sure you want to delete this table?</h2>" ), tableManager, function (data) {

						var table = $(tableManager.actualTag).parents("table");
						table.remove();

					});

					$.editIt.util.restoreSelection(editor.actualSelection);
				}
			}
		},

		i18n: {
			"it-IT": {
				"Table"        : "Tabella",
				"Add row︎"      : "Aggiungi riga",
				"Remove row︎"   : "Elimina riga︎",
				"Add column"   : "Aggiungi colonna",
				"remove column": "Rimuovi colonna",
				"Add table"    : "Aggiungi tabella",
				"Delete table" : "Elimina tabella",
				"<h2>Are you sure you want to delete this table?</h2>": "<h2>Sei sicuro di voler eliminare questa tabella?</h2>",

				// i18n for add-table-prompt
				"Add a table"            : "Aggiungi una tabella",
				"Select rows and column:": "Seleziona righe e colonne:",
				"Add header"             : "Aggiungi una intestazione",
				"How many rows?"         : "Quante righe?",
				"How many columns?"      : "Quante colonne?",
				"%% rows and %% columns" : "%% righe e %% colonne"

			}
		}

	};

	$.editIt.plugins.register(tableManager);


})(jQuery, document);



