/**
 * Classic Piano
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

var SoundProcessor = new Class({
	Options: {
		Volume: 5,
		URLToSound: 'sounds/',
		WhiteKey_StringID: 'WhiteKey',
		WhiteKey_FileNamesStartsWith: 'sound_w_',
		BlackKey_StringID: 'BlackKey',
		BlackKey_FileNamesStartsWith: 'sound_b_'
	},


	/**
	 * Первичная настройка
	 */
	initialize: function() {
		var oThis = this;

		soundManager.ontimeout(function() {
			// SM2 failed to start - error, unsupported etc.
			piano.LoadingInfo.WriteMessageToLoadScreen(piano.l.g('LoadingSWFModulesFailed'));
		});

		soundManager.onready(function() {
			/**
			 * change default settings for all
			 */
			soundManager.defaultOptions.autoLoad = true;
			soundManager.defaultOptions.whileloading = oThis.whileLoading;
			soundManager.defaultOptions.onload = oThis.onLoad;
			soundManager.defaultOptions.whileplaying = oThis.whilePlaying;
			soundManager.defaultOptions.onfinish = oThis.onFinish;
			soundManager.defaultOptions.volume = oThis.Options.Volume;
			//soundManager.defaultOptions.multiShot = false;

			/**
			 * звуки для белых клавиш
			 */
			for (var ic = 0; ic < piano.KeyboardPCControls_WhiteKeys.length; ic ++) {
				soundManager.createSound(
					oThis.Options.WhiteKey_StringID + ic,
					oThis.Options.URLToSound + oThis.Options.WhiteKey_FileNamesStartsWith + ic + '.mp3'
				);
			}
			/**
			 * звуки для черных клавиш
			 */
			for (ic = 0; ic < piano.KeyboardPCControls_BlackKeys.length; ic ++) {
				soundManager.createSound(
					oThis.Options.BlackKey_StringID + ic,
					oThis.Options.URLToSound + oThis.Options.BlackKey_FileNamesStartsWith + ic + '.mp3'
				);
			}
		});
	},


	/**
	 * Хендлер процесса загрузки аудио
	 */
	whileLoading: function() {

	},


	/**
	 * Хендлер загрузки одного аудио
	 *
	 * @param bSuccess
	 */
	onLoad: function(bSuccess) {
		/**
		 * трек загружен успешно
		 */
		if (bSuccess) {
			piano.LoadingInfo.UpdateLoadstatus();
		} else {
			piano.LoadingInfo.WriteMessageToLoadScreen(piano.l.g('FailedLoadingFile'));
		}
	},


	/**
	 * Хендлер процесса воспроизведения аудио
	 */
	whilePlaying: function() {

	},


	/**
	 * Хендлер окончания воспроизведения аудио
	 */
	onFinish: function() {

	}

});
