const firebaseConfig = {
    apiKey: "AIzaSyA344MFnmarmkroNJVL7lhM4SBoXwlMTPo",
    authDomain: "watertanklevel-20705.firebaseapp.com",
    databaseURL: "https://watertanklevel-20705-default-rtdb.firebaseio.com",
    projectId: "watertanklevel-20705",
    storageBucket: "watertanklevel-20705.appspot.com",
    messagingSenderId: "180314697033",
    appId: "1:180314697033:web:ab1277cce487c67e2ffe98"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

var pieCtx = document.getElementById('pieChart').getContext('2d');
if (window.pieChart instanceof Chart) {
    window.pieChart.destroy();
}
window.pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Seco', 'Nivel Bajo', 'Nivel Medio', 'Nivel Alto', 'Desbordamiento'],
        datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['red', 'orange', 'blue', 'navy', 'indigo']
        }]
    }
});


var nivel = 50;
var niveles = [];
var intervalId = null;
var contadores = {seco: 0, nivelBajo: 0, nivelMedio: 0, nivelAlto: 0, desbordamiento: 0};
var litrosPorBotella = 30;
var precioPorBotella = 45;
var botellasLlenadas = 0;
var aguaDesperdiciada = 0;
var costoPorLitroDesperdiciado = 1.3;
var costoAguaDesperdiciada = 0;
var litrosEnBotella = 0;
var tiempoTranscurrido = 0;
var alertaDesbordamiento = 0;
var alertaSequedad = 0;
var alertasTotales = 0;
var nivelesPasados = [];
var costoAlertas = 0;
var cantidadOperacion = 0;
var costoOperacion = 0;
var gananciaTotal = 0;
var energiaConsumida = 0;
var costoEnergia = 0;
var gananciaBotellasLlenadas = 0;
var mediaNiveles = 0;
document.getElementById('startButton').addEventListener('click', function() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        this.textContent = 'Iniciar Simulación';
    } else {
        intervalId = setInterval(function() {
            tiempoTranscurrido++;
            nivelesPasados.push(nivel); 
            niveles.push(nivel);
            if (nivelesPasados.length > 3) {
                nivelesPasados.shift();
            }
            simulate();
        }, 1000);
        this.textContent = 'Detener Simulación';
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
    updateDatabase();
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        document.getElementById('startButton').textContent = 'Iniciar Simulación';
    }

    tiempoTranscurrido = 0;
    niveles = [];
    nivel = 50;
    document.getElementById('water').style.height = '0%';
    document.getElementById('water').style.backgroundColor = 'blue';
    contadores = {seco: 0, nivelBajo: 0, nivelMedio: 0, nivelAlto: 0, desbordamiento: 0};
    pieChart.data.datasets[0].data = [0, 0, 0, 0, 0];
    pieChart.update();
    botellasLlenadas = 0;
    gananciaBotellasLlenadas = 0;
    aguaDesperdiciada = 0;
    litrosEnBotella = 0;
    alertaDesbordamiento = 0;
    alertaSequedad = 0;
    alertasTotales = 0;
    costoAlertas = 0;
    nivelesPasados = [];
    cantidadOperacion = 0;
    costoOperacion = 0;
    mediaNiveles = 0;
    costoAguaDesperdiciada = 0;
    gananciaTotal = 0;
    energiaConsumida = 0;
    costoEnergia = 0;
    document.getElementById('startButton').disabled = false;
    document.getElementById('botellasVendidas').innerHTML = "<i class='fas fa-wine-bottle'></i> Botellas vendidas: " + botellasLlenadas;
    document.getElementById('gananciaBotellasLlenadas').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Ganancia por botellas llenadas: $" + gananciaBotellasLlenadas.toFixed(2);
    document.getElementById('aguaDesperdiciada').innerHTML = "<i class='fas fa-tint' style='color: red;'></i> Agua desperdiciada: " + aguaDesperdiciada + " litros";
    document.getElementById('costoAguaDesperdiciada').innerHTML = "<i class='fas fa-dollar-sign' style='color: red;'></i> Costo del agua desperdiciada: $" + costoAguaDesperdiciada.toFixed(2);
    document.getElementById('energiaConsumida').innerHTML = "<i class='fas fa-bolt' style='color: yellow;'></i> Energía consumida: " + energiaConsumida.toFixed(2) + " Kilovatios";
    document.getElementById('costoEnergia').innerHTML = "<i class='fas fa-bolt' style='color: yellow;'></i> Costo de energía: $" + costoEnergia.toFixed(2);
    document.getElementById('costoOperacion').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Costo de operaciones: $" + costoOperacion.toFixed(2);
    document.getElementById('alertaDesbordamiento').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: indigo;'></i> Alertas de desbordamiento: " + alertaDesbordamiento;
    document.getElementById('alertaSequedad').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: red;'></i> Alertas de sequedad: " + alertaSequedad;
    document.getElementById('alertasTotales').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: orange;'></i> Alertas totales: " + alertasTotales;
    document.getElementById('gananciaTotal').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Ganancia total: $" + gananciaTotal.toFixed(2);
    document.getElementById('tiempoTranscurrido').innerHTML = "<i class='fas fa-clock'></i> Tiempo transcurrido: " + tiempoTranscurrido + " segundos";
    document.getElementById('nivelMedio').innerHTML = "<i class='fas fa-water'></i> Media de agua: " + mediaNiveles.toFixed(2) + " litros";
    var bottleWaters = document.querySelectorAll('.bottleWater');
    bottleWaters.forEach(function(bottleWater) {
        bottleWater.style.backgroundColor = 'blue';
        bottleWater.style.height = '0%';
    });
});
document.getElementById('dashboardButton').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});

