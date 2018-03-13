var _socket;

jQuery('#login').on('click', function (e) {
  alert("Connecting to socket");
      
  _socket = io.connect('localhost:3000');
  _socket.on('connect', function(){
    
    _socket.emit('authentication', {username: jQuery('#username').val(), password: jQuery('#password').val()});
    
    _socket.on('authenticated', function() {
      alert("Connected!");
      
      _socket.emit('join', { name: jQuery('#username').val() }, function () {
        console.log('join successful')
      });

      _socket.on('newValue', (data) => {
        console.log(`Got ${data.value} from device!`);
      });

    });
  
    _socket.on('unauthorized', function(err){
      alert("There was an error with the authentication!");
    });

  });
});

jQuery('#send').on('click', function (e) {
  alert("Sending data");
  _socket.emit('createValue', { value: 20 });
});

jQuery('#join').on('click', function (e) {
  var device = { name: jQuery('#device').val() } 
  
  _socket.emit('join', device, function () {
  console.log('join successful')
  });
});