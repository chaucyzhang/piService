$(document).ready(function(){
     $('.button').click(function(){
	     $(this).toggleClass('on');
         url = document.URL + 'inputs';
        // url = document.URL + 'inputs/' +$(this).attr('id');
         $.post(url, function (data) {
            // console.log('API response received. port ' + data.gpio + ' value = ' + data.value);
			});

             playStream();

         return false;
  });
});



function playStream() {

        var player = document.getElementById('audioPlayer');

        (player.paused == true) ? toggle(0) : toggle(1);

}

function toggle(state) {

        var player = document.getElementById('audioPlayer');
        var src = "./mediaSource/bestHBDsongever.mp3";

        switch(state) {
                case 0:
                        player.src = src;
                        player.load();
                        player.play();
                        player_state = 1;
                        break;
                case 1:
                        player.pause();
                        player.currentTime = 0;
                        player.src = '';
                        player_state = 0;
                        break;
        }
}

