let canvas = document.getElementById('cnv');
canvas.height = document.getElementById('map').offsetHeight;
canvas.width = document.getElementById('map').offsetWidth;
let ctx = canvas.getContext('2d');

let JSONstirngs= null;
let object=null;
let iconStyle = null;
let locations= [];
let time = [];
let animating = false;
let speed, now;
let VectorLayer = null;
let iconFeatures = [];
let individPlane = [];
let project = [];
let arrObj = [];
let arrObjNew = [];
let planeNames = [];
let newFiltered = [];
speed=200;

let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),addLayerWithFlight()
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([35.41, 38.82]),
        zoom: 6
    })
});

function changeScale(){
    let x_scale;
    let y_scale;
    let YValue = document.getElementById("Y_scale").value;
    let XValue = document.getElementById("X_scale").value;
    x_scale=parseInt(XValue);
    y_scale=parseInt(YValue);
    drawGrid(x_scale,y_scale);
}

function drawGrid(x_scale,y_scale) {
    let GridW = canvas.scrollWidth;
    let GridH = canvas.scrollHeight;
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (let x = 0.5; x <= GridW; x += x_scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GridH);
    }

    for (let y = 0.5; y <= GridH; y += y_scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(GridW, y);
    }

    ctx.strokeStyle = "#999999";
    ctx.lineWidth= 1.2;
    ctx.stroke();
}

function addLayerWithFlight(lat1,lat2,lon1,lon2){
    let iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([29.3132, 40.9032], 'EPSG:4326',
        'EPSG:3857')),
    name: 'Flight',
    population: 4000,
    rainfall: 500
});

var vectorSource = new ol.source.Vector({
    features: iconFeatures
});

iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        anchor: [0.5, -20],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixel',
        opacity: 1,
        scale:0.09,
        src: 'assets/img/plane1.png'
    })),

    'route': new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 6, color: [237, 212, 0, 0.8]
        })
    })
});

iconFeatures.push(iconFeature);


var vectorSource = new ol.source.Vector({
    features: iconFeatures,
});

VectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle ,function(feature) {
        if (animating && feature.get('type') === 'geoMarker') {
            return null;
        }
        return styles[feature.get('type')];
    }
});
return VectorLayer;
}

let openFile = function(event) {
    let input = event.target;

    let reader = new FileReader();
    reader.onload = function(){
        let text = reader.result;
        JSONstirngs=text;
        object= JSON.parse(JSONstirngs);
        createRouteFromArray(object);
    };
    reader.readAsText(input.files[0]);
};


function createRouteFromArray(arrayOfJSON){
    locations= [];
    for(i = 0; i < arrayOfJSON.length; i++){
        locations[i] = [arrayOfJSON[i].lon,arrayOfJSON[i].lat];
        time[i] = arrayOfJSON[i].dati;
        individPlane[i] = arrayOfJSON[i].f18
    }

};

function createPolyline(coordinates){
    let polyline = new ol.geom.LineString(coordinates);
    polyline.transform('EPSG:4326', 'EPSG:3857');
    let feature = new ol.Feature(polyline);
    let Surce = new ol.source.Vector();
    Surce.addFeature(feature);

    let darkStroke = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 4,
            lineDash: [2,7]
        })
    });


    let newLayer = new ol.layer.Vector({
        source: Surce,
        style: darkStroke
    });
    map.addLayer(newLayer);
};

function startFly(){
    let index=0;
    let current=time[0];
    let pathLength=locations[0];
    let Trigger=true;
    let id = setInterval(frame, 1)
    function frame(){
        console.log("current: " + current+" time: "+time[index] + " index: " +index)
        if (current == time[index]) {
            ++index;
            iconFeatures[0].setGeometry(new ol.geom.Point(ol.proj.transform(locations[index], 'EPSG:4326',
                'EPSG:3857')));
        }
        if(current<time[index])
            current++;
    }
}

let data = null;
$.getJSON('assets/json/fullFlights.json', function(result) {
    data = result;
    for (let i = 0; i <= data.length - 1; i++) {
            project.push(data[i]);
    }
    let used = {};

    filtered = data.filter(function (obj) {
        return obj.f15 in used ? 0: (used[obj.f15]=1);

    });
    for (let i = 0; i < filtered.length; i++){
        if (filtered[i]['f15'] != '') {
            newFiltered.push(filtered[i]);
        }

    }
    console.log(newFiltered);
    for (let i = 0; i < newFiltered.length; i++) {
        planes(newFiltered[i]['lon'], newFiltered[i]['lat']);
    }

    for (let i = 0; i < project.length; i++) {
        arrObj[i] = {
            name: '',
            startPonts: [],
            startTime: []
        };
    }
    for (let i = 0; i < project.length; i++) {
        if (planeNames.indexOf(project[i]['f15']) == (-1)) {
            planeNames.push(project[i]['f15']);
            arrObj[i].startPonts.push(project[i]['lat'], project[i]['lon']);
            arrObj[i].startTime.push(project[i]['dati']);

        } else {
            arrObj[planeNames.indexOf(project[i]['f15'])].startPonts.push(project[i]['lat'], project[i]['lon']);
            arrObj[planeNames.indexOf(project[i]['f15'])].startTime.push(project[i]['dati']);
        }
    }
    for (let i = 0; i < planeNames.length; i++) {
        arrObj[i].name = planeNames[i];
    }
    for (let i = 0; i < arrObj.length; i++) {
        if (arrObj[i].name != '') {
            arrObjNew[i] = arrObj[i];
        }
    }
    console.log(arrObjNew);
    console.log(arrObjNew[1].startPonts);
    for (let i = 0; i < arrObjNew.length; i++) {
        createPolyline(arrObjNew[i].startPonts);
    }
});
function planes(lat,lon) {
    let feauters=[];
    var iFeature = new ol.Feature({

        geometry: new ol.geom.Point(ol.proj.transform([lat, lon], 'EPSG:4326',
            'EPSG:3857')),

        name: 'Flight',

        population: 4000,

        rainfall: 500
    });
    feauters.push(iFeature);
    var vSource = new ol.source.Vector({

        features: feauters //add an array of features
    });

    iStyle = new ol.style.Style({

        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({

            anchor: [0.4, 46],

            anchorXUnits: 'fraction',

            anchorYUnits: 'pixels',

            opacity: 1,

            scale:0.09,

            src: 'assets/img/plane.png'

        }))

    });
    var wLayer = new ol.layer.Vector({
        source: vSource,
        style: iStyle
    });
    map.addLayer(wLayer);
}






