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
    
    public partial class Трелювання_підліску
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Трелювання_підліску()
        {
            this.Трелювання_підліску_ГСМ = new HashSet<Трелювання_підліску_ГСМ>();
            this.Трелювання_підліску_Норма = new HashSet<Трелювання_підліску_Норма>();
        }
    
        public int Id_Вид_робіт { get; set; }
        public string Вид_робіт { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Трелювання_підліску_ГСМ> Трелювання_підліску_ГСМ { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Трелювання_підліску_Норма> Трелювання_підліску_Норма { get; set; }
    }
}
