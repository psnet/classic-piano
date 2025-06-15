/**
 * Classic Piano
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 */

/**
 * Texts
 */
var LangSources = {
	'en': {
		Not_English_Language: 'Unsupported key',
		Loading_Done: 'Loading complete',
		FailedLoadingFile: 'Can\'t load file',
		LoadingSWFModulesFailed: 'Can\'t load additional modules',
		Volume: 'Volume: %%val%%%',
		AllComplete: 'Initialiation complete. Let\'s make some noise :)',
		LoadingWhiteKeys: 'Loading data for white keys...',
		LoadingBlackKeys: 'Loading data for black keys...',
		ShowHelp: 'Showing keyboard key help',
		HideHelp: 'Keyboard help closed',
		WhiteKeyNum: 'White key "%%num%%"',
		BlackKeyNum: 'Black key "%%num%%"'
	}
};

/**
 * Helpers
 */
var piano = (function ($) {

	/**
	 * 21 keys = 3 octaves * 7 keys
	 */
	this.KeyboardPCControls_WhiteKeysLetters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];
	this.KeyboardPCControls_WhiteKeys = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191];
	/**
	 * 15 keys = 3 octaves * 5 keys
	 */
	this.KeyboardPCControls_BlackKeysLetter = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', '1', '2'];
	this.KeyboardPCControls_BlackKeys = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 49, 50];

	/**
	 * texts
	 */
	this.l = null;
	/**
	 * display
	 */
	this.Msg = null;
	/**
	 * sound
	 */
	this.LiveSoundProcessor = null;
	/**
	 * loading progress
	 */
	this.LoadingInfo = null;
	/**
	 * mouse button press status
	 */
	this.isMouseDown = false;


	/**
	 * Get key id by type and id (number)
	 *
	 * @param sType		type ('white', 'black')
	 * @param sId		id
	 * @return string
	 */
	this.GetKeyId = function (sType, sId) {
		if (sType == 'white' || sType == 'black') {
			return this.LiveSoundProcessor.Options[sType == 'white' ? 'WhiteKey_StringID' : 'BlackKey_StringID'] + sId;
		}

		throw new Error('Unknown type to get id "' + sType + '"');
	};


	/**
	 * Translate keycode into sound
	 *
	 * @param CurrentKeyCode		code
	 * @param ActionType			pressed / unpressed
	 * @return bool|string
	 */
	this.MadeTranslitPCKeyboardToPiano = function (CurrentKeyCode, ActionType) {
		var WhiteButtonOrder = this.GetPCButtonOrder(CurrentKeyCode, this.KeyboardPCControls_WhiteKeys);
		var BlackButtonOrder = this.GetPCButtonOrder(CurrentKeyCode, this.KeyboardPCControls_BlackKeys);

		if (WhiteButtonOrder !== false) {
			if (ActionType == 'keydown') {
				this.MadeSoundFromWhiteKey(WhiteButtonOrder);
			} else if (ActionType == 'keyup') {
				this.StopSoundFromWhiteKey(WhiteButtonOrder);
			}
		} else if (BlackButtonOrder !== false) {
			if (ActionType == 'keydown') {
				this.MadeSoundFromBlackKey(BlackButtonOrder);
			} else if (ActionType == 'keyup') {
				this.StopSoundFromBlackKey(BlackButtonOrder);
			}
		} else {
			return this.Msg.Show(this.l.g('Not_English_Language'));
		}

		return true;
	};


	/**
	 * Get the key sequence number
	 *
	 * @param PCButtonCode
	 * @param ButtonsToKeysArray
	 * @return bool|int
	 */
	this.GetPCButtonOrder = function (PCButtonCode, ButtonsToKeysArray) {
		for (var ic = 0; ic < ButtonsToKeysArray.length; ic++) {
			if (ButtonsToKeysArray[ic] == PCButtonCode) {
				return ic;
			}
		}

		return false;
	};


	/**
	 * Play white key sound
	 *
	 * @param KeyNumber
	 */
	this.MadeSoundFromWhiteKey = function (KeyNumber) {
		$(this.GetKeyId('white', KeyNumber)).addClass('active-key');
		this.Msg.Show(this.l.g('WhiteKeyNum', { num: this.KeyboardPCControls_WhiteKeysLetters[KeyNumber].toUpperCase() }));
		soundManager.play(this.LiveSoundProcessor.Options.WhiteKey_StringID + KeyNumber, { volume: this.LiveSoundProcessor.Options.Volume });
	};


	/**
	 * Stop white key sound
	 *
	 * @param KeyNumber
	 */
	this.StopSoundFromWhiteKey = function (KeyNumber) {
		$(this.GetKeyId('white', KeyNumber)).removeClass('active-key');
		//soundManager.stop(LiveSoundProcessor.Options.WhiteKey_StringID + KeyNumber);
	};


	/**
	 * Play black key sound
	 *
	 * @param KeyNumber
	 */
	this.MadeSoundFromBlackKey = function (KeyNumber) {
		$(this.GetKeyId('black', KeyNumber)).addClass('active-key');
		this.Msg.Show(this.l.g('BlackKeyNum', { num: this.KeyboardPCControls_BlackKeysLetter[KeyNumber].toUpperCase() }));
		soundManager.play(this.LiveSoundProcessor.Options.BlackKey_StringID + KeyNumber, { volume: this.LiveSoundProcessor.Options.Volume });
	};


	/**
	 * Stop black key sound
	 *
	 * @param KeyNumber
	 */
	this.StopSoundFromBlackKey = function (KeyNumber) {
		$(this.GetKeyId('black', KeyNumber)).removeClass('active-key');
		//soundManager.stop(LiveSoundProcessor.Options.BlackKey_StringID + KeyNumber);
	};

	return this;

}).call(piano || {}, $);


