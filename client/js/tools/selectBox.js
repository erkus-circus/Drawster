(function (window) {
    var spaces;
    var alternating = false;
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
        topPos: [0, 0],
        bottomPos: [0, 0],
        // if selected
        selected: false,
    };

    Project.prototype.Draw.Select.Top = function (opts) {
        var tc = Project.Draw.drawCtx;
        tc.setLineDash([3, 3]);
        tc.beginPath();
        Project.Draw.clear(tc);
        tc.arc(...opts.pos, 1, 0, 2 * Math.PI);
        tc.fill();
        tc.beginPath();
        tc.arc(...opts.pos, 6, 0, 2 * Math.PI);
        tc.stroke();

    };

    Project.prototype.Draw.Select.Down = function (opts) {
        Project.Draw.Select.topPos = [...opts.pos];
        Project.Draw.Select.bottomPos = [...opts.pos];
        Project.Draw.Select.selected = true;
    };

    Project.prototype.Draw.Select.Move = function (opts) {
        Project.Draw.Select.bottomPos = opts.pos;
        var tc = opts.topCtx;
    };

    Project.prototype.Draw.Select.Init = function (opts) {
    }
    
    Project.prototype.Draw.Select.Deselect = function (opts) {
        Project.Draw.clear(opts.topCtx);
    }
    
    Project.prototype.Draw.Select.Up = function (opts) {
        Project.Draw.Select.selected = true;
    };


    $(window).load(function () {

        

        setInterval(() => {
            spaces = ++spaces < 40 ? spaces : 0;
            var tc = Project.Draw.Select.ctx;
            if (Project.Draw.Select.selected) {
                tc.beginPath();

                Project.Draw.clear(tc);
                tc.setLineDash([5, 5]);
                tc.lineDashOffset = spaces;
                tc.shadowBlur = .01;
                tc.shadowColor = "#fff"

                
                tc.strokeRect(...Project.Draw.Select.topPos, Project.Draw.Select.bottomPos[0] - Project.Draw.Select.topPos[0], Project.Draw.Select.bottomPos[1] - Project.Draw.Select.topPos[1]);
            }
        }, 1000 / 60);
    });
})(window);