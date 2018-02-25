using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using Наряд.Models;

namespace Наряд.Controllers.WebApi
{
    public class WorksTitleeController : ApiController
    {
        // GET api/<controller>
        public JsonResult Get()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())//получить все диаметры в таблице
            {
                var worksTitlee = dc.Найменування_заходу.OrderBy(a => a.Найменування_заходу1).Select(a => new {a.Id_Найменування_заходу, a.Найменування_заходу1 }).ToList();
                return new JsonResult { Data = worksTitlee, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}