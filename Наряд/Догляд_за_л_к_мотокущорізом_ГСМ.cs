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
    
    public partial class Догляд_за_л_к_мотокущорізом_ГСМ
    {
        public int Id_Норма_витрат_ГСМ { get; set; }
        public int Вид_робіт { get; set; }
        public decimal Норма_витрат_ГСМ { get; set; }
    
        public virtual Догляд_за_л_к_мотокущорізом Догляд_за_л_к_мотокущорізом { get; set; }
    }
}
