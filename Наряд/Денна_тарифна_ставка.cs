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
    
    public partial class Денна_тарифна_ставка
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Денна_тарифна_ставка()
        {
            this.Категорії_робіт = new HashSet<Категорії_робіт>();
        }
    
        public int РозцінкаID { get; set; }
        public string Вид_робіт { get; set; }
        public string Комплексна_индивідуальна { get; set; }
        public decimal Разряд1 { get; set; }
        public decimal Разряд2 { get; set; }
        public decimal Разряд3 { get; set; }
        public decimal Разряд4 { get; set; }
        public decimal Разряд5 { get; set; }
        public decimal Разряд6 { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Категорії_робіт> Категорії_робіт { get; set; }
    }
}
