$(function() {
	var apiKey = 'AIzaSyACwwIf-fpEqbbjWd7Ae09je7ixYyJsqc4';

	$('#submit-video').click(function() { submitVideo(); });

	var submitVideo = function() {
		var url = $('#video-url').val();
		var id = url.split('?v=')[1].split('&')[0];
		getVideoInfo(id);
	}

	var getVideoInfo = function(id) {
		var requestURL = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + apiKey + '&part=snippet';
		$.getJSON(requestURL, parseInfo);
	}

	var parseInfo = function(data) {
		var title = data.items[0].snippet.title;
		var uploader = data.items[0].snippet.channelTitle;
		var thumbURL = data.items[0].snippet.thumbnails.default.url;
		
		$('.video-title').text(title);
		$('.video-uploader').text(uploader);
		$('.video-thumbnail').empty();
		$('.video-thumbnail').append('<img src="' + thumbURL + '" width="90px">');
	}
});