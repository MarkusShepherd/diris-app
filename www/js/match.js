dixitApp.controller('MatchController',
function($location, $rootScope, $routeParams, $scope, blockUI, dataService) {

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

	$scope.mId = mId;

	dataService.getMatch(mId, action === 'refresh')
	.then(function(match) {
		$scope.$apply(function() {
			$scope.match = processMatch(match, player);
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
