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
    
    Project.prototype.Draw.Select = {
        topPos: [0,0],
        bottomPos: [0, 0],
        // if selected
        selected: false
    };

    Project.prototype.Draw.Select.Top = function (opts) {
        var cc = opts.topCtx;
        //Project.Draw.clear(cc);
        //cc.fillRect(...opts.pos, 1, 1);
    };

    Project.prototype.Draw.Select.Down = function (opts) {
        Project.Draw.Select.topPos = [...opts.pos];
        Project.Draw.Select.bottomPos = [...opts.pos];
    }

    Project.prototype.Draw.Select.Move = function (opts) {
        Project.Draw.Select.bottomPos = opts.pos;
        var tc = opts.topCtx;

        tc.beginPath();
        Project.Draw.clear(tc);
        console.log(Project.Draw.Select.topPos);

        tc.strokeRect(...Project.Draw.Select.topPos, Project.Draw.Select.bottomPos[0] - Project.Draw.Select.topPos[0], Project.Draw.Select.bottomPos[1] - Project.Draw.Select.topPos[1]);
    };

    Project.prototype.Draw.Select.Init = function (opts) { }
    
    Project.prototype.Draw.Select.Deselect = function (opts) { }
    
    Project.prototype.Draw.Select.Up = function (opts) {
        Project.Draw.Select.selected = true;
    }

    // clip
    Project.prototype.Draw.clip = function (ctx) {
        if (Project.Draw.Select.selected) {
            ctx.save();

            // WRONG!!!!!!!!!!!
            ctx.clip(
                Project.Draw.Select.topPos.x,
                Project.Draw.Select.topPos.y,
                Project.Draw.Select.bottomPos.x,
                Project.Draw.Select.bottomPos.y
            );
        }
    };


    $(window).load(function () {
    });
})(window);