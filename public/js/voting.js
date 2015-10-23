$(function() {

	// $('#submit-video').click(function() { submitVideo(); });

	// var submitVideo = function() {
	// 	$('.voting').empty();
	// 	generateVoteEntry();
	// 	var url = $('#video-url').val();
	// 	var id = url.split('?v=')[1].split('&')[0];
	// 	getVideoInfo(id, updateVoteEntry);
	// }

});

var apiKey = 'AIzaSyACwwIf-fpEqbbjWd7Ae09je7ixYyJsqc4';
var videoQueue = [];

var generateVoteEntry = function() {
	var domBlock =
		'<div class="video-entry">' +
			'<div class="vote-arrows">' +
				'<i class="fa fa-thumbs-up"></i>' +
				'<p id="counter">0</p>' +
				'<i class="fa fa-thumbs-down"></i>' +
			'</div>' +
			'<div class="video-thumbnail"></div>' +
			'<div class="video-info-text">' +
				'<div class="video-title"></div>' +
				'<div class="video-uploader"></div>' +
			'</div>' +
		'</div>';
	$('.voting').append(domBlock);
}

var getVideoInfo = function(id, callback, callback_param) {
	var requestURL = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + apiKey + '&part=snippet';
	$.getJSON(requestURL, function(data) {
		var parsedInfo = parseInfo(data);
		if (callback_param === undefined)
			callback(parsedInfo);
		else
			callback(parsedInfo, callback_param);
	});
}

var parseInfo = function(data) {
	var res = {
		'id': data.items[0].id,
		'title': data.items[0].snippet.title,
		'uploader': data.items[0].snippet.channelTitle,
		'thumbURL': data.items[0].snippet.thumbnails.default.url
	}
	return res;	
}

var updateVoteEntry = function(data, n) {
	$('.video-entry:nth-child(' + (n+1) + ')').children('.vote-arrows').find('.fa-thumbs-up').attr('id', 'thumbs-up.' + data.id);
	$('.video-entry:nth-child(' + (n+1) + ')').children('.vote-arrows').find('.fa-thumbs-down').attr('id', 'thumbs-down.' + data.id);
	$('.video-entry:nth-child(' + (n+1) + ')').children('.video-info-text').find('.video-title').text(data.title);
	$('.video-entry:nth-child(' + (n+1) + ')').children('.video-info-text').find('.video-uploader').text(data.uploader);
	$('.video-entry:nth-child(' + (n+1) + ')').children('.video-thumbnail').empty();
	$('.video-entry:nth-child(' + (n+1) + ')').children('.video-thumbnail').append('<img src="' + data.thumbURL + '" width="90px">');

	var thumbsUp = document.getElementById("thumbs-up." + data.id);
	var thumbsDown = document.getElementById("thumbs-down." + data.id);
	if (thumbsUp !== undefined && thumbsDown !== undefined) {
		thumbsUp.setAttribute('onclick','vote(\'' + thumbsUp.id + '\');');
		thumbsDown.setAttribute('onclick','vote(\'' + thumbsDown.id + '\');');
	}

	videoQueue[n] = data;
}

var sortVideos = function(videoArray) {
	var tuples = [];
	var sortedVideos = [];

	for (var video in videoArray) {
		tuples.push([videoArray[video].url, videoArray[video].points]);
	}
	tuples.sort(function(a, b) {
		a = a[1];
		b = b[1];

		return a < b ? -1 : (a > b ? 1 : 0);
	});
	for (var i = 0; i < tuples.length; i++) {
		var id = tuples[i][0];
		sortedVideos.push(id);
	}

	return sortedVideos.reverse();
}
