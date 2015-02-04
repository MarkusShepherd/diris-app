dixitApp.controller('LoginController', function($scope, $location,
		Authentication, $rootScope) {

	if ($rootScope.currentPlayer) {
		$location.path('/overview/' + $rootScope.currentPlayer.$id);
		return;
	}

	$scope.login = function() {
		Authentication.login($scope.player).then(function(player) {
			$location.path('/overview/' + player.uid);
		}, function(error) {
			$scope.message = error.toString();
		});
	} // login

}); // LoginController
