dirisApp.factory('dataService',
function dataService($localStorage, $log, $http, $q, jwtHelper, BACKEND_URL) {

	var factory = {},
		matches = {},
		players = {},
		images = {},
		token = null,
		loggedInPlayer = null,
		gcmRegistrationID = null;

	factory.setToken = function setToken(newToken) {
		if (newToken && !jwtHelper.isTokenExpired(newToken)) {
			token = newToken;
			loggedInPlayer = jwtHelper.decodeToken(newToken);
		} else {
			token = null;
			loggedInPlayer = null;
		}

		$localStorage.token = token;
		$localStorage.loggedInPlayer = loggedInPlayer;
	};

	factory.getToken = function getToken(username, password) {
		$log.debug('username:', username);

		token = token || $localStorage.token;

		if (token && !jwtHelper.isTokenExpired(token))
			return $q.resolve(token);

		return $http.post(BACKEND_URL + '/jwt', {
			username: username,
			password: password
		}, {skipAuthorization: true})
		.then(function(response) {
			$log.debug('received token');
			$log.debug(response);

			factory.setToken(response.data.token);
			return $localStorage.token;
		}).catch(function(response) {
			$log.debug('failed to obtain token');
			$log.debug(response);

			factory.setToken(null);
			return;
		});
	};

	// TODO
	// factory.setGcmRegistrationId = function(gri) {
	// 	gcmRegistrationID = gri;
	// };

	// TODO
	// factory.updatePlayer = function(pId, player) {
	// 	$http.post(BACKEND_URL + '/player/update/' + pId, player)
	// 	.then(function(response) {
	// 		$log.debug("Successfully updated player " + pId);
	// 		$log.debug(response);
	// 	})
	// 	.catch(function(response) {
	// 		$log.debug("Failed to updated player " + pId);
	// 		$log.debug(response);
	// 	});
	// };

	factory.getLoggedInPlayer = function getLoggedInPlayer() {
		loggedInPlayer = loggedInPlayer || $localStorage.loggedInPlayer;
		return loggedInPlayer;
	};

	// TODO
	// factory.setLoggedInPlayer = function(player) {
	// 	if (player) {
	// 		loggedInPlayer = player;
	// 		$localStorage.loggedInPlayer = player;

	// 		if (gcmRegistrationID) {
	// 			$log.debug("Updating GCM ID " + gcmRegistrationID + " for player " + player.name + "(" + player.key.id + ")");
	// 			factory.updatePlayer(player.key.id, {
	// 				gcmRegistrationID: gcmRegistrationID
	// 			});
	// 			gcmRegistrationID = null;
	// 		}
	// 	} else {
	// 		loggedInPlayer = null;
	// 		delete $localStorage.loggedInPlayer;
	// 	}
	// };

	factory.getMatches = function getMatches(forceRefresh, fallback) {
		if (!forceRefresh)
			return $q.resolve(matches);

		return $http.get(BACKEND_URL + '/matches/')
		.then(function (response) {
			matches = {};
			$.each(response.data.results, function (k, match) {
				$localStorage['match_' + match.pk] = match;
				matches[match.pk] = match;
			});
			return matches;
		}).catch(function (response) {
			if (forceRefresh && fallback) {
				// TODO add message
				$.each($localStorage, function(key, match) {
					if (key.substr(0, 6) === 'match_')
						matches[key.substr(6)] = match;
				});
				return matches;
			} else
				throw new Error(response);
		});
	};

	factory.getMatch = function getMatch(mPk, forceRefresh) {
		if (!forceRefresh && mPk in matches)
			return $q.resolve(matches[mPk]);

		if (!forceRefresh && ('match_' + mPk) in $localStorage) {
			matches[mPk] = $localStorage['match_' + mPk];
			return $q.resolve(matches[mPk])
		}

		return $http.get(BACKEND_URL + '/matches/' + mPk)
		.then(function (response) {
			$localStorage['match_' + mPk] = response.data;
			matches[mPk] = response.data;
			return matches[mPk];
		});
	};

	factory.getPlayers = function getPlayers(forceRefresh, fallback) {
		if (!forceRefresh)
			return $q.resolve(players);

		return $http.get(BACKEND_URL + '/players/')
		.then(function (response) {
			players = {};
			$.each(response.data.results, function(k, player) {
				$localStorage['player_' + player.pk] = player;
				players[player.pk] = player;
			});
			return players;
		}).catch(function (response) {
			if (forceRefresh && fallback) {
				// TODO add message
				$.each($localStorage, function(key, player) {
					if (key.substr(0, 7) === 'player_')
						players[key.substr(7)] = player;
				});
				return players;
			} else
				throw new Error(response);
		});
	};

	factory.getPlayer = function(pPk, forceRefresh) {
		if (!forceRefresh && pPk in players)
			return $q.resolve(players[pPk]);

		if (!forceRefresh && ('player_' + pPk) in $localStorage) {
			players[pPk] = $localStorage['player_' + pPk];
			return $q.resolve(players[pPk]);
		}

		return $http.get(BACKEND_URL + '/players/' + pPk)
		.then(function(response) {
			$localStorage['player_' + pPk] = response.data;
			players[pPk] = response.data;
			return players[pPk];
		});
	};

	// TODO
	// factory.getPlayerByExternalId = function(pId, forceRefresh) {
	// 	return new Promise(function(resolve, reject) {
	// 		$http.get(BACKEND_URL + '/player/id/' + pId + '/external')
	// 		.then(function(response) {
	// 			var player = response.data;
	// 			if (player) {
	// 				$localStorage['player_' + player.key.id] = player;
	// 				players[player.key.id] = player;
	// 				resolve(player);
	// 			} else {
	// 				response.message = "There was an error - player could not be found.";
	// 				reject(response);
	// 			}
	// 		}).catch(function(response) {
	// 			response.message = "There was an error when fetching the data.";
	// 			reject(response);
	// 		});
	// 	});
	// };

	// TODO
	// factory.getPlayerByName = function(name) {
	// 	return new Promise(function(resolve, reject) {
	// 		$http.get(BACKEND_URL + '/player/name/' + name)
	// 		.then(function(response) {
	// 			var player = response.data[0];
	// 			if (player) {
	// 				$localStorage['player_' + player.key.id] = player;
	// 				players[player.key.id] = player;
	// 				resolve(player);
	// 			} else {
	// 				response.message = "There was an error - player \"" + name + "\" not found.";
	// 				reject(response);
	// 			}
	// 		}).catch(function(response) {
	// 			response.message = "There was an error when fetching the data.";
	// 			reject(response);
	// 		});
	// 	});
	// };

	// TODO
	// factory.getPlayerByEmail = function(email) {
	// 	return new Promise(function(resolve, reject) {
	// 		// TODO save in localStorage, retrieve by email
	// 		$http.get(BACKEND_URL + '/player/email?email=' + email)
	// 		.then(function(response) {
	// 			var player = response.data;
	// 			if (player) {
	// 				$localStorage['player_' + player.key.id] = player;
	// 				players[player.key.id] = player;
	// 				resolve(player);
	// 			} else {
	// 				response.message = "There was an error - player \"" + email + "\" not found.";
	// 				reject(response);
	// 			}
	// 		}).catch(function(response) {
	// 			response.message = "There was an error when fetching the data.";
	// 			reject(response);
	// 		});
	// 	});
	// };

	// TODO
	factory.getImage = function(iId, forceRefresh) {
		return new Promise(function(resolve, reject) {
			if (!forceRefresh && iId in images)
				resolve(images[iId]);
			else if (!forceRefresh && ('image_' + iId) in $localStorage) {
				images[iId] = $localStorage['image_' + iId];
				resolve(images[iId]);
			} else {
				$http.get(BACKEND_URL + '/image/' + iId)
				.then(function(response) {
					$localStorage['image_' + iId] = response.data;
					images[iId] = response.data;
					resolve(response.data);
				}).catch(function(response) {
					reject(response);
				});
			}
		});
	};

	// TODO
	factory.getImages = function(mId, rNo, forceRefresh, fallback) {
		return new Promise(function(resolve, reject) {
			if (!forceRefresh)
				factory.getMatch(mId)
				.then(function(match) {
					var rounds = rNo in match.rounds ? [match.rounds[rNo]] : match.rounds;
					var promises = [];
					$.each(rounds, function(i, round) {
						$.each(round.images, function(k, iId) {
							promises.push(factory.getImage(iId, false));
						});
					});

					Promise.all(promises)
					.then(function(response) {
						var result = {};
						$.each(response, function(k, image) {
							result[image.key.id] = image;
						});
						resolve(result);
					}).catch(function(reason) {
						reject(reason);
					});
				}).catch(function() {
					reject("Match could not be found");
				});
			else {
				var url = BACKEND_URL + '/match/' + mId + '/images';
				if (rNo !== undefined && rNo !== null)
					url += '/' + rNo;
				$http.get(url)
				.then(function(response) {
					$.each(response.data, function(k, image) {
						$localStorage['image_' + image.key.id] = image;
						images[image.key.id] = image;
					});
					resolve(images);
				}).catch(function(response) {
					if (forceRefresh && fallback) {
						// TODO add message
						$.each($localStorage, function(key, image) {
							if (key.substr(0, 6) === 'image_')
								images[key.substr(6)] = image;
						});
						resolve(images);
					} else
						reject(response);
				});
			}
		});
	};

	return factory;
});
