dixitApp.controller('NavigationController', function($scope, $rootScope, $location, $localStorage) {

	$scope.logout = function() {
		delete $rootScope.currentPlayer;
		delete $localStorage.loginPlayer;
		$location.path('/login');
	};

});