let data = null;
$.getJSON('flights.json', function(result) {
    data = result;
    for (let  i = 0; i<=data.length-1; i++) {
        let project = data[i];
        console.log(project['lat']);
        console.log(project['lon']);
        console.log(project['f15']);

    }
});