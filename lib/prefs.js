var prefs =  require("sdk/simple-prefs").prefs;

var defaultsTypeFilter = {
	"all":false,
	"html":true,
	"xhr":true,
	"img":false,
	"css":false,
	"js":false
};

var conf = {};

/**
 * Properties Retrive
 * @param  {string} key 찾고자 하는 정보의 Key
 * @return {String}     key에 대한 value or false
 */
function getPrefs(key){
	return conf[key];
}
function setPrefs(key,value,save){
	if(save){
		prefs[key] = value;
	}else{
		conf[key] = value;
	}
}
function getUriFilters(){
	var filters = JSON.parse(getPrefs("filters.uri"));
	if(!filters || filters == ""){
		filters = [];
	}
	return filters;
}
function addUriFilter(add){
	var filters = getUriFilters();
	filters.push(add);
	setPrefs("filters.uri",filters.stringify());
}
function getTypeFilters(){
	var filters = JSON.parse(getPrefs("filters.type"));
	if(!filters || filters == ""){
		filters = defaultsTypeFilter;
	}
	return filters;
}
function setTypeFilters(key,value){
	var filters = getTypeFilters();
	filters[key] = value;
	setPrefs("filters.uri",filters.stringify());
}

function onPerfChange(data){
	for(var prop in prefs){
		conf[prop] = prefs[prop];
	}
}
require("sdk/simple-prefs").on("",onPerfChange);

exports.get = getPrefs;
exports.set = setPrefs;
exports.getUriFilters = getUriFilters;
exports.addUriFilter = addUriFilter;
exports.getTypeFilters = getTypeFilters;
exports.setTypeFilters = setTypeFilters;
