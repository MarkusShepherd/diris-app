dixitApp.controller('NavigationController',
function($rootScope, $scope, $location, dataService) {

	$scope.$watch(dataService.getLoggedInPlayer, function(player) {
		$scope.currentPlayer = player;
	});

	$scope.logout = function() {
		dataService.setLoggedInPlayer(null);
		$rootScope.menuItems = [];
		$location.path('/login');
	};

});