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
	// console.log(aHeader,aValue);
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

function httpRequest(event){
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

		newReq.method = httpChannel.requestMethod;
		newReq.pathFull = oUrl.path;
		[newReq.path,newReq.query,newReq.params] = getPathQuery(oUrl.path);
		newReq.host = oUrl.host;
		newReq.ext = fspath.extname(newReq.path);
		newReq.scheme = oUrl.scheme;
		newReq.reqheader = reqVisitor.getHeaders();
		newReq.resheader = resVisitor.getHeaders();

		if (newReq.host.match('daum.net') != null && newReq.resheader && newReq.resheader['Content-Type'].match('text/html') != null) {
			// console.log(newReq.host,newReq.path,newReq.ext,newReq.pathFull,newReq.params,newReq.method);
			if(ctx_.tabWorker){
				ctx_.datas.push(newReq);
				ctx_.tabWorker.port.emit('add',newReq);
			}
		}

	}catch(e){
		console.log("request_error:",e.toString());
	}
}

exports.httpRequest = httpRequest;
exports.setContext = setContext;
