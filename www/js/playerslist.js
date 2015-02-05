dixitApp.controller('PlayersListController', function($scope, $rootScope,
		$firebase, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL + 'players');
	var playersInfo = $firebase(ref);
	var playersObj = $firebase(ref).$asObject();
	var playersArray = $firebase(ref).$asArray();

	playersObj.$loaded().then(function(data) {
		$scope.players = playersObj;
	}); // meetings Object Loaded

	$scope.selected = [];
	
	$scope.addPlayer = function(pId) {
		$scope.selected.push(pId);
		$scope.players[pId].selected = true;
	};
	
}); // PlayersListController
