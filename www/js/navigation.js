dixitApp.controller('NavigationController', function($scope, $rootScope, $location, $localStorage, dataService) {

	$scope.currentPlayer = dataService.getLoggedInPlayer();

	$scope.logout = function() {
		dataService.setLoggedInPlayer(null);
		$location.path('/login');
	};

});