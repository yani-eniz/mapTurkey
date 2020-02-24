const Y_CONST=5447255.2983950271;
const X_CONST=2507662.6589170503;

let canvas = document.getElementById('canvo');


canvas.height = document.getElementById('map').offsetHeight;

canvas.width = document.getElementById('map').offsetWidth;

let context= canvas.getContext('2d');

//-! Variables needed for parsing
let JSONstirngs= null;
let object=null;
let iconStyle = null;
let locations= [];//-!
let time = [];
let fButton =  document.getElementById('fly');
var animating = false;
var speed, now;
var VectorLayer=null;
let iconFeatures=[];

speed=200;

var map = new ol.Map({

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

    var YValue = document.getElementById("Y_scale").value;

    var XValue = document.getElementById("X_scale").value;

    x_scale=parseInt(XValue);

    y_scale=parseInt(YValue);

    drawGrid(x_scale,y_scale);
}

function drawGrid(x_scale,y_scale){


    let GridW = canvas.scrollWidth;

    let GridH = canvas.scrollHeight;

    let context= canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    for (var x = 0.5; x <= GridW; x += x_scale) {

        context.moveTo(x, 0);

        context.lineTo(x, GridH);
    }

    for (var y = 0.5; y <= GridH; y +=y_scale) {

        context.moveTo(0, y);

        context.lineTo(GridW, y);
    }

    context.strokeStyle = "#999999";

    context.lineWidth= 1.2;

    context.stroke();
}


//Function which adds layer with plane and route

function addLayerWithFlight(lat1,lat2,lon1,lon2){
    //Trying to do marker plane

    var iconFeature = new ol.Feature({

        geometry: new ol.geom.Point(ol.proj.transform([29.3132, 40.9032], 'EPSG:4326',
            'EPSG:3857')),

        name: 'Flight',

        population: 4000,

        rainfall: 500
    });



    var vectorSource = new ol.source.Vector({

        features: iconFeatures //add an array of features
    });

    iconStyle = new ol.style.Style({

        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({

            anchor: [0.5, 46],

            anchorXUnits: 'fraction',

            anchorYUnits: 'pixels',

            opacity: 1,

            scale:0.09,

            src: 'plane.png'

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
            // hide geoMarker if animation is active
            if (animating && feature.get('type') === 'geoMarker') {
                return null;
            }
            return styles[feature.get('type')];
        }
    });

    return VectorLayer;
}


var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        JSONstirngs=text;
        object= JSON.parse(JSONstirngs);
        createRouteFromArray(object);
        createPolyline(locations);
    };
    reader.readAsText(input.files[0]);
};

function createRouteFromArray(arrayOfJSON){
    locations= [];
    for(i=0; i<arrayOfJSON.length;i++){
        locations[i]= [arrayOfJSON[i].lon,arrayOfJSON[i].lat];
        time[i]=arrayOfJSON[i].dati;
    }
    console.log("lon/lat : "+locations);
    console.log("Current time: "+time);
};

function createPolyline(coordinates){
    var polyline = new ol.geom.LineString(coordinates);
// Coordinates need to be in the view's projection, which is
// 'EPSG:3857' if nothing else is configured for your ol.View instance
    polyline.transform('EPSG:4326', 'EPSG:3857');
    var feature = new ol.Feature(polyline);
    var Surce = new ol.source.Vector();
    Surce.addFeature(feature);

    var darkStroke = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 4,
            lineDash: [2,7]
        })
    });

    var newLayer = new ol.layer.Vector({

        source: Surce,
        style: darkStroke
    });
    map.addLayer(newLayer);
};

function startFly() {
    let index = 0;
    let current = time[0];
    let Trigger = true;
    let id = setInterval(frame, 1000)

    function frame() {
        if (current == time[index]) {
            iconFeatures[0].setGeometry(new ol.geom.Point(ol.proj.transform(locations[index], 'EPSG:4326',
                'EPSG:3857')));
        }
        console.log("time: " + (current) + " time of next: " + time[index]);
    }
}

/*
var myDate = new Date( your epoch date *1000);
document.write(myDate.toGMTString()+"<br>"+myDate.toLocaleString());*/
