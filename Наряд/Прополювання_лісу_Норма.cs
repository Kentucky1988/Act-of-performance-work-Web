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
    
    public partial class Прополювання_лісу_Норма
    {
        public int Id_Вид_робіт { get; set; }
        public int Рівнині_умови { get; set; }
        public int Яружно_балкові_землі_схил_до_20град { get; set; }
        public int Яружно_балкові_землі_схил_понад_20град { get; set; }
        public int Гірські_умови_схил_до_20град { get; set; }
        public int Гірські_умови_схил_понад_20град { get; set; }
    
        public virtual Прополювання_лісу Прополювання_лісу { get; set; }
    }
}
