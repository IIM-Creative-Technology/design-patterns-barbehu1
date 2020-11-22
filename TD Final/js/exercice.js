// Récupération des métros
function metros(){
    fetch('https://api-ratp.pierre-grimaud.fr/v4/lines/metros')
        .then(response => response.json())
        .then(data => {
            const metrosData = data.result.metros
                .map(result =>{
                    return `<option value="${result.name}">${result.name}</option>`;
                })
                .join("");

            document.getElementById("metro").innerHTML += metrosData;
        })
}
metros();

// Récupération des stations
document.getElementById("metro").addEventListener('change', function(){
    async function stations(line) {
        fetch('https://api-ratp.pierre-grimaud.fr/v4/stations/metros' + '/' + line)
            .then(response => response.json())
            .then(data => {
                const stationsData = data.result.stations
                .map(result =>{
                    return `<option value="${result.name}">${result.name}</option>`;
                })
                .join("");

                document.getElementById("stations").innerHTML = stationsData;
            })
    }

    var metroSelected = document.getElementById("metro").selectedIndex;
    stations(metroSelected);
})

// Récupération des temps d'attente
document.getElementById("stations").addEventListener('change',function(){
    async function schedules(line, station) {
        fetch('https://api-ratp.pierre-grimaud.fr/v4/schedules/metros' + '/' + line + '/' + station  +  '/A+R')
            .then(response => response.json())
            .then(data => {
                const time = data.result.schedules
                    .map(result =>{
                        // Etape bonus 1
                        let minutes = parseInt(result.message.substr(0, 2))

                        // Heure française
                        const options = {
                            timeZone:"Europe/Paris",
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit"
                        }

                        let actualTime = new Date().toLocaleTimeString("fr",options)

                        if(Number.isInteger(minutes)){
                            
                            let actualHours = actualTime.substr(0, 2)
                            let actualMinutes = actualTime.substr(3, 2)

                            let metroMinutes = parseInt(actualMinutes) + minutes

                            if(metroMinutes>=60){
                                let metroHours = parseInt(actualHours) + 1
                                if(metroHours>=24){
                                    metroHours = "00"
                                }
                                metroMinutes-=60
                                if(metroMinutes<10){
                                    metroMinutes = "0" + metroMinutes
                                }

                                console.log(metroHours + ":" + metroMinutes)
                                return `<div style="display:flex;"><li style="width:50%">${result.message + " (" + metroHours + ":" + metroMinutes + ")"}</li><li style="width:50%">${result.destination}</li><br></div>`;
                            }
                            else if(metroMinutes<10){
                                metroMinutes = "0" + metroMinutes
                                return `<div style="display:flex;"><li style="width:50%">${result.message + " (" + actualHours + ":" + metroMinutes + ")"}</li><li style="width:50%">${result.destination}</li><br></div>`;
                            }
                            else {
                                console.log(actualHours + ":" + metroMinutes)
                                return `<div style="display:flex;"><li style="width:50%">${result.message + " (" + actualHours + ":" + metroMinutes + ")"}</li><li style="width:50%">${result.destination}</li><br></div>`;
                            }

                        }
                        else if(result.message.search("Train a l'approche") || result.message.search("Train a quai")){
                            return `<div style="display:flex;"><li style="width:50%">${result.message + " (" + actualTime + ")"}</li><li style="width:50%">${result.destination}</li><br></div>`;
                        }
                        else {
                            return `<div style="display:flex;"><li style="width:50%">${result.message}</li><li style="width:50%">${result.destination}</li><br></div>`;
                        }
                    })
                    .join("");
                    document.getElementById("time-list").innerHTML = ('<b>Destination & prochain train :</b>' + time);
            })
    }
    var metroSelected = document.getElementById("metro").selectedIndex;
    var stationName = document.getElementById('stations').value;

    // Actualisation des temps d'attente
    schedules(metroSelected,stationName)
    setInterval(function (){
        schedules(metroSelected,stationName)
    }, 30000)
})