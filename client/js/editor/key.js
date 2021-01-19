/* /editor.js */
(function (window) {

    var controlKeys = [
        "Control",
        "Alt"
    ]

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

            if (controlKeys.includes(e.key)) {
                e.preventDefault();
            }

            if (Project.Keys.isPressed(e.key)) return;
            Project.Keys.pressed.push(e.key);
        });
        $(window).keyup(function (e) {

            if (controlKeys.includes(e.key)) {
                e.preventDefault();
            }

            while (Project.Keys.pressed.indexOf(e.key) >= 0) {
                Project.Keys.pressed.splice(Project.Keys.pressed.indexOf(e.key), 1);
            }
        });
    });
})(window);