dixitApp.controller('PlayerController', 
function($scope, $rootScope, $http, $routeParams, $location, $localStorage, blockUI, dataService, BACKEND_URL, $rootScope) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	$scope.currentPlayer = player;
	$rootScope.menuItems = [];
	
	var myBlockUI = blockUI.instances.get('myBlockUI');

	myBlockUI.start();

	var action = $routeParams.action;

	dataService.getMatches(player.key.id, action === 'refresh')
	.then(function(matches) {
		$scope.$apply(function() {
			var status = {};
			$scope.matches = $.map(matches, function(match) {
				status[match.status] = true;
				return processMatch(match, player);
			});
			$scope.status = status;
		});
		myBlockUI.stop();
		console.log('Matches: ', $scope.matches);
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.message = "There was an error fetching the data - please try again later..."
	});

	$scope.newMatch = function() {
		$location.path('/newmatch');
	}

}); // PlayerController
