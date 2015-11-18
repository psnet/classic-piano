/**
 * Classic Piano
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

var MessageSystem = new Class({
	iMsgWindowId: null,
	bDebugEnabled: false,
	/**
	 * ид для таймаута очистки сообщения
	 */
	iTimeOutId: null,
	/**
	 * ms
	 */
	TimeForAutoCleaningWindow: 3500,


	/**
	 * Первичная настройка
	 * @param iMsgWindowId
	 * @param bDebug
	 */
	initialize: function(iMsgWindowId, bDebug) {
		this.iMsgWindowId = iMsgWindowId;
		this.bDebugEnabled = bDebug || false;
	},


	/**
	 * Вывести сообщение
	 *
	 * @param Msg
	 */
	Show: function(Msg) {
		$(this.iMsgWindowId).set('html', Msg.trim());
		this.LaterCleanMessageWindow();
	},


	/**
	 * Очистить экран
	 */
	Clean: function() {
		$(this.iMsgWindowId).set('html', '');
	},


	/**
	 * Отладка
	 *
	 * @param Msg
	 */
	Debug: function(Msg) {
		if (this.bDebugEnabled) {
			this.Show("DEBUG: " + Msg);
		}
	},


	/**
	 * Отложенная очистка экрана
	 */
	LaterCleanMessageWindow: function() {
		var oThis = this;
		clearTimeout(this.iTimeOutId);
		this.iTimeOutId = setTimeout(function() {
			oThis.Clean();
		}, this.TimeForAutoCleaningWindow);
	}

});
