using System.Web;
using System.Web.Optimization;

namespace Наряд
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jqueryValidate").Include(
                        "~/Scripts/jquery.validate.min.js",
                        "~/Scripts/jquery.validate.unobtrusive.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/notify_validate_loader").Include(
                        "~/Scripts/myJScript/notifyMessage.js",       /*окно сообщеиня*/
                        "~/Scripts/myJScript/ajaxLoaderIndicator.js", /*индикатор загрузки Ajax*/
                        "~/Scripts/myJScript/validate.js"));          /*валидация*/

            bundles.Add(new ScriptBundle("~/bundles/scriptPage").Include(
                        "~/Scripts//myJScript/datepicker.languageUK.js",      /*файл с кодом Украинского языка календаря и робота с датами*/
                        "~/Scripts/myJScript/autocomplete.combobox.js",       /*файл с кодом autocomplete.combobox*/
                        "~/Scripts/myJScript/addData.copyString.saveData.js", /*Файл JS в котором будит обработчик нажатия кнопок*/
                        "~/Scripts/myJScript/workTheTableFacial.js",          /*робота с ячейками таблицы Лицевая*/
                        "~/Scripts/myJScript/workTheTableReverse.js",         /*робота с ячейками таблицы Обратная*/                      
                        "~/Scripts/myJScript/printDocument.js"));             /*печать наряда*/

            bundles.Add(new ScriptBundle("~/bundles/cubaturnic").Include(
                        "~/Scripts/myJScript/cubaturnic.js"));       /*кубатурник*/

            bundles.Add(new ScriptBundle("~/bundles/dataBase").Include(
                        "~/Scripts/myJScript/editingTheDatabase.js",    /*робота с базой данных*/                       
                        "~/Scripts/myJScript/jQueryFixesDecimal.js"));  /*исправление библиотеки jquery.validate.js чтоб можно было в поле ввода вводить запятую ","*/
            
            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.min.css",            
                        "~/Content/ComboBox.Autocomplete.css",       /*файл с стилем autocomplete.combobox*/
                        "~/Content/Loader.css",                      /*анимация загрузки Ajax*/
                        "~/Content/textAlignment.css"));             /*стиль с выравниванием текста*/
        }
    }
}
