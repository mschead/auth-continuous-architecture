var _token = 'NO_VALUE';

$('#login').on('click', function (e) {
  alert("Connecting to server ...");
      
  var name = $('#username').val();
  var password = $('#password').val();

  var data = {
    name: name,
    password: password
  };

  $.ajax({
    url: '/device/login',
    type: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (data, status, xhr) {
      _token = xhr.getResponseHeader('x-auth');
      alert("Success in login!");
    },
    error: function (data){
      alert("Error trying to login!");
    }
  });

});

$('#send').on('click', function (e) {
  alert("Sending data ...");
  
  var data = {
    value: $('#deviceValue').val()
  };

  $.ajax({
    url: '/device/send',
    type: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': _token
    },
    success: function (data) {
      alert("Data has been sent!");
    },
    error: function (data) {
      alert("Error sending data: " + data);        
    }
  
  });
});