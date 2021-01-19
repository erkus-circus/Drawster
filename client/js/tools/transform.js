(function (window) {
    var noTransform;
    var start;
    var end;
    var imageData;
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
        if (noTransform) {
            Project.MessageBox.setMessage("NoSelectError");
            Project.MessageBox.show();
        }
    };
    
    Project.prototype.Draw.Transform.Move = function (opts) {
        var tc = opts.topCtx;
        var { pageOpen } = opts.config;


        Project.Draw.clear(tc);
        tc.beginPath();
        if (pageOpen == "move") {
            end[0] += opts.deltaX;
            end[1] += opts.deltaY;
            start[0] += opts.deltaX;
            start[1] += opts.deltaY;
            tc.strokeRect(...start, end[0] - start[0], end[1] - start[1]);
        }
        else if (pageOpen == "skew") {
            tc.transform(1,start[0]-end[0],start[1]-end[1],1,0,0);
            tc.strokeRect(...start, end[0] - start[0], end[1] - start[1]);
        }
    };

    Project.prototype.Draw.Transform.finish = function() {
        
        // get opts

        var {pageOpen, ctx, topCtx} = Project.Draw.emulateDraw();
        console.log(pageOpen)
        console.log("ffff");
        
        if(pageOpen === "move") {
            ctx.putImageData(imageData,...start);
        }
    };

    Project.prototype.Draw.Transform.Init = function (opts) {
        if (!Project.Draw.Select.selected) {
            // ERROR
            noTransform = true;
            return;
        }
        noTransform = false;
        Project.Draw.restore();
        start = Project.Draw.Select.topPos;
        end = Project.Draw.Select.bottomPos;
        imageData = opts.ctx.getImageData(...start, end[0] - start[0], end[1] - start[1]);
        
    };
    Project.prototype.Draw.Transform.Up = function (opts) { };
    Project.prototype.Draw.Transform.Deselect = function (opts) {
        opts.ctx.setTransform(1,0,0,1,0,0);
    };
})(window);