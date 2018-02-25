using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Linq.Dynamic;
using Наряд.ExtendedModel;
using Наряд.Models;

namespace Наряд.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetSubdivision(int companyID)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var subdivision = dc.Підрозділ.Where(a => a.Id_Підприємства == companyID).Select(a => a.Підрозділ1).ToList();
                return new JsonResult { Data = subdivision, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult GetCategories(string valueWorksTitlee)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var worksTitlee = dc.Найменування_заходу.Where(a => a.Найменування_заходу1 == valueWorksTitlee).Select(a => a.Id_Найменування_заходу).ToList();
                int worksTitleeID = worksTitlee[0];
                var categories = dc.Категорії_робіт.Where(a => a.Найменування_заходуID == worksTitleeID).Select(a => a.Категорії_робіт1).ToList();
                return new JsonResult { Data = categories, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult GetTypeOfWork(string categoryOfWork)
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var typeOfWork = context.Database.SqlQuery<string>($"SELECT Вид_робіт FROM {categoryOfWork}").ToList();
                return new JsonResult { Data = typeOfWork, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult PricingUnit(string pricingID, string rank)//расценка за единицу   
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                string colum = string.IsNullOrEmpty(rank) ? "1" : rank; //индивидуальна / комплексна

                var PricingUnit = context.Database.SqlQuery<decimal>(
                                                 $"SELECT [{colum}] FROM Денна_тарифна_ставка WHERE РозцінкаID = N'{pricingID}'").ToList();

                return new JsonResult { Data = double.Parse(PricingUnit[0].ToString()), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult GetUnit(string category)
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var unit = context.Категорії_робіт.Where(a => a.Категорії_робіт1 == category)
                                                  .Select(a => new { a.Комплексна_индивідуальна, a.РозцінкаID, a.Одиниця_виміру }).ToList();

                return new JsonResult { Data = unit, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult NormWork(string table, string typeOfWork, string volumeWood, string checkedConditionsWinter, string checkedConditionsHard,
                                   string tractorMoving, string block, string reduceDeforestationCoefficient, string forestPlantingConditions)//норма выполнения робот
        {
            NormFromDB normFromDB = new NormFromDB();
            CoefficientNorm coefficientNorm = new CoefficientNorm();
            ArrayList normArray = new ArrayList();

            string tableNormOfWork = normFromDB.TableNorm(table);
            double norm = normFromDB.NormFromTable(table, tableNormOfWork, typeOfWork, Replace(volumeWood), forestPlantingConditions); //норма выроботка  
            
            bool winterConditions = coefficientNorm.WinterConditions(table);            //приминение зимних условий ДА/НЕТ
            double coefficientWinter = winterConditions ? coefficientNorm.CoefficientNorm_Winter_Hard(checkedConditionsWinter) : 1; //поправочный коефиц. Зима

            double coefficientHard = coefficientNorm.CoefficientNorm_Winter_Hard(checkedConditionsHard);     //поправочный коефиц. Тяжелые условия
            double coefficientDistance = coefficientNorm.CoefficientTractorMoving(Replace(tractorMoving));   //поправочный коефиц. переезд
            double coefficientBlock = coefficientNorm.CoefficientBlock(Replace(block));                      //поправочный коефиц. помехи                
            double deforestationCoefficient = !string.IsNullOrEmpty(reduceDeforestationCoefficient) ? Convert.ToDouble(Replace(reduceDeforestationCoefficient)) : 1;//поправочный коефиц. заготовка (по приказу)

            norm = Math.Round(norm * (coefficientWinter * coefficientHard * coefficientDistance * coefficientBlock * deforestationCoefficient), 3);
            normArray.Add(norm);
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

        [HttpGet]
        public JsonResult CollectionOilCosts(string table, string typeOfWork, string volumeWood, string executed, string checkedConditionsWinter, string checkedConditionsHard, string hoursUsed)//нормарасхода ГСМ
        {
            NormOil oilCalculation = new NormOil();
            NormFromDB normFromDB = new NormFromDB();
            CoefficientNorm coefficientNorm = new CoefficientNorm();

            string tableNormOil = oilCalculation.TableNormOfOil(table);
            double normOil = normFromDB.NormFromTable(table, tableNormOil, typeOfWork, Replace(volumeWood), ""); //норма расхода ГСМ              
            double coefficientWinter = coefficientNorm.CoefficientOil_Winter_Hard(checkedConditionsWinter);//поправочный коефиц. Зима
            double coefficientHard = coefficientNorm.CoefficientOil_Winter_Hard(checkedConditionsHard);//поправочный коефиц. Тяжелые условия
            hoursUsed = !string.IsNullOrEmpty(hoursUsed) ? hoursUsed : "0";
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