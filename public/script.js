const fetchTemperature = () => {
    /* The fetch API uses a promise based sintax.
    It may look a little weird if you are seeing it for the first time, but it's an improvement over callbacks. */

    /* First, we instanciate the first promise, which call the API a /temperature of our server. */
    fetch('/temperature').then(results => {
        /* results.text() returns another promise, which resolves to the text response we receive from the API.  */
        return results.text();
    }).then(text => {
        /* This "text" variable is the response that the server gives us. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. */
        const temperatureDisplay = document.getElementById('temperature-display').innerHTML = text;
    });
}

const fetchHumidity = () => {
    /* First, we instanciate the first promise, which call the API a /humidity of our server. */
    fetch('/humidity').then(results => {
        /* results.text() returns another promise, which resolves to the text response we receive from the API.  */
        return results.text();
    }).then(text => {
        /* This "text" variable is the response that the server gives us. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. */
        const humidityDisplay = document.getElementById('humidity-display').innerHTML = text;
    });
}

/* Call the above defined function at regular intervals */
setInterval(() => {
    fetchTemperature();
    fetchHumidity();
}, 600000);