/* /editor.js */
(function (window) {
    $(window).load(function () {
        $(".content").on("wheel", function (e) {
            if (Project.Keys.isPressed("Alt")) {
                Project.Editor.zoom(e.deltaY);
            }
        });
    })
    window.Project.prototype.Editor = {
        zoomOut: function (delta) {
            Project.Editor.zoom(1)
        },
        zoomIn: function (delta) {
            Project.Editor.zoom(-1);
        },
        zoomLevel: 0,
        zoom: function (delta) {
            if (delta < 0) {
                delta = 30
            } else {
                delta = -30
            }
            Project.Editor.zoomLevel += delta;
            Project.Canvas.resizeCanvases([$("canvas")]);
        }
    };
})(window);