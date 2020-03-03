let canvas = document.getElementById('cnv');
canvas.height = document.getElementById('map').offsetHeight;
canvas.width = document.getElementById('map').offsetWidth;
const input= document.getElementById('r1');

let context= canvas.getContext('2d');
let JSONstirngs= null;
let objectParsedJSON=null;
let planes = [];
let planeNames = [];
let StartTime = null;
let EndTime = null;
let epoch_start;
let epoch_end;
let newEpoch_start;
let newEpoch_end;

class Planes{
    constructor(Name){
        this.name=Name;
        this.Dati=[];
        this.LatLon=[];
        this.FeatureLink=null;
    }


}

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
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

function drawGrid(x_scale,y_scale){
    let GridW = canvas.scrollWidth;
    let GridH = canvas.scrollHeight;
    let context= canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    for (let x = 0.5; x <= GridW; x += x_scale) {
        context.moveTo(x, 0);
        context.lineTo(x, GridH);
    }

    for (let y = 0.5; y <= GridH; y += y_scale) {
        context.moveTo(0, y);
        context.lineTo(GridW, y);
    }
    context.strokeStyle = "#999999";
    context.lineWidth= 1.2;
    context.stroke();
}

let openFile = function(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function(){
        let text = reader.result;
        JSONstirngs=text;
        objectParsedJSON= JSON.parse(JSONstirngs);
        SortingOf(objectParsedJSON);
        let ind=0;
        planes.forEach(element=>{element.FeatureLink = addPlane(element.LatLon[0][0],element.LatLon[0][1]);
            createPolyline(element.LatLon);
            console.log(" Name: " + element.name+" "+" Position: "+element.LatLon + "Time :" + element.Dati);
            ind++;
        });
    };
    reader.readAsText(input.files[0]);
};


function SortingOf(arrJSON) {
    StartTime=arrJSON[0].dati;
    EndTime = arrJSON[arrJSON.length-1].dati;
    epoch_start = document.getElementById("epoch_start").value;
    epoch_end = document.getElementById("epoch_end").value;
    newEpoch_start = parseInt(epoch_start);
    newEpoch_end = parseInt(epoch_end);
    for(let i = 0; i < arrJSON.length; i++){
        if(planeNames.indexOf(arrJSON[i].f15)==(-1) && arrJSON[i].f15!=""){
            planeNames.push(arrJSON[i].f15);
            planes.push(new Planes(arrJSON[i].f15));
            planes[planes.length-1].LatLon.push([arrJSON[i].lon, arrJSON[i].lat]);
            planes[planes.length-1].Dati.push(arrJSON[i].dati);
        }else {
            if(arrJSON[i].f15!=""){
                planes[planeNames.indexOf(arrJSON[i].f15)].LatLon.push([arrJSON[i].lon, arrJSON[i].lat]);
                planes[planeNames.indexOf(arrJSON[i].f15)].Dati.push(arrJSON[i].dati);
            }
        }
    }
};


function createPolyline(coordinates){
    var polyline = new ol.geom.LineString(coordinates);
    polyline.transform('EPSG:4326', 'EPSG:3857');
    var feature = new ol.Feature(polyline);
    var Surce = new ol.source.Vector();
    Surce.addFeature(feature);
    var darkStroke = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 2,
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
    let CurrentTime= StartTime;
    var del = document.getElementById("delay");
    var delay = del.options[del.selectedIndex].value;
    let id = setInterval(frame, delay)
    function frame(){
        planes.forEach(element=>{
            if(element.Dati.indexOf(CurrentTime.toString())!=(-1)){
                element.FeatureLink.setGeometry(new ol.geom.Point(ol.proj.transform(element.LatLon[element.Dati.indexOf(CurrentTime.toString())], 'EPSG:4326','EPSG:3857')));
                console.log(element.Dati.indexOf(CurrentTime.toString())+"  current time: " + CurrentTime +"  End time: "+ EndTime);
            }
        });
        CurrentTime++;
        if (CurrentTime == EndTime)clearInterval(id);
    }
}


function addPlane(lat,lon) {
    let feauters = [];
    var iFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([lat, lon], 'EPSG:4326', 'EPSG:3857')),
        name: 'Flight',
        population: 4000,
        rainfall: 500
    });

    feauters.push(iFeature);
    var vSource = new ol.source.Vector({
        features: feauters
    });

    iFeature.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 250],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                scale: 0.09,
                src: 'assets/img/plane1.png'
            }))
        })
    );

    let wLayer = new ol.layer.Vector({
        source: vSource,
    });

    map.addLayer(wLayer);
    input.addEventListener('input', updateValue);


    function updateValue(e) {
        iStyle.setImage(new ol.style.Icon( ({
                anchor: [0.4, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                scale: 0.09,
                src: 'assets/img/plane1.png'
            }))
        );

        wLayer.getSource().changed();
    }
    return iFeature;
}
