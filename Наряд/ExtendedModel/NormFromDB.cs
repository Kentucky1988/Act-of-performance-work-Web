using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Наряд.Models;

namespace Наряд.ExtendedModel
{
    public class NormFromDB
    {
        public string TableNorm(string table)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var tableNorm = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == table)
                                                  .Select(a => a.Норма_віробітку).ToList();
                return tableNorm[0];
            }
        }

        public string Units(string category)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var tableNorm = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == category)
                                    .Select(a => a.Одиниця_виміру).ToList();
                return tableNorm[0];
            }
        }

        public double NormFromTable(string table, string tableNorm, string typeOfWork, string volumeWood, string forestPlantingConditions)
        {
            string amountOfWood = null;

            if (new NormOil().TableNormOfOil(table) == "-" || (Units(table) != "м3" && table != "Прибирання_небезпечних_дерев"))
            {//если нет ГСМ и м3, тогда пропускаем расчет с V хлиста и возращаем значение в колонке "Норма_віробітку"
                amountOfWood = forestPlantingConditions == "" ? "Норма_віробітку" : forestPlantingConditions;
            }
            else
            {
                List<string> properties = ColumnList(tableNorm);
                int columnNumber = ColumnNumber(properties, double.Parse(volumeWood));
                amountOfWood = properties[columnNumber];
            }
            return Norm(amountOfWood, table, tableNorm, typeOfWork);
        }

        public List<string> ColumnList(string tableName)//получаем список колонок в таблице
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var normList = db.Database.SqlQuery<string>(
                                   $"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'{tableName}'").ToList();
                return normList;
            }
        }

        public int ColumnNumber(List<string> properties, double volumeWood)//получение имени колонки, которая соответствует Vср
        {
            double column = 0;
            int columnNumber = 0;
            for (; columnNumber < properties.Count; columnNumber++)
            {
                double columName = 0;
                double nextColumName = 0;

                try
                {
                    columName = double.Parse(properties[columnNumber].Replace('_', ','));
                    nextColumName = double.Parse(properties[columnNumber + 1].Replace('_', ','));
                }
                catch (Exception)
                {
                    continue;
                }

                if (columName < volumeWood && nextColumName >= volumeWood)
                {
                    column = nextColumName;
                    columnNumber++;
                    break;
                }
                else if (volumeWood <= columName)
                {
                    column = columName;
                    break;
                }
            }
            return columnNumber;
        }

        public double Norm(string amountOfWood, string table, string tableNorm, string typeOfWork)//расчет норм выроботки и расхода ГСМ
        {
            double norm = 0;

            try
            {
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var normID = db.Database.SqlQuery<int>(
                              $"SELECT Id_Вид_робіт FROM {table} WHERE Вид_робіт = N'{typeOfWork}'").ToList();

                    var normList = db.Database.SqlQuery<decimal>(
                                  $"SELECT [{amountOfWood}] FROM {tableNorm} WHERE Вид_робіт = '{normID[0]}'").ToList();

                    norm = Convert.ToDouble(normList[0]);
                }
            }
            catch (Exception)
            {
                norm = 0;
            }

            return norm;
        }
    }

    public class Oil
    {
        public string Вид_палива { get; set; }
        public double Витрити_ГСМ { get; set; }
    }

    public class NormOil
    {
        public string TableNormOfOil(string table)
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var oil = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == table)
                                    .Select(a => a.ГСМ).ToList();
                return oil[0];
            }
        }

        public List<Oil> CollectionOilCosts(string table, double fuelCosts)//колекция расхода ГСМ по видам
        {
            List<Oil> collectionOilCosts = new List<Oil>();

            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var mechanism = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == table)
                                                  .Select(a => a.Id_механізма).ToList();
                int x = mechanism[0];
                var listNormOil = db.Витрати_ГСМ.Where(a => a.Id_механізма == x)
                                                .Select(a => new { a.Id_Палива, a.Витрати_ГСМ__ }).ToList();

                foreach (var oil in listNormOil)
                {
                    var typeOil = db.Вид_ГСМ.Where(a => a.Id_Палива == oil.Id_Палива)
                                                 .Select(a => a.Вид_ГСМ1).ToList(); //название топлива                   
                    double oilCosts = Math.Round((Convert.ToDouble(oil.Витрати_ГСМ__) / 100) * fuelCosts, 3); //расход ГСМ

                    collectionOilCosts.Add(new Oil { Вид_палива = typeOil[0], Витрити_ГСМ = oilCosts });
                }
            }
            return collectionOilCosts;
        }
    }
    class CoefficientNorm
    {
        public async Task<double> CoefficientNorm_Winter_Hard(string workingСonditions)//поправочный коефициент Норма (зима, тяжелые)
        {
            try
            {
                double coefficient = 1;

                if (!string.IsNullOrEmpty(workingСonditions))
                {
                    using (БД_НарядEntities1 db = new БД_НарядEntities1())
                    {
                        var tableNorm = await db.Поправочний_коефіцієнт.Where(a => a.Умови_праці == workingСonditions)
                                                                 .Select(a => a.Поправочний_коефіцієнт_Норма).ToListAsync();
                        coefficient = Convert.ToDouble(tableNorm[0]);
                    }
                }
                return coefficient;
            }
            catch (Exception)
            {
                return 1;
            }
        }

        public bool WinterConditions(string category) //приминение зимних условий ДА/НЕТ
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var winterConditions = db.Категорії_робіт.Where(a => a.Категорії_робіт1 == category)
                                                        .Select(a => a.Зимові_умови).ToList();
                return Convert.ToBoolean(winterConditions[0]);
            }
        }

        public async Task<double> CoefficientOil_Winter_Hard(string workingСonditions)//поправочный коефициент ГСМ (зима, тяжелые)
        {
            try
            {
                double coefficient = 1;

                if (!string.IsNullOrEmpty(workingСonditions))
                {
                    using (БД_НарядEntities1 db = new БД_НарядEntities1())
                    {
                        var tableNorm = await db.Поправочний_коефіцієнт.Where(a => a.Умови_праці == workingСonditions)
                                            .Select(a => a.Поправочний_коефіцієнт_ГСМ).ToListAsync();
                        coefficient = Convert.ToDouble(tableNorm[0]);
                    }
                }
                return coefficient;
            }
            catch (Exception)
            {
                return 1;
            }
        }

        public async Task<double> CoefficientTractorMoving(string distanceMoving)//поправочный коефициент переезд трактора
        {
            try
            {
                double coefficient = 1;

                if (!string.IsNullOrEmpty(distanceMoving))
                {
                    decimal distance = Convert.ToDecimal(distanceMoving);
                    using (БД_НарядEntities1 db = new БД_НарядEntities1())
                    {
                        var tableNorm = await db.Поправочний_коефіцієнт_Переїзд.Where(a => a.Відстань_переїзду >= distance).Select(a => a.Поправочний_коефіцієнт).ToListAsync();
                        coefficient = Convert.ToDouble(tableNorm[0]);
                    }
                }
                return coefficient;
            }
            catch (Exception)
            {
                return 1;
            }
        }

        public async Task<double> CoefficientBlock(string distanceMoving)//поправочный коефициент помехи на делянке
        {
            try
            {
                double coefficient = 1;

                if (!string.IsNullOrEmpty(distanceMoving))
                {
                    decimal distance = Convert.ToDecimal(distanceMoving);
                    using (БД_НарядEntities1 db = new БД_НарядEntities1())
                    {
                        var tableNorm = await db.Поправочний_коефіцієнт_Перешкоди.Where(a => a.Відсоток_Перешкоди >= distance).Select(a => a.Поправочний_коефіцієнт).ToListAsync();
                        coefficient = Convert.ToDouble(tableNorm[0]);
                    }
                }
                return coefficient;
            }
            catch (Exception)
            {
                return 1;
            }
        }

        public double NormHoursUsed()//норма расход топлива на переезд
        {
            try
            {               
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var normHoursUsedList = db.Витрати_ГСМ_в_годину.Where(a => a.Id_Механізма >= 3).Select(a => a.Витрати_ГСМ_переїзд_кг_ч).ToList();
                    return Convert.ToDouble(normHoursUsedList[0]);
                }
            }
            catch (Exception)
            {
                return 1;
            }
        }
    }
}