const {Cc, Ci} = require("chrome");
var urls = require("sdk/url");
var qs = require("sdk/querystring");
var fspath = require('sdk/fs/path');

var ctx_ = null;
function setContext(ctx){
	ctx_ = ctx;
}

var HeaderVisitor = function() {
	(function(self) {
		self.headers = {};
	})(this);
};
HeaderVisitor.prototype.visitHeader = function (aHeader, aValue) {
	var tvalue = aValue;
	if (typeof aValue === 'Array') {
		tvalue = aValue.join(';');
	}
	this.headers[aHeader] = tvalue;
};
HeaderVisitor.prototype.getHeaders = function () {
	return this.headers;
}

function getPathQuery(inpath){
	var params = {};
	var path = inpath;
	var query = '';
	var isParam = inpath.indexOf('?');
	if (isParam > -1){
		query = inpath.substr(isParam+1);
		path = inpath.substr(0,isParam);
		params = qs.parse(query);
	}

	return [path,query,params];
}

function _checkFilterProc(newReq, filters) {
	for (var i in filters) {
		var filter = filters[i];
		var regex = new RegExp(filter.text);
		if(regex.test(newReq.uri)){
			return true;
		}
	}
	return false;
}
function _checkFilter(newReq, ctx) {
	if (_checkFilterProc(newReq, ctx.filters.allow)){
		return true;
	}
	if (_checkFilterProc(newReq, ctx.filters.deny)){
		return false;
	}
	return true;
}

function httpRequest(event){
	if(ctx_.prefs["run"] === false) return;

	try{
		var newReq = {};
		var subject = event.subject;
		var data = event.data;
		var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
		var uri = httpChannel.URI;
		var oUrl = urls.URL(uri.spec);
		//console.log(oUrl.scheme, oUrl.userPass, oUrl.host, oUrl.port,
		//			oUrl.path, oUrl.hostname, oUrl.pathname, oUrl.hash,
		//			oUrl.href, oUrl.origin, oUrl.protocol, oUrl.search);

		var reqVisitor = new HeaderVisitor();
		httpChannel.visitRequestHeaders(reqVisitor);
		var resVisitor = new HeaderVisitor();
		httpChannel.visitResponseHeaders(resVisitor);

		newReq.uri = uri.spec;
		newReq.method = httpChannel.requestMethod;
		newReq.pathFull = oUrl.path;
		[newReq.path,newReq.query,newReq.params] = getPathQuery(oUrl.path);
		newReq.host = oUrl.host;
		newReq.ext = fspath.extname(newReq.path);
		newReq.scheme = oUrl.scheme;
		newReq.reqheader = reqVisitor.getHeaders();
		newReq.resheader = resVisitor.getHeaders();
		
		if(_checkFilter(newReq, ctx_)){
			ctx_.datas.push(newReq);
			if(ctx_.tabWorker){
				ctx_.tabWorker.port.emit('add',newReq, ctx_.datas.length);
			}
		}
	}catch(e){
		console.log("request_error:",e.toString());
	}
}

exports.httpRequest = httpRequest;
exports.setContext = setContext;
