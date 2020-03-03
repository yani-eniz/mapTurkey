let rad = 6372795;

let llat1 = 32.4553;
let llong1 = 34.7268;
let llat2 = 32.4496;
let llong2 = 34.7273;

let lat1 = llat1*Math.PI/180;
let lat2 = llat2*Math.PI/180;
let long1 = llong1*Math.PI/180;
let long2 = llong2*Math.PI/180;
console.log(long1)

let cl1 = Math.cos(lat1);
let cl2 = Math.cos(lat2);
let sl1 = Math.cos(lat1);
let sl2 = Math.cos(lat2);
let delta = long2 - long1;
let cdelta = Math.cos(delta);
let sdelta = Math.sin(delta);

let y = Math.sqrt(Math.pow(cl2*sdelta, 2) + Math.pow(cl1*sl2-sl1*cl2*cdelta, 2));
let x = sl1*sl2+cl1*cl2*cdelta;
let ad = Math.atan2(y, x);
let dist = ad*rad;
console.log(dist)

let x1 = (cl1*sl2) - (sl1*cl2*cdelta);
let y1 = sdelta*cl2;
let z = (Math.atan(-y/x))*(180/Math.PI);

if (x < 0) {
    z = z+180.;
}

let z2 = (z+180.) % 360. -180.;
z2 = z2*180./Math.PI;

let anglerad2 = z2 - ((2*Math.PI)*Math.floor((z2/(2*Math.PI))));
let angledeg = (anglerad2*180.)/Math.PI;
console.log(`Distance = ${dist} meters, Angle = ${angledeg-180} degress`);
