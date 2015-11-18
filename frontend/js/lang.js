/**
 * Classic Piano
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

var Lang = new Class({

	/**
	 * Где хранятся все текстовки в разрезе ключа языка
	 */
	lang_texts: {},
	/**
	 * Текущий язык
	 */
	current: null,


	/**
	 * Первичная настройка
	 *
	 * @param lang_texts
	 * @param lang_current
	 */
	initialize: function(lang_texts, lang_current) {
		this.lang_texts = lang_texts || {};
		this.current = lang_current || 'en';
	},


	/**
	 * Заполнить плейсхолдеры
	 *
	 * @param str
	 * @param replace
	 * @return string
	 */
	fillPlaceholders: function(str, replace) {
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
	 * Получить текстовку
	 *
	 * @param id
	 * @param replace
	 * @return {string}
	 */
	get: function(id, replace) {
		if (this.lang_texts.hasOwnProperty(this.current) && this.lang_texts[this.current].hasOwnProperty(id)) {
			return this.fillPlaceholders(this.lang_texts[this.current][id], replace);
		}
		return 'Unknown id "' + id + '" for language "' + this.current + '"';
	},


	/**
	 * Алиас для получения текстовки
	 *
	 * @return {string}
	 */
	g: function() {
		return this.get.apply(this, arguments);
	}

});

