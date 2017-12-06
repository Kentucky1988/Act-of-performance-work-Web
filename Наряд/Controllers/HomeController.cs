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
                var materials = dc.Сортименти.OrderBy(a => a.Назва_сортименту).Select(a => a.Назва_сортименту).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getEmployees()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Робітники.OrderBy(a => a.П_І_Б).Select(a => new { a.Id_Робітника, a.П_І_Б, a.Професія, a.Тарифний_розряд, a.Категорія }).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getCompany()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Підприємство.OrderBy(a => a.Підприємство1).Select(a => new { a.Id_Підприємства, a.Підприємство1, a.Код_ЄДРПОУ }).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getSubdivision(int companyID)
        {            
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {              
                var subdivision = dc.Підрозділ.Where(a => a.Id_Підприємства == companyID).Select(a => a.Підрозділ1).ToList();
                return new JsonResult { Data = subdivision, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getWorksTitlee()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Найменування_заходу.OrderBy(a => a.Найменування_заходу1).Select(a => a.Найменування_заходу1).ToList();
                return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getcolectionSortOil()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var colectionSortOil = dc.Вид_ГСМ.OrderBy(a => a.Вид_ГСМ1).Select(a => a.Вид_ГСМ1).ToList();
                return new JsonResult { Data = colectionSortOil, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
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

        public JsonResult getCategories(string valueWorksTitlee)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var worksTitlee = dc.Найменування_заходу.Where(a => a.Найменування_заходу1 == valueWorksTitlee).Select(a => a.Id_Найменування_заходу).ToList();
                int worksTitleeID = worksTitlee[0];
                var categories = dc.Категорії_робіт.Where(a => a.Найменування_заходуID == worksTitleeID).Select(a => a.Категорії_робіт1).ToList();
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

        public JsonResult normWork(string table, string typeOfWork, string volumeWood, string checkedConditionsWinter,
                                   string checkedConditionsHard, string tractorMoving, string block, string reduceDeforestationCoefficient)//норма выполнения робот
        {
            NormFromDB normFromDB = new NormFromDB();
            CoefficientNorm coefficientNorm = new CoefficientNorm();
            ArrayList normArray = new ArrayList();

            string tableNormOfWork = normFromDB.TableNorm(table);
            double norm = normFromDB.NormFromTable(table, tableNormOfWork, typeOfWork, Replace(volumeWood)); //норма выроботка  

            if (new NormOil().TableNormOfOil(table) == "-")
            {//если нет ГСМ, тогда пропускаем расчет поправочных коефициентов
                normArray.Add(norm);
                normArray.Add(0);
            }
            else
            {
                double coefficientWinter = checkedConditionsWinter != "" ? coefficientNorm.CoefficientNorm_Winter_Hard(checkedConditionsWinter) : 1;//поправочный коефиц. Зима
                double coefficientHard = checkedConditionsHard != "" ? coefficientNorm.CoefficientNorm_Winter_Hard(checkedConditionsHard) : 1;//поправочный коефиц. Тяжелые условия
                double coefficientDistance = tractorMoving != "" ? coefficientNorm.CoefficientTractorMoving(Replace(tractorMoving)) : 1;//поправочный коефиц. переезд
                double coefficientBlock = block != "" ? coefficientNorm.CoefficientBlock(Replace(block)) : 1;//поправочный коефиц. помехи
                double deforestationCoefficient = reduceDeforestationCoefficient != "" ? Convert.ToDouble(Replace(reduceDeforestationCoefficient)) : 1;//поправочный коефиц. заготовка (по приказу)

                norm = Math.Round(norm * (coefficientWinter * coefficientHard * coefficientDistance * coefficientBlock * deforestationCoefficient), 3);
                normArray.Add(norm);
            }
            return new JsonResult { Data = normArray, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public string Replace(string value)
        {
            try
            {
                value = value.Replace('.', ',');
                return value;
            }
            catch (Exception)
            {
                return value = "0";
            }
        }

        public JsonResult CollectionOilCosts(string table, string typeOfWork, string volumeWood, string executed, string checkedConditionsWinter, string checkedConditionsHard, string hoursUsed)//нормарасхода ГСМ
        {
            NormOil oilCalculation = new NormOil();
            NormFromDB normFromDB = new NormFromDB();
            CoefficientNorm coefficientNorm = new CoefficientNorm();

            string tableNormOil = oilCalculation.TableNormOfOil(table);
            double normOil = normFromDB.NormFromTable(table, tableNormOil, typeOfWork, Replace(volumeWood)); //норма расхода ГСМ              
            double coefficientWinter = checkedConditionsWinter != "" ? coefficientNorm.CoefficientOil_Winter_Hard(checkedConditionsWinter) : 1;//поправочный коефиц. Зима
            double coefficientHard = checkedConditionsHard != "" ? coefficientNorm.CoefficientOil_Winter_Hard(checkedConditionsHard) : 1;//поправочный коефиц. Тяжелые условия
            hoursUsed = hoursUsed != "" ? hoursUsed : "0";
            double normOilHoursUsed = coefficientNorm.NormHoursUsed(); //норма расход топлива на переезд
            double fuelCosts = Convert.ToDouble(Replace(executed)) * normOil * (coefficientWinter * coefficientHard) + (normOilHoursUsed * Convert.ToDouble(hoursUsed));//расход топлива  
            List<Oil> collectionOilCosts = oilCalculation.CollectionOilCosts(table, fuelCosts);

            return new JsonResult { Data = collectionOilCosts, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
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