dixitApp.controller('MatchController', function($routeParams, $scope,
		$location, $http, BACKEND_URL, $rootScope) {

	if (!("currentPlayer" in $rootScope)) {
		$location.path('/login');
		return;
	}

	var mId = $routeParams.mId;
	var player = $rootScope.currentPlayer;

	$scope.mId = mId;

	$http.get(BACKEND_URL + '/match/' + mId).success(
			function(data, status, headers, config) {
				$scope.match = data;

				$scope.readyForStoryImage = false;
				$scope.readyForOtherImage = false;

				if ($routeParams.rNo) {
					var rNo = $routeParams.rNo;
					$scope.rNo = rNo;

					var roundObj = $scope.match.rounds[rNo];

					$scope.round = roundObj;

					if (roundObj.status == "SUBMIT_STORY"
							&& roundObj.storyTellerKey.id == player.key.id) {
						console.log("Storyteller!");
						$scope.readyForStoryImage = true;
					} else if (roundObj.status == "SUBMIT_OTHERS"
							&& roundObj.storyTellerKey.id != player.key.id) {
						console.log("Other player!");
						$scope.readyForOtherImage = true;
					}
				}

			}).error(function(data, status, headers, config) {
		console.log('error');
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
	});

	$http.get(BACKEND_URL + '/match/' + mId + '/players').success(
			function(data, status, headers, config) {
				$scope.players = {};

				for (var i = 0; i < data.length; i++) {
					var p = data[i];
					console.log(p);
					$scope.players['' + p.key.id] = p;
				}
			}).error(function(data, status, headers, config) {
		console.log('error');
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
	});

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
	}

	$scope.getImageFromCamera = function() {
		getImage(Camera.PictureSourceType.CAMERA);
	}

	$scope.getImageFromLibrary = function() {
		getImage(Camera.PictureSourceType.PHOTOLIBRARY);
	}

	$scope.submitImage = function() {
		console.log("submitImage()");
		console.log($scope.round.story);

		var fd = new FormData();

		fd.append("image", $scope.imageData);
		fd.append("player", player.key.id);
		fd.append("match", mId);
		fd.append("round", $scope.rNo);
		if ($scope.round.story)
			fd.append("story", $scope.round.story);

		console.log(fd.toString());

		$http.post(BACKEND_URL + '/image', fd, {
        	withCredentials: true,
        	headers: { 'Content-Type': undefined },
        	transformRequest: angular.identity
    	}).success(function(data, status, headers, config) {
			console.log(data);
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

}); // MatchController
