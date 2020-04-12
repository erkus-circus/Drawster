/* /canvas.js */
(function (window) {
    window.Project.prototype.Canvas = {
        width: 1000,
        height: 900,
        resizeCanvases: function (canvases) {
            for (i in canvases) {
                var canvas = canvases[i];

                canvas.width(this.width).csswidth(this.width).marginLeft(-this.width / 2);
                canvas.height(this.height).cssheight(this.height);
            }
        }
    };
})(window);