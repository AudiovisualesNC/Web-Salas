// url (required), options (optional)
function getRoomInfo(){
  fetch('http://127.0.0.1:8080/roomdata.json', {method: 'get'}).then(

    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      } else {
        // Examine the text in the response
        response.json().then(function(data) {
          document.getElementById("ip").innerHTML = data.host + '<br/>IP:' + data.ip;
          document.getElementById("nombreSala").innerHTML = data.room_name + ' *' + data.id;
          document.getElementById("titulo").innerHTML = data.room_name + ' *' + data.id;
          room_id = data.id;
          if (data.with_button == true){
            botonera = true
          } else {
            botonera = false
          }
          clearInterval(interval_roomInfo)
          get_meetings()
          post_data_inventory(data)
        })
      }

    }
  ).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function getCam(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
  return;
}

// List cameras and microphones.

navigator.mediaDevices.enumerateDevices()
.then(function(devices) {
  devices.forEach(function(device) {
    console.log(device.label);
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
}

