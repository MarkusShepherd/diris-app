function shuffle(o) {
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
		;
	return o;
}

function processRound(round, player) {
	if (!round)
		return round;

	// round.details = $.filter(round.player_round_details || [],
	// 	                     function (details) { return !!(details && details.player === player.pk); })[0];

	$.each(round.player_round_details, function(i, details) {
		if (details.player === player.pk)
			round.details = details;
	});

	if (!round.details)
		return round;

	round.isStoryTeller = player.pk === round.storyteller;
	round.hasSubmittedImage = !!round.details.image;
	round.hasVoted = !!round.details.vote;

	round.readyForStoryImage = false;
	round.readyForOtherImage = false;
	round.readyForVote = false;

	if (round.status === 's' && round.isStoryTeller)
		round.readyForStoryImage = true;
	else if (round.status === 'o' && !round.isStoryTeller && !round.hasSubmittedImage)
		round.readyForOtherImage = true;
	else if (round.status === 'v' && !round.isStoryTeller && !round.hasVoted)
		round.readyForVote = true;

	round.hasAction = round.readyForStoryImage || round.readyForOtherImage || round.readyForVote;

	round.scoresArray = $.map(round.player_round_details, function(details) {
		return {
			playerPk: details.player,
			score: details.score
		};
	});

	return round;
}

function processMatch(match, player) {
	console.log(player.pk);
	console.log(match.player_match_details);

	match.rounds = $.map(match.rounds, function(round) {
		return processRound(round, player);
	});
	match.currentRoundObj = match.rounds[(match.current_round || 1) - 1];

	// match.details = $.filter(match.player_match_details || [],
	// 	                     function (details) { return !!(details && details.player === player.pk); })[0];
	$.each(match.player_match_details, function(i, details) {
		console.log(details);
		if (details.player === player.pk)
			match.details = details;
	});

	var score = match.details.score;
	var pos = 1;
	$.each(match.player_match_details, function(i, details) {
		if (details.score > score)
			pos++;
	});

	match.playerPosition = pos;
	match.playerPositionOrd = getOrdinal(pos);

	match.standingsArray = $.map(match.player_match_details, function(details) {
		return {
			playerId: details.player,
			score: details.score
		};
	});

	match.createdFromNow = moment(match.created).fromNow();
	match.lastModifiedFromNow = moment(match.last_modified).fromNow();

	match.hasAccepted = match.details.invitation_status === 'a';

	return match;
}

function getOrdinal(n) {
   var s=["th","st","nd","rd"],
       v=n%100;
   return n+(s[(v-20)%10]||s[v]||s[0]);
}

function isBrowser() {
	try {
		return device && device.platform === 'browser';
	} catch (err) {
		return true;
	}
}