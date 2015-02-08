dixitApp.controller('PlayerController', function($routeParams, $scope,
		FIREBASE_URL, $firebase) {

	var pId = $routeParams.pId;
	var ref = new Firebase(FIREBASE_URL);
	var playerInfo = $firebase(ref.child("players/" + pId));
	var playerObj = playerInfo.$asObject();

	playerObj.$loaded().then(function(data) {
		$scope.player = playerObj;
	}); // meetings Object Loaded

}); // PlayerController
