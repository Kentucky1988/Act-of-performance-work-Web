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
    
    public partial class Садіння_лісу_Додаткові_роботи
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Садіння_лісу_Додаткові_роботи()
        {
            this.Садіння_лісу_Додаткові_роботи_Норма = new HashSet<Садіння_лісу_Додаткові_роботи_Норма>();
        }
    
        public int Id_Вид_робіт { get; set; }
        public string Вид_робіт { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Садіння_лісу_Додаткові_роботи_Норма> Садіння_лісу_Додаткові_роботи_Норма { get; set; }
    }
}
