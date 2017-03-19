dirisApp.controller('AcceptController',
function AcceptController($location, $log, $q, $rootScope, $routeParams, $scope,
	                      blockUI, toastr, dataService) {
	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	if (!blockUI.state().blocking)
		blockUI.start();

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}];
	$rootScope.refreshPath = null;
	$rootScope.refreshReload = false;

	var mPk = $routeParams.mPk;
	$scope.mPk = mPk;

	dataService.getMatch(mPk)
	.then(function (match) {
		$scope.match = processMatch(match, player);
		return $scope.match;
	}).then(function (match) {
		var promises = $.map(match.players, dataService.getPlayer);
		$scope.players = {};
		$q.all(promises)
		.then(function (players) {
			$.each(players, function (i, player) {
				$scope.players[player.pk] = player;
			});
			blockUI.stop();
		});
	}).catch(function (response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error("There was an error fetching the data - please try again later...");
		blockUI.stop();
	});

	$scope.accept = function accept() {
		dataService.respondToInvitation(mPk, true)
		.then(function (match) {
			$location.path('/overview/refresh');
		}).catch(function (response) {
			$log.debug('error');
			$log.debug(response);
			toastr.error("There was an error...");
		});
	};
}); // AcceptController
