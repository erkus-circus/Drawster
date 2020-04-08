/* /functions.js */
(function (window) {
    window.Project.prototype.Functions = {
        clear: function () {
            alert("Created new canvas!")
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
            return `ID${++this.idIndex}`;
        }
    };
})(window);