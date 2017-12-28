const fetchTemperature = () => {
    /* The fetch API uses a promise based sintax.
    It may look a little weird if you are seeing it for the first time, but it's an improvement over callbacks. */

    /* First, we instanciate a promise, which call the API /temperature of our server. */
    fetch('/temperature').then(results => {
        /* We want results converted to json, so we use the fetch results 'json' method, which returns a promise with the JSON data instead of the string. */
        return results.json();
    }).then(data => {
        /* In our server API route handler, the format of returned data was an object with a 'value' property. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. 
        The value of the sensor reading is therefore available in 'data.value' */
        const temperatureDisplay = document.getElementById('temperature-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

/* Repeat the same steps for the humidity API */
const fetchHumidity = () => {
    fetch('/humidity').then(results => {
        return results.json();
    }).then(data => {
        pushData(humidityChart.data.labels, getNowTimeStamp(), 10);
        pushData(humidityChart.data.datasets[0].data, data.value, 10);
        const humidityDisplay = document.getElementById('humidity-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const pushData = (arr, value, maxLen) => {
    arr.push(value);
    if (arr.length > maxLen) {
        arr.shift();
    }
}

const getNowTimeStamp = () => {
    const now = new Date();
    const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    return timeNow;
}

/* Call the above defined function at regular intervals */
setInterval(() => {
    fetchTemperature();
    fetchHumidity();
}, 2000);

/* Get the contex of the temperature canvas element. */
const temperatureCanvasCtX = document.getElementById('temperature-chart').getContext('2d');

/* Create a new chart on the context we just instanciated. */
const temperatureChart = new Chart(temperatureCanvasCtX,
{
    /* We are going to show the ongoing temperature as a line chart. */
    type: 'line',
    data: {
        /* This is mock data.
        The labels, which will form our x-axis, are suppose to represent the time at which each reading was taken.
        Finally, we add the dataset, whose data is an array of temperature values.
        The background color is set to the same value as earlier display, with some added transparency (which is why the 'rgba' representation is used) */
        labels: ['10:30', '10.31', '10.32', '10.33'],
        datasets: [{
            data: [12, 19, 23, 17],
            backgroundColor: 'rgba(255, 205, 210, 0.5)'
        }]
    },
    options: {
        /* There is no need for a legend since there is only one dataset plotted.
        The 'responsive' and 'mantainAspectRadio' options are set so that the chart takes the width and height of the canvas, and does not set it on its own. */
        legend: {
            display: false
        },
        responsive: true,
        mantainAspectRadio: false,
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 10,
                    suggestedMax: 40
                }
            }]
        }
    }
});

/* Get the contex of the humidity canvas element. */
const humitityCanvasCtX = document.getElementById('humidity-chart').getContext('2d');
const humidityChart = new Chart(humitityCanvasCtX,
{
    type: 'line',
    data: {
        labels: ['10:30', '10.31', '10.32', '10.33'],
        datasets: [{
            data: [12, 19, 23, 17],
            backgroundColor: 'rgba(255, 205, 210, 0.5)'
        }]
    },
    options: {
        legend: {
            display: false
        },
        responsive: true,
        mantainAspectRadio: false,
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }]
        }
    }
});