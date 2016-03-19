dixitApp.controller('LoginController', 
function($http, $localStorage, $location, $log, $rootScope, $scope, $timeout, auth, blockUI, dataService, BACKEND_URL) {

	$rootScope.menuItems = [];
	$rootScope.refreshPath = null;
	$rootScope.refreshReload = false;

	if (auth.isAuthenticated)
		$location.path('/overview/refresh').replace();
	else
		auth.signin({}, function(profile, token) {
			$log.debug(profile);
			$log.debug(token);

			$localStorage.profile = profile;
			$localStorage.token = token;

			var name = profile.username;
			var email = profile.email;
			var userID = profile.user_id;
			var avatar = profile.picture;

			dataService.getPlayerByExternalId(userID)
			.then(function(result) {
				dataService.setLoggedInPlayer(result);
				$timeout(function() {
					$location.path('/overview/refresh').replace();
				});
			}).catch(function(response) {
				var player = {
					name: name,
					email: email,
					externalID: userID,
					avatarURL: avatar
				}
				$log.debug('LoginController: try to register new player', player);

				$http.post(BACKEND_URL + '/player', player)
				.then(function(response) {
					var player = response.data;

					if (!player) {
						$scope.$apply(function() {
							$scope.message = "There was an error - player \"" +
								name + "\" could not be registered. " +
								"Please try again in a couple of minutes.";
						});
						return;
					}

					$log.debug(player.key.id);

					dataService.setLoggedInPlayer(player);
					$timeout(function() {
						$location.path('/overview/refresh').replace();
					});
				}).catch(function(response) {
					$log.debug('error');
					$log.debug(response);

					dataService.setLoggedInPlayer(null);
					$scope.$apply(function() {
						$scope.message = response.message || "There was an error...";
						blockUI.stop();
					});
				});
			});
		}, function (err) {
			$log.debug("Error:", err);
			dataService.setLoggedInPlayer(null);
			$scope.$apply(function() {
				$scope.message = "There was an error...";
			});
		});
}); // LoginController
