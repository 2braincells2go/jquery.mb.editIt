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


(function ($) {
	var variablesReplace = {

		name       : "variablesReplace",
		description: "Replace variables with the corresponding cliententry. ",
		version    : "1.0",
		author     : "Pupunzi",

		command: {
			label : _("Insert Variable"),
			icon  : "editIt-icon-crosshairs",
			type  : "plugin",
			action: function (editor) {

				$.get(variablesReplace.path + "/prompt.html?_=" + new Date().getTime(), function (html) {

					$.editIt.prompt.draw(editor, html, variablesReplace, function (data) {
						document.execCommand( 'insertText', false, "%%" + data[ "variable-name" ] + "%%");

					});
				});
			}
		},

		variables: {
			variableA : "Some custom content 1",
			variableB : "Some custom content 2"
		},

		getVariables: function(){
			var ks = [];
			for (var v in this.variables) {
				ks.push(v);
			}

			return ks;
		},

		activate: function () {

			console.debug("Activate:: ", this);

			var plugin = this;
			$.editIt.commands.extend("variablesReplace", this.command);

			$('<link/>', {rel: 'stylesheet', href: this.path + "/style.css", id: "style_" + this.name}).appendTo('head');

			$(document).on("editIt-apply", function (e) {plugin.update.apply(plugin, [e]);});
			$(document).on("editIt-remove", function (e) {plugin.destroy.apply(plugin, [e]);});
			$(document).on("editIt-preview", function (e) {
				var c = plugin.replace(e.content.html(), plugin.variables);
				e.content.html(c);
			});

		},
		update  : function (e) {
			var plugin = this;
		},

		destroy: function (e) {},

		replace: function(txt, vars){

			var replacer = function (str){
				str = str.replace(/%%/g, "" );

				var input = $("[name=" + str + "]");
				var val = input.length ? input.val() :  vars[str];

				return val;

			};

			/* var extract = str.match(/%%(.*)%%/).pop(); */
			return txt.replace(/%%[^>]+%%/g, replacer);

		},

		i18n: {
			"it-IT": {
				"Insert Variable" : "Inserisci una variabile",

				// i18n for prompt
				"Choose the variable:": "Scegli una variabile da inserire:",
				"There're no available variables." : "Non ci sono variabili da utilizzare."

			}
		}

	};

	$.editIt.plugins.register(variablesReplace);


})(jQuery);



