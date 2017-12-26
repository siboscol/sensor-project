fetch('/temperature').then(results => {
    results.text();
}).then(text => {
    console.log('Temperature: ' + text);
});