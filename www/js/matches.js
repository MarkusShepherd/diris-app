dixitApp.controller('MatchController',
function($http, $location, $rootScope, $routeParams, $scope, blockUI, dataService, BACKEND_URL) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');
	myBlockUI.start();

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}];

	var mId = $routeParams.mId;
	var action = $routeParams.action;
	var rNo = $routeParams.rNo;

	$scope.mId = mId;

	dataService.getMatch(mId, action === 'refresh')
	.then(function(match) {
		$scope.$apply(function() {
			$scope.match = processMatch(match, player);

			if ($routeParams.rNo) {
				var rNo = $routeParams.rNo;
				$scope.rNo = rNo;
				$scope.round = $scope.match.rounds[rNo];
			}
		});
		console.log('Match: ', $scope.match);
		return $scope.match;
	}).then(function(match) {
		$scope.players = {};
		$.each(match.playerKeys, function(i, key) {
			dataService.getPlayer(key.id)
			.then(function(player) {
				$scope.$apply(function() {
					$scope.players[player.key.id] = player;
				});
			});
		});
		myBlockUI.stop();
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.$apply(function() {
			$scope.message = "There was an error fetching the data - please try again later...";
		});
		myBlockUI.stop();
	});

	dataService.getImages(mId, rNo, true, false)
	.then(function(images) {
		$scope.$apply(function() {
			$scope.images = {};
			$.each(images, function(k, img) {
				$scope.images['' + img.key.id] = img;
			});
		});
		console.log('Images: ', $scope.images);
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.$apply(function() {
			$scope.message = "There was an error fetching the data - please try again later...";
		});
	});

	function getImage(srcType) {
		navigator.camera.getPicture(setImage, function(message) {
			$scope.$apply(function () {
				$scope.message = message;
			});
		}, {
			quality : 100,
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : srcType,
			encodingType: 0
		});
	}

	function setImage(imageData) {
		$scope.$apply(function () {
			$scope.message = null;
			$scope.imageData = imageData;
			$scope.selectedImage = true;
			$("#image")
				.cropper('replace', "data:image/jpeg;base64," + imageData)
				.cropper('enable');
		});
	}

	$("#image").cropper({ 
		viewMode: 3,
		aspectRatio: 1,
		dragMode: 'move',
		modal: false,
		guides: false,
		center: false,
		highlight: false,
		autoCropArea: 1,
		cropBoxMovable: false,
		cropBoxResizable: false,
		toggleDragModeOnDblclick: false
	}).cropper('disable');

	$scope.getImageFromCamera = function() {
		getImage(Camera.PictureSourceType.CAMERA);
	};

	$scope.getImageFromLibrary = function() {
		if (isBrowser())
			$('#file-input').trigger('click');
		else
			getImage(Camera.PictureSourceType.PHOTOLIBRARY);
	};

	$("#file-input").change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
            	var d = e.target.result;
            	setImage(d.substr(d.indexOf(",") + 1));
            };
            
            reader.readAsDataURL(this.files[0]);
        }
	});

	$scope.submitImage = function() {
		var croppedImage = $("#image").cropper('getCroppedCanvas', {
			width: 1080,
			height: 1080
		}).toDataURL("image/jpeg", 0.5);
		croppedImage = croppedImage.substr(croppedImage.indexOf(",") + 1);

		var fd = new FormData();

		fd.append("image", croppedImage);
		fd.append("player", player.key.id);
		fd.append("match", mId);
		fd.append("round", $scope.rNo);
		if ($scope.round.story)
			fd.append("story", $scope.round.story);

		$http.post(BACKEND_URL + '/image', fd, {
        	headers: { 'Content-Type': undefined },
        	transformRequest: angular.identity
    	}).then(function(response) {
			console.log(response);
			$location.path('/match/' + mId + '/refresh').replace();
		}).catch(function(response) {
			console.log('error');
			console.log(response);
			$scope.message = "There was an error";
		});
	};

	$scope.zoom = function(ratio) {
		$('#image').cropper('zoom', ratio);
	};

	$scope.rotate = function(angle) {
		$('#image').cropper('rotate', angle);
	};

	$scope.flip = function(axis) {
		var  img = $('#image');
		img.cropper('scale' + axis, -img.cropper('getData')['scale' + axis]);
	};

	$scope.selectImage = function(image) {
		if ($scope.round.imageToPlayer[image.key.id] != player.key.id)
			$scope.selectedImage = image;
	};

	$scope.submitVote = function() {
		$http.get(BACKEND_URL + '/vote?player=' + 
			player.key.id + '&match=' + mId + '&round=' + $scope.rNo + '&image=' + $scope.selectedImage.key.id)
		.then(function(response) {
			if (response.data)
				$location.path('/match/' + mId + '/refresh').replace();
			else
				$scope.message = "There was an error...";
		}).catch(function(response) {
			console.log('error');
			console.log(response);
			$scope.message = "There was an error";
		});
	};

	$scope.filterValues = function(items, value) {
		var result = [];
		angular.forEach(items, function(v, k) {
	        if (v == value)
	        	result.push(k);
	    });
	    return result;
	};

	$scope.filterOutKey = function(items, key) {
		var result = [];
		angular.forEach(items, function(v, k) {
	        if (k != key)
	        	result.push(v);
	    });
	    return result;
	};

}); // MatchController
