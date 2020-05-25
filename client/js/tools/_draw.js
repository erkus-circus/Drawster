(function (window) {
    Project.prototype.Draw = {};
    Project.prototype.Draw.restore = function () {
        Project.Layers.selectedContext.restore();
        Project.Draw.drawCtx.restore();
        Project.Draw.selected = {
            X1: 0,
            Y1: 0,
            X2: Project.Canvas.width,
            Y2: Project.Canvas.height
        };
        Project.Draw["Selector"].ctx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height)
    };
    Project.prototype.Draw.clear = function (ctx) {
        ctx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
    };
})(window);