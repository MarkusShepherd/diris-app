dixitApp.controller('OverviewController', 
function($location, $rootScope, $routeParams, $scope, blockUI, dataService) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	$scope.currentPlayer = player;
	$rootScope.menuItems = [];
	
	blockUI.start();

	var action = $routeParams.action;

	dataService.getMatches(player.key.id, action === 'refresh', true)
	.then(function(matches) {
		$scope.$apply(function() {
			var status = {};
			$scope.matches = $.map(matches, function(match) {
				status[match.status] = true;
				return processMatch(match, player);
			});
			$scope.status = status;
			blockUI.stop();
		});
		console.log('Matches: ', $scope.matches);
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.$apply(function() {
			$scope.message = "There was an error fetching the data - please try again later...";
		});
	});

	dataService.getPlayers(action === 'refresh', true)
	.then(function(players) {
		$scope.$apply(function() {
			$scope.players = players;
		});
		console.log('Players: ', $scope.players);
	}).catch(function(response) {
		console.log('error');
		console.log(response);
	});

	$scope.newMatch = function() {
		$location.path('/newmatch');
	};

}); // PlayerController
