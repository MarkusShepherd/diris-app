'use strict';

dirisApp.controller('AcceptController', function AcceptController(
    $location,
    $log,
    $q,
    $rootScope,
    $routeParams,
    $scope,
    blockUI,
    toastr,
    dataService
) {
    var player = dataService.getLoggedInPlayer(),
        mPk = $routeParams.mPk;

    if (!player) {
        $location.path('/login');
        return;
    }

    if (!blockUI.state().blocking) {
        blockUI.start();
    }

    $scope.currentPlayer = player;
    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }];
    $rootScope.refreshPath = null;
    $rootScope.refreshReload = false;

    $scope.mPk = mPk;

    dataService.getMatch(mPk)
        .then(function (match) {
            $scope.match = processMatch(match, player);
            return $q.all(_.map($scope.match.players, function (pk) {
                return dataService.getPlayer(pk, false);
            }));
        }).then(function (players) {
            $scope.players = {};
            _.forEach(players, function (player) {
                $scope.players[player.pk] = player;
            });
        }).catch(function (response) {
            $log.debug('error');
            $log.debug(response);
            toastr.error('There was an error fetching the data - please try again later...');
        }).then(blockUI.stop);

    $scope.accept = function accept() {
        blockUI.start();
        dataService.respondToInvitation(mPk, true)
            .then(function () {
                $location.path('/overview');
            }).catch(function (response) {
                $log.debug('error');
                $log.debug(response);
                blockUI.stop();
                toastr.error('There was an error...');
            });
    };
}); // AcceptController
