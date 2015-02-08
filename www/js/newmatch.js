dixitApp.controller('NewMatchController', function($scope, $rootScope,
		$location, $firebase, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL + 'players');
	var playersInfo = $firebase(ref);
	var playersObj = playersInfo.$asObject();
	var playersArray = playersInfo.$asArray();

	playersObj.$loaded().then(function(data) {
		$scope.players = playersObj;
	}); // meetings Object Loaded

	$scope.selected = {};
	$scope.numPlayers = 0;
	$scope.roundsPerPlayer = 2;

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
			rounds : [],
			playerIds : [],
			standings : [],
			currentRound : 0,
			timeout : 24 * 60 * 60,
			status : "STARTED"
		};

		for ( var pId in $scope.selected) {
			match.playerIds.push(pId);
			match.standings[pId] = 0;
		}

		shuffle(match.playerIds);

		match.numPlayers = match.playerIds.length;
		match.totalRounds = match.numPlayers * $scope.roundsPerPlayer;

		for (var i = 0; i < match.totalRounds; i++) {
			round = {
				roundNo : i,
				storyTellerId : match.playerIds[i % match.numPlayers],
				story : "",
				status : i == 0 ? "SUBMIT_STORY" : "WAITING",
			};

			match.rounds.push(round);
		}

		var matchesRef = new Firebase(FIREBASE_URL + 'matches');
		var matchesInfo = $firebase(matchesRef);

		matchesInfo.$push(match).then(function(newChildRef) {
			console.log("added match with id " + newChildRef.key());
			console.log(newChildRef);

			var mId = newChildRef.key();
			console.log(match.playerIds);
			for (var i = 0; i < match.playerIds.length; i++) {
				var pId = match.playerIds[i];
				console.log(pId);
				var c = ref.child(pId + "/matchIds");
				c.transaction(function(currentValue) {
					var matches = currentValue ? currentValue : [];
					matches.push(mId);
					console.log(matches);
					return matches;
				});
			}

			$location.path('/overview/' + $rootScope.currentPlayer.$id);
		});
	} // createMatch

}); // NewMatchController
