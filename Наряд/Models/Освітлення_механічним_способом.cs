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
    
    public partial class Освітлення_механічним_способом
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Освітлення_механічним_способом()
        {
            this.Освітлення_механічним_способом_ГСМ = new HashSet<Освітлення_механічним_способом_ГСМ>();
            this.Освітлення_механічним_способом_Норма = new HashSet<Освітлення_механічним_способом_Норма>();
        }
    
        public int Id_Вид_робіт { get; set; }
        public string Вид_робіт { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Освітлення_механічним_способом_ГСМ> Освітлення_механічним_способом_ГСМ { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Освітлення_механічним_способом_Норма> Освітлення_механічним_способом_Норма { get; set; }
    }
}
