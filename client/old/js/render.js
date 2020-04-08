function draw(e) { // draws on the canvas, main function

    var pos = brush.pos = mPos(e);

    if (mousedown && brush.spaceBar) {
        brush.calig.size++;
    }
    else if (mousedown && !brush.spaceBar && brush.calig.size > 0) {
        brush.calig.size--;
    }
    else {
        brush.calig.size = 0;
    }

    c.shadowColor = brush.shadow.color;
    c.shadowBlur = brush.shadow.blur;
    c.shadowOffsetX = brush.shadow.offX;
    c.shadowOffsetY = brush.shadow.offY;
    c.globalAlpha = brush.transparency;

    if (!pos.x < 0 || !pos.x > canvas.width || !pos.y < 0 || !pos.y > canvas.height) {
        e.preventDefault();
        e.stopPropagation();
    }
    c.beginPath();
    if (mousedown && drawable && brush.mode == 'erase') {
        c.shadowColor = 0;
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillStyle = brush.color;
        c.globalAlpha = 1;

        if (brush.oldMode == 'grid') {
            var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
                y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
                dx = brush.gridSize,
                dy = brush.gridSize;
            c.clearRect(x, y, dx, dy);
        }
        else {
            c.clearRect(pos.x - ((brush.size + brush.calig.size) / 2), pos.y - ((brush.size + brush.calig.size) / 2), brush.size + brush.calig.size, brush.size + brush.calig.size);
        }

    }
    else if (mousedown && drawable && brush.mode == 'pixel') {
        c.fillStyle = brush.color;
        c.fillRect(pos.x - ((brush.size + brush.calig.size) / 4), pos.y - ((brush.size + brush.calig.size) / 4), (brush.size + brush.calig.size) / 2, (brush.size + brush.calig.size) / 2);
    }
    else if (mousedown && drawable && brush.mode == 'image') {
        c.strokeStyle = brush.color;
        c.lineWidth = brush.line.lineWidth;
        c.drawImage(brush.img, pos.x - (brush.width / 2), pos.y - (brush.height / 2), brush.width, brush.height);
    }
    else if (mousedown && brush.mode == 'pen' && drawable) {
        c.lineJoin = 'round';
        c.lineCap = 'round';
        c.lineWidth = brush.size / 2 + brush.calig.size;
        c.strokeStyle = brush.color;
        c.moveTo(brush.lastPos.x, brush.lastPos.y);
        c.lineTo(pos.x, pos.y);
        c.stroke();
    }
    else if (mousedown && brush.mode == 'grid' && drawable) {
        c.beginPath()
        c.fillStyle = brush.color;
        var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
            y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
            dx = brush.gridSize,
            dy = brush.gridSize;
        c.rect(x, y, dx, dy);
        c.fill();
        c.closePath();
    }

    c.closePath()

    updateTop();
    brush.lastPos.x = pos.x;
    brush.lastPos.y = pos.y;
    if (brush.grid) {
        $('.mouse-pos').html(Math.round(pos.x / brush.gridSize) + ", " + Math.round(pos.y / brush.gridSize));
    }
    else {
        $('.mouse-pos').html(Math.round(pos.x) + ", " + Math.round(pos.y));
    }
}

function updateTop() {
    var pos = brush.pos;
    tc.beginPath();
    tc.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // check if grid
    if (brush.mode == 'grid' || (brush.oldMode == 'grid' && brush.mode == 'eraser')) {
        tc.beginPath()
        tc.lineWidth = 1;
        tc.globalAlpha = .5
        tc.fillStyle = brush.color;
        var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
            y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
            dx = brush.gridSize,
            dy = brush.gridSize;
        tc.rect(x, y, dx, dy);
        tc.fill();
        tc.closePath();
    }

    if (brush.mode === 'pen') {
        tc.strokeStyle = brush.color;
        tc.shadowColor = 'white';
        tc.shadowBlur = 10;
        tc.arc(pos.x, pos.y, brush.size / 4 + brush.calig.size / 2, 0, Math.PI * 2);
        tc.stroke()
        tc.arc(pos.x + c.shadowOffsetX, pos.y + c.shadowOffsetY, (brush.size / 4 + brush.calig.size + c.shadowBlur / 1.5 / 2), 0, Math.PI * 2);
        tc.stroke();
    }
    else if (brush.mode === 'pixel') {
        tc.beginPath()
        tc.fillStyle = brush.color;
        tc.rect(pos.x - ((brush.size + brush.calig.size)) / 4,
            pos.y - ((brush.size + brush.calig.size)) / 4, (brush.size + brush.calig.size) / 2,
            (brush.size + brush.calig.size) / 2);
        tc.stroke()
        tc.closePath()
    }
    tc.closePath()
}


