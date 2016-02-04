// Add data to Config Panel
self.port.on('add', function(newReq){
	var recordedList = document.getElementById('recordedList');

	var li = document.createElement('li');
	li.textContent = newReq.pathFull;
	recordedList.appendChild(li);
});

self.port.on('init', function(ctx) {
	// Config Setting
	console.log('init',ctx);


	// Data add
});

self.port.emit('message',"test");
self.port.emit('updatePrefs',"test");
