const Y_CONST=5447255.2983950271;
const X_CONST=2507662.6589170503;

let canvas = document.getElementById('canvo');
canvas.height = document.getElementById('map').offsetHeight;
canvas.width = document.getElementById('map').offsetWidth;
const input= document.getElementById('r1');
let context= canvas.getContext('2d');


//-!Selects: Airplanes & Radars
var objPlane1 = document.getElementById("Plane1");
var objPlane2 = document.getElementById("Plane2");
var objPlane3 = document.getElementById("Plane3");
var objRadar1 = document.getElementById("Radar1");
var objRadar2 = document.getElementById("Radar2");
var objRadar3 = document.getElementById("Radar3");
//-!




//-! Variables needed for parsing
let JSONstirngs= null;
let objectParsedJSON=null;
let StartTime = null;//First time from parsed JSON
let EndTime = null;//Last time from parsed JSON
//-!

let planes = [];// This is an arry of Plane_class objects each of them stores info about 1 flight;
let radars = [];// This is an array of Radars which stares info about each Radar;
let planeNames = [];
let iStyle=null;// Plane style with icon 'plane.png'
let wLayer=null;
let gridControl = true;// Conrolls on and off grid
let gratGrid= null;//Grid Layer


class Plane{
    constructor(Name){
        this.name=Name;
        this.CallSign=null;
        this.Time=[];
        this.Route=[];
        this.FeatureLink=null;
        this.currentPosition=null;
    }
}

class Radar{
    constructor(Name){
        this.name=Name;
        this.range=null;
        this.FeatureLink=null;
        this.LinkedAirplane=null;
        this.coordinates=null;
    }

    isAccessible(){
        let distanceToAirplane = Math.sqrt(Math.pow((this.LinkedAirplane.currentPosition[0] - this.coordinates[0]), 2) + Math.pow((this.LinkedAirplane.currentPosition[1] - this.coordinates[1]), 2));
        if(distanceToAirplane>=this.range){
            this.LinkedAirplane.FeatureLink.getStyle().setImage(

                new ol.style.Icon( ({

                    anchor: [0.5, 0.5],

                    opacity: 1,

                    scale: 0.6,

                    src: 'AirplaneUnAccessible.png'

                }))

            );
        }
        else if(distanceToAirplane<=this.range){
            this.LinkedAirplane.FeatureLink.getStyle().setImage(

                new ol.style.Icon( ({

                    anchor: [0.5, 0.5],

                    opacity: 1,

                    scale: 0.6,

                    src: 'AirplaneAccessible.png'

                }))

            );
        };
        console.log("Watch :" + this.LinkedAirplane.currentPosition[0] +" and "+ distanceToAirplane +" "+ this.LinkedAirplane.name);
    }
}

/*function addGrid(){
    gridControl=!gridControl;
    let cellSize = document.getElementById('targetSize').value;
    if(gridControl==false){

        gratGrid=new ol.layer.Graticule({  // the style to use for the lines, optional.
            strokeStyle: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.8)',
                width: 1,
                lineDash: [0.4, 1]
            }),
            showLabels: false,
            targetSize: cellSize,
            wrapX: false
        })
        map.addLayer(gratGrid);
    }
    else{
        map.removeLayer(gratGrid);
    }
}*/
//JSON FILE OPEN & SORTING
var openFile = function(event) {
    var input = event.target;
    if(wLayer!=null){
        map.removeLayer(wLayer);
        console.log("Removed!");
    }
    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        JSONstirngs=text;
        objectParsedJSON= JSON.parse(JSONstirngs);
        SortingOf(objectParsedJSON);
        let ind=0;
        planes.forEach(element=>{element.FeatureLink = addPlane(element.Route[0][0],element.Route[0][1]);
            createPolyline(element.Route);
            objPlane1.options[objPlane1.options.length]=new Option(element.name, element.name);
            objPlane2.options[objPlane2.options.length]=new Option(element.name, element.name);
            objPlane3.options[objPlane3.options.length]=new Option(element.name, element.name);
            console.log("Name: "+element.name,element.Route);
            ind++;
        });
    };
    reader.readAsText(input.files[0]);
};
//JSON FILE OPEN & SORTING



//SORTING
function SortingOf(arrayOfJSON){

    addRadar([32.31,41.62],1.5);
    addRadar([31.31,39.62],2);
    addRadar([36.31,37.62],2);
    radars.forEach(element=>{
        objRadar1[objRadar1.options.length]=new Option(element.name.toString(),element);
        objRadar2[objRadar2.options.length]=new Option(element.name.toString(),element);
        objRadar3[objRadar3.options.length]=new Option(element.name.toString(),element);
    })
    planeNames=[];

    planes=[];

    StartTime=arrayOfJSON[0].dati;

    EndTime = arrayOfJSON[arrayOfJSON.length-1].dati;

    for(i=0; i<arrayOfJSON.length;i++){

        if(planeNames.indexOf(arrayOfJSON[i].f15)==(-1) && arrayOfJSON[i].f15!=""){

            planeNames.push(arrayOfJSON[i].f15);

            planes.push(new Plane(arrayOfJSON[i].f15));

            planes[planes.length-1].Route.push([arrayOfJSON[i].lon,arrayOfJSON[i].lat]);

            planes[planes.length-1].Time.push(arrayOfJSON[i].dati);
        }else {
            if(arrayOfJSON[i].f15!=""){
                planes[planeNames.indexOf(arrayOfJSON[i].f15)].Route.push([arrayOfJSON[i].lon,arrayOfJSON[i].lat]);
                planes[planeNames.indexOf(arrayOfJSON[i].f15)].Time.push(arrayOfJSON[i].dati);
            }
        }
    }
};
//SORTING





