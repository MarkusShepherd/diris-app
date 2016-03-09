dixitApp.controller('VoteImageController',
function($http, $location, $rootScope, $routeParams, $scope, blockUI, dataService, BACKEND_URL) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');
	myBlockUI.start();

	var mId = $routeParams.mId;
	var rNo = $routeParams.rNo;

	$scope.mId = mId;
	$scope.rNo = rNo;

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}, {
		link: '#/match/' + mId,
		label: 'Match',
		glyphicon: 'knight'
	}];

	dataService.getMatch(mId)
	.then(function(match) {
		$scope.$apply(function() {
			$scope.match = processMatch(match, player);
			$scope.round = $scope.match.rounds[rNo];
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

	dataService.getImages(mId, rNo, true, true)
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
			else {
				console.log('error');
				console.log(response);
				$scope.message = "There was an error...";
			}
		}).catch(function(response) {
			console.log('error');
			console.log(response);
			$scope.message = "There was an error";
		});
	};

});
