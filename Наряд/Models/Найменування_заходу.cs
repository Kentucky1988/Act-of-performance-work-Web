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
    
    public partial class Найменування_заходу
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Найменування_заходу()
        {
            this.Категорії_робіт = new HashSet<Категорії_робіт>();
        }
    
        public int Id_Найменування_заходу { get; set; }
        public string Найменування_заходу1 { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Категорії_робіт> Категорії_робіт { get; set; }
    }
}
