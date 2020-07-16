namespace AspNet4._5Typescript.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Class for demonstrating how a tag works
    /// </summary>
    public class Test
    {
        /// <summary>
        /// Gets or sets the Variable
        /// </summary>
        public string Variable { get; set; }

        /// <summary>
        /// method for creating a full name
        /// </summary>
        /// <param name="firstName">The first name of the user</param>
        /// <param name="surname">The surname of the user</param>
        /// <returns>The full name of the user</returns>
        public string MakeName(string firstName, string surname)
        {
            string name = String.Format("{0} {1}", firstName, surname);

            return name;
        }
    }
}