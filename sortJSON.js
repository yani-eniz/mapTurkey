/*
var homes = [
    {"h_id":"3",
        "city":"Dallas",
        "state":"TX",
        "zip":"75201",
        price:"162500"},
    {"h_id":"4",
        "city":"Bevery Hills",
        "state":"CA",
        "zip":"90210",
        price:"1"},
    {"h_id":"6",
        "city":"Dallas",
        "state":"TX",
        "zip":"75000",
        "price":"1"},
    {"h_id":"5",
        "city":"New York",
        "state":"NY",
        "zip":"00010",
        price:"1"}
];
let used = {};

let filtered = homes.filter(function (obj) {
    return obj.price in used ? 0: (used[obj.price]=1);

});
console.log(filtered);*/
let latVisibility = 32.4854;
let lonVisibility = 40.6084;
let latRadar = 34.334;
let lonRadar = 41.731;

let rad = Math.sqrt(Math.pow(latRadar-latVisibility, 2) + Math.pow(lonRadar - lonVisibility, 2));
console.log(rad);