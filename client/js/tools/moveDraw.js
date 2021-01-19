/*TODO: STARTOVER*/
(function (window) {
    var imageData = null;
    var translated = [0, 0]
    Project.prototype.Draw.Move = {};
    Project.prototype.Draw.Move.Top = function (opts) {};
    Project.prototype.Draw.Move.Up = function (opts) {

        opts.ctx.clearRect(
            Project.Draw.selected.X1,
            Project.Draw.selected.Y1,
            Project.Draw.selected.X2 - Project.Draw.selected.X1,
            Project.Draw.selected.Y2 - Project.Draw.selected.Y1
        );
        opts.ctx.setTransform(opts.topCtx.getTransform());
        opts.ctx.putImageData(opts.topCtx.getImageData(0, 0, Project.Canvas.width, Project.Canvas.height), ...translated);
        opts.ctx.setTransform(1, 0, 0, 1, 0, 0);
        opts.topCtx.setTransform(1, 0, 0, 1, 0, 0);
        Project.Draw.clear(opts.topCtx);
        translated = [0, 0];

    };
    Project.prototype.Draw.Move.Down = function (opts) {
        imageData = opts.ctx.getImageData(
            Project.Draw.selected.X1,
            Project.Draw.selected.Y1,
            Project.Draw.selected.X2 - Project.Draw.selected.X1,
            Project.Draw.selected.Y2 - Project.Draw.selected.Y1
        );
        opts.topCtx.beginPath();
    };
    Project.prototype.Draw.Move.Move = function (opts) {
        var c = opts.topCtx;
        Project.Draw.clear(c);
        translated[0] += opts.deltaX;
        translated[1] += opts.deltaY;

        c.translate(...translated);
        c.putImageData(imageData, ...translated);
    };
    Project.prototype.Draw.Move.Deselect = function (opts) {
        $(".layer-canvas").cursor("none");
    };
    Project.prototype.Draw.Move.Init = function (opts) {
        $(".layer-canvas").cursor("all-scroll");
    };
})(window);