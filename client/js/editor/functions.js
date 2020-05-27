/* /functions.js */
(function (window) {
    window.Project.prototype.Fn = {
        clear: function () {
            localStorage.clear();
            sessionStorage.clear();
            window.Project = new window.ProjectConstructor;
        },
        save: function () {
            alert("saving")
        },
        saveAs: function () {},
        open: function () {
            alert("Opened new project")
        },
        idIndex: 0,
        genID: function () {
            return `ID${++this.idIndex}-`;
        },

        getPath: function (path) {
            return path.split('.').reduce((o, i) => o[i], window);
        },

        swapArrayElem: function (array, i, j) {
            [array[i], array[j]] = [array[j], array[i]];
            return array;
        },
        getMousePosition: function (canvas, e) { // find mouse position on "canvas"
            var rt = canvas[0].getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width()[0] / rt.width, // relationship bitmap vs. element for X
                scaleY = canvas.height()[0] / rt.height; // relationship bitmap vs. element for Y

            return [
                (e.clientX - rt.left) * scaleX,
                (e.clientY - rt.top) * scaleY
            ];
        },
        distance: function (pos1, pos2) {
            return Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2));
        },
        oppositeRGB: function (rgb) {
            return rgb.map(function (color) {
                return 255 - color;
            });
        }
    };
})(window);