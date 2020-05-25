(function (window) {

    function createButton(btn, inputs) {
        var action = btn.action;
        var btnElem = $("<span>").className("msg-btn").text(btn.title).click(function () {
            // get inputs into object, name: value
            var inputObject = btn.args;
            $(".msg-input-value").map(function (l) {
                inputObject[l.name] = l.value;
            });
            window.Project.Fn.getPath(action)(inputObject);
        });
        $(".msg-btns").append(btnElem);
    }

    window.Project.prototype.MessageBox = {
        messageData: null,
        setMessage: function setMessage(name) {
            var message = messageData[name];
            $(".msg-title").text(message.title);
            $(".msg-content").text(message.content);

            $(".msg-btns").html("");
            $(".msg-inputs").html("");

            for (let i = 0; i < message.inputs.length; i++) {
                const input = message.inputs[i];
                var inputElem = $("<span>").className(".msg-input").text(input.content)
                    .append(
                        $("<input>").value(input.value).name(input.name).className("msg-input-value").type(input.type)
                    );
                $(".msg-inputs").append(inputElem);
            }

            for (let i = 0; i < message.buttons.length; i++) {
                createButton(message.buttons[i]);
            }
        },
        attrs: {},
        set: function (a, b) {
            this.attrs[a] = b;
        },
        get: function (a) {
            return this.attrs[a];
        },
        hide: function hide() {
            $(".outer-msg-box").hide();
        },
        show: function show() {
            $(".outer-msg-box").show();
        },
    };

    //LOADER:
    var messageData;
    $(window).load(async function () {
        const response = await fetch('/data/messages.json');
        const json = await response.json();
        window.Project.MessageBox.messageData = messageData = json;

    });
})(window);