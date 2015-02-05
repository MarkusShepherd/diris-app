dixitApp.controller('RegistrationController', function($scope, $location,
		Authentication, $rootScope) {

	$scope.register = function() {
		Authentication.register($scope.player).then(function(player) {
			Authentication.login($scope.player);
			$location.path('/overview/' + $rootScope.currentPlayer.$id);
		}, function(error) {
			$scope.message = error.toString();
		});
	} // login

}); // RegistrationController
