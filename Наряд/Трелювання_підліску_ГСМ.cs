//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Наряд
{
    using System;
    using System.Collections.Generic;
    
    public partial class Трелювання_підліску_ГСМ
    {
        public int Вид_робітID { get; set; }
        public int Вид_робіт { get; set; }
        public decimal Норма_віробітку { get; set; }
    
        public virtual Трелювання_підліску Трелювання_підліску { get; set; }
    }
}
