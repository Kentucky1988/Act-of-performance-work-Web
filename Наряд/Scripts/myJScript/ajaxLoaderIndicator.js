$(document).ajaxStart(function () {//индикатор работы AJAX
    $('#loader').show();
}).ajaxStop(function () {
    $('#loader').hide();
});