dixitApp.controller('PlayerController', function($routeParams, $scope, $http,
		BACKEND_URL, $rootScope) {

	var pId = $routeParams.pId;
	var player = $rootScope.currentPlayer;

	$http.get(BACKEND_URL + '/player/id/' + player.key.id + '/matches/waiting')
			.success(function(data, status, headers, config) {
				console.log('sucess');
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
				$scope.waiting = data;
			}).error(function(data, status, headers, config) {
				console.log('error');
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
			});

	$http
			.get(
					BACKEND_URL + '/player/id/' + player.key.id
							+ '/matches/inprogress').success(
					function(data, status, headers, config) {
						console.log('sucess');
						console.log(data);
						console.log(status);
						console.log(headers);
						console.log(config);
						$scope.inprogress = data;
					}).error(function(data, status, headers, config) {
				console.log('error');
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
			});

	$http
			.get(
					BACKEND_URL + '/player/id/' + player.key.id
							+ '/matches/finished').success(
					function(data, status, headers, config) {
						console.log('sucess');
						console.log(data);
						console.log(status);
						console.log(headers);
						console.log(config);
						$scope.finished = data;
					}).error(function(data, status, headers, config) {
				console.log('error');
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
			});

	/*
	 * var ref = new Firebase(FIREBASE_URL); var playerInfo =
	 * $firebase(ref.child("players/" + pId)); var playerObj =
	 * playerInfo.$asObject();
	 * 
	 * playerObj.$loaded().then(function(data) { $scope.player = playerObj; });
	 */// meetings Object Loaded
}); // PlayerController
