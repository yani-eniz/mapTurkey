let canvas = document.querySelector('#map');
let ctx = canvas.getContext('2d');
let imageObj = new Image(window.innerWidth, window.innerHeight);
let x;
let y;
let arrY = [];
let arrX = [];
let result = [];
let rectWidth = 11.4;
let rectHeight = 15.2;
let gridX;
let gridY;
let xAdept;
let yAdept;


    imageObj.onload = function () {
        ctx.drawImage(imageObj, 0, 0);
    }

        function gridMap() {
            arrX = [];
            arrY = [];
            ctx.clearRect(0,0,1200,584);
            ctx.drawImage(imageObj, 0, 0);
            gridX = document.gridPositions.gridX.value;
            gridY = document.gridPositions.gridY.value;
            xAdept = parseInt(gridX);
            yAdept = parseInt(gridY);
            console.log(xAdept);
            console.log(yAdept);

            /*ctx.drawImage(imageObj, 0, 0);*/
            ctx.beginPath();
            for (x = 0.5; x < 1200; x += xAdept) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 584)
            }

            for (y = 0.5; y < 584; y += yAdept) {
                ctx.moveTo(0, y);
                ctx.lineTo(1200, y)
            }
            ctx.strokeStyle = 'black';
            ctx.stroke();

            for (x = 0.5; x <= 1200; x += xAdept) {
                arrX.push(Math.floor(x));
            }
            for (y = 0.5; y <= 584; y += yAdept) {
                arrY.push(Math.floor(y));
            }
        }

    canvas.onmousedown = function (event) {
        x = event.offsetX;
        y = event.offsetY;
    };
    canvas.onmouseup = function (event) {
        console.log(`x: ${x}, y: ${y}`);
        let result = [];
        for (let i = 0; i < arrX.length; i++) {
            if (x <= arrX[i + 1] && x >= arrX[i]) {
                result.push(arrX[i]);
            }
        }
        for (let i = 0; i < arrY.length; i++) {
            if (y <= arrY[i + 1] && y >= arrY[i]) {
                result.push(arrY[i]);
            }
        }
        ctx.rect(result[0] + 0.5, result[1], xAdept, yAdept);
        ctx.fillStyle = "green";
        ctx.fill();
        result = [];

    };

imageObj.src = 'map.png';
imageObj.style.position = 'relative';