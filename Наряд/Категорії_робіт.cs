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
    
    public partial class Категорії_робіт
    {
        public int Категорії_робітID { get; set; }
        public string Категорії_робіт1 { get; set; }
        public string Норма_віробітку { get; set; }
        public string ГСМ { get; set; }
        public string Комплексна_индивідуальна { get; set; }
        public int РозцінкаID { get; set; }
        public string Одиниця_виміру { get; set; }
    
        public virtual Денна_тарифна_ставка Денна_тарифна_ставка { get; set; }
    }
}
