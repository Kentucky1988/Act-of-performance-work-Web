using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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

        public JsonResult getListColumn(string nameTable)//получить список колонок (все длины) в таблице
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                NormFromDB normFromDB = new NormFromDB();
                List<string> listColumn = normFromDB.ColumnList(nameTable);
                listColumn.RemoveRange(0, 2);
                return new JsonResult { Data = listColumn, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getListDiameter()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())//получить все диаметры в таблице
            {               
                var diameter = dc.Кубатурник.OrderBy(a => a.Диаметр).Select(a => a.Диаметр).ToList();
                return new JsonResult { Data = diameter, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult getListVolumeOfTree(string length)//получить необходимую колонку с объемами       
        {
            using (БД_НарядEntities1 context = new БД_НарядEntities1())
            {
                var volumeOfWood = context.Database.SqlQuery<decimal>($"SELECT [{length}] FROM Кубатурник").ToList();
                return new JsonResult { Data = volumeOfWood, JsonRequestBehavior = JsonRequestBehavior.AllowGet };               
            }
        }
    }
}