window.addEvent('domready', function () {

	piano.l = new Lang(LangSources);

	/**
	 * display
	 */
	piano.Msg = new MessageSystem('js-info-window', true);

	/**
	 * sound loader
	 */
	piano.LoadingInfo = new LoaderInfo([
		{ 'data': piano.KeyboardPCControls_WhiteKeys, 'msg': piano.l.g('LoadingWhiteKeys') },
		{ 'data': piano.KeyboardPCControls_BlackKeys, 'msg': piano.l.g('LoadingBlackKeys') }
	], piano.l.g('Loading_Done'), function () {
		piano.Msg.Show(piano.l.g('AllComplete'))
	});

	/**
	 * sound
	 */
	piano.LiveSoundProcessor = new SoundProcessor();

	/**
	 * global mouse click listener
	 */
	document.addEvent('mousedown', function (e) {
		piano.isMouseDown = true;
	}).addEvent('mouseup', function (e) {
		piano.isMouseDown = false;
	});

	/**
	 * mouse click on white keys
	 */
	var KeyboardWhiteControls = $$('.js-white-key');
	var KeyboardWhiteLength = KeyboardWhiteControls.length;

	for (var ic = 0; ic < KeyboardWhiteLength; ic++) {
		KeyboardWhiteControls[ic].KeyLogicNumber = ic;
		KeyboardWhiteControls[ic].id = piano.GetKeyId('white', ic);

		KeyboardWhiteControls[ic].onmouseover = function () {
			if (piano.isMouseDown) {
				piano.MadeSoundFromWhiteKey(this.KeyLogicNumber);
			}
		};
		KeyboardWhiteControls[ic].onmousedown = function () {
			piano.MadeSoundFromWhiteKey(this.KeyLogicNumber);
		};
		KeyboardWhiteControls[ic].onmouseout = function () {
			piano.StopSoundFromWhiteKey(this.KeyLogicNumber);
		};
		KeyboardWhiteControls[ic].onmouseup = function () {
			piano.StopSoundFromWhiteKey(this.KeyLogicNumber);
		};
	}

	/**
	 * mouse click on black keys
	 */
	var KeyboardBlackControls = $$('.js-black-key');
	var KeyboardBlackLength = KeyboardBlackControls.length;

	for (ic = 0; ic < KeyboardBlackLength; ic++) {
		KeyboardBlackControls[ic].KeyLogicNumber = ic;
		KeyboardBlackControls[ic].id = piano.GetKeyId('black', ic);

		KeyboardBlackControls[ic].onmouseover = function () {
			if (piano.isMouseDown) {
				piano.MadeSoundFromBlackKey(this.KeyLogicNumber);
			}
		};
		KeyboardBlackControls[ic].onmousedown = function () {
			piano.MadeSoundFromBlackKey(this.KeyLogicNumber);
		};
		KeyboardBlackControls[ic].onmouseout = function () {
			piano.StopSoundFromBlackKey(this.KeyLogicNumber);
		};
		KeyboardBlackControls[ic].onmouseup = function () {
			piano.StopSoundFromBlackKey(this.KeyLogicNumber);
		};
	}

	/**
	 * keyboard presses
	 */
	function KeyboardControlService(Event) {
		if (!Event.control && !Event.shift && piano.MadeTranslitPCKeyboardToPiano(Event.code, Event.type) === true) {
			Event.stop();
		}
	}

	document.addEvents({ 'keydown': KeyboardControlService, 'keyup': KeyboardControlService });

	/**
	 * volume control
	 */
	new RoundedFader($('js-volume-fader'), 0, 100, piano.LiveSoundProcessor.Options.Volume, function (iNewVolume) {
		piano.Msg.Show(piano.l.g('Volume', { val: iNewVolume }));
		piano.LiveSoundProcessor.Options.Volume = iNewVolume;
		soundManager.setVolume(iNewVolume);
	}, 'metal-knob');

	/**
	 * key help regulator
	 */
	new RoundedFader($('js-key-help-switch'), 0, 1, 0, function (iEnabled) {
		if (iEnabled) {
			piano.Msg.Show(piano.l.g('ShowHelp'));
			piano.KeyboardPCControls_WhiteKeys.forEach(function (i, k) {
				new Element('div', { class: 'key-helper on-white-key js-key-helper', 'html': piano.KeyboardPCControls_WhiteKeysLetters[k] }).inject(piano.GetKeyId('white', k));
			});
			piano.KeyboardPCControls_BlackKeys.forEach(function (i, k) {
				new Element('div', { class: 'key-helper on-black-key js-key-helper', 'html': piano.KeyboardPCControls_BlackKeysLetter[k] }).inject(piano.GetKeyId('black', k));
			});
		} else {
			piano.Msg.Show(piano.l.g('HideHelp'));
			$$('.js-key-helper').destroy();
		}
	}, 'metal-knob keys-help');

});


soundManager.url = 'frontend/vendor/soundmanager2/';
soundManager.useHTML5Audio = true;
soundManager.useFlashBlock = false;

soundManager.debugMode = false;
soundManager.debugFlash = false;

soundManager.flashVersion = 9;
soundManager.useHighPerformance = true; // if false { left: -9999px; top: -9999px; }

soundManager.waitForWindowLoad = false;
soundManager.flashLoadTimeout = 2000;
soundManager.wmode = 'transparent';
