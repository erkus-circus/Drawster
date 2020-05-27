(function (window) {
    var start = [0, 0];
    var end = [0, 0];
    /*
            var options = {
                pos: pos,
                canvas: Project.Layers.selectedCanvas,
                ctx: Project.Layers.selectedContext,
                topCtx: Project.Draw[mode].ctx,
                topCanvas: Project.Draw.topCanvas,
                lastPos: lastPos,
                eventType: e.type,
                deltaX: a - c,
                outOfBounds: true,
                deltaY: b - d,
                config: Project.Config // pageOpen
            };*/

    Project.prototype.Draw.Shapes = {};

    Project.prototype.Draw.Shapes.Top = function (opts) {
        var tc = opts.topCtx;
        tc.beginPath();
        Project.Draw.clear(tc);
        tc.lineWidth = 1;
        tc.arc(...opts.pos, 1, 0, 2 * Math.PI);
        tc.fill();
        tc.beginPath();
        tc.arc(...opts.pos, 6, 0, 2 * Math.PI);
        tc.stroke();
    };

    Project.prototype.Draw.Shapes.Down = function (opts) {
        start = [...opts.pos];
        end = [...opts.pos];

    };

    Project.prototype.Draw.Shapes.Move = function (opts) {
        end = [...opts.pos];

        var tc = opts.topCtx;

        var pageOpen = opts.config.pageOpen;
        
        Project.Draw.clip(tc);

        if (pageOpen == "rectangle") {
            tc.beginPath();
            //Project.Draw.clear(tc);
            tc.strokeStyle = opts.config.color;
            tc.fillStyle = opts.config.fillStyle;
            tc.lineWidth = opts.config.size;
            tc.globalAlpha = opts.config.fillOpacity / 100;
            tc.rect(...start,end[0]-start[0],end[1]-start[1]);
            tc.fill();
            tc.beginPath();
            tc.globalAlpha = opts.config.strokeOpacity / 100;
            tc.rect(...start, end[0] - start[0], end[1] - start[1]);
            tc.stroke();
        }

        tc.restore();
    };

    Project.prototype.Draw.Shapes.Init = function (opts) {
        
    }

    Project.prototype.Draw.Shapes.Deselect = function (opts) { }

    Project.prototype.Draw.Shapes.Up = function (opts) {

        var c = opts.ctx;
        
        var pageOpen = opts.config.pageOpen;

        Project.Draw.clip(c);

        if (pageOpen == "rectangle") {
            c.beginPath();
            c.strokeStyle = opts.config.color;
            c.fillStyle = opts.config.fillStyle;
            c.lineWidth = opts.config.size;
            c.globalAlpha = opts.config.fillOpacity / 100;
            c.rect(...start, end[0] - start[0], end[1] - start[1]);
            c.fill();
            c.beginPath();
            c.globalAlpha = opts.config.strokeOpacity / 100;
            c.rect(...start, end[0] - start[0], end[1] - start[1]);
            c.stroke();

            Project.Draw.clear(opts.topCtx);
        }

        c.restore();
    };

    $(window).load(function () {});
})(window);