var $element = $('#loader');

$(document).ajaxStart(function () {//индикатор работы AJAX
    $($element).show();
}).ajaxStop(function () {
    $($element).hide();
});

function loaderHide($element) {
    $($element).hide();
}

function loaderShow($element) {
    $($element).show();
}