/* Get the contex of the temperature canvas element. */
const temperatureCanvasCtX = document.getElementById('temperature-chart').getContext('2d');
export const temperatureChartConfig = {
    /* We are going to show the ongoing temperature as a line chart. */
    type: 'line',
    data: {
        /* For our actual data, we will not have any reading initially.
        The labels, which will form our x-axis, are suppose to represent the time at which each reading was taken.
        Finally, we add the dataset, whose data is an array of temperature values.
        The background color is set to the same value as earlier display, with some added transparency (which is why the 'rgba' representation is used) */
        labels: [],
        datasets: [{
            data: [],
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
        /* Add in the range for the Y-axis. Where I live, the temperature varies from 15-35 °C with a 5 °C buffer range, that gives us a minimus value of 10 and maximum of 40. */
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 10,
                    suggestedMax: 40
                }
            }]
        }
    }
};

/* Create a temperature chart on the context we just instanciated. */
export const temperatureChart = new Chart(temperatureCanvasCtX, temperatureChartConfig);

/* Get the contex of the humidity canvas element. */
const humitityCanvasCtX = document.getElementById('humidity-chart').getContext('2d');
export const humidityChartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
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
};

export const humidityChart = new Chart(humitityCanvasCtX, humidityChartConfig);