dixitApp.controller('MatchController', function($routeParams, $scope,
		$location, $http, BACKEND_URL, $rootScope, $q, blockUI) {

	if (!("currentPlayer" in $rootScope)) {
		$location.path('/login');
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	myBlockUI.start();

	var mId = $routeParams.mId;
	var player = $rootScope.currentPlayer;

	$scope.mId = mId;

	var matchPromise = $http.get(BACKEND_URL + '/match/' + mId);

	matchPromise.success(
		function(data, status, headers, config) {
			$scope.match = data;

			for (var i = 0; i < $scope.match.rounds.length; i++) {
				var roundObj = $scope.match.rounds[i];
				roundObj.readyForStoryImage = false;
				roundObj.readyForOtherImage = false;
				roundObj.readyForVote = false;

				if (roundObj.status == "SUBMIT_STORY"
						&& roundObj.storyTellerKey.id == player.key.id)
					roundObj.readyForStoryImage = true;
				else if (roundObj.status == "SUBMIT_OTHERS"
						&& roundObj.storyTellerKey.id != player.key.id
						&& !(('' + player.key.id) in roundObj.images))
					roundObj.readyForOtherImage = true;
				else if (roundObj.status == "SUBMIT_VOTES"
						&& roundObj.storyTellerKey.id != player.key.id
						&& !(('' + player.key.id) in roundObj.votes))
					roundObj.readyForVote = true;
			}

			if ($routeParams.rNo) {
				var rNo = $routeParams.rNo;
				$scope.rNo = rNo;

				var roundObj = $scope.match.rounds[rNo];

				$scope.round = roundObj;
			}

			myBlockUI.stop();
	}).error(function(data, status, headers, config) {
		console.log('error');
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
		myBlockUI.stop();
	});

	var playersPromise = $http.get(BACKEND_URL + '/match/' + mId + '/players');

	playersPromise.success(
		function(data, status, headers, config) {
			$scope.players = {};

			for (var i = 0; i < data.length; i++) {
				var p = data[i];
				$scope.players['' + p.key.id] = p;
			}

			myBlockUI.stop();
	}).error(function(data, status, headers, config) {
		console.log('error');
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
		myBlockUI.stop();
	});

	if ($routeParams.rNo) {
		var imagesPromise = $http.get(BACKEND_URL + '/match/' + mId + '/images/' + $routeParams.rNo);

		imagesPromise.success(function(data, status, headers, config) {
			$scope.images = {};

			for (var i = 0; i < data.length; i++) {
				var img = data[i];
				$scope.images['' + img.key.id] = img;
			}

			myBlockUI.stop();
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			myBlockUI.stop();
		});
	} else  {
		var imagesPromise = $http.get(BACKEND_URL + '/match/' + mId + '/images');

		imagesPromise.success(function(data, status, headers, config) {
			$scope.images = {};

			for (var i = 0; i < data.length; i++) {
				var img = data[i];
				$scope.images['' + img.key.id] = img;
			}
			
			myBlockUI.stop();
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			myBlockUI.stop();
		});
	}

	/* $q.all([matchPromise, playersPromise]).then(function (ret) {
		console.log("$q.all");
		console.log(ret);
	}); */

	function getImage(srcType) {
		navigator.camera.getPicture(function(imageData) {
			$scope.imageData = imageData;
			$("#image").attr('src', "data:image/jpeg;base64," + imageData);
		}, function(message) {
			$scope.message = message;
		}, {
			quality : 50,
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : srcType
		});
	};

	$scope.getImageFromCamera = function() {
		getImage(Camera.PictureSourceType.CAMERA);
	};

	$scope.getImageFromLibrary = function() {
		getImage(Camera.PictureSourceType.PHOTOLIBRARY);
	};

	$scope.submitImage = function() {
		var fd = new FormData();

		fd.append("image", $scope.imageData);
		fd.append("player", player.key.id);
		fd.append("match", mId);
		fd.append("round", $scope.rNo);
		if ($scope.round.story)
			fd.append("story", $scope.round.story);

		$http.post(BACKEND_URL + '/image', fd, {
        	headers: { 'Content-Type': undefined },
        	transformRequest: angular.identity
    	}).success(function(data, status, headers, config) {
			$location.path('/match/' + mId);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);

			$scope.message = "There was an error";
		});
	};

	$scope.selectImage = function(image) {
		$scope.selectedImage = image;
	};

	$scope.submitVote = function() {
		$http.get(BACKEND_URL + '/vote?player=' + 
			player.key.id + '&match=' + mId + '&round=' + $scope.rNo + '&image=' + $scope.selectedImage.key.id)
		.success(function(data, status, headers, config) {
			if (data)
				$location.path('/match/' + mId);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);

			$scope.message = "There was an error";
		});
	}

	$scope.filterValues = function(items, value) {
		var result = [];
		angular.forEach(items, function(v, k) {
	        if (v == value)
	        	result.push(k);
	    });
	    return result;
	}

	$scope.filterOutKey = function(items, key) {
		var result = [];
		angular.forEach(items, function(v, k) {
	        if (k != key)
	        	result.push(v);
	    });
	    return result;
	}

}); // MatchController
