//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Наряд.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Техобслуговування_бензопили_Норма
    {
        public int Вид_робітID { get; set; }
        public int Вид_робіт { get; set; }
        public decimal Норма_віробітку { get; set; }
    
        public virtual Техобслуговування_бензопили Техобслуговування_бензопили { get; set; }
    }
}
