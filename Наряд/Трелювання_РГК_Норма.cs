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
    
    public partial class Трелювання_РГК_Норма
    {
        public int Вид_робітID { get; set; }
        public int Вид_робіт { get; set; }
        public decimal C0_25 { get; set; }
        public decimal C0_32 { get; set; }
        public decimal C0_39 { get; set; }
        public decimal C0_49 { get; set; }
        public decimal C0_75 { get; set; }
        public decimal C1_1 { get; set; }
    
        public virtual Трелювання_РГК Трелювання_РГК { get; set; }
    }
}
