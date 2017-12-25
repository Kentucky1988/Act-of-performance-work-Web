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

    [MetadataType(typeof(Вид_рубкиMetadata))]
    public partial class Вид_рубки
    {
    }

    public class Вид_рубкиMetadata
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Введіть вид рубки")]
        public string Вид_рубки1 { get; set; } 
    }

    [MetadataType(typeof(СортиментиMetadata))]
    public partial class Сортименти
    {
    }

    public class СортиментиMetadata
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Введіть назву сортимента")]
        public string Назва_сортименту { get; set; }    
    }
}