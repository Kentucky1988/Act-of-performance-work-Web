using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Наряд
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)//с какая страница будит заглавная
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",//по умолчанию
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }//ссылку на загружаемую 
            );//страницу взять в controller - Home (HomeController) метод Index(чтоб узнать какое окно нажать правой кнопкой 
        }// по методу и выбрать "перейти к представлению")
    }
}
