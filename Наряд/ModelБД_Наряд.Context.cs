﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class БД_НарядEntities1 : DbContext
    {
        public БД_НарядEntities1()
            : base("name=БД_НарядEntities1")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Вид_ГСМ> Вид_ГСМ { get; set; }
        public virtual DbSet<Вид_рубки> Вид_рубки { get; set; }
        public virtual DbSet<Денна_тарифна_ставка> Денна_тарифна_ставка { get; set; }
        public virtual DbSet<Догляд_за_л_к_мотокущорізом> Догляд_за_л_к_мотокущорізом { get; set; }
        public virtual DbSet<Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР> Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР { get; set; }
        public virtual DbSet<Заточка_цепей> Заточка_цепей { get; set; }
        public virtual DbSet<Механізми> Механізми { get; set; }
        public virtual DbSet<Найменування_заходу> Найменування_заходу { get; set; }
        public virtual DbSet<Освітлення_механічним_способом> Освітлення_механічним_способом { get; set; }
        public virtual DbSet<Підприємство> Підприємство { get; set; }
        public virtual DbSet<Підрозділ> Підрозділ { get; set; }
        public virtual DbSet<Погрузка> Погрузка { get; set; }
        public virtual DbSet<Прибирання_небезпечних_дерев> Прибирання_небезпечних_дерев { get; set; }
        public virtual DbSet<Прополювання_лісу> Прополювання_лісу { get; set; }
        public virtual DbSet<Прополювання_лісу_Норма> Прополювання_лісу_Норма { get; set; }
        public virtual DbSet<РГК_ССР_без_трелювання> РГК_ССР_без_трелювання { get; set; }
        public virtual DbSet<Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР> Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР { get; set; }
        public virtual DbSet<Ручний_догляд_за_л_к> Ручний_догляд_за_л_к { get; set; }
        public virtual DbSet<Ручний_догляд_за_л_к_Норма> Ручний_догляд_за_л_к_Норма { get; set; }
        public virtual DbSet<Садіння_лісу> Садіння_лісу { get; set; }
        public virtual DbSet<Садіння_лісу_Додаткові_роботи> Садіння_лісу_Додаткові_роботи { get; set; }
        public virtual DbSet<Садіння_лісу_Норма> Садіння_лісу_Норма { get; set; }
        public virtual DbSet<Трелювання_підліску> Трелювання_підліску { get; set; }
        public virtual DbSet<Трелювання_РГК> Трелювання_РГК { get; set; }
        public virtual DbSet<Трелювання_РУ> Трелювання_РУ { get; set; }
        public virtual DbSet<Трелювання_фанери_РУ> Трелювання_фанери_РУ { get; set; }
        public virtual DbSet<Устройство_площадок> Устройство_площадок { get; set; }
        public virtual DbSet<Витрати_ГСМ> Витрати_ГСМ { get; set; }
        public virtual DbSet<Витрати_ГСМ_в_годину> Витрати_ГСМ_в_годину { get; set; }
        public virtual DbSet<Догляд_за_л_к_мотокущорізом_ГСМ> Догляд_за_л_к_мотокущорізом_ГСМ { get; set; }
        public virtual DbSet<Догляд_за_л_к_мотокущорізом_Норма> Догляд_за_л_к_мотокущорізом_Норма { get; set; }
        public virtual DbSet<Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР_ГСМ> Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР_ГСМ { get; set; }
        public virtual DbSet<Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР_Норма> Заготівля_фанерної_сировини_на_ПРЖ_ПРХ_ВСР_Норма { get; set; }
        public virtual DbSet<Заточка_цепей_Норма> Заточка_цепей_Норма { get; set; }
        public virtual DbSet<Категорії_робіт> Категорії_робіт { get; set; }
        public virtual DbSet<Освітлення_механічним_способом_ГСМ> Освітлення_механічним_способом_ГСМ { get; set; }
        public virtual DbSet<Освітлення_механічним_способом_Норма> Освітлення_механічним_способом_Норма { get; set; }
        public virtual DbSet<Погрузка_Норма> Погрузка_Норма { get; set; }
        public virtual DbSet<Поправочний_коефіцієнт> Поправочний_коефіцієнт { get; set; }
        public virtual DbSet<Поправочний_коефіцієнт_Переїзд> Поправочний_коефіцієнт_Переїзд { get; set; }
        public virtual DbSet<Поправочний_коефіцієнт_Перешкоди> Поправочний_коефіцієнт_Перешкоди { get; set; }
        public virtual DbSet<Прибирання_небезпечних_дерев_ГСМ> Прибирання_небезпечних_дерев_ГСМ { get; set; }
        public virtual DbSet<Прибирання_небезпечних_дерев_Норма> Прибирання_небезпечних_дерев_Норма { get; set; }
        public virtual DbSet<РГК_ССР_без_трелювання_ГСМ> РГК_ССР_без_трелювання_ГСМ { get; set; }
        public virtual DbSet<РГК_ССР_без_трелювання_Норма> РГК_ССР_без_трелювання_Норма { get; set; }
        public virtual DbSet<Робітники> Робітники { get; set; }
        public virtual DbSet<Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_ГСМ> Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_ГСМ { get; set; }
        public virtual DbSet<Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма> Рубки_догляду_за_лісом_ПРЖ_ПРХ_ВСР_Норма { get; set; }
        public virtual DbSet<Садіння_лісу_Додаткові_роботи_Норма> Садіння_лісу_Додаткові_роботи_Норма { get; set; }
        public virtual DbSet<Сортименти> Сортименти { get; set; }
        public virtual DbSet<Трелювання_підліску_ГСМ> Трелювання_підліску_ГСМ { get; set; }
        public virtual DbSet<Трелювання_підліску_Норма> Трелювання_підліску_Норма { get; set; }
        public virtual DbSet<Трелювання_РГК_ГСМ> Трелювання_РГК_ГСМ { get; set; }
        public virtual DbSet<Трелювання_РГК_Норма> Трелювання_РГК_Норма { get; set; }
        public virtual DbSet<Трелювання_РУ_ГСМ> Трелювання_РУ_ГСМ { get; set; }
        public virtual DbSet<Трелювання_РУ_Норма> Трелювання_РУ_Норма { get; set; }
        public virtual DbSet<Трелювання_фанери_РУ_ГСМ> Трелювання_фанери_РУ_ГСМ { get; set; }
        public virtual DbSet<Трелювання_фанери_РУ_Норма> Трелювання_фанери_РУ_Норма { get; set; }
        public virtual DbSet<Устройство_площадок_Норма> Устройство_площадок_Норма { get; set; }
    }
}
