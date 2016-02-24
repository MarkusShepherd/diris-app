dixitApp.controller('LoginController', 
function($scope, $location, $rootScope, $http, BACKEND_URL, blockUI) {

	if ("currentPlayer" in $rootScope) {
		$location.path('/overview');
		return;
	}

	$scope.login = function() {
		blockUI.start();

		$http.get(BACKEND_URL + '/player/name/' + $scope.player.name)
			.success(function(data, status, headers, config) {
				var player = data[0];

				if (!player) {
					$scope.message = "There was an error - player \""
							+ $scope.player.name + "\" not found.";
					return;
				}

				$rootScope.currentPlayer = player;
				$location.path('/overview');
			}).error(function(data, status, headers, config) {
				console.log('error');
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
				$scope.message = "There was an error";
				blockUI.stop();
			});
	} // login

}); // LoginController
