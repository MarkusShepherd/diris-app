dirisApp.controller('RegistrationController',
function RegistrationController($location, $log, $scope, dataService) {
	dataService.setToken(null);

	$scope.register = function register() {
		$log.debug($scope.player);

		dataService.registerPlayer($scope.player)
		.then(function (player) {
			$location.path('/overview/refresh');
		}).catch(function (err) {
			$scope.message = "There was an error - player \"" +
				$scope.player.username + "\" could not be registered.";
		});
	}; // register
}); // RegistrationController
