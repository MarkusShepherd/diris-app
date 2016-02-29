dixitApp.controller('NewMatchController', function($scope, $rootScope,
		$location, $http, BACKEND_URL) {

	if (!("currentPlayer" in $rootScope)) {
		$location.path('/login');
		return;
	}

	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}];

	var player = $rootScope.currentPlayer;

	$http.get(BACKEND_URL + '/player').success(
			function(data, status, headers, config) {
				$scope.players = data;
			}).error(function(data, status, headers, config) {
		console.log('error');
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
	});

	$scope.selected = {};
	$scope.numPlayers = 0;
	$scope.roundsPerPlayer = 2;

	$scope.addPlayer = function(p) {
		p.selected = true;
		$scope.selected["" + p.key.id] = p;
		$scope.numPlayers++;
	};

	$scope.removePlayer = function(p) {
		p.selected = false;
		delete $scope.selected["" + p.key.id];
		$scope.numPlayers--;
	};

	$scope.createMatch = function() {
		var playerIds = [];

		var includeCurrent = false;

		for (pId in $scope.selected) {
			var id = parseInt(pId, 10);
			playerIds.push(id);
			if (id == player.key.id)
				includeCurrent = true;
		}

		if (!includeCurrent)
			playerIds.push(player.key.id);

		if (playerIds.length < 4) {
			$scope.message = "Please select at least 3 players to invite to the match!";
			return;
		}

		$http.post(BACKEND_URL + '/match', playerIds).success(
				function(data, status, headers, config) {
					$location.path('/overview');
				}).error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);

			$scope.message = "There was an error";
		});
	} // createMatch

}); // NewMatchController
