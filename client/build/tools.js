(function (window) {
    Project.prototype.Draw = {};
    Project.prototype.Draw.restore = function () {
        Project.Layers.selectedContext.restore();
        Project.Draw.drawCtx.restore();
        Project.Draw.Select.selected = false;
        Project.Draw.clear(Project.Draw["Select"].ctx);
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
})(window);(function (window) {
    window.Project.prototype.Config = {
        Mode: {
            Pen: "Pen",
            Pencil: "Pencil",
            FromSource: "Source",
            Select: "Select",
            Transform: "Transform",
            Shapes: "Shapes",
            Options: "Options"
        },
        mode: "Pen",
        pageOpen:"color",
        selected: {
            from: [0, 0],
            // Value 
            to: [0, 0]
        },
        size: 8,
        miterLimit: 10,
        lineCap: "round",
        lineJoin: "round",
        color: "#000",
        strokeOpacity: 100,
        fillOpacity: 100,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000",
        SelectMode: "Rectangle",
        connectPoints: true,
        set: function (opt, val) {
            this[opt] = val;
        }
    };


})(window);/*TODO: STARTOVER*/
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
/* options.js */
(function (window) {
    Project.prototype.Draw.Options = {};
    Project.prototype.Draw.Options.Top = function (opts) { };
    Project.prototype.Draw.Options.Down = function (opts) { };
    Project.prototype.Draw.Options.Move = function (opts) { };
    Project.prototype.Draw.Options.Init = function (opts) { };
    Project.prototype.Draw.Options.Deselect = function (opts) { };
    Project.prototype.Draw.Options.Up = function (opts) {};
})(window);/* penDraw.js */
(function (window) {
    // alternate color of selector
    var alternating = true;

    Project.prototype.Draw.Pen = {};
    Project.prototype.Draw.Pen.Deselect = function (opts) {
        opts.ctx.restore();
        opts.topCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
    };
    Project.prototype.Draw.Pen.Top = function (opts) {
        alternating = !alternating;
        
        var tc = opts.topCtx;
        tc.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        tc.beginPath();
        tc.arc(opts.pos[0], opts.pos[1], opts.config.size / 2, 0, 2 * Math.PI);
        tc.stroke();
        tc.beginPath();
        tc.shadowBlur = .01;
        tc.shadowColor = "#fff"
        tc.arc(opts.pos[0], opts.pos[1], 1, 0, 2 * Math.PI);
        tc.fill();

    }
    Project.prototype.Draw.Pen.Move = function (opts) {
        var c = opts.ctx;
        var dc = Project.Draw.drawCtx;
        var config = opts.config;



        // LAYER:DRAW
        // Config
        c.lineWidth = config.size;
        c.shadowColor = config.shadowColor;
        c.shadowBlur = config.shadowBlur;
        c.globalAlpha = config.strokeOpacity / 100;
        c.shadowOffsetX = config.shadowOffsetX;
        c.shadowOffsetY = config.shadowOffsetY;
        c.lineCap = "round";
        c.lineJoin = "round";

        c.strokeStyle = config.color;
        // Draw
        c.moveTo(...opts.lastPos);

        c.lineTo(...opts.pos);



        // LAYER:DRAW
        // Config
        dc.beginPath();
        dc.lineWidth = config.size;
        dc.shadowColor = config.shadowColor;
        dc.shadowBlur = config.shadowBlur;
        dc.globalAlpha = config.strokeOpacity / 100;
        dc.shadowOffsetX = config.shadowOffsetX;
        dc.shadowOffsetY = config.shadowOffsetY;
        dc.lineCap = "round";
        dc.lineJoin = "round";

        dc.strokeStyle = config.color;
        // Draw
        dc.moveTo(...opts.pos);

        if (config.connectPoints) {
            dc.moveTo(...opts.lastPos);
        }
        dc.lineTo(...opts.pos);
        dc.stroke();
    };

    Project.prototype.Draw.Pen.Up = function (opts) {
        opts.topCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        Project.Draw.drawCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);

        var c = opts.ctx;
        c.stroke();
        c.closePath();
        c.restore();
        Project.Draw.drawCtx.restore();
    };
    Project.prototype.Draw.Pen.Down = function (opts) {
        var c = opts.ctx;

        Project.Draw.clip(c);
        Project.Draw.clip(Project.Draw.drawCtx);
        c.beginPath();

        this.Move(opts);
    };
    Project.prototype.Draw.Pen.Init = function (opts) {}
})(window);(function (window) {
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
})(window);(function (window) {
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
})(window);(function (window) {
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