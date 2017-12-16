using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Наряд.Controllers
{
    public class EditingTheDatabaseController : Controller
    {
        public ActionResult getTableEmployees()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var materials = dc.Робітники.OrderBy(a => a.П_І_Б).Select(a => new { a.П_І_Б, a.Професія, a.Тарифний_розряд, a.Категорія }).ToList();              
                return Json(new { data = materials }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}
