/* /toolbar.js */
(function (window) {
    function createToolbar(data) {
        var parent = $("<div>").className("nav-menu");
        for (let i = 0; i < data.length; i++) {
            const {
                type,
                name,
            } = data[i];
            if (type === "button") {
                var elem = $("<span>").html(name).className("nav-button").click(function (e) {
                    data[i]["action"].split('.').reduce((o, i) => o[i], window)();
                });
                parent.append(elem);
            } else if (type === "dropdown") {
                var elem = $("<div>").html(name).className("nav-dropdown");
                elem.append(createToolbar(data[i].content));
                parent.append(elem);
            }
            console.log("Loading?");

        }
        return parent;
    }

    $(window).load(async function () {
        const response = await fetch("/data/toolbar.json");
        const json = await response.json();
        $(".nav-bar").append(createToolbar(json));
    });
})(window);