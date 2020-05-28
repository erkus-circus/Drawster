(function (window) {
    var start;
    var end;
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
                config: Project.Config
            };*/

    Project.prototype.Draw.Transform = {};

    Project.prototype.Draw.Transform.Top = function (opts) {

    };

    Project.prototype.Draw.Transform.Down = function (opts) {
    };

    Project.prototype.Draw.Transform.Move = function (opts) {
        var tc = opts.topCtx;
        var { pageOpen } = opts.config;

        Project.Draw.clear(tc);

        if (pageOpen == "move") {
            end[0] += opts.deltaX;
            end[1] += opts.deltaY;
            tc.fillRect(...start, end[0] - start[0], end[1] - start[1]);
        }
    };

    Project.prototype.Draw.Transform.Init = function (opts) {
        if (!Project.Draw.Select.selected) {
            // ERROR
            return;
        }
        Project.Draw.Select.selected = false;
        start = Project.Draw.Select.topPos;
        end = Project.Draw.Select.bottomPos;
        
    Project.prototype.Draw.Transform.Deselect = function (opts) { }

    Project.prototype.Draw.Transform.Up = function (opts) { };
    $(window).load(function () { });
})(window);