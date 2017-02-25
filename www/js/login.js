dirisApp.controller('LoginController',
function LoginController($http, $localStorage, $location, $log, $rootScope, $scope, $timeout,
	                     authManager, blockUI, jwtHelper, toastr, dataService, BACKEND_URL) {

	$rootScope.menuItems = [];
	$rootScope.refreshPath = null;
	$rootScope.refreshReload = false;

	if (authManager.isAuthenticated()) {
		$log.debug('already authenticated');
		$location.path('/overview/refresh').replace();
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	$scope.login = function() {
		myBlockUI.start();

		$log.debug('try to login');

		dataService.getToken($scope.player.name, $scope.player.password)
		.then(function (token) {
			$log.debug('token:', token);

			if (!token)
				throw new Error('no token');

			authManager.authenticate();

			$timeout(function() {
				$location.path('/overview/refresh').replace();
			});
		}).catch(function (response) {
			$log.debug(response);

			authManager.unauthenticate();

			$scope.$apply(function() {
				$scope.message = response.message || "There was an error...";
			});

			myBlockUI.stop();
		});
	}; // login
}); // LoginController
