var _socket;

jQuery('#login').on('click', function (e) {
  alert("Connecting to socket");
      
  _socket = io.connect('localhost:3000');
  _socket.on('connect', function(){
    
    _socket.emit('authentication', {username: jQuery('#username').val(), password: jQuery('#password').val()});
    
    _socket.on('authenticated', function() {
      alert("Connected!");
      
      _socket.on('newValue', (data) => {
        console.log(`Got ${data} from device!`);
      });

    });
  
    _socket.on('unauthorized', function(err){
      alert("There was an error with the authentication!");
    });

  });
});


jQuery('#join').on('click', function (e) {
  var device = { name: jQuery('#deviceName').val() }
  
  _socket.emit('join', device, function (e) {
    if (e) {
      console.log(e);
    } else {
      console.log('join successful')
    }
  });
});

jQuery('#leave').on('click', function (e) {
  var device = { name: jQuery('#deviceName').val() }

  _socket.emit('leave', device, function (e) {
    if (e) {
      console.log(e);
    } else {
      console.log('join successful')
    }
  });
});