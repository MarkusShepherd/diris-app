dirisApp.controller('NewMatchController',
function NewMatchController($http, $location, $log, $rootScope, $scope, $timeout,
	                        toastr, dataService, BACKEND_URL) {

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
	$rootScope.refreshPath = null;
	$rootScope.refreshReload = false;

	dataService.getPlayers()
	.then(function (players) {
		$scope.players = players;
		$scope.playersArray = $.map(players, function(player) {
			return player;
		});
	}).catch(function(response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error('There was an error fetching the player data...');
	});

	$scope.selected = {};
	$scope.numPlayers = 0;
	$scope.roundsPerPlayer = 2;

	$scope.addPlayer = function(p) {
		p.selected = true;
		$scope.selected["" + p.pk] = p;
		$scope.numPlayers++;
	};

	$scope.removePlayer = function(p) {
		p.selected = false;
		delete $scope.selected["" + p.pk];
		$scope.numPlayers--;
	};

	$scope.createMatch = function() {
		var playerPks = [];

		var includeCurrent = false;

		for (var pk in $scope.selected)
			if (pk == player.pk) {
				includeCurrent = true;
				playerPks.unshift(pk);
			} else
				playerPks.push(pk);

		if (!includeCurrent)
			playerPks.unshift(player.pk);

		if (playerPks.length < 4) {
			toastr.error("Please select at least 3 players to invite to the match!");
			return;
		}

		dataService.createMatch(playerPks)
		.then(function(match) {
			$log.debug(match);
			$location.path('/overview');
		}).catch(function(response) {
			$log.debug('error');
			$log.debug(response);
			toastr.error("There was an error when creating the match...");
		});
	}; // createMatch

}); // NewMatchController
