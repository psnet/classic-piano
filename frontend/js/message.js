/**
 * Classic Piano
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 */

var MessageSystem = new Class({
	iMsgWindowId: null,
	bDebugEnabled: false,
	/**
	 * id for message clear timeout
	 */
	iTimeOutId: null,
	/**
	 * ms
	 */
	TimeForAutoCleaningWindow: 3500,


	/**
	 * Init
	 * 
	 * @param iMsgWindowId
	 * @param bDebug
	 */
	initialize: function (iMsgWindowId, bDebug) {
		this.iMsgWindowId = iMsgWindowId;
		this.bDebugEnabled = bDebug || false;
	},


	/**
	 * Display message
	 *
	 * @param Msg
	 */
	Show: function (Msg) {
		$(this.iMsgWindowId).set('html', Msg.trim());
		this.LaterCleanMessageWindow();
	},


	/**
	 * Clear display
	 */
	Clean: function () {
		$(this.iMsgWindowId).set('html', '');
	},


	/**
	 * Debug
	 *
	 * @param Msg
	 */
	Debug: function (Msg) {
		if (this.bDebugEnabled) {
			this.Show("DEBUG: " + Msg);
		}
	},


	/**
	 * Delayed screen clearing
	 */
	LaterCleanMessageWindow: function () {
		var oThis = this;

		clearTimeout(this.iTimeOutId);

		this.iTimeOutId = setTimeout(function () {
			oThis.Clean();
		}, this.TimeForAutoCleaningWindow);
	}

});
