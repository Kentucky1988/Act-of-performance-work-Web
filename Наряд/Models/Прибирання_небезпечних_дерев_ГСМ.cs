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
    
    public partial class Прибирання_небезпечних_дерев_ГСМ
    {
        public int Вид_робітID { get; set; }
        public int Вид_робіт { get; set; }
        public decimal C0_14 { get; set; }
        public decimal C0_17 { get; set; }
        public decimal C0_21 { get; set; }
        public decimal C0_25 { get; set; }
        public decimal C0_32 { get; set; }
        public decimal C0_39 { get; set; }
        public decimal C0_49 { get; set; }
        public decimal C0_75 { get; set; }
        public decimal C1_1 { get; set; }
    
        public virtual Прибирання_небезпечних_дерев Прибирання_небезпечних_дерев { get; set; }
    }
}
