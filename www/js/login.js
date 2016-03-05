dixitApp.controller('LoginController', 
function($scope, $location, $http, $localStorage, blockUI, dataService, BACKEND_URL) {

	var player = dataService.getLoggedInPlayer();

	if (player) {
		$location.path('/overview/refresh');
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	$scope.login = function() {
		myBlockUI.start();

		$http.get(BACKEND_URL + '/player/name/' + $scope.player.name)
		.then(function(response) {
			player = response.data[0];
			if (!player) {
				$scope.message = "There was an error - player \""
						+ $scope.player.name + "\" not found.";
				return;
			}
			dataService.setLoggedInPlayer(player);
			$location.path('/overview/refresh');
		}).catch(function(response) {
			console.log('error');
			console.log(response.data);
			console.log(response.status);
			dataService.setLoggedInPlayer(null);
			$scope.message = "There was an error";
			myBlockUI.stop();
		});
	}; // login

}); // LoginController
