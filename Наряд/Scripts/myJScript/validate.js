function validateInt(element) {//в input только целые числа
    $(element).keydown(function (e) {
        if (e.key.length == 1 && e.key.match(/[^0-9]/)) {
            return false;
        };
    })
}

function validateDouble(element) {//в input double
    $(element).keydown(function (e) {
        if (e.key.length == 1 && e.key.match(/[^0-9''.,]/)) {
            return false;
        };
    })
}