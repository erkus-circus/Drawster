(function (window) {


    function topCanvasEvents(canv, c) {
        canv.mousemove(function (e) {
            var pos = Project.Fn.getMousePosition(canv, e);
            c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
            c.beginPath();
            c.arc(pos[0], pos[1], Project.Config.brushSize / 2, 0, 2 * Math.PI);
            c.stroke();
        });

        canv.mouseout(function (e) {
            c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        })
    }


    $(window).load(function () {

        //Top Cnavas
        var topCanv = $("<canvas>").width(Project.Canvas.width).height(Project.Canvas.height);
        topCanv.className("top-canvas layer-canvas");
        topCanv.zIndex(60);
        $(".top-canvases").append(topCanv);
        Project.Canvas.resizeCanvases([topCanv]);
        Project.Draw.TopCtx = topCanv[0].getContext("2d");


        // Drawing Canvas
        var drawCanv = $("<canvas>").width(Project.Canvas.width).height(Project.Canvas.height);
        drawCanv.className("draw-canvas layer-canvas");
        drawCanv.zIndex(59);
        Project.Draw.drawCanv = drawCanv;
        Project.Draw.drawCtx = drawCanv[0].getContext("2d");

        $(".draw-canvases").append(drawCanv);
        window.Project.Canvas.resizeCanvases([drawCanv]);
        // init drawing
        Project.Draw.Init();
    });
})(window);