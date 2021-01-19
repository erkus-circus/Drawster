
function setGridSize(value) {
    brush.gridSize = parseInt(value);
    drawCanvGrid();
}

function drawCanvGrid() {
    $("#loading-modal").show();
    var gc = $("#grid-canvas")[0].getContext('2d');
    setTimeout(() => {
        if (brush.grid) {
            gc.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y += brush.gridSize) {

                // draw grid
                gc.beginPath();
                gc.moveTo(0, y);
                gc.lineTo(canvas.width, y);
                gc.stroke();
            }
            for (let x = 0; x < canvas.width; x += brush.gridSize) {
                gc.moveTo(x, 0);
                gc.lineTo(x, canvas.height);
                gc.stroke();
            }
        }
        $("#loading-modal").hide();
    }, 10);

}