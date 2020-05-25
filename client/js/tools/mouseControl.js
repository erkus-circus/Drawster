(function (window) {
    var lastPos = [0, 0];
    var inited = false;
    var lastMode = null;

    function initCanvas(name) {
        var newCanvas = $("<canvas>").className(`layer-canvas ${name}-canvas`);
        Project.Canvas.resizeCanvases([newCanvas]);
        Project.Draw[name].canvas = newCanvas;
        Project.Draw[name].ctx = newCanvas[0].getContext("2d");
        $(".top-canvases").append(newCanvas);
    }

    function handleMove(e) {
        if (!inited) {
            return;
        }
        e.preventDefault();
        const mode = Project.Config.mode;
        var pos = Project.Fn.getMousePosition($(".top-canvas"), e);
        var [a, b] = pos;
        var [c, d] = lastPos;

        // Options
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
        };

        // Modes
        if (lastMode === null) {
            lastMode = mode;
        }
        if (mode != lastMode) {
            Project.Draw[lastMode].Deselect(options);
            lastMode = mode;
            Project.Draw[mode].Init(options);

        }


        Project.Draw[mode].Top(options);
        if (Project.Canvas.mousedown) {
            if (e.type === "mousedown") {
                Project.Draw[mode].Down(options);

            } else if (e.type === "mouseup") {
                Project.Draw[mode].Up(options);

            } else if (e.type === "mousemove") {
                Project.Draw[mode].Move(options);
            }
        }

        lastPos = pos;
    }

    Project.prototype.Draw.Init = async function () {

        $(".top-canvas").mousedown(function (e) {
            Project.Canvas.mousedown = true;
            handleMove(e);
        });

        $(window).mousemove(handleMove);

        $(window).mouseup(function (e) {
            handleMove(e);
            Project.Canvas.mousedown = false;
        });


        const response = await fetch("/data/modes.json");
        const json = await response.json();

        for (let i = 0; i < json.length; i++) {
            const name = json[i];
            initCanvas(name);
        }

        inited = true;
    }
})(window);