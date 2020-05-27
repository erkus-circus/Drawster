(function (window) {
    window.Project.prototype.Config = {
        Mode: {
            Pen: "Pen",
            Pencil: "Pencil",
            FromSource: "Source",
            Select: "Select",
            Transform: "Transform",
            Shapes: "Shapes",
            Options: "Options"
        },
        mode: "Pen",
        pageOpen:"color",
        selected: {
            from: [0, 0],
            // Value 
            to: [0, 0]
        },
        size: 8,
        miterLimit: 10,
        lineCap: "round",
        lineJoin: "round",
        color: "#000",
        strokeOpacity: 100,
        fillOpacity: 100,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000",
        SelectMode: "Rectangle",
        connectPoints: true,
        set: function (opt, val) {
            this[opt] = val;
        }
    };


})(window);