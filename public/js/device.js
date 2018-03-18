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
    success: function (data) {
      alert("Success in login!: " + data);     
    },
    error: function (data){
      alert("Error sending data: " + data);        
    }
  });

});

$('#send').on('click', function (e) {
  alert("Sending data ...");
  
  $.ajax({
    url: '/device/send',
    type: 'post',
    data: {
      value: $('#deviceValue').val()
    },
    headers: {
      'Content-Type': 'application/json',
      'x-auth': _token
    },
    dataType: 'json',
    success: function (data) {     
    },
    error: function (data) {
      alert("Error sending data: " + data);        
    }
  
  });
});