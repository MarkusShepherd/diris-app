dixitApp.controller('RegistrationController', 
function($scope, $location, $http, dataService, BACKEND_URL) {

	$scope.register = function() {
		$http.post(BACKEND_URL + '/player', $scope.player)
		.then(function(response) {
			var player = response.data;

			if (!player) {
				$scope.message = "There was an error - player \""
						+ $scope.player.name
						+ "\" could not be registered.";
				return;
			}

			console.log(player.key.id);
			dataService.setLoggedInPlayer(player);
			$location.path('/overview');
		}).catch(function(response) {
			console.log('error');
			console.log(response.data);
			console.log(response.status);
			console.log(response.headers);
			console.log(response.config);

			$scope.message = "There was an error";
		});
	} // login

}); // RegistrationController
