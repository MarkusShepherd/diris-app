dixitApp.controller('HeaderController', function($scope, $rootScope, $location) {

	$scope.logout = function() {
			delete $rootScope.currentPlayer;
			$location.path('/login');
		};

});