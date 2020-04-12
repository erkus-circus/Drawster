(function (window) {
    window.Project.prototype.Config = {
        modes: {
            Pen: "Pen",
            Pencil: "Pencil",
            FromSource: "Source",
            Square: "Square",
        },
        selected: {
            from: [0, 0],
            // Value 
            to: [0, 0]
        },
        brushSize: 16,
        connectPoints: true
    };


})(window);