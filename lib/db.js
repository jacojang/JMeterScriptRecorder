var { indexedDB, IDBKeyRange } = require('sdk/indexed-db');

var database = {
 	version:1,
	name:'JMETERSCRIPTRECORDER_DB',
	tables:[
		{name: "filter", keyPath:"_id", indexes:[]}
	],
	db:null
};

function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/**
 * DATABASE를 초기화 한다.
 * @param  {Function} callback Open 결과를 전달하는 함수
 */
exports.open = function(callback){
	var request = indexedDB.open(database.name, database.version);
	request.onerror = function(e){
		if(callback) callback(e,null);
	};
	request.onupgradeneeded = function(e) {
		var db = e.target.result;
		var objectStore = db.createObjectStore(table, { keyPath: "_id" });

		for(let i in database.tables){
			let table = database.tables[i];

			if(db.objectStoreNames.contains(table.name)){
				db.deleteObjectStore(table.name);
			}

			var store = db.createObjectStore(table.name,{keyPath: database.keyPath});

			if(table.indexes && table.indexes.length > 0){
				for(let j in table.indexes){
					let index = table.indexes[j];
					store.createIndex(index.name, index.key, index.options);
				}
			}
		}
	};
	request.success = function(e){
		database.db = e.target.result;
		if(callback) {
			callback(null,database.db);
		}
	};
};

/**
 * Database close
 */
exports.close = function(){
	if(database.db !== null){
		database.db.close();
		database.db = null;
	}
};

/**
 * Data를 가져오는 함수
 * @param  {String}   table    Table명
 * @param  {String}   key      얻고자 하는 Data의 key, 없다면 전체 Data를 Return 한다.
 * @param  {Function} callback 결과를 전달하는 함수
 */
exports.get = function(table,key,callback){
	if(database.db === null) { if(callback) callback(new Error("Not yet init"),null); return; }
	if(!table){ if(callback) callback(new Error("Invalid Parameter"),null); return; }

	var db = database.db;
	var trans = db.transaction([table], "read");
	var store = trans.objectStore(table);

	trans.oncomplete = function() {
		if(callback) callback(null,data);
	}
	trans.onerror = function(e) {
		if(callback) callback(trans.error,null);
	};

	var data = [];
	if(key === null){
		// Get all data
		var cursor = store.openCursor();
		cursor.onerror = function(e) {
			if(callback) callback(e,null);
		};
		cursor.onsuccess = function(e) {
			var result = e.target.result;
			if(!!result == false)
				return;

			data.push(result.value);
			result.continue();
		};
	}else{
		// Get one data
		var request = store.get(key);
		request.onerror = function(e) {
			if(callback) callback(e,null);
		};
		request.onsuccess = function(e) {
			if(callback) callback(null, request.result);
		};
	}
};

/**
 * Data를 삭제하는 함수
 * @param  {String}   table    Table명
 * @param  {String}   key      삭제하고자 하는 Data의 key;
 * @param  {Function} callback 결과를 전달하는 함수
 */
exports.delete = function(table,key,callback){
	if(database.db === null) { if(callback) callback(new Error("Not yet init"),null); return; }
	if(!key){ if(callback) callback(new Error("Invalid Parameter"),null); return; }

	var db = database.db;
	var trans = db.transaction([table], "readwrite");
	var store = trans.objectStore(table);

	var request = store.delete(key);
	trans.onerror = function(e) {
		if(callback) callback(trans.error,null);
	};
	request.onsuccess = function(e) {
		if(callback) callback(null, request.result);
	};
}

/**
 * Data를 모두 삭제하는 함수
 * @param  {String}   table    Table명
 * @param  {Function} callback 결과를 전달하는 함수
 */
exports.clear = function(table,callback){
	if(database.db === null) { if(callback) callback(new Error("Not yet init"),null); return; }
	if(!table){ if(callback) callback(new Error("Invalid Parameter"),null); return; }

	var db = database.db;
	var trans = db.transaction([table], "readwrite");
	var store = trans.objectStore(table);

	var request = store.clear();
	trans.onerror = function(e) {
		if(callback) callback(trans.error,null);
	};
	request.onsuccess = function(e) {
		if(callback) callback(null, request.result);
	};
}

/**
 * Data를 추가하는 함수
 * @param  {String}   table    Table명
 * @param  {Object}   data     추가 하고자 하는 Data
 * @param  {Function} callback 결과를 전달하는 함수
 */
exports.add = function(table,data,callback){
	if(database.db === null) { if(callback) callback(new Error("Not yet init"),null); return; }
	if(!table || !data){ if(callback) callback(new Error("Invalid Parameter"),null); return; }

	var db = database.db;
	var trans = db.transaction([table], "readwrite");
	var store = trans.objectStore(table);

	data._id = generateUUID();

	var request = store.put(data);
	request.onerror = function(e) {
		if(callback) callback(e,null);
	};
	request.onsuccess = function(e) {
		if(callback) callback(null, request.result);
	};
};
