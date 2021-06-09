function post_data_inventory(data){
    fetch('https://api.avserver.ddnsfree.com/inventory/rooms/', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(
    //fetch('http://127.0.0.1:8000/rooms/meetings?room_id=' + room_id, {method: 'get'}).then(
        function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response);
            }
        }
    ).catch(function(err) {
    console.log('Fetch Error :-S', err);
    });
}