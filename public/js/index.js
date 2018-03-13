var _socket;

jQuery('#login').on('click', function (e) {
    alert("Connecting to socket");
    _socket = io.connect('localhost:3000');
    _socket.emit('confirm');

    _socket.emit('join', { name: 'face' }, function () {
      console.log('join successful')
    });

    _socket.on('newValue', (data) => {
      console.log(`Got ${data.value} from device!`);
    });
});

jQuery('#send').on('click', function (e) {
  alert("Sending data");
  _socket.emit('createValue', { value: 20 });
});