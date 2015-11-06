const {Cc, Ci} = require("chrome");
var self = require('sdk/self');
var events = require("sdk/system/events");

var filtersInclude = [
	"/*.html/i"
];

function observerHttpRequest(event){
	var subject = event.subject;
	var data = event.data;
	var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
	var url = httpChannel.URI.spec;

	var matched = false;
	for(var i in filtersInclude){
		var filter = filtersInclude[i];
		var rgex = new RegExp(filter,"i");
		if(rgex.exec(url)) {
			matched = true;
			break;
		}
	}

	if(matched) console.log(url);
}

events.on("http-on-examine-response", observerHttpRequest);
