/* /editor.js */
(function (window) {
    $(window).load(function () {
        $(".content").on("wheel", function (e) {
            if (Project.Keys.isPressed("Alt") || Project.Keys.isPressed("Shift")) {
                e.preventDefault();
            }
            if (Project.Keys.isPressed("Alt")) {
                Project.Editor.zoom(e.deltaY);
            }
            if (Project.Keys.isPressed("Shift")) {
                window.scrollBy(e.deltaY, 0);
                
            }
        }, true);
    });
    window.Project.prototype.Editor = {
        zoomOut: function (delta) {
            Project.Editor.zoom(1)
        },
        zoomIn: function (delta) {
            Project.Editor.zoom(-1);
        },
        resetZoom: function () {
            Project.Editor.zoomLevel = 1;
            Project.Canvas.resizeCanvases([$("canvas")]);
        },
        zoomLevel: 1,
        zoom: function (delta) {
            if (delta < 0) {
                delta = 30
            } else {
                delta = -30
            }
            Project.Editor.zoomLevel += delta / 1000;
            Project.Canvas.resizeCanvases([$("canvas")]);
        }
    };
})(window);