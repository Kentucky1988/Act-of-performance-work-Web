
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Наряд.Models;
using System.Data;
using System.Collections.Generic;
using System;

namespace Наряд.Controllers
{
    public class EditingTheDatabaseРобітникиController : Controller
    {
        public ActionResult GetTable()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var table = dc.Робітники.ToList();//вид рубок 
                return Json(new { data = table }, JsonRequestBehavior.AllowGet);
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
        public ActionResult Save(Робітники table)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                string message = null;
                if (table.Id_Робітника == 0)
                {
                    db.Робітники.Add(table);
                    message = "Дані збережено";
                }
                else
                {
                    db.Entry(table).State = EntityState.Modified;
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
        public ActionResult DeleteRow(int id)
        {
            bool status = false;
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Робітники.Where(a => a.Id_Робітника == id).FirstOrDefault();
                if (value != null)
                {
                    dc.Робітники.Remove(value);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status, message = "Дані видалено" } };
        }
    }    

    public class EditingTheDatabaseВид_рубкиController : Controller
    {
        public ActionResult GetTable()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var table = dc.Вид_рубки.ToList();//вид рубок 
                return Json(new { data = table }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Save(int id = 0)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Вид_рубки.Where(a => a.Id_Вид_робіт == id).FirstOrDefault();
                return View(value);
            }
        }


        [HttpPost]
        public ActionResult Save(Вид_рубки table)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                string message = null;
                if (table.Id_Вид_робіт == 0)
                {
                    db.Вид_рубки.Add(table);
                    message = "Дані збережено";
                }
                else
                {
                    db.Entry(table).State = EntityState.Modified;
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
                var v = dc.Вид_рубки.Where(a => a.Id_Вид_робіт == id).FirstOrDefault();
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
        public ActionResult DeleteRow(int id)
        {
            bool status = false;
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Вид_рубки.Where(a => a.Id_Вид_робіт == id).FirstOrDefault();
                if (value != null)
                {
                    dc.Вид_рубки.Remove(value);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status, message = "Дані видалено" } };
        }
    }

    public class EditingTheDatabaseДенна_тарифна_ставкаController : Controller
    {
        public ActionResult GetTable()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                dc.Configuration.LazyLoadingEnabled = false; //почемуто подтягивало колонку из другой таблицы /отключить загрузку связей/ 
                var table = dc.Денна_тарифна_ставка.ToList();//Денна_тарифна_ставка      
                return Json(new { data = table }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Save(int id = 0)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Денна_тарифна_ставка.Where(a => a.РозцінкаID == id).FirstOrDefault();
                return View(value);
            }
        }


        [HttpPost]
        public ActionResult Save(Денна_тарифна_ставка data)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                string message = null;
                if (data.РозцінкаID == 0)
                {
                    db.Денна_тарифна_ставка.Add(data);
                    message = "Дані збережено";
                }
                else
                {
                    //db.Entry(data).State = EntityState.Modified;

                    var table = db.Денна_тарифна_ставка.Where(a => a.РозцінкаID == data.РозцінкаID).FirstOrDefault();
                    //table.Вид_робіт = data.Вид_робіт;
                    //table.Комплексна_индивідуальна = data.Комплексна_индивідуальна;
                    table.C1 = data.C1;
                    table.C2 = data.C2;
                    table.C3 = data.C3;
                    table.C4 = data.C4;
                    table.C5 = data.C5;
                    table.C6 = data.C6;

                    message = "Дані змінено";
                }
                db.SaveChanges();
                return Json(new { status = true, message = message }, JsonRequestBehavior.AllowGet);
            }
        }

        public decimal ReplaceDecimal(decimal i)
        {
            return Decimal.Parse(i.ToString().Replace('.', ',')); 
        }
       
        //[HttpGet]
        //public ActionResult Delete(int id)
        //{
        //    using (БД_НарядEntities1 dc = new БД_НарядEntities1())
        //    {
        //        var v = dc.Денна_тарифна_ставка.Where(a => a.РозцінкаID == id).FirstOrDefault();
        //        if (v != null)
        //        {
        //            return View(v);
        //        }
        //        else
        //        {
        //            return HttpNotFound();
        //        }
        //    }
        //}

        //[HttpPost]
        //[ActionName("Delete")]
        //public ActionResult DeleteRow(int id)
        //{
        //    bool status = false;
        //    using (БД_НарядEntities1 dc = new БД_НарядEntities1())
        //    {
        //        var value = dc.Денна_тарифна_ставка.Where(a => a.РозцінкаID == id).FirstOrDefault();
        //        if (value != null)
        //        {
        //            dc.Денна_тарифна_ставка.Remove(value);
        //            dc.SaveChanges();
        //            status = true;
        //        }
        //    }
        //    return new JsonResult { Data = new { status = status, message = "Дані видалено" } };
        //}
    }

    public class EditingTheDatabaseСортиментиController : Controller
    {
        public ActionResult GetTable()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var table = dc.Сортименти.ToList();//сортименты 
                return Json(new { data = table }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Save(int id = 0)
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Сортименти.Where(a => a.СортиментиID == id).FirstOrDefault();
                return View(value);
            }
        }


        [HttpPost]
        public ActionResult Save(Сортименти table)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                string message = null;
                if (table.СортиментиID == 0)
                {
                    db.Сортименти.Add(table);
                    message = "Дані збережено";
                }
                else
                {
                    db.Entry(table).State = EntityState.Modified;
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
                var v = dc.Сортименти.Where(a => a.СортиментиID == id).FirstOrDefault();
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
        public ActionResult DeleteRow(int id)
        {
            bool status = false;
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var value = dc.Сортименти.Where(a => a.СортиментиID == id).FirstOrDefault();
                if (value != null)
                {
                    dc.Сортименти.Remove(value);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status, message = "Дані видалено" } };
        }
    }
}





