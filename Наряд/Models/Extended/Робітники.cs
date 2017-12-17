using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Наряд.Models
{
    [MetadataType(typeof(РобітникиMetadata))]
    public partial class Робітники
    {
    }

    public class РобітникиMetadata
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Введіть П.І.Б.")]
        public string П_І_Б { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Введіть посаду")]
        public string Професія { get; set; }
    }
}