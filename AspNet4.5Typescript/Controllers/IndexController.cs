using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AspNet4._5Typescript.Controllers
{
    public class IndexController : Controller
    {
        public ActionResult Home()
        {
            return View("Index");
        }

        public ActionResult About()
        {
            return View("Index");
        }
       
    }
}