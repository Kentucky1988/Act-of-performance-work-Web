using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Наряд.Models;

namespace Наряд.Controllers.WebApi
{
    public class EmployeesController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Робітники> Get()
        {
            using (БД_НарядEntities1 dc = new БД_НарядEntities1())//получить все диаметры в таблице
            {
                var company = dc.Робітники.ToList();
                return company;
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