'use strict';

dirisApp.controller('ProfileController',
function ProfileController($location, $log, $rootScope, $routeParams, $scope, blockUI, dataService) {

    var player = dataService.getLoggedInPlayer();

    if (!player) {
        $location.path('/login');
        return;
    }

    $scope.currentPlayer = player;
    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }];

    if (!blockUI.state().blocking)
        blockUI.start();

    var pPk = $routeParams.pPk;
    var action = $routeParams.action;

    if (!pPk)
        pPk = player.pk;

    if (!action)
        if (pPk == player.pk)
            action = 'edit';
        else
            action = 'view';

    $rootScope.refreshPath = null;
    $rootScope.refreshReload = false;

    dataService.getPlayer(pPk)
    .then(function (player) {
        $scope.player = player;
        blockUI.stop();
        $log.debug('Player: ', $scope.player);
    }).catch(function(response) {
        $log.debug('error');
        $log.debug(response);
    });

}); // ProfileController
