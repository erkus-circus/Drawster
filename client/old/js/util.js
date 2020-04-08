

function mPos(e) { // find mouse position on "canvas"
    var rt = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rt.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rt.height;  // relationship bitmap vs. element for Y

    if (e.touches) {
        // if touch evt
        return {
            x: (e.touches[0].clientX - rt.left) * scaleX,
            y: (e.touches[0].clientY - rt.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rt.left) * scaleX,
        y: (e.clientY - rt.top) * scaleY
    };
}

function decur(str) { return decodeURIComponent(str); }

function undo() { // undo canvas
    let dataImg = canvasObj.oldImages.pop();
    canvasObj.newImages.push(dataImg);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.putImageData(dataImg, 0, 0);
    c.restore();
}

function redo() { // redo canvas
    let dataImg = canvasObj.newImages.pop();
    canvasObj.oldImages.push(dataImg);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.putImageData(dataImg, 0, 0);
    c.restore();
}