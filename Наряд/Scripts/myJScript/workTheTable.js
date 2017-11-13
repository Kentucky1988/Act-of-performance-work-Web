function normOfWork(typeOfWork) {//норма выроботки
    if ($('#productCategory').val() != 0 && $("#volumeWood").val() != 0) {

        $.ajax({
            type: "GET",
            url: '/home/normWork',
            data: { 'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val() },
            success: function (norm) {
                $('#norm').val(norm[0]);
            }
        });
    }
};

var pricingID     //РозцінкаID
var typeOfBrigade //Комплексна_индивідуальна 

function Unit(element) { //единица измерения  
    $.ajax({
        type: "GET",
        url: '/home/getUnit',
        data: { 'category': $('#productCategory').val() },
        success: function (unit) {
            $('#Unit').val(unit[0].Одиниця_виміру);
            typeOfBrigade = unit[0].Комплексна_индивідуальна;
            pricingID = unit[0].РозцінкаID;
            RankActiv();
        }
    });
};

function RankActiv() {//выпадающий список разряд робот Активный/Неактивный
    //alert(typeOfBrigade);
    if (typeOfBrigade == "комплексна") {
        $('#Rank').val(" ").prop("disabled", true)
    } else if (typeOfBrigade == "індивідуальна") {
        $('#Rank').val(" ").prop("disabled", false)
    }
};

function pricingUnit() {//расценка за единицу   
    $.ajax({
        type: "GET",
        url: '/home/PricingUnit',
        data: { 'pricingID': pricingID, 'rank': $("#Rank").val() },
        success: function (unitPrice) {
            $('#UnitPrice').val(unitPrice);           
            var executed = $('#executedNorm').val();
            var price = unitPrice;
           // alert(executed + "*" + unitPrice + "=" + executed * price);
            $('#Sum').val((executed * price).toFixed(2)); 
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
        $('#executedNorm').val(($('#executed').val().replace(',', '.') / $('#norm').val()).toFixed(3));
    }

    pricingUnit();//найти в БД расценку за единицу    
});

function columnSum() {//сумма строк   
    $("tfoot tr td:not(:first)").text(function (indx) {//"tfoot tr td:not(:first)"
        if (indx == 1 || indx == 2) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {//
                sum += +$(this).text().replace(',', '.');
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

$(document).ready(function () {
    typeOfFelling($('#typeOfFelling'));
});

var TypeOfFelling = []
function typeOfFelling(element) {//вид рубок
    $.ajax({
        type: "GET",
        url: '/home/TypeOfFelling',
        success: function (data) {
            TypeOfFelling = data;
            rendertypeOfFelling(element);
        }
    })
}

function rendertypeOfFelling(element) {//создание списка категорий
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Вибрати'));
    $.each(TypeOfFelling, function (i, val) {
        $ele.append($('<option/>').text(val));
    })
}




