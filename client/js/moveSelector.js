(function (window) {

    function createMenu(json) {
        json = json.B;
        $(".selector-box-title").text(json.title);

        for (let i = 0; i < json.inputs.length; i++) {
            const input = json.inputs[i];
            var inputElem = $("<span>").className("selector-input").text(input.title);

            if (input.type === "number") {
                inputElem.append($("<input>").type("number").value(input.value)
                    .className("selector-box-input").display("inline")
                    .min(input.range[0]).max(input.range[1]));
            }

            if (input.type === "checkbox") {
                var box = $("<label>").className("selector-box-switch").append($.merge(
                    $("<input>").type("checkbox").checked(input.value),
                    $("<span>").className("selector-box-slider")
                ))

                inputElem.append(box);
            }

            $(".selector-box-content").append(inputElem);
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

        sel.dblclick(function (e) {
            if (e.target === sel[0]) {
                $(".selector-box-menu").toggle();
            }
        });

        $(window).mouseup(function (e) {
            Project.Selector.mouseDown = false;
            var sel = $(".selector-box-main");
        });

        $(window).mousemove(function (e) {
            var sel = $(".selector-box-main");
            if (Project.Selector.mouseDown) {
                if (e.clientX - 16 < 0 || e.clientX + 16 > window.innerWidth ||
                    e.clientY - 16 < 0 || e.clientY + 16 > window.innerHeight) {
                    return;
                }
                sel.style("top", e.clientY - 16).style("left", e.clientX - 16);
                $(".selector-box-menu").hide();
            }
        });
    }

    $(window).load(async function () {
        var response = await fetch("/data/editConfigPages.json");
        var json = await response.json();

        window.Project.Selector = {
            mouseDown: false
        };

        setMovement();
        createMenu(json);
    });
})(window);