dixitApp.controller('RegistrationController', 
function($http, $location, $scope, $timeout, dataService, BACKEND_URL) {

	$scope.register = function() {
		$http.post(BACKEND_URL + '/player', $scope.player)
		.then(function(response) {
			var player = response.data;

			if (!player) {
				$scope.$apply(function() {
					$scope.message = "There was an error - player \"" +
						$scope.player.name + "\" could not be registered.";
				});
				return;
			}

			console.log(player.key.id);

			dataService.setLoggedInPlayer(player);
			$timeout(function() {
				$location.path('/overview/refresh');
			});
		}).catch(function(response) {
			console.log('error');
			console.log(response);

			$scope.$apply(function() {
				$scope.message = "There was an error";
			});
		});
	}; // login

}); // RegistrationController
