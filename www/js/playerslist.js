dixitApp.controller('PlayersListController', function($scope, $rootScope,
		$firebase, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL + 'players');
	var playersInfo = $firebase(ref);
	var playersObj = $firebase(ref).$asObject();
	var playersArray = $firebase(ref).$asArray();

	playersObj.$loaded().then(function(data) {
		$scope.players = playersObj;
	}); // meetings Object Loaded

	$scope.selected = {};
	$scope.numPlayers = 0;

	$scope.addPlayer = function(pId) {
		$scope.players[pId].selected = true;
		$scope.selected[pId] = $scope.players[pId];
		$scope.numPlayers++;
	};

	$scope.removePlayer = function(pId) {
		$scope.players[pId].selected = false;
		delete $scope.selected[pId];
		$scope.numPlayers--;
	};

	$scope.sendInvite = function() {
		var match = {
			playerIds : []
		};
		for ( var pId in $scope.selected) {
			match.playerIds.push(pId);
		}

		var matchesRef = new Firebase(FIREBASE_URL + 'matches');
		var matchesInfo = $firebase(matchesRef);

		matchesInfo.$push(match).then(function(newChildRef) {
			console.log("added record with id " + newChildRef.key());
			console.log(newChildRef);
		});
	}
}); // PlayersListController
