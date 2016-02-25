dixitApp.controller('PlayerController', function($scope, $http, BACKEND_URL,
		$rootScope, $location, blockUI) {

	if (!("currentPlayer" in $rootScope)) {
		$location.path('/login');
		return;
	}
	
	var myBlockUI = blockUI.instances.get('myBlockUI');

	myBlockUI.start();

	var player = $rootScope.currentPlayer;

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/waiting')
		.success(function(data, status, headers, config) {
			$scope.waiting = $.map(data, function(match) {
				return processMatch(match, player);
			});
			myBlockUI.stop();
			console.log('Waiting: ', $scope.waiting);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/inprogress')
		.success(function(data, status, headers, config) {
			$scope.inprogress = $.map(data, function(match) {
				return processMatch(match, player);
			});
			myBlockUI.stop();
			console.log('Progress: ', $scope.inprogress);
		}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/finished')
		.success(function(data, status, headers, config) {
			$scope.finished = $.map(data, function(match) {
				return processMatch(match, player);
			});
			myBlockUI.stop();
			console.log('Finished: ', $scope.finished);
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
