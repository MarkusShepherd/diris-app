dixitApp.controller('LoginController', 
function($location, $scope, blockUI, dataService) {

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
			$scope.$apply(function() {
				dataService.setLoggedInPlayer(result);
				$location.path('/overview/refresh').replace();
			});
		}).catch(function(response) {
			console.log('LoginController: error');
			console.log('LoginController: response = ' + JSON.stringify(response));
			$scope.$apply(function() {
				dataService.setLoggedInPlayer(null);
				$scope.message = response.message || "There was an error...";
			});
			myBlockUI.stop();
		});
	}; // login

}); // LoginController
