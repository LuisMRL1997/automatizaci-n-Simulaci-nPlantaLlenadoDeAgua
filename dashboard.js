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

db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        datos.push(dato);
    });

    datos.sort((a, b) => b.gananciaTotal - a.gananciaTotal);
    datos = datos.slice(0, 10);
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Ganancia total',
                data: datos.map(dato => dato.gananciaTotal),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    datos.sort((a, b) => b.fecha - a.fecha);
    datos = datos.slice(0, 10);
    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Ganancia total',
                data: datos.map(dato => dato.gananciaTotal),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx3 = document.getElementById('myChart3').getContext('2d');
    var chart3 = new Chart(ctx3, {
        type: 'line', // Cambia el tipo de gráfica a 'line'
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Ganancia total',
                data: datos.map(dato => dato.gananciaTotal),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx4 = document.getElementById('myChart4').getContext('2d');
    var chart4 = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Costo de energía',
                data: datos.map(dato => dato.costoEnergia),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Costo del agua desperdiciada',
                data: datos.map(dato => dato.costoAguaDesperdiciada),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Costo de operación',
                data: datos.map(dato => dato.costoOperacion),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            },
            {
                label: 'Alertas totales',
                data: datos.map(dato => dato.alertasTotales),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var totalDesbordamiento = 0;
    var totalSequedad = 0;

    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        totalDesbordamiento += dato.alertaDesbordamiento;
        totalSequedad += dato.alertaSequedad;
    });

    var ctx5 = document.getElementById('myChart5').getContext('2d');
    var chart5 = new Chart(ctx5, {
        type: 'pie',
        data: {
            labels: ['Alertas de Desbordamiento', 'Alertas de Sequedad'],
            datasets: [{
                data: [totalDesbordamiento, totalSequedad],
                backgroundColor: ['indigo', 'darkred'], // Cambia los colores aquí
                borderColor: ['indigo', 'darkred'], // Y aquí
                borderWidth: 1
            }]
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx6 = document.getElementById('myChart6').getContext('2d');
    var chart6 = new Chart(ctx6, {
        type: 'line',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Costo de energía',
                data: datos.map(dato => dato.costoEnergia),
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            },
            {
                label: 'Costo del agua desperdiciada',
                data: datos.map(dato => dato.costoAguaDesperdiciada),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            },
            {
                label: 'Costo de operación',
                data: datos.map(dato => dato.costoOperacion),
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false
            },
            {
                label: 'Alertas totales',
                data: datos.map(dato => dato.alertasTotales),
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        datos.push(dato);
    });
    // Ordena los datos por el nivel medio de agua en orden descendente
    datos.sort((a, b) => b.mediaNiveles - a.mediaNiveles);
    // Toma solo las primeras 10 jornadas
    datos = datos.slice(0, 10);

    var ctx7 = document.getElementById('myChart7').getContext('2d');
    var chart7 = new Chart(ctx7, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Nivel medio de agua',
                data: datos.map(dato => dato.mediaNiveles),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        datos.push(dato);
    });
    // Ordena los datos por la cantidad total de alertas en orden descendente
    datos.sort((a, b) => b.alertasTotales - a.alertasTotales);
    // Toma solo las primeras 10 jornadas
    datos = datos.slice(0, 10);

    var ctx8 = document.getElementById('myChart8').getContext('2d');
    var chart8 = new Chart(ctx8, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Alertas totales',
                data: datos.map(dato => dato.alertasTotales),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx9 = document.getElementById('myChart9').getContext('2d');
    var chart9 = new Chart(ctx9, {
        type: 'line',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Alertas de Desbordamiento',
                data: datos.map(dato => dato.alertaDesbordamiento),
                borderColor: 'indigo',
                fill: false
            },
            {
                label: 'Alertas de Sequedad',
                data: datos.map(dato => dato.alertaSequedad),
                borderColor: 'darkred',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var totalCostoOperacion = 0;
    var totalAlertas = 0;
    var totalCostoEnergia = 0;
    var totalCostoAguaDesperdiciada = 0;

    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        totalCostoOperacion += parseFloat(dato.costoOperacion);
        totalAlertas += dato.alertasTotales;
        totalCostoEnergia += parseFloat(dato.costoEnergia);
        totalCostoAguaDesperdiciada += parseFloat(dato.costoAguaDesperdiciada);
    });

    var ctx10 = document.getElementById('myChart10').getContext('2d');
    var chart10 = new Chart(ctx10, {
        type: 'pie',
        data: {
            labels: ['Costo de Operación', 'Cantidad de Alertas', 'Costo Total de Energía', 'Costo del Agua Desperdiciada'],
            datasets: [{
                data: [totalCostoOperacion, totalAlertas, totalCostoEnergia, totalCostoAguaDesperdiciada],
                backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });

    // Ordena los datos por la cantidad de botellas vendidas en orden descendente
    var datosBotellasVendidas = [...datos].sort((a, b) => b.botellasVendidas - a.botellasVendidas);
    // Toma solo las primeras 10 jornadas
    datosBotellasVendidas = datosBotellasVendidas.slice(0, 10);

    var ctx12 = document.getElementById('myChart12').getContext('2d');
    var chart12 = new Chart(ctx12, {
        type: 'line',
        data: {
            labels: datosBotellasVendidas.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Botellas vendidas',
                data: datosBotellasVendidas.map(dato => dato.botellasVendidas),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Ordena los datos por fecha en orden descendente
    var datosRecientes = [...datos].sort((a, b) => b.fecha - a.fecha);
    // Toma solo las primeras 10 jornadas
    datosRecientes = datosRecientes.slice(0, 10);

    var ctx13 = document.getElementById('myChart13').getContext('2d');
    var chart13 = new Chart(ctx13, {
        type: 'line',
        data: {
            labels: datosRecientes.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Botellas vendidas',
                data: datosRecientes.map(dato => dato.botellasVendidas),
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx14 = document.getElementById('myChart14').getContext('2d');
    var chart14 = new Chart(ctx14, {
        type: 'line',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Nivel medio del agua',
                data: datos.map(dato => dato.mediaNiveles),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        var partes = dato.nombreJornada.split(" ");
        var fechaPartes = partes[1].split("-");
        var horaPartes = partes[4].split(":");
        dato.fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
        datos.push(dato);
    });
    // Asegúrate de que los datos estén ordenados por fecha
    datos.sort((a, b) => a.fecha - b.fecha);

    var ctx15 = document.getElementById('myChart15').getContext('2d');
    var chart15 = new Chart(ctx15, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Nivel medio del agua',
                data: datos.map(dato => dato.mediaNiveles),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Botellas vendidas',
                data: datos.map(dato => dato.botellasVendidas),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
db.collection("simulacion").get().then((querySnapshot) => {
    var datos = [];
    querySnapshot.forEach((doc) => {
        var dato = doc.data();
        dato.nombreJornada = doc.id;
        datos.push(dato);
    });
    // Ordena los datos por la ganancia generada por vender botellas en orden descendente
    datos.sort((a, b) => b.gananciaBotellasLlenadas - a.gananciaBotellasLlenadas);
    // Toma solo las primeras 10 jornadas
    datos = datos.slice(0, 10);

    var ctx16 = document.getElementById('myChart16').getContext('2d');
    var chart16 = new Chart(ctx16, {
        type: 'bar',
        data: {
            labels: datos.map(dato => dato.nombreJornada),
            datasets: [{
                label: 'Ganancias por vender botellas',
                data: datos.map(dato => dato.gananciaBotellasLlenadas),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});




