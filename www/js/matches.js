dixitApp.controller('MatchController', function($routeParams, $scope,
		FIREBASE_URL, $firebase) {

	var pId = $routeParams.pId;
	var mId = $routeParams.mId;

	$scope.pId = pId;
	$scope.mId = mId;

	var ref = new Firebase(FIREBASE_URL);
	var playerInfo = $firebase(ref.child("players/" + pId));
	var playerObj = playerInfo.$asObject();

	playerObj.$loaded().then(function(data) {
		$scope.player = playerObj;
	});

	var matchInfo = $firebase(ref.child("matches/" + mId));
	var matchObj = matchInfo.$asObject();

	matchObj.$loaded().then(function(data) {
		$scope.match = matchObj;
	});

	if ($routeParams.rNo) {
		var rNo = $routeParams.rNo;
		$scope.rNo = rNo;

		var roundInfo = $firebase(ref
				.child("matches/" + mId + "/rounds/" + rNo));
		var roundObj = roundInfo.$asObject();

		roundObj.$loaded().then(function(data) {
			$scope.round = roundObj;
		});
	}
}); // MatchController
