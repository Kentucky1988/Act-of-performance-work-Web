
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Наряд.Models;

namespace Наряд.Controllers
{
    public class EditingTheDatabaseController : Controller
    {
        public ActionResult getTableEmployees()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var employees = dc.Робітники.OrderBy(a => a.П_І_Б).ToList();              
                return Json(new { data = employees }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Save(int id = 0)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Робітники.Where(a => a.Id_Робітника == id).FirstOrDefault();
                return View(value);
            }
        }

        [HttpPost]
        public ActionResult Save(Робітники emp)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                string message = null;
                if (emp.Id_Робітника == 0)
                {
                    db.Робітники.Add(emp);
                    message = "Дані збережено";
                }
                else
                {
                    db.Entry(emp).State = EntityState.Modified;
                    message = "Дані змінено";                   
                }
                db.SaveChanges();
                return Json(new { status = true, message = message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Delete(int id)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var v = dc.Робітники.Where(a => a.Id_Робітника == id).FirstOrDefault();
                if (v != null)
                {
                    return View(v);
                }
                else
                {
                    return HttpNotFound();
                }
            }
        }

        [HttpPost]
        [ActionName("Delete")]
        public ActionResult DeleteEmployee(int id)
        {
            bool status = false;
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var v = dc.Робітники.Where(a => a.Id_Робітника == id).FirstOrDefault();
                if (v != null)
                {
                    dc.Робітники.Remove(v);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status, message = "Дані видалено" } };
        } 
    }
}
