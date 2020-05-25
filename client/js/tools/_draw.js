(function (window) {
    Project.prototype.Draw = {};
    Project.prototype.Draw.restore = function () {
        Project.Layers.selectedContext.restore();
        Project.Draw.drawCtx.restore();
        Project.Draw.Select.selected = false;
        Project.Draw.clear(Project.Draw["Select"].ctx)
    };
    Project.prototype.Draw.clear = function (ctx) {
        ctx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
    };
        // clip
    Project.prototype.Draw.clip = function (ctx) {
        if (Project.Draw.Select.selected) {
            ctx.save();
            ctx.rect(...Project.Draw.Select.topPos, Project.Draw.Select.bottomPos[0] - Project.Draw.Select.topPos[0], Project.Draw.Select.bottomPos[1] - Project.Draw.Select.topPos[1]);
            ctx.clip();
        }
    };
})(window);