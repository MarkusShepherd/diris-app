dixitApp.controller('NewMatchController', function($scope, $rootScope,
		$location, $firebase, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL + 'players');
	var playersInfo = $firebase(ref);
	var playersObj = $firebase(ref).$asObject();
	var playersArray = $firebase(ref).$asArray();

	playersObj.$loaded().then(function(data) {
		$scope.players = playersObj;
	}); // meetings Object Loaded

	$scope.selected = {};
	$scope.numPlayers = 0;
	$scope.roundsPerPlayer = 1;

	$scope.addPlayer = function(pId) {
		$scope.players[pId].selected = true;
		$scope.selected[pId] = $scope.players[pId];
		$scope.numPlayers++;
		console.log("Added player " + pId + "; total: " + $scope.numPlayers);
	};

	$scope.removePlayer = function(pId) {
		$scope.players[pId].selected = false;
		delete $scope.selected[pId];
		$scope.numPlayers--;
		console.log("Removed player " + pId + "; total: " + $scope.numPlayers);
	};

	$scope.createMatch = function() {
		var match = {
			playerIds : [],
			roundIds : [],
			standings : [],
			currentRound : 0,
			timeout : 86400,
			status : "WAITING"
		};

		for ( var pId in $scope.selected) {
			match.playerIds.push(pId);
			match.standings[pId] = 0;
		}

		shuffle(match.playerIds);

		match.numPlayers = match.playerIds.length;
		match.totalRounds = match.numPlayers * $scope.roundsPerPlayer;

		var roundsRef = new Firebase(FIREBASE_URL + 'rounds');
		var roundsInfo = $firebase(roundsRef);

		for (var i = 0; i < match.totalRounds; i++) {
			round = {
				roundNo : i,
				storyTellerId : match.playerIds[i % match.numPlayers],
				story : "",
				status : i == 0 ? "SUBMIT_STORY" : "WAITING",
			};

			roundsInfo.$push(round).then(function(newChildRef) {
				console.log("added round with id " + newChildRef.key());
				console.log(newChildRef);
				match.roundIds.push(newChildRef.key());
			});
		}

		var matchesRef = new Firebase(FIREBASE_URL + 'matches');
		var matchesInfo = $firebase(matchesRef);

		matchesInfo.$push(match).then(function(newChildRef) {
			console.log("added match with id " + newChildRef.key());
			console.log(newChildRef);
			$location.path('/overview/' + $rootScope.currentPlayer.$id);
		});
	}

}); // NewMatchController
