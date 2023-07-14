// Custom Functions

// // Definindo as datas permitidas
// var allowedDates = ["2023-07-07", "2023-07-14", "2023-07-14", "2023-08-03", "2023-09-01", "2023-10-06", "2023-11-03", "2023-12-01"];
// // Definindo o horário de inicio e término
// var startTime = 13.83; // 13:50
// var endTime = 19; // 19:00

// // Definindo a diferença de fuso horário
// var timezoneOffset = -240; // para GMT-0400

// function checkDate() {
//     var now = new Date();
//     var timezoneDifference = timezoneOffset - now.getTimezoneOffset();
//     now.setMinutes(now.getMinutes() + timezoneDifference); // ajusta a hora local para GMT-0400

//     var currentDate = now.toISOString().slice(0,10); // pega a data atual no formato yyyy-mm-dd
//     var currentTime = now.getHours() + now.getMinutes() / 60; // pega a hora atual e converte em decimal

//     // checando se a data e hora atual estão dentro do intervalo permitido
//     if (allowedDates.includes(currentDate) && currentTime >= startTime && currentTime <= endTime) {
//         return true;
//     } else {
//         return false;
//     }
// }

// Função para encontrar a próxima data permitida
// function getNextDate() {
//     var now = new Date();
//     var nextDate = null;

//     for (var i = 0; i < allowedDates.length; i++) {
//         var currentDate = new Date(allowedDates[i]);
//         if (currentDate > now) {
//             nextDate = currentDate;
//             break;
//         }
//     }

//     return nextDate;
// }

function setNote() {
    const queryString = new URLSearchParams(window.location.search);
    const note = queryString.get('note');
    if (note !== null) {
        document.getElementById("note").innerText = decodeURIComponent(note);
    }
}

window.onload = function() {
    // if (!checkDate()) {
    //     var nextDate = getNextDate();
    //     if (nextDate) {
    //         // Formata a data em Dia/Mês/Ano
    //         var day = nextDate.getDate();
    //         var month = nextDate.getMonth() + 1; // o índice do mês começa em 0
    //         var year = nextDate.getFullYear();
    //         var formattedDate = day + "/" + month + "/" + year;

        //     // document.getElementById("app").innerHTML = "<div id='customAlert' class='custom-alert'>" +
        //     "<div class='alert alert-error'>" + 
        //     "<div class='icon__wrapper'>" +
        //     "<span class='mdi mdi-map-marker-outline'></span>" +
        //     "</div>" +
        //     "<p>Registro de presença não está disponível neste momento.<br>" +
        //     "Próxima data de realização de presença: " + formattedDate + "</p>" +
        //     "</div>";
        // } else {
        //     document.getElementById("app").innerHTML = "<div id='customAlert' class='custom-alert'>" +
        //      "<div class='alert alert-error'>" +
        //     "<div class='icon__wrapper'>" +
        //     "<span class='mdi mdi-map-marker-outline'></span>" +
        //     "</div>" +
        //     "<p>Registro de presença não está disponível neste momento.<br>" +
        //     "Não há mais datas de realização de presença.</p>" +
        //     "</div>";
        // }
    // } else {
        (function () {
            const queryString = new URLSearchParams(window.location.search);
            const note = queryString.get('note');
            const formId = queryString.get('formId');
            const gpsEntry = queryString.get('gpsEntry');
            const formType = queryString.get('formType');
            let prefilledForm;
            
            if (!formId || !gpsEntry || !formType) {
                console.error('Missing necessary query parameters. Please provide formId, gpsEntry, and formType.');
                return;
            }
        
            // Chama a função setNote diretamente
            setNote();
            
            function requestLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getPosition, handleLocationError);
                } else {
                    handleLocationError();
                }
            }
            
            function handleLocationError() {
                const customAlert = document.getElementById('customAlert');
                customAlert.style.display = 'block';
        
                let countdown = 10;
                const timer = document.getElementById('timer');
                timer.innerText = countdown;
        
                const countdownInterval = setInterval(function() {
                    countdown--;
                    timer.innerText = countdown;
            
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        location.reload(true);
                        window.location.href = 'http://semusvilhena.com/gep/residencia'; // Redirecionar para outra página
                    }
                }, 1000);
            }

            function generateHash(seed) {
                const timestamp = new Date().toISOString();
                const message = seed + timestamp;
                const hash = sha256(message);
                return hash;
            }
    
            function getPosition(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const seed = Math.random().toString(36).substring(7);
                const hash = generateHash(seed);
                const gmap = `${hash},${lat},${lon}`;
                let unfilledForm;
                
            switch (formType) {
                case 'google':
                    unfilledForm = `https://docs.google.com/forms/d/e/${formId}/viewform`;
                break;
                case 'tally':
                    unfilledForm = `https://tally.so/r/${formId}`;
                break;
                default:
                    console.error('Invalid form type. Please provide a valid formType query parameter (either "google" or "tally").');
                    return;
                }
        
                prefilledForm = `${unfilledForm}?entry.${gpsEntry}=${encodeURIComponent(gmap)}`;
                location.href = prefilledForm;
            }
            
            // Make requestLocation available globally
            window.requestLocation = requestLocation;
        })();
    }
}
