var projectVersion = 0;
var altPressed = false;

var brush = {

    // show grid ontop of canvas.
    grid: false,

    // size of boxes
    gridSize: 8,
    layers: {},

    // brush is big object of everything that  the cursor can do. includes some canvas objects
    mode: 'pen',
    oldMode: 'pixel',
    gramode: 0,
    size: 16,
    color: (sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : 'black',
    transparency: 1,
    img: null, // the image to draw in image mode
    width: 100,
    height: 100,
    calig: {
        size: 0
    },
    rotate: 0,
    shadow: { // shadows
        on: true,
        blur: 0,
        offX: 0,
        offY: 0,
        color: 'black'
    },
    lastPos: {
        x: null,
        y: null
    },
    line: {
        from: [0, 0],
        lineWidth: 10
    },
    pos: [0, 0], // last pos of mouse
    title: 'Untitled'
};

brush.spaceBar = false; // is the spaceBar toggled?

var webApp = false;

var canvasObj = {
    oldImages: [],
    newImages: []
}; // redo and undo
// TODO: redo

var version = '0.8.0',
    vercsionFull = {
        major: 0,
        minor: 8,
        build: 0,
        patch: 0
    };

var menuOpen = null; // the open menu

var imageURL = '',
    drawable = true,
    makingSomething = 0;

let canvas;
let topCanv, tc;
let c; // context

var mousedown = false;