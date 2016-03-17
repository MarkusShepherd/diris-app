dixitApp.controller('MatchController',
function($location, $rootScope, $routeParams, $scope, blockUI, dataService) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	blockUI.start();

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}];

	var mId = $routeParams.mId;
	var action = $routeParams.action;

	$scope.mId = mId;

	dataService.getMatch(mId, action === 'refresh')
	.then(function(match) {
		$scope.$apply(function() {
			$scope.match = processMatch(match, player);
		});
		return $scope.match;
	}).then(function(match) {
		var promises = $.map(match.playerKeys, function(key) {
			return dataService.getPlayer(key.id);
		});
		$scope.players = {};
		Promise.all(promises)
		.then(function(players) {
			$scope.$apply(function() {
				$.each(players, function(i, player) {
					$scope.players[player.key.id] = player;
				});
				blockUI.stop();
			});
		});
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.$apply(function() {
			$scope.message = "There was an error fetching the data - please try again later...";
			blockUI.stop();
		});
	});

	dataService.getImages(mId, undefined, true, true)
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

}); // MatchController
