dixitApp.factory('dataService', 
function($localStorage, $http, BACKEND_URL) {
     
    var factory = {}, 
    	matches = {},
    	players = {},
    	images = {},
    	loggedInPlayer = null;

    factory.getLoggedInPlayer = function() {
    	if (!loggedInPlayer) {
    		var player = $localStorage.loggedInPlayer;
    		if (player)
    			loggedInPlayer = player;
    		else {
    			loggedInPlayer = null;
    			delete $localStorage.loggedInPlayer;
    		}
    	}

		return loggedInPlayer;
    };

    factory.setLoggedInPlayer = function(player) {
    	if (player) {
    		loggedInPlayer = player;
    		$localStorage.loggedInPlayer = player;
    	} else {
    		loggedInPlayer = null;
    		delete $localStorage.loggedInPlayer;
    	}
    };
 
    factory.getMatches = function(pId, forceRefresh, fallback) {
    	return new Promise(function(resolve, reject) {
			if (!forceRefresh)
				resolve(matches);
			else {
				$http.get(BACKEND_URL + '/player/id/' + pId + '/matches')
				.then(function(response) {
					matches = {};
					$.each(response.data, function(k, match) {
						$localStorage['match_' + match.key.id] = match;
						matches[match.key.id] = match;
					});
					resolve(response.data);
				}).catch(function(response) {
					if (forceRefresh && fallback) {
						// TODO add message
						$.each($localStorage, function(key, match) {
							if (key.substr(0, 6) === 'match_')
								matches[key.substr(6)] = match;
						});
						resolve(matches);
					} else
						reject(response);
				});
			}
    	});
    };
 
    factory.getMatch = function(mId, forceRefresh) {
    	return new Promise(function(resolve, reject) {
			if (!forceRefresh && mId in matches)
				resolve(matches[mId]);
			else if (!forceRefresh && ('match_' + mId) in $localStorage) {
				matches[mId] = $localStorage['match_' + mId];
				resolve(matches[mId]);
			} else {
				$http.get(BACKEND_URL + '/match/' + mId)
				.then(function(response) {
					$localStorage['match_' + mId] = response.data;
					matches[mId] = response.data;
					resolve(response.data);
				}).catch(function(response) {
					reject(response);
				});
			}
    	});
    };
 
    factory.getPlayers = function(forceRefresh, fallback) {
    	return new Promise(function(resolve, reject) {
			if (!forceRefresh)
				resolve(players);
			else {
				$http.get(BACKEND_URL + '/player')
				.then(function(response) {
					players = {};
					$.each(response.data, function(k, player) {
						$localStorage['player_' + player.key.id] = player;
						players[player.key.id] = player;
					});
					resolve(players);
				}).catch(function(response) {
					if (forceRefresh && fallback) {
						// TODO add message
						$.each($localStorage, function(key, player) {
							if (key.substr(0, 7) === 'player_')
								players[key.substr(7)] = player;
						});
						resolve(players);
					} else
						reject(response);
				});
			}
    	});
    };
 
    factory.getPlayer = function(pId, forceRefresh) {
    	return new Promise(function(resolve, reject) {
			if (!forceRefresh && pId in players)
				resolve(players[pId]);
			else if (!forceRefresh && ('player_' + pId) in $localStorage) {
				players[pId] = $localStorage['player_' + pId];
				resolve(players[pId]);
			} else {
				$http.get(BACKEND_URL + '/player/id/' + pId)
				.then(function(response) {
					$localStorage['player_' + pId] = response.data;
					players[pId] = response.data;
					resolve(response.data);
				}).catch(function(response) {
					reject(response);
				});
			}
    	});
    };
 
    factory.getPlayerByName = function(name) {
    	return new Promise(function(resolve, reject) {
			$http.get(BACKEND_URL + '/player/name/' + name)
			.then(function(response) {
				player = response.data[0];
				if (player) {
					$localStorage['player_' + player.key.id] = player;
					players[player.key.id] = player;
					resolve(player);
				} else {
					response.message = "There was an error - player \"" + name + "\" not found.";
					reject(response);
				}
			}).catch(function(response) {
				response.message = "There was an error when fetching the data.";
				reject(response);
			});
    	});
    };
 
    factory.getImages = function(mId, rNo, forceRefresh, fallback) {
    	return new Promise(function(resolve, reject) {
			if (!forceRefresh)
				this.getMatch(mId)
				.then(function(match) {
					// TODO find images in match object
					resolve(images);
				}).catch(function() {
					resolve(images);
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
 
    return factory;
});
