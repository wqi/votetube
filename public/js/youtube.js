var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: window.innerHeight,
	width: window.innerWidth,
	videoId: 'Fo-gan8U914',
    playerVars: {'wmode': 'opaque', 'autoplay': 0, 'controls': 0, 'showinfo': 0},
    events: {
      'onReady': onPlayerReady,
    }
  });
}

// 4. The API will call this function when the video player is ready.
var onPlayerReady = function(event) {
  event.target.playVideo();
}

var syncVideo = function(id, timestamp) {
  if (id === null) {
    id = "Fo-gan8U914" // default video, no videos in queue
  }
  var currentID = player.getVideoData()['video_id'];
  if (currentID != id) {
    player.loadVideoById(id, timestamp, "default");
    getVideoInfo(id, function(data) {
      $('#top-video-title').text(data.title);
    })
  } else {
    if (Math.abs(player.getCurrentTime() - timestamp) > 3) {
      player.seekTo(timestamp, true);
    }
  }
}

var setPlayerSize = function(width, height) {
  player.setSize(width, height);
}

