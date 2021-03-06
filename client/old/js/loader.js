// FUTURE: fix this 
$(window).load(function () { // window onload
    //vars:
    topCanv = $('#top-canvas')[0];
    tc = topCanv.getContext('2d');
    canvs = $('canvas');

    brush.layers[0] = new Layer('Background');
    c = brush.layers[0].c;
    canvas = brush.layers[0].canvas[0];



    brush.img = _.find('#brush-img');
    //event listeners:
    initNewCanvas(canvs);
    window.addEventListener('mouseup', function () {
        mousedown = false;
    });

    $('.modal').modal();
    $('#load-modal').show();
    $('.panel').hide();
    drawCanvGrid();
    $('#loading-modal').show();
    $('.nav-menu-item').click(function (e, elem) {
        var panel = $('.panel', e.target)

        if (e.target !== this) {
            return;
        }

        if (menuOpen != panel) {
            try {
                menuOpen.hide();
            } catch (e) {
                // no panel open
            }
        }


        panel.toggle();
        menuOpen = panel;
    });

    $('.close-panel-btn').click((e) => {
        var el = $(e.target).parent();
        el.hide();
    });

    $(window).on('keydown', function (e) {
        var cd = e.keyCode || e.wich;
        if (cd == 90 && e.ctrlKey) {
            undo();
        } else if (e.ctrlKey && cd == 89) {
            redo();
        } else if (e.ctrlKey && e.altKey && !e.shiftKey && cd == 67) {
            $('.color').click();
        } else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 67) {
            c.clearRect(0, 0, canvas.width, canvas.height);
        } else if (cd == 32) {
            brush.spaceBar = !brush.spaceBar;
        } else if (cd == 221 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            brush.size += (++brush.size * .04);
            $('.brush-size').html(Math.floor(brush.size))
        } else if (cd == 219 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (brush.size > 2) {
                brush.size -= (++brush.size * .04);
            }
            $('.brush-size').html(Math.floor(brush.size))
        } else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 70) {
            resizeCanvas('f');
        } else if (e.ctrlKey && cd == 83 && e.altKey) {
            //	_('#info-sheet').unfade();
            //	_('@wait',function() {
            //		_('#info-sheet').fade();
            //	}
            //,1100);
        }
        updateTop();
    }, true);

    // for some reason it doesent auto set.

    $(".quick-select").change(function (e) {
        console.log($("#" + e.target.value + "-tip").html()[0]);

        $("#quick-tip").html($("#" + e.target.value + "-tip").html()[0]);
    });

    $("#quick-tip").html($("#" + "Brush" + "-tip").html()[0]);

    // keep all inputs uniform
    $("input").change(uniformChange);
    $("select").change(uniformChange);

    $("#quick-tip").html($(".Brush-tip").html()[0]);

    $(window).on('mousemove', draw, true);
    //fun calls:
    initAdvancedBrushSets();

    // other:
    $('.color').val((sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : '#000000');


    // set css width and height so no errors occur
    canvs.csswidth(canvs.width()[0] + 'px');
    canvs.cssheight(canvs.height()[0] + 'px');


    $("*").style('fontFamily', "'Indie Flower', cursive");
    // layer maker:


    // other onload
    // PARAMS
    resizeCanvas('l');
    $('#loading-modal').hide();

});