dirisApp.controller('VoteImageController',
function VoteImageController($http, $location, $log, $q, $rootScope, $routeParams, $scope, $timeout,
	                         blockUI, toastr, dataService, BACKEND_URL) {

	var player = dataService.getLoggedInPlayer();

	if (!player) {
		$location.path('/login');
		return;
	}

	if (!blockUI.state().blocking)
		blockUI.start();

	var mPk = $routeParams.mPk;
	var rNo = $routeParams.rNo;

	$scope.mPk = mPk;
	$scope.rNo = rNo;

	$scope.currentPlayer = player;
	$rootScope.menuItems = [{
		link: '#/overview',
		label: 'Overview',
		glyphicon: 'home'
	}, {
		link: '#/match/' + mPk,
		label: 'Match',
		glyphicon: 'knight'
	}];
	$rootScope.refreshPath = null;
	$rootScope.refreshReload = false;

	dataService.getMatch(mPk)
	.then(function (match) {
		$scope.match = processMatch(match, player);
		$scope.round = $scope.match.currentRoundObj;
		return $scope.match;
	}).then(function (match) {
		if ($scope.round.status === 's' || $scope.round.status === 'o')
			$location.path('/image/' + mPk + '/' + rNo).replace();
		else if ($scope.round.status === 'f')
			$location.path('/review/' + mPk + '/' + rNo).replace();
		else {
			var promises = $.map(match.players, dataService.getPlayer);
			$scope.players = {};
			$q.all(promises)
			.then(function (players) {
				$.each(players, function (i, player) {
					$scope.players[player.pk] = player;
				});
				blockUI.stop();
			});
		}
	}).catch(function(response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error("There was an error fetching the data - please try again later...");
		blockUI.stop();
	});

	dataService.getImages()
	.then(function (images) {
		$scope.images = {};
		$.each(images, function (k, img) {
			$scope.images['' + img.pk] = img;
		});
	}).catch(function (response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error("There was an error fetching the data - please try again later...");
	});

	$scope.selectImage = function selectImage(image) {
		if (image.pk != $scope.round.details.image.pk)
			$scope.selectedImage = image;
	};

	$scope.submitVote = function submitVote() {
		dataService.submitVote(mPk, rNo, $scope.selectedImage.pk)
		.then(function (match) {
			$log.debug('new match:', match);
			$location.path('/match/' + mPk + '/refresh').replace();
		}).catch(function (response) {
			$log.debug('error');
			$log.debug(response);
			toastr.error("There was an error");
		});
	};
});
