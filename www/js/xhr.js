var baseUrl = "http://192.168.0.7:8080/";

function cheese() {
	console.log('Cheese!');
	navigator.camera.getPicture(onSuccess, onFail, {
		quality : 50,
		sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
		destinationType : Camera.DestinationType.DATA_URL
	});
}

function onSuccess(imageData) {
	console.log(imageData);
	var image = document.getElementById('myImage');
	image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
	console.log(message);
	alert('Failed because: ' + message);
}

function getPlayers(onSuccess, onFail) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				onSuccess(JSON.parse(this.responseText));
			} else {
				onFail(this.statusText);
			}
		}
	};

	request.open('GET', baseUrl + '/player', true);
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.send();
}

function setPlayerList(arr) {
	console.log(arr);
	var out = "<ul>"
	for (var i = 0; i < arr.length; i++) {
		out += "<li>" + arr[i].name + "</li>";
	}
	out += "</ul>"

	document.getElementById('myContent').innerHTML = out;
}

function errorMessage(text) {
	console.log(text);
	document.getElementById('myContent').innerHTML = text;
}