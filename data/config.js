// ----------------------------------------------------------------------------
// Local function
// ----------------------------------------------------------------------------
function save(ctx){
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ctx.datas));

	var a = document.getElementById('save_proc');
	a.setAttribute("href", 'data:'+data);
	a.setAttribute("download", "scene.json");
	a.style.display = 'none';
	a.click();
	a.setAttribute("href", '');
}

function clearList(){
	var dataList = document.getElementById('recordedList');
	dataList.textContent = '';
}

function addData(newReq) {
	var recordedList = document.getElementById('recordedList');

	var div = document.createElement('div');
	div.textContent = newReq.pathFull;
	recordedList.appendChild(div);
}

// ----------------------------------------------------------------------------
// Event listener
// ----------------------------------------------------------------------------
self.port.on('save', function(ctx){
	save(ctx);
});

self.port.on('add', function(newReq){
	addData(newReq);
});

self.port.on('init', function(ctx) {
	// Config Setting
	self.port.emit('updatePrefs',"test");

	// Data add
	clearList();
	for(var i in ctx.datas) {
		if (!ctx.datas.hasOwnProperty(i)) { continue; }
		var data = ctx.datas[i];
		addData(data);
	}
});

self.port.on('updateStartStop', function(flag) {
	var btn = document.getElementById('btn_start_stop');
	btn.textContent = flag;
});


// ----------------------------------------------------------------------------
// onLoad
// ----------------------------------------------------------------------------
(function(d){
	var save = d.getElementById('btn_save');
	save.addEventListener('click', function(){
		self.port.emit('save');
	}, false);

	var btn = d.getElementById('btn_start_stop');
	btn.addEventListener('click', function(){
		if(btn.textContent === 'Start') {
			self.port.emit('updateStartStop','Stop');
		}else{
			self.port.emit('updateStartStop','Start');
		}
	}, false);
})(document);
