function planeMooving(planeId, xx1, xx2, yy1, yy2, angle, speed) {
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
                element.style.bottom = y + 'px';
            } else {
                y = ((x - x2) * (y1 - y2)) / (x1 - x2) + y2;
                element.style.bottom = y + 'px';
            }
        }
    }
}

function goFly() {
    planeMooving('plane', 10, 800, 10, 500, 120, 10);

    planeMooving('plane1', 1100, 300, 200, 300, 100, 10);



}

goFly();

