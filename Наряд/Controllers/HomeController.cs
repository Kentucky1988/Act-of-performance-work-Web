using System;
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