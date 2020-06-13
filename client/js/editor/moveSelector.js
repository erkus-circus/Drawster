(function (window) {

    var pageBtns = {};

    function switchSelectorViews(e, elem, opts, defaultPage, name) {

        $(".selector-box").removeClass("btn-selected");
        elem.addClass("btn-selected");

        $('.page').hide();
        $(`.page-${defaultPage}`).show();

        Project.Config.pageOpen = defaultPage;

        $(".selector-box-menu-sections").html("");
        
        for (let i = 0; i < opts.length; i++) {
            $(".selector-box-menu-sections").append(pageBtns[opts[i]].clone(true));
        }
        $(".selector-box-menu-section-box").removeClass("btn-menu-selected");
        $(`.box-${defaultPage}`).addClass("btn-menu-selected");

        // change project mode
        Project.Config.mode = Project.Config.Mode[name];
    }

    function createMenu(json) {

        for (const key in json.pages) {
            var menu = json.pages[key];

            var page = $("<div>").className(`page-${key} page selector-box-content-menu`).hide();

            var s = $("<span>");
            s.className("selector-box-title");
            s.text(menu.name);

            page.append(s);
            
            var btnElem = $("<div>");
            btnElem.className(`selector-box selector-box-menu-section-box box-${key}`);
            btnElem.text(menu.name[0]);
            
            var name = $("<span>");
            name.className(`selector-box-section-hidden`);
            name.text(menu.name.slice(1));
            
            btnElem.append(name);
            
            btnElem.click(function (e, elem) {
                $(".selector-box-menu-section-box").removeClass("btn-menu-selected");
                elem.addClass("btn-menu-selected");
                Project.Config.pageOpen = key;
                $(`.page`).hide();
                $(`.page-${key}`).show();
            });
            
            pageBtns[key] = btnElem;
            
            for (let i = 0; i < json.pages[key].inputs.length; i++) {
                const input = menu.inputs[i];
                var inputElem = $("<span>").className("selector-input").text(input.title);
                inputElem.change(function (e, elem) {
                    var [value] = $(".selector-box-input", elem[0]).value();
                    console.log(value);

                    Project.Config[input.option] = value;
                });


                if (input.type === "button") {
                    inputElem.append($("<button>").html(input.value)
                        .className("selector-box-input"));
                    inputElem.click(function() {
                        Project.Fn.getPath(input.option)();
                    });
                }
                else if (input.type === "number") {
                    inputElem.append($("<input>").type("number").value(input.value)
                        .className("selector-box-input").display("inline")
                        .min(input.range[0]).max(input.range[1]));
                } else if (input.type === "checkbox") {
                    var box = $("<label>").className("selector-box-switch").append($.merge(
                        $("<input>").type("checkbox").checked(input.value).className("selector-box-input"),
                        $("<span>").className("selector-box-slider")
                    ));

                    inputElem.append(box);
                } else if (input.type === "select") {
                    var select = $("<select>").className("selector-box-input");
                    for (let j in input.options) {
                        select.append($("<option>").text(j).value(input.options[j]));
                    }
                    inputElem.append(select);
                } else {
                    inputElem.append($("<input>").type(input.type).className("selector-box-input selector-box-" + input.type));
                }
                

                page.append(inputElem)
            }
            $(".selector-box-menu").append(page);
        }

        // left buttons toggle right buttons
        for (let i = 0; i < json.sidebuttons.length; i++) {
            const btn = json.sidebuttons[i];

            var btnElem = $("<div>").className(`selector-box-section selector-box selector-box-${btn.name}`).text(btn.name[0]);
            btnElem.append($("<span>").className(`selector-box-section-hidden`).text(btn.name.slice(1)));

            btnElem.click(function (e, elem) {
                switchSelectorViews(e, elem, btn.options, btn.defaultPage, btn.name);
                
            });

            $(".selector-box-sections").append(btnElem);
        }
    }

    function setMovement() {
        var sel = $(".selector-box-main");
        console.log(sel);

        sel.left(window.innerWidth / 5 + "px");
        sel.top(window.innerHeight / 5 + "px");


        sel.mousedown(function (e) {
            if (e.target === sel[0]) {
                Project.Selector.mouseDown = true;
            }
        });


        $(window).mouseup(function (e) {
            Project.Selector.mouseDown = false;
        });

        $(window).mousemove(function (e) {
            var sel = $(".selector-box-main");
            if (Project.Selector.mouseDown) {
                if (e.clientX - 16 < 0 || e.clientX + 16 > window.innerWidth ||
                    e.clientY - 16 < 0 || e.clientY + 16 > window.innerHeight) {
                    return;
                }
                sel.style("top", e.clientY - 32).style("left", e.clientX - 16);
            }
        });
    }

    window.Project.prototype.Selector = {
        mouseDown: false
    };
    
    $(window).load(async function () {
        var response = await fetch("/data/editConfigPages.json");
        var json = await response.json();


        setMovement();
        createMenu(json);

        // Show the Brush menu as the start
        switchSelectorViews(null, $('.selector-box-Pen'), json.sidebuttons[0].options, "color", "Pen");
    });
})(window);