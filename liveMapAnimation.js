let canvas = document.getElementById('cnv');
canvas.height = document.getElementById('map').offsetHeight;
canvas.width = document.getElementById('map').offsetWidth;
const input= document.getElementById('range');

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
let arrRadars = [];
let LatLonForRadar = [[27.738, 37.339], [34.334, 41.731], [43.264, 37.725]];
let arrRadarsVisibility = [];
let lat1 = 32.687;
let lat2 = 35.728;
let lon1 = 42.737;
let lon2 = 40.552;



class Planes{
    constructor(Name){
        this.name=Name;
        this.Dati=[];
        this.NewDati =[];
        this.LatLon=[];
        this.FeatureLink=null;
    }


}

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([35.41, 38.82]),
        zoom: 6,
        minZoom: 6,
        maxZoom: 6
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
        changeTime();
        let ind=0;
        planes.forEach(element=>{
            if(element.NewDati.length != 0){
                element.FeatureLink = addPlane(element.LatLon[0][0],element.LatLon[0][1]);
                createPolyline(element.LatLon);
                console.log(" Name: " + element.name+" "+" Position: "+element.LatLon + "Time :" + element.NewDati);
            }
            ind++;
        });
    };
    reader.readAsText(input.files[0]);
};


function SortingOf(arrJSON) {
    StartTime=arrJSON[0].dati;
    EndTime = arrJSON[arrJSON.length-1].dati;
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
    let latVisibility = 32.4854;
    let lonVisibility = 40.6084;
    let latRadar = 34.334;
    let lonRadar = 41.731;
    var del = document.getElementById("delay");
    var delay = del.options[del.selectedIndex].value;
    let id = setInterval(frame, delay);
    let rad = Math.sqrt(Math.pow(latRadar-latVisibility, 2) + Math.pow(lonRadar - lonVisibility, 2));
    function frame(){
        planes.forEach(element=>{
            if(element.NewDati.indexOf(CurrentTime.toString())!=(-1)){
                    for (let i = 0; i < element.LatLon.length; i++) {
                        if ((Math.sqrt(Math.pow(latRadar - element.LatLon[i][0], 2) + Math.pow(lonRadar - element.LatLon[i][1], 2))) === rad) {
                            element.FeatureLink.getStyle().setImage(new ol.style.Icon(({
                                    anchor: [0.5, 250],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    opacity: 1,
                                    scale: 0.09,
                                    src: 'assets/img/planeGreen.png'
                                }))
                            )
                        } else if ((Math.sqrt(Math.pow(latRadar - element.LatLon[i][0], 2) + Math.pow(lonRadar - element.LatLon[i][1], 2))) >= rad) {
                            element.FeatureLink.getStyle().setImage(new ol.style.Icon(({
                                    anchor: [0.5, 250],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    opacity: 1,
                                    scale: 0.09,
                                    src: 'assets/img/planeRed.png'
                                }))
                            )
                        }
                    }


                element.FeatureLink.setGeometry(new ol.geom.Point(ol.proj.transform(element.LatLon[element.NewDati.indexOf(CurrentTime.toString())], 'EPSG:4326','EPSG:3857')));

                console.log(element.NewDati.indexOf(CurrentTime.toString())+"  current time: " + CurrentTime +"  End time: "+ EndTime);
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
                src: 'assets/img/plane.png'
            }))
        })
    );

    let wLayer = new ol.layer.Vector({
        source: vSource,
    });

    map.addLayer(wLayer);
    input.addEventListener('input', updateValue);


    function updateValue(e) {
        iStyle.setImage(new ol.style.Icon(({
                anchor: [0.4, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                scale: 0.09,
                src: 'assets/img/plane.png'
            }))
        );

        wLayer.getSource().changed();
    }

    return iFeature;
}


function changeTime() {
    epoch_start = document.getElementById("epoch_start").value;
    epoch_end = document.getElementById("epoch_end").value;
    newEpoch_start = parseInt(epoch_start);
    newEpoch_end = parseInt(epoch_end);
    for (let i = 0; i < planes.length; i++) {
        if (planes[i].Dati[0] >= newEpoch_start && planes[i].Dati[planes[i].Dati.length - 1] <= newEpoch_end) {
            for (let k = 0; k < planes[i].Dati.length; k++) {
                planes[i].NewDati.push(planes[i].Dati[k]);
            }

        }
    }
}

function drawRadar(coord){
    var iconRadar = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coord,'EPSG:4326',
            'EPSG:3857')),
        name: 'Radar',
        population: 4000,
        rainfall: 500
    });

    iconRadar.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 250],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                scale: 0.09,
                color: 'red',
                src: 'assets/img/radar.png'
            }))
        })
    );
    arrRadars.push(iconRadar);
    let vectorSource = new ol.source.Vector({
        features: arrRadars
    });
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
    return iconRadar;
}
for (let i = 0; i < LatLonForRadar.length; i++) {
    drawRadar(LatLonForRadar[i]);
    drawRadarVisibility(LatLonForRadar[i]);
}

function drawRadarVisibility(coords){
    var RadarVisibility = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coords,'EPSG:4326', 'EPSG:3857')),
        name: 'Radar',
        population: 4000,
        rainfall: 500
    });

    RadarVisibility.setStyle(
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 100,
                stroke: new ol.style.Stroke({color: 'yellow', width: 2})
            })
        }))
    arrRadarsVisibility.push(RadarVisibility);
    let vectorSource = new ol.source.Vector({
        features: arrRadarsVisibility
    });
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
    return RadarVisibility;

}
