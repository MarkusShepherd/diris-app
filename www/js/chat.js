'use strict';

/*jslint browser: true, nomen: true */
/*global _, dirisApp, utils */

dirisApp.controller('ChatController', function ChatController(
    $location,
    $log,
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
        $location.search('dest', $location.path()).path('/login');
        return;
    }

    if (!blockUI.state().blocking) {
        blockUI.start();
    }

    // $scope.currentPlayer = player;
    // $scope.mPk = mPk;

    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }, {
        link: '#/match/' + mPk,
        label: 'Match',
        glyphicon: 'knight'
    }];
    $rootScope.refreshButton = true;

    dataService.getChat(mPk)
        .then(function (messages) {
            $log.debug(messages);
            $scope.messages = messages;
        }).catch(function (response) {
            $log.debug('error');
            $log.debug(response);
            toastr.error('There was an error fetching the data - please try again later...');
        }).then(blockUI.stop);
}); // MatchController
