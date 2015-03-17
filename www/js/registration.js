dixitApp.controller('RegistrationController', function($scope, $location,
		$rootScope, $http, BACKEND_URL) {

	$scope.register = function() {
		$http.post(BACKEND_URL + '/player', $scope.player).success(
				function(data, status, headers, config) {
					console.log('sucess');
					console.log(data);
					console.log(status);
					console.log(headers);
					console.log(config);

					var player = data;

					if (!player) {
						$scope.message = "There was an error - player \""
								+ $scope.player.name
								+ "\" could not be registered.";
						return;
					}

					console.log(player.key.id);

					$rootScope.currentPlayer = player;
					$location.path('/overview');
				}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);

			$scope.message = "There was an error";
		});
	} // login

}); // RegistrationController
