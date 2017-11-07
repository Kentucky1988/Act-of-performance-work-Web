function normOfWork(typeOfWork) {//норма выроботки
    if ($('#productCategory').val() != 0 && $("#volumeWood").val() != 0) {

        $.ajax({
            type: "GET",
            url: '/home/normWork',
            data: { 'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val() },
            success: function (norm) {
                $('#norm').val(norm);
            }
        });
    }
};

var pricingID     //РозцінкаID
function Unit(element) { //единица измерения   

    var typeOfBrigade //Комплексна_индивідуальна 
    $.ajax({
        type: "GET",
        url: '/home/getUnit',
        data: { 'category': $('#productCategory').val() },
        success: function (unit) {
            $('#Unit').val(unit[0].Одиниця_виміру);
            typeOfBrigade = unit[0].Комплексна_индивідуальна;
            pricingID = unit[0].РозцінкаID;
            RankActiv(typeOfBrigade);
        }
    });    
};

function RankActiv(typeOfBrigade) {//выпадающий список разряд робот Активный/Неактивный
    alert(typeOfBrigade);
    if (typeOfBrigade == "Комплексна") {
        $('#rank').val(" ").prop("disabled", true)
    } else if (typeOfBrigade == "індивідуальна") {       
        $('#rank').val(" ").prop("disabled", false)
    } 
};

function Pricing() {//расценка за единицу!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //предать: компл/индив, ИД, разряд
    $.ajax({
        type: "GET",
        url: '/home/normWork',
        data: { 'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val() },
        success: function (norm) {
            $('#norm').val(norm);
        }
    });
};

$("#volumeWood").change(function () {// событие на изминеие обьема хлыста   
    normOfWork($('#product').val());
});

$("#productCategory").change(function () {// событие на изминеие категории работ
    LoadProduct(this);
    Unit($('#productCategory').val());    
});

$("#executed").change(function () {// событие на изминеие ячейки выполнено    
    if ($('#executed').val() != 0 && $('#norm').val() != 0) {// расчет выполненно норм   
        $('#executedNorm').val(($('#executed').val() / $('#norm').val()).toFixed(2));
    }
    
    Pricing();//найти в БД расценку за единицу

    $('#Sum').val(($('#executedNorm').val() * 10).toFixed(2)); //!!!!убрать 10 !!!!!!!!!!!!!!!!!!!
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




