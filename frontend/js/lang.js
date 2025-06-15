/**
 * Classic Piano
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 */

var Lang = new Class({

	/**
	 * Texts stored in terms of the language key
	 */
	lang_texts: {},
	/**
	 * Current language
	 */
	current: null,


	/**
	 * Init
	 *
	 * @param lang_texts
	 * @param lang_current
	 */
	initialize: function (lang_texts, lang_current) {
		this.lang_texts = lang_texts || {};
		this.current = lang_current || 'en';
	},


	/**
	 * Fill placeholders
	 *
	 * @param str
	 * @param replace
	 * @return string
	 */
	fillPlaceholders: function (str, replace) {
		if (typeof replace == 'object') {
			for (var key in replace) {
				if (replace.hasOwnProperty(key)) {
					switch (typeof replace[key]) {
						case 'object':
							str = this.fillPlaceholders(str, replace[key]);

							break;

						default:
							str = str.replace(new RegExp('%%' + key + '%%', 'g'), replace[key]);
					}
				}
			}
		}

		return str;
	},


	/**
	 * Get the text
	 *
	 * @param id
	 * @param replace
	 * @return {string}
	 */
	get: function (id, replace) {
		if (this.lang_texts.hasOwnProperty(this.current) && this.lang_texts[this.current].hasOwnProperty(id)) {
			return this.fillPlaceholders(this.lang_texts[this.current][id], replace);
		}

		return 'Unknown id "' + id + '" for language "' + this.current + '"';
	},


	/**
	 * Alias ​​for receiving text
	 *
	 * @return {string}
	 */
	g: function () {
		return this.get.apply(this, arguments);
	}

});
