using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Наряд.Controllers.WebApi;
using Наряд.ExtendedModel;
using Наряд.Models;

namespace Наряд.Controllers
{
    public class CubaturnicController : Controller
    {
        // GET: Cubaturnic
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetListColumn(string nameTable)//получить список колонок (все длины) в таблице
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                NormFromDB normFromDB = new NormFromDB();
                List<string> listColumn = normFromDB.ColumnList(nameTable);
                listColumn.RemoveRange(0, 2);
                return new JsonResult { Data = listColumn, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult GetListDiameter()
        {          
            var diameter = new CubaturnicDataController().Get().Select(a => a.Диаметр).ToList();
            return new JsonResult { Data = diameter, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetListVolumeOfTree(string length)//получить необходимую колонку с объемами       
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var volumeOfWood = context.Database.SqlQuery<decimal>($"SELECT [{length}] FROM Кубатурник").ToList();
                return new JsonResult { Data = volumeOfWood, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}