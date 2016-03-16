dixitApp.controller('NavigationController',
function($localStorage, $location, $rootScope, $scope, auth, dataService) {

	$scope.$watch(dataService.getLoggedInPlayer, function(player) {
		$scope.currentPlayer = player;
	});

	$scope.logout = function() {
		auth.signout();
		delete $localStorage.profile;
		delete $localStorage.token;
		dataService.setLoggedInPlayer(null);
		$rootScope.menuItems = [];
		$location.path('/login');
	};
});