function createPolyline(coordinates){ // create and add on new created Layer a polyline which points are given as param's

    var polyline = new ol.geom.LineString(coordinates);

    polyline.transform('EPSG:4326', 'EPSG:3857');

    var feature = new ol.Feature(polyline);

    var Surce = new ol.source.Vector();

    Surce.addFeature(feature);

    var darkStroke = new ol.style.Style({

        stroke: new ol.style.Stroke({

            color: [60,179,113, 0.9],

            width: 2,

            lineDash: [2,7]

        })

    });

    let newLayer = new ol.layer.Vector({

        source: Surce,

        style: darkStroke
    });
    map.addLayer(newLayer);
}






function addRadar(coordinates,range) {


    var RadarFeature = new ol.Feature({// Radar feature description

        geometry: new ol.geom.Point(ol.proj.transform(coordinates, 'EPSG:4326','EPSG:3857')),

        name: 'Radar',

        rainfall: 500
    });



    var RadarSource = new ol.source.Vector({

        features: [RadarFeature] //add an array of features
    });

    RadarFeature.setStyle(//Adding a style with an icon
        new ol.style.Style({

            image: new ol.style.Icon(/ @type {olx.style.IconOptions} */ ({

                anchor: [0.4, 46],

                anchorXUnits: 'fraction',

                anchorYUnits: 'pixels',

                opacity: 1,

                scale: 1,

                src: 'radar.png'

            }))

        })
    );
    let RadarLayer = new ol.layer.Vector({

        source: RadarSource,
    });
    radars.push(new Radar("Radar "+radars.length.toString()));
    radars[radars.length-1].FeatureLink=RadarFeature;
    radars[radars.length-1].range=range;
    radars[radars.length-1].coordinates=coordinates;

    RadarLayer.getSource().changed();
    map.addLayer(RadarLayer);

}







function startFly(){ //Functions for emulation  of airplane mooving

    console.log("Radar: "+objRadar1.options[objRadar1.selectedIndex].value+" Plane: "+objPlane1.value);
    console.log("Radar: "+objRadar2.value+" Plane: "+objPlane2.value);
    console.log("Radar: "+objRadar3.value+" Plane: "+objPlane3.value);


    let CurrentTime= StartTime;

    var e = document.getElementById("delay");

    var delay = e.options[e.selectedIndex].value;

    let id = setInterval(frame, delay);

    function frame(){

        planes.forEach(element=>{

            if(element.Time.indexOf(CurrentTime.toString())!=(-1)){


                let indexCurr= parseInt(element.Time.indexOf(CurrentTime.toString()));
                let oP1 = new ol.geom.Point(ol.proj.transform(element.Route[indexCurr], 'EPSG:4326','EPSG:3857'));
                let oP2=null;
                if(element.Route[indexCurr+1] == undefined)
                {
                    oP2 = new ol.geom.Point(ol.proj.transform([element.Route[indexCurr][0],element.Route[indexCurr][1]], 'EPSG:4326','EPSG:3857'));
                }
                else{
                    oP2 = new ol.geom.Point(ol.proj.transform([element.Route[indexCurr+1][0],element.Route[indexCurr+1][1]], 'EPSG:4326','EPSG:3857'));
                }

                let dx= oP2.getCoordinates()[0]-oP1.getCoordinates()[0];

                let dy = oP2.getCoordinates()[1]-oP1.getCoordinates()[1];

                var angle =360-Math.atan2(dy,dx)*180 / Math.PI;
                element.currentPosition= [element.Route[indexCurr][0],element.Route[indexCurr][1]];

                radars.forEach(radar=>{radar.isAccessible();});
                if(element.Route[indexCurr+1] != undefined){
                    element.FeatureLink.getStyle().getImage().setRotation(angle*0.0173);}


                let curpos=new ol.geom.Point(ol.proj.transform(element.Route[indexCurr], 'EPSG:4326','EPSG:3857'));

                element.FeatureLink.setGeometry(curpos);

                //    console.log(element.Time.indexOf(CurrentTime.toString())+"  current time: " + CurrentTime +"  End time: "+ EndTime);

            }

        });

        CurrentTime++;

        if (CurrentTime == EndTime)clearInterval(id);
    }
}




function addPlane(lat,lon) { // Functions which creates an array of features and new Layer,Style, Source. !Also listens to iStyles.Image_size slider changings!

    let feauters=[];

    var iFeature = new ol.Feature({

        geometry: new ol.geom.Point(ol.proj.transform([lat, lon], 'EPSG:4326','EPSG:3857')),

        name: 'Flight',

        population: 4000,

        rainfall: 500
    });


    feauters.push(iFeature);

    var vSource = new ol.source.Vector({

        features: feauters //add an array of features
    });


    iFeature.setStyle(
        new ol.style.Style({

            image: new ol.style.Icon(/ @type {olx.style.IconOptions} */ ({

                anchor: [0.4, 46],

                anchorXUnits: 'fraction',

                anchorYUnits: 'pixels',

                opacity: 1,

                scale: map.getView().getZoom()/18,
                src: 'airplane.png'

            }))

        })
    );
    wLayer = new ol.layer.Vector({

        source: vSource,
    });
    wLayer.getSource().changed();
    map.addLayer(wLayer);

    input.addEventListener('input', updateValue);



    function updateValue(e) {
        iStyle.setImage(new ol.style.Icon( ({

                anchor: [0.5, 0.5],

//            anchorXUnits: 'fraction',
//
//            anchorYUnits: 'pixels',

                opacity: 1,

                scale: e.target.value/100,

                src: 'airplane.png'

            }))
        );


        wLayer.getSource().changed();
    }
    return iFeature;
}