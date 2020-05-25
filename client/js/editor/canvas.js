/* /canvas.js */
(function (window) {
    window.Project.prototype.Canvas = {
        width: 900,
        height: 900,
        resizeCanvases: function (canvases) {
            for (i in canvases) {
                var canvas = canvases[i];
                for (let j = 0; j < canvas.length; j++) {
                    const ctx = canvas[j].getContext("2d");
                    var imageData = ctx.getImageData(0, 0, canvas[j].width, canvas[j].height);
                    $(canvas[j]).width(this.width).csswidth(this.width * Project.Editor.zoomLevel).marginLeft((-this.width - Project.Editor.zoomLevel) / 2);
                    $(canvas[j]).height(this.height).cssheight(this.height * Project.Editor.zoomLevel);
                    ctx.putImageData(imageData, 0, 0);
                }
            }
        },

        // resize canvases
        resize: function () {
            Project.MessageBox.setMessage("ResizeCanvases");
            Project.MessageBox.show();
        },

        resizeConfirmed: function (opts) {

            console.log("HER");
            

            Project.Canvas.width = parseInt(opts.width);
            Project.Canvas.height = parseInt(opts.height);

            Project.Canvas.resizeCanvases([$("canvas")]);

            Project.MessageBox.hide();
        }
    };
})(window);