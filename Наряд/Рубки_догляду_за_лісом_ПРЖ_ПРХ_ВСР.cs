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
    
    public partial class Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР()
        {
            this.Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма = new HashSet<Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма>();
        }
    
        public int Id_Вид_робіт { get; set; }
        public string Вид_робіт { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма> Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма { get; set; }
    }
}
