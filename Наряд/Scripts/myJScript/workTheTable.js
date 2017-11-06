function normOfWork(typeOfWork) {//норма выроботки
    $.ajax({
        type: "GET",
        url: '/home/normWork',
        data: { 'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val() },
        success: function (norm) {
            $('#norm').val(norm);
        }
    });
};

function Unit(element) { //единица измерения      
    $.ajax({
        type: "GET",
        url: '/home/getUnit',
        data: { 'category': $('#productCategory').val() },
        success: function (unit) {
            $('#Unit').val(unit);
        }
    })
}

$("#volumeWood").change(function () {// событие на изминеие обьема хлыста         
    if ($('#productCategory').val() != 0) {
        normOfWork($('#product').val());
    }

});

$("#productCategory").change(function () {// событие на изминеие категории работ
    LoadProduct(this);
    Unit($('#productCategory').val());
});

$("#executed").change(function () {// расчет выполненно норм       
    if ($('#executed').val() != 0 && $('#norm').val() != 0) {
        $('#executedNorm').val(($('#executed').val() / $('#norm').val()).toFixed(2));
    }


     //найти в БД расценку за единицу !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



    $('#Sum').val(($('#executedNorm').val() * 10).toFixed(2)); //!!!!убрать 10 !!!!
});

function columnSum() {//сумма строк   
    $("tfoot tr td:not(:first)").text(function (indx) {//"tfoot tr td:not(:first)"
        if (indx == 1 || indx == 2) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {//
                sum += +$(this).text()
            });
            $(this).text((sum).toFixed(3))
        } else if (indx == 4 || indx == 6 || indx == 7 || indx == 8) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {//
                sum += +$(this).text()
            });
            $(this).text((sum).toFixed(2))
        }
    });
};




