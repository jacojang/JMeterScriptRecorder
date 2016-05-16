// ----------------------------------------------------------------------------
// Local function
// ----------------------------------------------------------------------------
function genFilename() {
	var now = new Date();
	return now.getFullYear()+
			'_'+(now.getMonth()+1)+
			'_'+now.getDate()+
			'-'+now.getHours()+
			'_'+now.getMinutes()+
			'_'+now.getSeconds()+'-JMeterScriptRecorder.jmx';
}
function save(str){
	var data = "text/xml;charset=utf-8," + encodeURIComponent(str);

	var a = document.getElementById('save_proc');
	a.setAttribute("href", 'data:'+data);
	a.setAttribute("download", genFilename());
	a.style.display = 'none';
	a.click();
	a.setAttribute("href", '');
}

function addData(newReq, length) {
	var target = document.getElementById('data_list');
	addItemList(target, [newReq], 'uri', 'data', '', true, parseInt(length)-1); 
}

function addItemList(target, list, key, listType, type, isAppend, startPos) {
	if(!isAppend) target.textContent = '';
	if(!startPos) startPos = 0;
	
	for (let i in list) {
		var oItem = list[i];
		var item = document.createElement('DIV');
		item.className = type + ' item';

		var number = document.createElement('DIV');
		number.className = 'item_number';
		number.textContent = (parseInt(i) + startPos + 1);

		var text = document.createElement('DIV');
		text.className = 'item_text';
		
		var text_span = document.createElement('SPAN');
		text_span.className = 'item_text_span';
		text_span.textContent = oItem[key];
		text.appendChild(text_span)

		var control = document.createElement('DIV');
		control.className = 'item_control';

		var del = document.createElement('button');
		del.className = 'btn-xs';
		del.textContent = 'del';
		del.setAttribute('type', 'button');
		(function(idx){
			del.addEventListener('click', function(){
				self.port.emit(listType+'Del', idx, type);		
			}, false);
		})(parseInt(i) + startPos)
		
		item.appendChild(number);
		item.appendChild(text);
		item.appendChild(control);
		control.appendChild(del);
		
		target.appendChild(item);
	}
}

// ----------------------------------------------------------------------------
// Event listener
// ----------------------------------------------------------------------------
self.port.on('save', function(ctx){
	save(ctx);
});

self.port.on('add', function(newReq, length){
	addData(newReq, length);
});

self.port.on('init', function(ctx) {
	// Config Setting
	self.port.emit('updatePrefs',"test");

	// Data add
	var target = document.getElementById('data_list');
	addItemList(target, ctx.datas, 'uri', 'data'); 
});

self.port.on('updateStartStop', function(flag) {
	var btn = document.getElementById('btn_start_stop');
	btn.textContent = flag;
});

function filterCheckAndSave(textObj, type) {
	var text = textObj.value;

	if (!text || text.length < 1) {
		alert('Invalid input text');
		return;
	}

	self.port.emit('filterSave', text, type);
}

self.port.on('filterLoad', function(filterList, type){
	var target = document.getElementById(type+'_list');
	addItemList(target, filterList, 'text', 'filter', type);
});

self.port.on('dataLoad', function(dataList, type){
	var target = document.getElementById('data_list');
	addItemList(target, dataList, 'uri', 'data', type);
});


// ----------------------------------------------------------------------------
// onLoad
// ----------------------------------------------------------------------------
(function(d){
	// Save Button
	var save = d.getElementById('btn_save');
	save.addEventListener('click', function(){
		self.port.emit('save');
	}, false);

	// Start/Stop Button
	var btn = d.getElementById('btn_start_stop');
	btn.addEventListener('click', function(){
		if(btn.textContent === 'Start') {
			self.port.emit('updateStartStop','Stop');
		}else{
			self.port.emit('updateStartStop','Start');
		}
	}, false);

	// Allow Filter
	var allowFilterBtn = d.getElementById('allow_filter_btn');
	allowFilterBtn.addEventListener('click', function(){
		filterCheckAndSave(d.getElementById('allow_text'), 'allow');
	}, false);

	var allowFilterInput = d.getElementById('allow_text');
	allowFilterInput.addEventListener("keydown", function (event) {
		if (event.which == 13 || event.keyCode == 13) {
			filterCheckAndSave(d.getElementById('allow_text'), 'allow');
		}
		return false;
	}, true);

	// Deny Filter
	var denyFilterBtn = d.getElementById('deny_filter_btn');
	denyFilterBtn.addEventListener('click', function(){
		filterCheckAndSave(d.getElementById('deny_text'), 'deny');
	}, false);
	
	var denyFilterInput = d.getElementById('deny_text');
	denyFilterInput.addEventListener("keydown", function (event) {
		if (event.which == 13 || event.keyCode == 13) {
			filterCheckAndSave(d.getElementById('deny_text'), 'deny');
		}
		return false;
	}, true);


})(document);
