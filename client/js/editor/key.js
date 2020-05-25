/* /editor.js */
(function (window) {
    window.Project.prototype.Keys = {
        pressed: [],
        isPressed: function (key) {
            return Project.Keys.pressed.indexOf(key) >= 0;
        }
    }
    $(window).load(function () {
        $(window).on("unfocus", function () {
            Project.Keys.pressed = [];
        })
        $(window).keydown(function (e) {
            if (Project.Keys.isPressed(e.key)) return;
            Project.Keys.pressed.push(e.key);
        });
        $(window).keyup(function (e) {
            while (Project.Keys.pressed.indexOf(e.key) >= 0) {
                Project.Keys.pressed.splice(Project.Keys.pressed.indexOf(e.key), 1);
            }
        });
    });
})(window);