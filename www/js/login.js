dixitApp.controller('LoginController', 
function($scope, $location, $rootScope, $http, BACKEND_URL, blockUI, $localStorage) {

	if ($localStorage.loginPlayer)
		$rootScope.currentPlayer = $localStorage.loginPlayer;

	if ("currentPlayer" in $rootScope) {
		$location.path('/overview');
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	$scope.login = function() {
		myBlockUI.start();

		$http.get(BACKEND_URL + '/player/name/' + $scope.player.name)
			.success(function(data, status, headers, config) {
				var player = data[0];

				if (!player) {
					$scope.message = "There was an error - player \""
							+ $scope.player.name + "\" not found.";
					return;
				}

				$rootScope.currentPlayer = player;
				$localStorage.loginPlayer = player;
				$location.path('/overview');
			}).error(function(data, status, headers, config) {
				console.log('error');
				console.log(data);
				console.log(status);
				$scope.message = "There was an error";
				myBlockUI.stop();
			});
	}; // login

}); // LoginController
