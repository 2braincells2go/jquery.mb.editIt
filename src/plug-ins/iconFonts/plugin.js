
(function(){
	var iconFont = {

		name:"iconFont",
		description:"",
		version: "1.0",
		author:"Pupunzi",

		command: {
			label : _("Add emoticon"),
			icon  : "emoticons-smile",
			type  : "dropdown",
			action: function (editor) {
				var elements = ["h1", "h2", "h3", "h4", "p"];
				$.editIt.dropDown.draw.apply(this, [editor, elements]);
			}
		},

		activate: function(){

			console.debug("Activate:: ", this);

			var plugin = this;

			$.editIt.commands.extend("iconfont", this.command);

			$('<link/>', {rel: 'stylesheet', href: this.path + "/emoticons/style.css", id: "style_" + this.name}).appendTo('head');

			$(document).on("editIt-mouseup." + iconFont.name, function(e){});

			$.editIt.i18n.extend(plugin.i18n);

		},

		i18n: {
			"it-IT" : {
				"Add emoticon": "Aggiungi un'emoticon"
			}
		}

	};

	$.editIt.plugins.register(iconFont,true);

})();



