$(function() {

	$('#submit-video').click(function() { submitVideo(); });

	var submitVideo = function() {
		$('.voting').empty();
		generateVoteEntry();
		var url = $('#video-url').val();
		var id = url.split('?v=')[1].split('&')[0];
		getVideoInfo(id, updateVoteEntry);
	}

	
});

var apiKey = 'AIzaSyACwwIf-fpEqbbjWd7Ae09je7ixYyJsqc4';

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

var getVideoInfo = function(id, callback) {
	var requestURL = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + apiKey + '&part=snippet';
	$.getJSON(requestURL, function(data) {
		var parsedInfo = parseInfo(data);
		callback(parsedInfo);
	});
}

var parseInfo = function(data) {
	var res = {
		'title': data.items[0].snippet.title,
		'uploader': data.items[0].snippet.channelTitle,
		'thumbURL': data.items[0].snippet.thumbnails.default.url
	}
	return res;
	
}

var updateVoteEntry = function(data) {
	$('.video-title').text(data.title);
	$('.video-uploader').text(data.uploader);
	$('.video-thumbnail').empty();
	$('.video-thumbnail').append('<img src="' + data.thumbURL + '" width="90px">');
}

var sortVideos = function(videoArray) {
	var tuples = [];
	var sortedVideos = [];
	for (var video in videoArray) {
		tuples.push([video["id"], video["points"]]);
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

	return sortedVideos;
}
