dixitApp.controller('NavigationController',
function($scope, $location, dataService) {

	$scope.currentPlayer = dataService.getLoggedInPlayer();

	$scope.logout = function() {
		dataService.setLoggedInPlayer(null);
		$location.path('/login');
	};

});