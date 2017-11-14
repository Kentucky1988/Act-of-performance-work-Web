using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Linq.Dynamic;
using System.Web.DynamicData;
using Наряд.ExtendedModel;

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
            NormFromDB normFromDB = new NormFromDB();
            ArrayList norm = new ArrayList();
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
            }

            if (tableNormOfOil == "-")//если нет ГСМ, тогда пропускаем расчет с V хлиста и возращаем значение в колонке "Норма_віробітку"
            {
                string str = "Норма_віробітку";
                normFromDB.Norm(str, table, tableNormOfWork, typeOfWork);

                norm.Add(normFromDB.Norm(str, table, tableNormOfWork, typeOfWork));
                norm.Add(0);
                return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

            try
            {
                volumeWoods = Convert.ToDouble(volumeWood.Replace('.', ','));
            }
            catch (Exception)
            {
                return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
           
            norm.Add(normFromDB.NormFromTable(table, tableNormOfWork, typeOfWork, volumeWoods)); //норма выроботка
            double normOil = normFromDB.NormFromTable(table, tableNormOfOil, typeOfWork, volumeWoods); //норма расхода ГСМ

            NormOil oilCalculation = new NormOil();
            List<Oil> collectionOilCosts = oilCalculation.CollectionOilCosts(table, normOil);
                       
            norm.Add(collectionOilCosts);
            norm.Add(все види топлива); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            return new JsonResult { Data = norm, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
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