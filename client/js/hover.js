(function ($) {
    $.fn.hover = function (on = function () { }, out = function () { }) {
        return this.forEach(el => {
            $(el).on('mouseover', on);
            $(el).on('mouseout', out);
        });
    }
})(Erklib);