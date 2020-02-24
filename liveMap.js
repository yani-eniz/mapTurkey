let canvas = document.getElementById("cnv");
    canvas.height=document.getElementById("map").offsetHeight;
    canvas.width=document.getElementById("map").offsetWidth;
let ctx = canvas.getContext('2d');

let gridWidth = canvas.scrollWidth;
let gridHeight = canvas.scrollHeight;

let locations = [];




let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([35.41, 38.82]),
        zoom: 6.7
    })
});

let layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([29, 41])),
            })
        ]
    })
});
map.addLayer(layer);

let layer1 = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([40.9032, 40.9963])),
            })

        ]
    })
});
map.addLayer(layer1);

/*let vector = new ol.layer.Vector();
let points = [new ol.geom.Point(29, 41), new ol.geom.Point(40.9032, 40.9963)];
let line = new ol.feature.Vector(new ol.geom.LineString(points));
vector.addFeatures([line]);
map.addLayer(vector);*/

/*let points = new Array(
    new map.Geometry.Point(35.41, 38.82),
    new map.Geometry.Point(37, 41)
);
let line = new map.Geometry.LineString(points);*/

let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');

let overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(overlay);

close.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

map.on('singleclick', function (event) {
    if (map.hasFeatureAtPixel(event.pixel) === true) {
        let coordinate = event.coordinate;

        content.innerHTML = '<b>TK7434</b>';
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();
    }

});

let x_scale;
let y_scale;

function changeScale(){
    let yValue = document.getElementById("Y_scale").value;
    let xValue = document.getElementById("X_scale").value;
    x_scale=parseInt(xValue);
    y_scale=parseInt(yValue);
    drawGrid();
}

function drawGrid(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (let x = 0.5; x <= gridWidth; x += x_scale/0.2645833333) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gridHeight);
    }

    for (let y = 0.5; y <= gridHeight; y += y_scale/0.2645833333) {
        ctx.moveTo(0, y);
        ctx.lineTo(gridWidth, y);

    }

    let currZoom = map.getView().getZoom();
    map.on('moveend', function(e) {
        let newZoom = map.getView().getZoom();
        if (currZoom != newZoom) {
            console.log('zoom end, new zoom: ' + newZoom);
            currZoom = newZoom;
        }
    });

    ctx.strokeStyle = "black";
    ctx.stroke();
}
map.on('click', function(event) {
    let coord = event.coordinate;
    let degrees = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
    let hdms = ol.coordinate.toStringHDMS(degrees);
    console.info(hdms);
});

/*function planeMooving(planeId, xx1, xx2, yy1, yy2, angle, speed) {
    let element = document.getElementById(planeId);
    element.style.transform = 'rotate(-' + angle + 'deg)';
    let x1 = xx1;
    let x2 = xx2;
    let y1 = yy1;
    let y2 = yy2;
    let x = x1;
    let y = y1;
    element.style.left = x1 + 'px';
    element.style.bottom = y1 + 'px';
    let id = setInterval(frame, speed);
    let bool = true;

    function frame() {
        if (x == x2 && y == y2) {
            let xp = x1;
            let yp = y1;
            x1 = x2;
            y1 = y2;
            y2 = yp;
            x2 = xp;
            bool
                ? (element.style.transform = 'rotate(' + (180 - angle) + 'deg)')
                : (element.style.transform = 'rotate(-' + angle + 'deg)')
            bool = !bool
        } else {
            if (x2 > x1) {
                x++;
                element.style.left = x + 'px';
            } else {
                x--;
                element.style.left = x + 'px';
            }
            if (y2 > y1) {
                y = ((x - x1) * (y2 - y1)) / (x2 - x1) + y1;
                element.style.top = y + 'px';
            } else {
                y = ((x - x2) * (y1 - y2)) / (x1 - x2) + y2;
                element.style.top = y + 'px';
            }
        }
    }
}

function goFly() {
    planeMooving("plane1", 40, 640, 360, 30, 340, 20);
    planeMooving("plane3", 100, 720, 260, 400, 0, 30);



}*/

/*var mapVectorSource = new ol.source.Vector({
    features: []
});
var mapVectorLayer = new ol.layer.Vector({
    source: mapVectorSource
});
map.addLayer(mapVectorLayer);

function makeMovable(feature) {
    var modify = new ol.interaction.Modify({
        features: new ol.Collection([feature])
    });

    feature.on('change',function() {
        console.log('Feature Moved To:' + this.getGeometry().getCoordinates());
    }, feature);
    return modify;
}

function createMarker(location, style){
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(location)
    });
    iconFeature.setStyle(style);

    return iconFeature
}

iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/!** @type {olx.style.IconOptions} *!/ ({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'plane.png',
        width: 20,
        height: 20
    }))
});
var marker = createMarker(ol.proj.transform([35.41, 38.82], 'EPSG:4326', 'EPSG:3857'), iconStyle);
mapVectorSource.addFeature(marker);
var modifyInteraction = makeMovable(marker);
map.addInteraction(modifyInteraction);*/

let mapVectorSource = new ol.source.Vector({
    features: []
});
let mapVectorLayer = new ol.layer.Vector({
    source: mapVectorSource
});
map.addLayer(mapVectorLayer);

function makeMovable(feature) {
    let modify = new ol.interaction.Modify({
        features: new ol.Collection([feature])
    });

    feature.on('change',function() {
        console.log('Feature Moved To:' + this.getGeometry().getCoordinates());
    }, feature);
    return modify;
}

function createMarker(location, style){
    let iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(location)
});
iconFeature.setStyle(style);

return iconFeature
}

iconStyle = new ol.style.Style({
    image: new ol.style.Icon( ({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'plane1.png',

    }))
});
let marker = createMarker(ol.proj.transform([35.41, 38.82], 'EPSG:4326', 'EPSG:3857'), iconStyle);
mapVectorSource.addFeature(marker);
let modifyInteraction = makeMovable(marker);
map.addInteraction(modifyInteraction);

function addLayerWithFlight(lat1,lat2,lon1,lon2){
    var iconFeatures=[];
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
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            scale:0.65,
            src: 'airplane.png'

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

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle,
    });
    return vectorLayer;
}

let data = null;
$.getJSON('flights.json', function(result) {
    data = result;
    for (let  i = 0; i<=data.length-1; i++) {
        let project = data[i];
        locations[i]= [project['lon'], project['lon']];
    }
    console.log(locations);
});

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

    var vectorLayer = new ol.layer.Vector({

        source: Surce,
        style: darkStroke
    });
    map.addLayer(vectorLayer);
};

createPolyline(locations);