function simulate() {
    if (tiempoTranscurrido >= 60) {
        clearInterval(intervalId);
        intervalId = null;
        document.getElementById('startButton').textContent = 'Iniciar Simulación';
        document.getElementById('startButton').disabled = true;
        return;
    }
    var nivelAnterior = nivel;
    if (nivelesPasados.length == 3 && nivelesPasados.every(n => n >= 75)) {
        nivel -= 25; 
        alertaDesbordamiento++;
        alertasTotales++;
        cantidadOperacion++;
    } else if (nivelesPasados.length == 3 && nivelesPasados.every(n => n <= 25)) {
        nivel += 25; 
        alertaSequedad++;
        alertasTotales++;
        cantidadOperacion++;
    } else {
        var cambio = (Math.random() * 2 - 1) * 15;
        nivel += cambio;
        cantidadOperacion++;
    }
    var cambioNivel = Math.abs(nivel - nivelAnterior);
    energiaConsumida += cambioNivel;
    costoEnergia = energiaConsumida * 0.056;
    costoOperacion = cantidadOperacion * 0.27;
    costoAlertas = alertasTotales * 1.2;
    gananciaBotellasLlenadas = botellasLlenadas * precioPorBotella;
    costoAguaDesperdiciada = aguaDesperdiciada * costoPorLitroDesperdiciado;
    gananciaTotal = gananciaBotellasLlenadas - costoAguaDesperdiciada - costoAlertas - costoOperacion - costoEnergia;
    if (nivel < 0) {
        nivel = 0;
    } else if (nivel > 120) {
        nivel = 120;
    }
    document.getElementById('water').style.height = (nivel / 120 * 100) + '%';
    var estado;
    if (nivel == 0) {
        estado = "seco";
        document.getElementById('water').style.backgroundColor = 'red';
    } else if (nivel <= 25) {
        estado = "nivelBajo";
        document.getElementById('water').style.backgroundColor = 'orange';
    } else if (nivel <= 75) {
        estado = "nivelMedio";
        document.getElementById('water').style.backgroundColor = 'blue';
    } else if (nivel <= 100) {
        estado = "nivelAlto";
        document.getElementById('water').style.backgroundColor = 'navy';
    } else {
        estado = "desbordamiento";
        document.getElementById('water').style.backgroundColor = 'indigo';
    }
    contadores[estado]++;
    pieChart.data.datasets[0].data = [
        contadores.seco,
        contadores.nivelBajo,
        contadores.nivelMedio,
        contadores.nivelAlto,
        contadores.desbordamiento
    ];
    pieChart.update();
    if (cambio < 0 && nivel > 0) {
        var aguaUsada = -cambio;
        var aguaNecesaria = litrosPorBotella - litrosEnBotella;

        if (aguaUsada >= aguaNecesaria) {
            litrosEnBotella = 0;
            aguaDesperdiciada += aguaUsada - aguaNecesaria;
            var fillingBottle = document.getElementById('fillingBottle');
            fillingBottle.style.animation = 'moveAndFade 2s forwards';
        
            fillingBottle.addEventListener('animationend', function() {

                document.getElementById('fillingBottleWater').style.height = '0%';
                document.getElementById('fillingBottleWater').style.backgroundColor = 'white';
                fillingBottle.style.animation = '';

                var otherBottles = document.querySelectorAll('.bottle:not(#fillingBottle)');
                otherBottles.forEach(function(bottle) {
                    bottle.style.animation = 'moveUp 2s forwards';
                });
            });

            botellasLlenadas++;
        } else {
            litrosEnBotella += aguaUsada;
            document.getElementById('fillingBottleWater').style.height = (litrosEnBotella / litrosPorBotella * 100) + '%';
            document.getElementById('fillingBottleWater').style.backgroundColor = 'blue';
        }
        
        
    }
    var sumaNiveles = niveles.reduce(function(a, b) { return a + b; }, 0);
    mediaNiveles = sumaNiveles / niveles.length;
    
    document.getElementById('botellasVendidas').innerHTML = "<i class='fas fa-wine-bottle'></i> Botellas vendidas: " + botellasLlenadas;
    document.getElementById('gananciaBotellasLlenadas').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Ganancia por botellas llenadas: $" + gananciaBotellasLlenadas.toFixed(2);
    document.getElementById('aguaDesperdiciada').innerHTML = "<i class='fas fa-tint' style='color: red;'></i> Agua desperdiciada: " + aguaDesperdiciada + " litros";
    document.getElementById('costoAguaDesperdiciada').innerHTML = "<i class='fas fa-dollar-sign' style='color: red;'></i> Costo del agua desperdiciada: $" + costoAguaDesperdiciada.toFixed(2);
    document.getElementById('energiaConsumida').innerHTML = "<i class='fas fa-bolt' style='color: yellow;'></i> Energía consumida: " + energiaConsumida.toFixed(2) + " Kilovatios";
    document.getElementById('costoEnergia').innerHTML = "<i class='fas fa-bolt' style='color: yellow;'></i> Costo de energía: $" + costoEnergia.toFixed(2);
    document.getElementById('costoOperacion').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Costo de operaciones: $" + costoOperacion.toFixed(2);
    document.getElementById('alertaDesbordamiento').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: indigo;'></i> Alertas de desbordamiento: " + alertaDesbordamiento;
    document.getElementById('alertaSequedad').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: red;'></i> Alertas de sequedad: " + alertaSequedad;
    document.getElementById('alertasTotales').innerHTML = "<i class='fas fa-exclamation-triangle' style='color: orange;'></i> Alertas totales: " + alertasTotales;
    document.getElementById('gananciaTotal').innerHTML = "<i class='fas fa-dollar-sign' style='color: green;'></i> Ganancia total: $" + gananciaTotal.toFixed(2);
    document.getElementById('tiempoTranscurrido').innerHTML = "<i class='fas fa-clock'></i> Tiempo transcurrido: " + tiempoTranscurrido + " segundos";
    document.getElementById('nivelMedio').innerHTML = "<i class='fas fa-water'></i> Media de agua: " + mediaNiveles.toFixed(2) + " litros";
    
}

function updateDatabase() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var id = "Jornada " + day + "-" + month + "-" + year + " a las " + hour + ":" + minute + ":" + second;
    db.collection("simulacion").doc(id).set({
        botellasVendidas: botellasLlenadas,
        gananciaBotellasLlenadas: gananciaBotellasLlenadas.toFixed(2),
        aguaDesperdiciada: aguaDesperdiciada,
        costoAguaDesperdiciada: costoAguaDesperdiciada.toFixed(2),
        energiaConsumida: energiaConsumida.toFixed(2),
        costoEnergia: costoEnergia.toFixed(2),
        costoOperacion: costoOperacion.toFixed(2),
        alertaDesbordamiento: alertaDesbordamiento,
        alertaSequedad: alertaSequedad,
        alertasTotales: alertasTotales,
        gananciaTotal: gananciaTotal.toFixed(2),
        tiempoTranscurrido: tiempoTranscurrido,
        mediaNiveles: mediaNiveles.toFixed(2)
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

