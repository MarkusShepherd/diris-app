'use strict';

/*jslint browser: true, nomen: true */
/*global _, dirisApp, utils */

dirisApp.controller('MatchController', function MatchController(
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
        mPk = $routeParams.mPk,
        forceRefresh = _.now() >= dataService.getNextUpdate();

    if (!player) {
        $location.search('dest', $location.path()).path('/login');
        return;
    }

    if (!blockUI.state().blocking) {
        blockUI.start();
    }

    $scope.currentPlayer = player;
    $scope.mPk = mPk;

    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }, {
        link: '#/chat/' + mPk,
        label: 'Chat',
        glyphicon: 'send'
    }];
    $rootScope.refreshButton = true;

    dataService.getMatch(mPk, forceRefresh)
        .then(function (match) {
            $log.debug('Match:', match);
            $scope.match = match;
            $scope.round = match.currentRoundObj;
            $log.debug('Round:', $scope.round);
            return $q.all(_.map(match.players, function (pk) {
                return dataService.getPlayer(pk, false);
            }));
        }).then(function (players) {
            $scope.players = {};
            _.forEach(players, function (player) {
                $scope.players[player.pk.toString()] = player;
            });
            dataService.setNextUpdate('_renew');
        }).catch(function (response) {
            $log.debug('error');
            $log.debug(response);
            toastr.error('There was an error fetching the data - please try again later...');
        }).then(blockUI.stop);

    dataService.getImages(mPk, forceRefresh, true)
        .then(function (images) {
            $scope.images = {};
            _.forEach(images, function (img) {
                $scope.images[img.pk.toString()] = img;
            });
            $log.debug('Images:', $scope.images);
        }).catch(function (response) {
            $log.debug('error');
            $log.debug(response);
            toastr.error('There was an error fetching the data - please try again later...');
        });

    dataService.getChatNumNew(mPk, true)
        .then(function (numMessages) {
            $scope.numMessages = numMessages;
        });

    $scope.action = utils.roundAction;

    $scope.rematch = function rematch() {
        if (!blockUI.state().blocking) {
            blockUI.start();
        }

        var match = $scope.match,
            playerPks = _(match.players).without(player.pk).unshift(player.pk).value();

        dataService.createMatch(playerPks, match.total_rounds, match.timeout)
            .then(function (newMatch) {
                $log.debug(newMatch);
                $location.path('/accept/' + newMatch.pk);
            }).catch(function (response) {
                var message = _.get(response, 'data[0]', response) || 'There was an error creating the match...';
                $log.debug(response);
                $log.debug(message);
                blockUI.stop();
                toastr.error(message);
            });
    };

    $scope.check = function check() {
        if (!blockUI.state().blocking) {
            blockUI.start();
        }

        $q(function (resolve) {
            navigator.notification.confirm(
                'If the game is in an inconsistent state you can perform a check here.\n\n' +
                    'If this does not fix the problem please send a bug report or ' +
                    'an email through the links at the bottom of every page.',
                resolve,
                'Check status',
                ['OK', 'Cancel']
            );
        }).then(function (buttonIndex) {
            if (buttonIndex === 1) {
                return dataService.getMatch(mPk, true, true);
            }
            return false;
        }).then(function (match) {
            if (match) {
                $scope.match = match;
                $scope.round = match.currentRoundObj;
            }

            $log.debug('Match:', match);
            $log.debug('Round:', $scope.round);
        }).catch(function (response) {
            $log.debug('error');
            $log.debug(response);
            toastr.error('There was an error fetching the data - please try again later...');
        }).then(blockUI.stop);
    };
}); // MatchController
