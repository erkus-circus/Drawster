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
        
        var c = opts.topCtx;
        c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        c.beginPath();
        c.shadowBlur = 1;
        c.shadowColor = alternating ? "#fff": "#000";
        c.strokeStyle = !alternating ? "#fff" : "#000";


        c.arc(opts.pos[0], opts.pos[1], opts.config.size / 2, 0, 2 * Math.PI);
        c.stroke();
        c.beginPath();
        c.shadowBlur = 1;
        c.shadowColor = alternating ? "#fff" : "#000";
        c.strokeStyle = !alternating ? "#fff" : "#000";


        c.arc(opts.pos[0], opts.pos[1], 1, 0, 2 * Math.PI);
        c.fill();

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
        c.globalAlpha = config.globalAlpha / 100;
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
        dc.globalAlpha = config.globalAlpha / 100;
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
})(window);