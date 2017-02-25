dirisApp.controller('NavigationController',
function($localStorage, $location, $rootScope, $route, $scope, dataService) {
//auth,

	// $scope.$watch(dataService.getLoggedInPlayer, function(player) {
	// 	$scope.currentPlayer = player;
	// });

	$scope.logout = function() {
		// auth.signout();
		delete $localStorage.profile;
		delete $localStorage.token;
		// dataService.setLoggedInPlayer(null);
		dataService.setToken(null);
		authManager.unauthenticate();
		$location.path('/login');
	};

	$scope.refresh = function() {
		if ($rootScope.refreshReload)
			$route.reload();
		else if ($rootScope.refreshPath)
			$location.path($rootScope.refreshPath).replace();
	};
});