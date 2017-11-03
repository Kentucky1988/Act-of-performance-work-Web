using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
            List<Вид_робіт_Сортименти> materials = new List<Вид_робіт_Сортименти>();
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                materials = dc.Вид_робіт_Сортименти.OrderBy(a => a.Сортимент).ToList();
            }
            return new JsonResult { Data = materials, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult getProductCategories()
        {
            List<Categories> categories = new List<Categories>();
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                categories = dc.Categories.OrderBy(a => a.CategoryName).ToList();
            }
            return new JsonResult { Data = categories, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult getProducts(int categoryID)
        {
            List<Products> products = new List<Products>();
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                products = dc.Products.Where(a => a.CategoryID.Equals(categoryID)).OrderBy(a => a.ProductName).ToList();
            }
            return new JsonResult { Data = products, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult normWork(string volumeWood)//норма выполнения робот
        {
            double column = 0;
            double volumeWoods = 0;

            try
            {
                volumeWoods = Convert.ToDouble(volumeWood.Replace('.', ','));
            }
            catch (Exception)
            {
                return new JsonResult { Data = column, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

            var properties = (from t in typeof(Вид_робіт_Сортименти).GetProperties()
                              select t.Name).ToList();

            int columnNumber = 0;
            for (; columnNumber < properties.Count; columnNumber++)
            {
                double columName = 0;
                double nextColumName = 0;

                try
                {
                    columName = double.Parse(properties[columnNumber].Remove(0, 1).Replace('_', ','));
                    nextColumName = double.Parse(properties[columnNumber + 1].Remove(0, 1).Replace('_', ','));
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

            double normOfWork = 0;

            try
            {
                string typeOfWork = "Ділові ялина 6м";
                string amountOfWood = properties[columnNumber];

                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var normList = (from p in db.Вид_робіт_Сортименти
                                    where p.Сортимент == typeOfWork
                                    select p).ToList();

                    var nameColum = normList[0].GetType().GetProperty(amountOfWood);
                    normOfWork = Convert.ToDouble(nameColum.GetValue(normList[0]));
                }
            }
            catch (Exception)
            {
                normOfWork = 0;
            }

            return new JsonResult { Data = normOfWork, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        
        [HttpPost]
        public JsonResult save(OrderMaster order)
        {
            bool status = false;
            DateTime dateOrg;
            var isValidDate = DateTime.TryParseExact(order.OrderDateString, "mm-dd-yyyy", null, System.Globalization.DateTimeStyles.None, out dateOrg);
            if (isValidDate)
            {
                order.OrderDate = dateOrg;
            }

            var isValidModel = TryUpdateModel(order);
            if (isValidModel)
            {
                using (БД_НарядEntities1 dc = new БД_НарядEntities1())
                {
                    dc.OrderMaster.Add(order);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status } };
        }
    }
}