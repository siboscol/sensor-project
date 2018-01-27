/* Import temperature and humidity chart configuration from charts module using ES6. */
import {temperatureChart, humidityChart, temperatureChartConfig, humidityChartConfig} from './charts.js';

const temperatureDisplay = document.getElementById('temperature-display');
const fetchTemperature = () => {
    /* The fetch API uses a promise based sintax.
    It may look a little weird if you are seeing it for the first time, but it's an improvement over callbacks. */

    /* First, we instanciate a promise, which call the API /temperature of our server. */
    fetch('/temperature').then(results => {
        /* We want results converted to json, so we use the fetch results 'json' method, which returns a promise with the JSON data instead of the string. */
        return results.json();
        
    }).then(data => {
        /* Add the data to the chart dataset.
        The x-axis here is time, with the time of measurement added as its value. 
        Since it is measure in regular intervals, we do not need to scale it, and can assume a uniform regular interval.
        The y-axis is temperature, which is stored in 'data.value'.
        The data is being pushed directly into the configuration we described in charts.js.
        A maximum length of 10 is maintained. Which means that after 10 readings are filled in the dataset, the older readings will start being pushed out. */
        pushData(temperatureChart.data.labels, getTimeStamp(), 10);
        pushData(temperatureChart.data.datasets[0].data, data.value, 10);

        /* 'temperatureChart' is our ChartJs instance. 
        The 'update' method looks for changes in the dataset and axes, and animates and updates the chart accordingly. */
        temperatureChart.update();

        /* In our server API route handler, the format of returned data was an object with a 'value' property. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. 
        The value of the sensor reading is therefore available in 'data.value' */
        temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const fetchTemperatureHistory = () => {
    fetch('/temperature/history').then(results => {
        return results.json();
    }).then(data => {
        data.forEach(readings => {
            /* For each readings prsent in the 'data' array, 
            convert the time to the ISO Z format accepted by the javascript Date object.
            Format the time and push data on the chart similar to the previous API calls. */
            const time = new Date(readings.createdAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(temperatureChartConfig.data.labels, formattedTime, 10);
            pushData(temperatureChartConfig.data.datasets[0].data, readings.value, 10);
            temperatureChart.update();
        });
    });
}

const fetchTemperatureRange = () => {
    /* The getParameterByName fuction is used to get the 'start' and 'end' parameters from the query. */
    const start = getParameterByName('start');
    const end = getParameterByName('end');

    /* These parameters are then passed on to make AJAX requests to get the range of readings from the server. */
    fetch(`/temperature/range?start=${start}&end=${end}`).then(results => {
        return results.json();
    }).then( data => {
        data.forEach(readings => {
            const time = new Date(readings.createdAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(temperatureChartConfig.data.labels, formattedTime, 10);
            pushData(temperatureChartConfig.data.datasets[0].data, readings.value, 10);
            temperatureChart.update();
        });
    });

    /* We also use this information to fecth the average by calling the required API,
    and updating the reading display with the result. */
    fetch(`/temperature/average?start=${start}&end=${end}`).then(results => {
        return results.json();
    }).then( data => {
        temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });

}

/* Repeat the same steps for the humidity API */
const humidityDisplay = document.getElementById('humidity-display');
const fetchHumidity = () => {
    fetch('/humidity').then(results => {
        return results.json();
    }).then(data => {
        pushData(humidityChart.data.labels, getTimeStamp(), 10);
        pushData(humidityChart.data.datasets[0].data, data.value, 10);
        humidityChart.update();
        humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const fetchHumidityHistory = () => {
    fetch('/humidity/history').then(results => {
        return results.json();
    }).then(data => {
        data.forEach(readings => {
            const time = new Date(readings.createdAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(humidityChartConfig.data.labels, formattedTime, 10);
            pushData(humidityChartConfig.data.datasets[0].data, readings.value, 10);
            temperatureChart.update();
        });
    });
}

const fetchHumidityRange = () => {
    const start = getParameterByName('start');
    const end = getParameterByName('end');

    fetch(`/humidity/range?start=${start}&end=${end}`).then(results => {
        return results.json();
    }).then( data => {
        data.forEach(readings => {
            const time = new Date(readings.createdAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(humidityChartConfig.data.labels, formattedTime, 10);
            pushData(humidityChartConfig.data.datasets[0].data, readings.value, 10);
            humidityChart.update();
        });
    });

    fetch(`/humidity/average?start=${start}&end=${end}`).then(results => {
        return results.json();
    }).then( data => {
        humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });
}

/* Util functions. */
const pushData = (arr, value, maxLen) => {
    arr.push(value);
    if (arr.length > maxLen) {
        arr.shift();
    }
}

const getTimeStamp = (time) => {
    /* Note the time when the reading is obtained, and convert it to hh:mm:ss format. */
    if (!time) {
        time = new Date();
    }
    const timeStamp = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    return timeStamp;
}

/* We first define a function to extract the parameters from the request query.
You do not need to be connected too much with its implementation, although you could always study it as an exercise. */
const getParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if(!results) return null;
    if(!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ''));
}

/** 
 * First define a function that will initialise the socket connection and add listeners to the required events.
 */
const addSocketListeners = () => {
    /**
     * The "io" constructor is available to us after including the socket.io library script in the "index.html" file.
     * Initializing the sockect connection is as easy as the statement below.
     */
    const socket = io();

    /**
     * An event listener is attached to the "new-temperature" event.
     * The handler is similar to the handler that was attached to the GET /temperature API,
     * so in essence, we are replacing the API call with the event notification.
     */
    socket.on('new-temperature', data => {
        const timeNow = getTimeStamp();
        pushData(temperatureChartConfig.data.labels, timeNow, 10);
        pushData(temperatureChartConfig.data.datasets[0].date, date.value, 10);
        temperatureChart.update();
        temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });

    /**
     * Similarly, we add the handler for "new-humidity" event
     */
    socket.on('new-humidity', data => {
        const timeNow = getTimeStamp();
        pushData(humidityChartConfig.data.labels, timeNow, 10);
        pushData(humidityChartConfig.data.datasets[0].date, date.value, 10);
        humidityChart.update();
        humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>';
    });

}

if(!getParameterByName('start') && !getParameterByName('end')){
    /**
     * FInally, the fetchTemperature and fetchHumidity functions, that used to call the APIs at regular intervals, are removed.
     * In their place, the addSocketListeners function is called (and only needs to be called once this time)
     */
    addSocketListeners();

    /* Initialize Temperature and Humidity charts. */
    fetchHumidityHistory();
    fetchTemperatureHistory();
} else {
    fetchTemperatureRange();
    fetchHumidityRange();
}


// if(!getParameterByName('start') && !getParameterByName('end')){
//     /* The fechTemperature and fetchHumidity calls are now moved here and are called only when the 'start' and 'end' parameters are not present in the query.
//     In this case, we will be showing the live reading implementation. */

//     /* Initialize Temperature and Humidity charts. */
//     fetchHumidityHistory();
//     fetchTemperatureHistory();

//     /* Call the above defined function at regular intervals */
//     setInterval(() => {
//         fetchTemperature();
//         fetchHumidity();
//     }, 2000);
// } else {
//     /* If we do have these parameters, we will only be showing the range of readings requested by calling the functions we defined in this section. */
//     fetchTemperatureRange();
//     fetchHumidityRange();
// }