using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Linq.Dynamic;
using System.Web.DynamicData;

namespace Наряд.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getMaterials()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Сортименти.OrderBy(a => a.Назва_сортименту).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult TypeOfFelling()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Вид_рубки.OrderBy(a => a.Вид_рубки1).Select(a => a.Вид_рубки1).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getCategories()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var categories = dc.Категорії_робіт.OrderBy(a => a.Категорії_робіт1).Select(a => a.Категорії_робіт1).ToList();
                return new JsonResult { Data = categories, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }


        public JsonResult getTypeOfWork(string categoryOfWork)
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var TypeOfWork = context.Database.SqlQuery<string>(
                                   $"SELECT Вид_робіт FROM {categoryOfWork}").ToList();

                return new JsonResult { Data = TypeOfWork, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult PricingUnit(string pricingID, string rank)//расценка за единицу   
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                string colum = (rank == "") ? "1" : rank; //индивидуальна / комплексна

                var PricingUnit = context.Database.SqlQuery<decimal>(
                                                 $"SELECT [{colum}] FROM Денна_тарифна_ставка WHERE РозцінкаID = N'{pricingID}'").ToList();

                return new JsonResult { Data = double.Parse(PricingUnit[0].ToString()), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getUnit(string category)
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var TypeOfWork = context.Категорії_робіт.Where(a => a.Категорії_робіт1 == category)
                                                       .Select(a => new { a.Комплексна_индивідуальна, a.РозцінкаID, a.Одиниця_виміру })
                                                       .ToList();

                return new JsonResult { Data = TypeOfWork, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult normWork(string table, string typeOfWork, string volumeWood)//норма выполнения робот
        {
            List<double> norm = new List<double>();
            double volumeWoods = 0;

            string tableNormOfWork;
            string tableNormOfOil;
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var tableNorm = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == table)
                                    .Select(a => a.Норма_віробітку).ToList();
                tableNormOfWork = tableNorm[0];

                var oil = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == table)
                                    .Select(a => a.ГСМ).ToList();
                tableNormOfOil = oil[0];

                if (oil[0] == "-")//если нет ГСМ, тогда пропускаем расчет с V хлиста и возращаем значение в колонке "Норма_віробітку"
                {
                    var normID = db.Database.SqlQuery<int>(
                              $"SELECT Id_Вид_робіт FROM {table} WHERE Вид_робіт = N'{typeOfWork}'").ToList();

                    var normList = db.Database.SqlQuery<decimal>(
                                  $"SELECT Норма_віробітку FROM {tableNormOfWork} WHERE Вид_робіт = '{normID[0]}'").ToList();

                    norm.Add(Convert.ToDouble(normList[0]));
                    norm.Add(0);
                    return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
            }

            try
            {
                volumeWoods = Convert.ToDouble(volumeWood.Replace('.', ','));
            }
            catch (Exception)
            {
                return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

            norm.Add(NormFromTable(table, tableNormOfWork, typeOfWork, volumeWoods)); //норма выроботка
            norm.Add(NormFromTable(table, tableNormOfOil, typeOfWork, volumeWoods)); //норма расхода ГСМ

            return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public double NormFromTable(string table, string tableNorm, string typeOfWork, double volumeWoods)//расчет норм выроботки и расхода ГСМ
        {
            double column = 0;

            List<string> properties = null;
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var normList = db.Database.SqlQuery<string>(
                                   $"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'{tableNorm}'").ToList();
                properties = normList;
            }

            int columnNumber = 0;
            for (; columnNumber < properties.Count; columnNumber++)
            {
                double columName = 0;
                double nextColumName = 0;

                try
                {
                    columName = double.Parse(properties[columnNumber].Replace('_', ','));
                    nextColumName = double.Parse(properties[columnNumber + 1].Replace('_', ','));
                }
                catch (Exception)
                {
                    continue;
                }

                if (columName < volumeWoods && nextColumName >= volumeWoods)
                {
                    column = nextColumName;
                    columnNumber++;
                    break;
                }
                else if (volumeWoods <= columName)
                {
                    column = columName;
                    break;
                }
            }

            double norm = 0;

            try
            {
                string amountOfWood = properties[columnNumber];

                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var normID = db.Database.SqlQuery<int>(
                              $"SELECT Id_Вид_робіт FROM {table} WHERE Вид_робіт = N'{typeOfWork}'").ToList();

                    var normList = db.Database.SqlQuery<decimal>(
                                  $"SELECT [{amountOfWood}] FROM {tableNorm} WHERE Вид_робіт = '{normID[0]}'").ToList();

                    norm = Convert.ToDouble(normList[0]);
                }
            }
            catch (Exception)
            {
                norm = 0;
            }

            return norm;
        }

        //[HttpPost]
        //public JsonResult save(OrderMaster order)
        //{
        //    bool status = false;
        //    DateTime dateOrg;
        //    var isValidDate = DateTime.TryParseExact(order.OrderDateString, "mm-dd-yyyy", null, System.Globalization.DateTimeStyles.None, out dateOrg);
        //    if (isValidDate)
        //    {
        //        order.OrderDate = dateOrg;
        //    }

        //    var isValidModel = TryUpdateModel(order);
        //    if (isValidModel)
        //    {
        //        using (БД_НарядEntities1 dc = new БД_НарядEntities1())
        //        {
        //            dc.OrderMaster.Add(order);
        //            dc.SaveChanges();
        //            status = true;
        //        }
        //    }
        //    return new JsonResult { Data = new { status = status } };
        //}
    }
}