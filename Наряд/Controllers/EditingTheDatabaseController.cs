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
        public ActionResult Save(int id)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Робітники.Where(a => a.Id_Робітника == id).FirstOrDefault();
                return View(value);
            }

            //if (id == 0)
            //    return View(new Робітники());
            //else
            //{
            //    using (БД_НарядEntities1 db = new БД_НарядEntities1())
            //    {
            //        return View(db.Робітники.Where(x => x.Id_Робітника == id).FirstOrDefault<Робітники>());
            //    }
            //}
        }

        [HttpPost]
        public ActionResult Save(Робітники emp)
        {
            bool status = false;
            if (ModelState.IsValid)
            {
                using (БД_НарядEntities1 dc = new БД_НарядEntities1())
                {
                    if (emp.Id_Робітника > 0)
                    {
                        //Edit 
                        var v = dc.Робітники.Where(a => a.Id_Робітника == emp.Id_Робітника).FirstOrDefault();
                        if (v != null)
                        {
                            v.П_І_Б = emp.П_І_Б;
                            v.Професія = emp.Професія;
                            v.Тарифний_розряд = emp.Тарифний_розряд;
                            v.Категорія = emp.Категорія;
                        }
                    }
                    else
                    {
                        //Save
                        dc.Робітники.Add(emp);
                    }
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status } };

            //using (БД_НарядEntities1 db = new БД_НарядEntities1())
            //{
            //    if (emp.Id_Робітника == 0)
            //    {
            //        db.Робітники.Add(emp);
            //        db.SaveChanges();
            //        return Json(new { success = true, message = "Saved Successfully" }, JsonRequestBehavior.AllowGet);
            //    }
            //    else
            //    {
            //        db.Entry(emp).State = EntityState.Modified;
            //        db.SaveChanges();
            //        return Json(new { success = true, message = "Updated Successfully" }, JsonRequestBehavior.AllowGet);
            //    }
            //}
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
            return new JsonResult { Data = new { status = status } };
        }
    }
}
