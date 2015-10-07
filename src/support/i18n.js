
/**
 *
 * Description:
 * Internationalization for editIt
 *
 *
 *
 **/

$.editIt.i18n = {};

/**
 *
 * @type Object
 *
 * labels it-IT
 */
$.editIt.i18n["it-IT"] =  {
	"<b>Attention!</b><br><br> Images insertion has been disabled in this editor.<br><br> <b>%%</b> images have been removed from the pasted source." : "<b>Attenzione!</b><br><br> L'inserimento di immagini è disabilitato.<br>Sono state rimosse <b>%%</b> immagini dal codice incollato.",
	"Edit source"                  : "Edita il sorgente",
	"Redo"                         : "Rifai",
	"Undo"                         : "Annulla",
	"Bold"                         : "Grassetto",
	"Italic"                       : "Corsivo",
	"Underline"                    : "Sottolineato",
	"Stroke"                       : "Barrato",
	"Clear"                        : "Ripulisci",
	"Link"                         : "Link",
	"Justify"                      : "Giustificato",
	"Center"                       : "Centrato",
	"Left"                         : "Allineato a sinistra",
	"Right"                        : "Allineato a destra",
	"Unlink"                       : "Unlink",
	"Paragraph"                    : "Paragrafo",
	"Title H1"                     : "Titolo H1",
	"Title H2"                     : "Titolo H2",
	"Title H3"                     : "Titolo H3",
	"Title H4"                     : "Titolo H4",
	"Paragraph P"                  : "Paragrafo P",
	"Blockquote"                   : "Citazione",
	"Ordered list"                 : "Lista ordinata",
	"Unordered list"               : "Lista",
	"Indent"                       : "Indenta",
	"Outdent"                      : "Elimina indentatura",
	"Preview"                      : "Anteprima",
	"Close"                        : "Chiudi",
	"Apply"                        : "Applica",
	"Cancel"                       : "Cancella",
	"Delete"                       : "Elimina",
	"Write here the URL for:"      : "Inserisci qui la URL per:",
	"Open the link in a new window": "Apri il link in una nuova finestra"

};

/*
$.editIt.i18n.extend = function(lang, labels){

	if(!$.editIt.i18n[lang])
		$.editIt.i18n[lang] = {};

	$.extend($.editIt.i18n[lang], labels);

};
*/


$.editIt.i18n.extend = function(obj){

	for (var lang in obj) {

		$.extend($.editIt.i18n[lang], obj[lang]);

	}

};

function _(label, variables){
	var i18n = $.editIt.i18n;
	var lang = i18n.default_lang || (navigator.language || navigator.userLanguage);
	var trans = label;

	if(i18n[lang] && i18n[lang][label]){
		trans = i18n[lang][label];
	}

	if (variables){

		for (var x in variables) {
			trans = trans.replace("%%", variables[x]);
		}

	}

	return trans;
};
