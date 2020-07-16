using System.Web;
using System.Web.Optimization;

namespace AspNet4._5Typescript
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new Bundle("~/bundles/coreJS")
                .IncludeDirectory("~/dist", "*.js"));
            bundles.Add(new StyleBundle("~/bundles/coreCSS").IncludeDirectory("~/Stylesheets", "*.css", true));
        }
    }
}
