/* /layers.js */
(function (window) {
    window.Project.prototype.Layers = {
        Layer: class {
            ID = window.Project.Functions.genID();
            constructor(name) {
                this.name = name;
                // Add canvas:
                this.canvas = $("<canvas>").className("layer-canvas").id(this.ID);

                //this.write = new window.Project.Write(this.canvas.ctx("2d"));
            }
        },
        addLayer: function (name) {
            var newLayer = new Project.Layers.Layer(name);
            window.Project.Canvas.resizeCanvases([newLayer.canvas]);
            Project.Layers.layers.push(newLayer);
            $(".canvases").append(newLayer.canvas);
        },
        addLayerGUI: function () {
            var name = prompt("Name?");
            Project.Layers.addLayer(name);
        },
        layers: []
    };
})(window);