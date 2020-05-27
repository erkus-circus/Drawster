(function (window) {

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

    };

    Project.prototype.Draw.Transform.Init = function (opts) {
        Project.Draw.Select.selected = false;
    }

    Project.prototype.Draw.Transform.Deselect = function (opts) {}

    Project.prototype.Draw.Transform.Up = function (opts) {
    };




    $(window).load(function () {});
})(window);