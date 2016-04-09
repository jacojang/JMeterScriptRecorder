var self = require('sdk/self');
var events = require("sdk/system/events");
var observer = require("lib/observer");
var db = require("lib/db");
var prefs = require('sdk/simple-prefs');
var tabs = require("sdk/tabs");
var { ActionButton } = require("sdk/ui/button/action");
var ctx = {
	db:db,
	prefs:prefs.prefs,
	configTab:null,
	tabWorker:null,
	datas:[]
};

// Make a button to enable recording function
var button = ActionButton({
	id: "jmeterscriptrecoder",
	label: "JMeterSR",
	icon: {
		"16": "./firefox-16.png",
		"32": "./firefox-32.png"
	},
	onClick: function(state) {
		if(ctx.configTab){
			ctx.configTab.activate();
		}else{
			tabs.open({
				url: self.data.url("config.html"),
				onOpen:function onOpen(tab) {
					tab.on('ready',function(t){
						ctx.configTab = t;
						ctx.tabWorker = t.attach({
							contentScriptFile:self.data.url('config.js'),
						});

						ctx.tabWorker.port.emit('init',ctx);
						ctx.tabWorker.port.on("save",function() {
							ctx.tabWorker.port.emit('save',ctx);
						});
						ctx.tabWorker.port.on("updatePrefs",function(data) {
						});
						ctx.tabWorker.port.on('updateStartStop', function(flag) {
							if (flag === 'Start'){
								// Start Recording
								ctx.prefs['run'] = false;
								ctx.tabWorker.port.emit('updateStartStop','Start');
							} else {
								// Stop Recording
								ctx.prefs['run'] = true;
								ctx.tabWorker.port.emit('updateStartStop','Stop');
							}
						});
					});

					tab.on('close',function(){
						ctx.configTab = null;
						ctx.tabWorker = null;
					});

				}
			});
		}
	}
});

// Initial
ctx.prefs["run"] = false;
ctx.db.open();

// Set event observer
observer.setContext(ctx);
events.on("http-on-examine-response", observer.httpRequest);
