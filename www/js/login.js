dixitApp.controller('LoginController', 
function($location, $scope, $timeout, blockUI, dataService) {

	var player = dataService.getLoggedInPlayer();

	if (player) {
		$location.path('/overview/refresh').replace();
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	$scope.login = function() {
		myBlockUI.start();

		dataService.getPlayerByName($scope.player.name)
		.then(function(result) {
			dataService.setLoggedInPlayer(result);
			$timeout(function() {
				$location.path('/overview/refresh').replace();
			});
		}).catch(function(response) {
			console.log('LoginController: error');
			console.log('LoginController: response = ' + JSON.stringify(response));
			dataService.setLoggedInPlayer(null);
			$scope.$apply(function() {
				$scope.message = response.message || "There was an error...";
			});
			myBlockUI.stop();
		});
	}; // login

}); // LoginController
