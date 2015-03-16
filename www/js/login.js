dixitApp.controller('LoginController', function($scope, $location, $rootScope,
		$http, BACKEND_URL) {

	if ($rootScope.currentPlayer) {
		$location.path('/overview/' + $rootScope.currentPlayer.key.id);
		return;
	}

	$scope.login = function() {
		$http.get(BACKEND_URL + '/player/name/' + $scope.player.name)
				.success(function(data, status, headers, config) {
					console.log('sucess');
					console.log(data);
					console.log(status);
					console.log(headers);
					console.log(config);

					var player = data[0];
					$rootScope.currentPlayer = player;
					$location.path('/overview/' + player.key.id);
				}).error(function(data, status, headers, config) {
					console.log('error');
					console.log(data);
					console.log(status);
					console.log(headers);
					console.log(config);
				});
		/*Authentication.login($scope.player).then(function(player) {
			$location.path('/overview/' + player.uid);
		}, function(error) {
			$scope.message = error.toString();
		});*/
	} // login

}); // LoginController
