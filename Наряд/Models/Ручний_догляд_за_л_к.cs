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
    
    public partial class Ручний_догляд_за_л_к
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Ручний_догляд_за_л_к()
        {
            this.Ручний_догляд_за_л_к_Норма = new HashSet<Ручний_догляд_за_л_к_Норма>();
        }
    
        public int Id_Вид_робіт { get; set; }
        public string Вид_робіт { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Ручний_догляд_за_л_к_Норма> Ручний_догляд_за_л_к_Норма { get; set; }
    }
}
