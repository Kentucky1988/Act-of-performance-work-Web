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
    public class ColectionSortOilController : ApiController
    {
        // GET api/<controller>
        public JsonResult Get()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())
            {
                var colectionSortOil = dc.Вид_ГСМ.OrderBy(a => a.Вид_ГСМ1).Select(a => new { a.Id_Палива, a.Вид_ГСМ1, a.Ціні_палива }).ToList();
                return new JsonResult { Data = colectionSortOil, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
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