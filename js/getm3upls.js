$(document).ready(function () {
  console.log('getm3upls');
  //load playlist on ready

  // getPlaylists("https://pastebin.com/raw/t1mBJ2Yi");


  getPlaylists("http://ndasat.pro:8000/get.php?username=884199991&password=1593574628&type=m3u_plus&output=ts");
  

  $('#m3uForm').on('submit', function (e) {
    e.preventDefault();

    //var $this = $(this);
    var playlists = $('#playlists').val();

    getPlaylists(playlists);

  });
});

function getPlaylists(playlists) {
  
  $('#result').html(''); // empty list

  $.ajax({
    url: 'http://localhost/m3u8parser/m3u-parser.php',
    method: 'GET',
    dataType: 'jsonP',
    data: {
      url: playlists
    }
  }).done(function (data) {
    //if(data.status != 'ok'){ throw data.message; }
    console.log(data);
    $('#result').text('Total: '+data.length+' Channels found'); // TOTAL COUNT

    $.each(data, function (i, item) {

      var tvglogo = '';
      
      if (typeof item["tvg-logo"] != 'undefined')
        tvglogo = '<img src="'+item["tvg-logo"]+'" alt="' + item.title + '" style="width:38px;height:38px;float:left;marging: 5px;border:solid 1px #ccc;margin-right:5px">';
        
      $('#result').append('<li><a href="' + item.url + '">' + tvglogo + ' ► ' + item.title + '</a><br>' + item.url + '</li>');

    });

  });

}

/* TEST TO LOAD VIDEO WITH VIDEOJS */
/*
$(document).on('click', '#result a', function (e) {
  e.preventDefault();
  
  $('#result a').removeClass('bold');
  $(this).addClass('bold');
  
  var mediaUrl = $(this).attr('href');
  //alert(mediaUrl);
  loadStream(mediaUrl)
});
*/
