dirisApp.controller('RegistrationController',
function RegistrationController($http, $location, $log, $scope, $timeout,
	                            authManager, dataService, BACKEND_URL) {

	$scope.register = function() {
		$log.debug($scope.player);

		$http.post(BACKEND_URL + '/players/', {user: $scope.player}, {skipAuthorization: true})
		.then(function(response) {
			var player = response.data;

			$log.debug(player);

			if (!player) {
				$scope.$apply(function() {
					$scope.message = "There was an error - player \"" +
						$scope.player.name + "\" could not be registered.";
				});
				return;
			}

			dataService.setToken(player.token);
			authManager.authenticate();

			$timeout(function() {
				$location.path('/overview/refresh');
			});
		}).catch(function(response) {
			console.log('error');
			console.log(response);

			dataService.setToken(null);
			authManager.unauthenticate();

			$scope.$apply(function() {
				$scope.message = "There was an error";
			});
		});
	}; // register

}); // RegistrationController
