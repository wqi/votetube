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

var refreshQueue = function(queue) {
	$('.voting').empty();
	for (var i=0; i<queue.length; i++) {
		generateVoteEntry();
		// var id = sorted[i].split('?v=')[1].split('&')[0];
		getVideoInfo(queue[i].videoId, updateVoteEntry, i);
	}
}

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

	var thumbsUp = $("#thumbs-up." + data.id);
	var thumbsDown = $("#thumbs-down." + data.id);
	if (thumbsUp !== undefined && thumbsDown !== undefined) {
		thumbsUp.attr('onclick','vote(\'' + thumbsUp.id + '\');');
		thumbsDown.attr('onclick','vote(\'' + thumbsDown.id + '\');');
	}

	for (var i=0; i<videoQueue.length; i++) {
		if (videoQueue[i].videoId == data.id) {
			if (videoQueue[i].upvotedUsers.includes(username)) {
				thumbsUp.addClass('upvotecolor');
			} else if (videoQueue[i].downvotedUsers.includes(username)) {
				thumbsDown.addClass('downvotecolor');
			}
		}
	}

	// videoQueue[n] = data;
}

var insertionSortByPoints = function(array) {
	for (var i=0; i<array.length; i++) {
		var j = i;
		while (j > 0 && array[j-1].points > array[j].points) {
			var temp = array[j-1];
			array[j-1] = array[j];
			array[j] = temp;
			j--;
		}
	}
	return array;
}

var sortVideos = function(videoArray) {
	// var tuples = [];
	var sortedVideos = [];
	// console.log(videoArray);

	for (var key in videoArray) {
		if (videoArray.hasOwnProperty(key)) {
			var video = videoArray[key];
			sortedVideos.push(video);
		}
	}
	// console.log(sortedVideos);

	// insertion sort since most of the time it's almost sorted
	return insertionSortByPoints(sortedVideos).reverse();

	// sortedVideos.sort(function(a, b) {
	// 	a = a.points;
	// 	b = b.points;

	// 	return a < b ? -1 : (a > b ? 1 : 0);
	// });
	// for (var i = 0; i < tuples.length; i++) {
	// 	var id = tuples[i][0];
	// 	sortedVideos.push(id);
	// }

	// return sortedVideos.reverse();
}

