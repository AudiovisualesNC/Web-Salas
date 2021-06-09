var meets_old = undefined

/**
 * Realiza la consulta a la API del servidor AV para obtener las reuniones, enviando el hostname
 */
function get_meetings() {
    var id = room_id
    if(room_id.startsWith('*')){
        id = room_id.substring(1)
    }
    fetch('https://api.avserver.ddnsfree.com/rooms/meetings?room_id=' + id, {method: 'get'}).then(
    //fetch('http://127.0.0.1:8000/rooms/meetings?room_id=' + room_id, {method: 'get'}).then(
        function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response);
            }
            else {
                response.json().then(function(data) {
                    showMeets(data.meetings)
                });
            }
        }
    ).catch(function(err) {
    console.log('Fetch Error :-S', err);
    });
}

/**
 * Se encarga de mostrar las reuniones en la pantalla
 * @param {Array de reuniones} meets 
 */
function showMeets(meets){
    if (meets.length > 0){
        //Próxima reunion
        if(meets.length >= 1) {
            console.log(meets.length)
            var now = new Date()
            //Las reuniones recurrentes tienen una fecha de inicio y final del día que se crearon por lo que es necesario modificarla al día actual para que el tiempo restante sea correcto
            var todayString = formatStringToday(now)
            var stringStartDate = meets[0].start_time.split("T")[0]
            if (  stringStartDate != todayString ){
                var startNextMeeting = new Date(meets[0].start_time.replace(stringStartDate, todayString))
                var endNextMeeting = new Date(meets[0].end_time.replace(stringStartDate, todayString))
            } else {
                var startNextMeeting = new Date(meets[0].start_time)
                var endNextMeeting = new Date(meets[0].end_time)
            }

            var tiempoRestante_inicio = startNextMeeting.getTime()-now.getTime()
            var tiempoRestante_final = endNextMeeting.getTime()-now.getTime()


            document.getElementById("Texto1CajaReuniones").innerHTML = '&nbsp Título: '+meets[0].summary;
            document.getElementById("Texto1CajaReuniones1").innerHTML = '&nbsp Tiempo: '+ meets[0].start_time.split('T')[1].slice(0, -3) + '-' + meets[0].end_time.split('T')[1].slice(0, -3) + '  horas'

            //Si la reunión ya esta empezada
            if(tiempoRestante_inicio <= 0){
                updateInProgress(meets)
            // Si el tiempo restante es menor que el tiempo para la próxima consulta se añade un temporizador
            } else if (tiempoRestante_inicio <= timeToUpdate){
                setTimeout(function(){
                    updateInProgress(meets)
                }, tiempoRestante_inicio)
            }
            // Si la reunión acaba antes de la siguiente actualización, cuando acabe se vuelve a llamar a la 
            //función showmeets pero eliminando la reunion que acaba de terminar
            if(tiempoRestante_final <= 0){
                meets.shift()
                showMeets(meets)
            } else if(tiempoRestante_final <= timeToUpdate) {
                setTimeout(function(){
                    meets.shift()
                    showMeets(meets)
                }, tiempoRestante_final)
            }

            //Se ocultan todos los recuadrod menos el primero que siempre esta visible
            document.getElementById("cajaReuniones-2").style.display = "none"
            document.getElementById("recuadro2").style.display = "none"
            document.getElementById("cajaReuniones-3").style.display = "none"
            document.getElementById("recuadro3").style.display = "none"
        }

        if (meets.length >= 2){
            //Se pone la información de la reunión
            document.getElementById("Texto2CajaReuniones").innerHTML = '&nbsp Título: '+meets[1].summary;
            document.getElementById("Texto2CajaReuniones2").innerHTML = '&nbsp Tiempo: '+ meets[1].start_time.split('T')[1].slice(0, -3) + '-' + meets[1].end_time.split('T')[1].slice(0, -3) + '  horas'

            //Se muestra el recuadro de la segunda reunion y se oculta el tercero
            document.getElementById("cajaReuniones-2").style.display = "block"
            document.getElementById("recuadro2").style.display = "block"
            document.getElementById("cajaReuniones-3").style.display = "none"
            document.getElementById("recuadro3").style.display = "none"
        }

        if(meets.length === 3) {
            //Se pone la información de la reunión
            document.getElementById("Texto3CajaReuniones").innerHTML = '&nbsp Título: '+meets[2].summary;
            document.getElementById("Texto3CajaReuniones3").innerHTML = '&nbsp Tiempo: '+ meets[2].start_time.split('T')[1].slice(0, -3) + '-' + meets[2].end_time.split('T')[1].slice(0, -3) + '  horas'

            //Se muestran todos los recuadros
            document.getElementById("cajaReuniones-3").style.display = "block"
            document.getElementById("recuadro3").style.display = "block"
        }

    }else {
        document.getElementById("Texto1CajaReuniones").innerHTML = "&nbsp No hay reuniones programadas"
        document.getElementById("Texto1CajaReuniones1").innerHTML = ""
        document.getElementById("cajaReuniones-2").style.display = "none"
        document.getElementById("recuadro2").style.display = "none"
        document.getElementById("cajaReuniones-3").style.display = "none"
        document.getElementById("recuadro3").style.display = "none"
    }
  }
/**
 * Actualiza los textos de la reunion para indicar que esta (En curso) y mostrar el boton de acceso a la reunion
 * @param {*} meets 
 */
  function updateInProgress(meets){

    document.getElementById("Texto1CajaReuniones").innerHTML = '&nbsp Título: '+ meets[0].summary + '<a id="EnCursoCaja">  (En curso)</a>';
    //Dependiendo si es Webex o Meets se utiliza un icono u otro
    if(meets[0].meeting_type === "Webex") {
        document.getElementById("Texto1CajaReuniones1").innerHTML = '&nbsp Tiempo: '+ meets[0].start_time.split('T')[1].slice(0, -3) + '-' + meets[0].end_time.split('T')[1].slice(0, -3) + '  horas <a id="botonWebex" href="'+meets[0].uri+'" style="text-decoration:none" target="_blank"> Join Webex<img id="iconoWebex" src="img/iconWebex.png"></a>'
    }else if (meets[0].meeting_type === "Google Meet") {
        document.getElementById("Texto1CajaReuniones1").innerHTML = '&nbsp Tiempo: '+ meets[0].start_time.split('T')[1].slice(0, -3) + '-' + meets[0].end_time.split('T')[1].slice(0, -3) + '  horas<a id="botonWebex" href="'+meets[0].uri+'" style="text-decoration:none" target="_blank">Join Meets<img id="iconoMeets" src="img/iconMeets.png"></a>';
    }
  }
/**
 * Obtiene en formato YYYY-MM-DD la fecha de hoy
 * @param {*} date 
 * @returns 
 */
  function formatStringToday( date ){
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
