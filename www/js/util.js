function shuffle(o) {
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
		;
	return o;
};

function processRound(round, player) {
	round.isStoryteller = player.key.id === round.storyTellerKey.id;
	round.hasSubmittedImage = player.key.id in round.images;
	round.hasVoted = player.key.id in round.votes;
	return round;
}

function processMatch(match, player) {
	match.rounds = $.map(match.rounds, function(round) {
		return processRound(round, player);
	});
	match.currentRoundObj = match.rounds[match.currentRound];

	var score = match.standings[player.key.id];
	var pos = 1;
	$.each(match.standings, function(k, v) {
		if (v > score)
			pos++;
	});
	match.playerPosition = pos;
	match.playerPositionOrd = getOrdinal(pos);
	return match;
}

function getOrdinal(n) {
   var s=["th","st","nd","rd"],
       v=n%100;
   return n+(s[(v-20)%10]||s[v]||s[0]);
}
