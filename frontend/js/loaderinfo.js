/**
 * Classic Piano
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

var LoaderInfo = new Class({

	TotalObjectsForLoading: 0,
	CurrentObjectsLoaded: 0,
	ArrayDataWithMessages: [],
	AllDoneMessage: '',
	LoadingCompleteFunction: function() {},

	/**
	 * Первичная настройка
	 *
	 * @param RunOnObjects
	 * @param DoneMsg
	 * @param LoadingCompleteFunction
	 */
	initialize: function(RunOnObjects, DoneMsg, LoadingCompleteFunction) {
		for (var ic = 0; ic < RunOnObjects.length; ic ++) {
			this.TotalObjectsForLoading += RunOnObjects[ic]['data'].length;
			this.ArrayDataWithMessages.push({'limit': this.TotalObjectsForLoading, 'msg': RunOnObjects[ic]['msg']});
		}
		this.AllDoneMessage = DoneMsg;
		this.LoadingCompleteFunction = LoadingCompleteFunction;
		this.MakeLoadingWidget();
	},


	/**
	 * Добавить виджет загрузчика на экран
	 */
	MakeLoadingWidget: function() {
		var Container = new Element('div', {'class': 'container'});

		new Element('div', {'id': 'js-loading-bar-line-bg', 'class': 'loading-bar-line-bg'}).inject(new Element('div', {'class': 'loading-line'}).inject(Container));
		new Element('div', {'id': 'js-info-message', 'class': 'info-message'}).inject(Container);

		Container.inject(new Element('div', {'id': 'js-loading-info-screen', 'class': 'loading-info-screen'}).inject(document.body));
	},


	/**
	 * Обновить статус загрузки
	 *
	 * @return {boolean}
	 */
	UpdateLoadstatus: function() {
		this.CurrentObjectsLoaded ++;
		var NewPercentageLoaded = parseInt((this.CurrentObjectsLoaded * 100) / this.TotalObjectsForLoading);
		if (NewPercentageLoaded > 100) return false;
		$('js-loading-bar-line-bg').set('html', NewPercentageLoaded + ' %').setStyle('width', NewPercentageLoaded + '%');
		this.UpdateMessageStatus();
		if (NewPercentageLoaded == 100) {
			this.FadeScreenAndClose();
			this.WriteMessageToLoadScreen(this.AllDoneMessage);
			this.LoadingCompleteFunction();
		}
		return true;
	},


	/**
	 * Вывести сообщение на экран виджета
	 *
	 * @param NewMsg
	 */
	WriteMessageToLoadScreen: function(NewMsg) {
		$('js-info-message').set('html', NewMsg);
	},


	/**
	 * Обновить сообщение статуса загрузки
	 */
	UpdateMessageStatus: function() {
		var NewOutputMsgString = '';
		var CurrentArrayLength = this.ArrayDataWithMessages.length;
		if (CurrentArrayLength == 0) {
			return;
		}
		for (var ic = CurrentArrayLength - 1; ic >= 0; ic --) {
			if (this.CurrentObjectsLoaded < this.ArrayDataWithMessages[ic]['limit']) {
				NewOutputMsgString = this.ArrayDataWithMessages[ic]['msg'];
			}
		}
		this.WriteMessageToLoadScreen(NewOutputMsgString);
	},


	/**
	 * Закрыть виджет загрузки
	 */
	FadeScreenAndClose: function() {
		$('js-loading-info-screen').tween('opacity', 0);
		setTimeout(function() {
			$('js-loading-info-screen').setStyle('display', 'none');
		}, 2000);
	}

});
