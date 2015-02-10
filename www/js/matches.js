dixitApp.controller('MatchController', function($routeParams, $scope,
		FIREBASE_URL, $firebase, $location) {

	var pId = $routeParams.pId;
	var mId = $routeParams.mId;

	$scope.pId = pId;
	$scope.mId = mId;

	var ref = new Firebase(FIREBASE_URL);
	var playerInfo = $firebase(ref.child("players/" + pId));
	var playerObj = playerInfo.$asObject();

	playerObj.$loaded().then(function(data) {
		$scope.player = playerObj;
	});

	var matchInfo = $firebase(ref.child("matches/" + mId));
	var matchObj = matchInfo.$asObject();

	matchObj.$loaded().then(function(data) {
		$scope.match = matchObj;
	});

	$scope.readyForStoryImage = false;
	$scope.readyForOtherImage = false;

	if ($routeParams.rNo) {
		var rNo = $routeParams.rNo;
		$scope.rNo = rNo;

		var roundInfo = $firebase(ref
				.child("matches/" + mId + "/rounds/" + rNo));
		var roundObj = roundInfo.$asObject();

		roundObj.$loaded().then(
				function(data) {
					$scope.round = roundObj;

					if (roundObj.status == "SUBMIT_STORY"
							&& roundObj.storyTellerId == pId) {
						console.log("Storyteller!");
						$scope.readyForStoryImage = true;
					} else if (roundObj.status == "SUBMIT_OTHERS"
							&& roundObj.storyTellerId != pId) {
						console.log("Other player!");
						$scope.readyForOtherImage = true;
					}
				});
	}

	function getImage(srcType) {
		navigator.camera.getPicture(function(imageData) {
			$scope.imageData = imageData;
			$("#image").attr('src', 'data:image/jpeg;base64,' + imageData);
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
		console.log($scope.imageData);

		if ($scope.readyForStoryImage) {
			roundObj.story = $scope.round.story;
			roundObj.images = {};
			roundObj.images[pId] = $scope.imageData;
			roundObj.status = "SUBMIT_OTHERS";
			roundObj.$save().then(function(ref) {
				console.log("saved");
				console.log(ref);
				$location.path('/match/' + pId + '/' + mId);
			}, function(error) {
				$scope.message = error;
			});
		} else if ($scope.readyForOtherImage) {
			roundObj.images[pId] = $scope.imageData;
			if (roundObj.images.length == $scope.match.numPlayers) {
				roundObj.status = "SUBMIT_VOTES";
			}
			roundObj.$save().then(function(ref) {
				console.log("saved");
				console.log(ref);
				$location.path('/match/' + pId + '/' + mId);
			}, function(error) {
				$scope.message = error;
			});
		}
	}

}); // MatchController
