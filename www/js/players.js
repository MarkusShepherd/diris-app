dixitApp.controller('PlayerController', function($scope, $http, BACKEND_URL,
		$rootScope, $location, blockUI) {

	if (!("currentPlayer" in $rootScope)) {
		$location.path('/login');
		return;
	}

	blockUI.start();

	var player = $rootScope.currentPlayer;

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/waiting')
		.success(function(data, status, headers, config) {
			$scope.waiting = data;
			blockUI.stop();
			console.log('Waiting: ', data);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/inprogress')
		.success(function(data, status, headers, config) {
			$scope.inprogress = data;
			blockUI.stop();
			console.log('Progress: ', data);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/finished')
		.success(function(data, status, headers, config) {
			$scope.finished = data;
			blockUI.stop();
			console.log('Finished: ', data);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	$scope.newMatch = function() {
		$location.path('/newmatch');
	}

}); // PlayerController
