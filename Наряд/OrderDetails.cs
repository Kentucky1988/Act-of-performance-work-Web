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
    
    public partial class OrderDetails
    {
        public int OrderDetailsId { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public decimal Rate { get; set; }
        public int Quantity { get; set; }
    
        public virtual OrderMaster OrderMaster { get; set; }
    }
}
