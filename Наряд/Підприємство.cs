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
    
    public partial class Підприємство
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Підприємство()
        {
            this.Підрозділ = new HashSet<Підрозділ>();
        }
    
        public int Id_Підприємства { get; set; }
        public string Підприємство1 { get; set; }
        public int Код_ЄДРПОУ { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Підрозділ> Підрозділ { get; set; }
    }
}
