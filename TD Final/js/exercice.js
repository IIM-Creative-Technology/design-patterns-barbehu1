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
                        return `<div style="display:flex;"><li style="width:50%">${result.message}</li><li style="width:50%">${result.destination}</li><br></div>`;
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