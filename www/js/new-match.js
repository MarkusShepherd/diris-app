dixitApp.controller('NewMatchController',
function($http, $location, $rootScope, $scope, dataService, BACKEND_URL) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}];

	dataService.getPlayers()
	.then(function(players) {
		$scope.$apply(function () {
			$scope.players = players;
			$scope.playersArray = $.map(players, function(player) {
				return player;
			});
		});
	}).catch(function(response) {
		console.log('error');
		console.log(response);
		$scope.$apply(function () {
			$scope.message = 'There was an error fetching the data...';
		});
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

		for (var pId in $scope.selected) {
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

		$http.post(BACKEND_URL + '/match', playerIds)
		.then(function(response) {
			// TODO add response.data to dataService instead of force refresh below (#46)
			$location.path('/overview/refresh');
		}).catch(function(response) {
			console.log('error');
			console.log(response);
			$scope.message = "There was an error when creating the match...";
		});
	}; // createMatch

}); // NewMatchController
