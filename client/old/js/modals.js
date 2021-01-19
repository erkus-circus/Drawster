(function ($) {
    $.fn.modal = function () {

        // click gray part
        this.click(function (e) {
            console.log(e);

            if (e.target === this && $('.close-btn', e.target)[0]) {
                $(this).hide();
            }
        });

        return this.forEach(el => {

            $('.close-btn',el).click(function () {
                $(el).hide();
            });
        });
        
    }
})(Erklib);