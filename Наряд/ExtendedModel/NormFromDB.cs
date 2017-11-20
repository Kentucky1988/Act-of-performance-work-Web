using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

        public double NormFromTable(string table, string tableNorm, string typeOfWork, string volumeWood)
        {
            List<string> properties = ColumnList(tableNorm);
            int columnNumber = ColumnNumber(properties, double.Parse(volumeWood));
            string amountOfWood = properties[columnNumber];
            return Norm(amountOfWood, table, tableNorm, typeOfWork);
        }

        public List<string> ColumnList(string tableNorm)//получаем список колонок в таблице
        {
            using (БД_НарядEntities1 db = new БД_НарядEntities1())
            {
                var normList = db.Database.SqlQuery<string>(
                                   $"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'{tableNorm}'").ToList();
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
        public double CoefficientNorm_Winter_Hard(string workingСonditions)//поправочный коефициент Норма (зима, тяжелые)
        {
            try
            {
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var tableNorm = db.Поправочний_коефіцієнт.Where(a => a.Умови_праці == workingСonditions)
                                        .Select(a => a.Поправочний_коефіцієнт_Норма).ToList();
                    return Convert.ToDouble(tableNorm[0]);
                }
            }
            catch (Exception)
            {
                return 0;
            }           
        }

        public double CoefficientOil_Winter_Hard(string workingСonditions)//поправочный коефициент ГСМ (зима, тяжелые)
        {
            try
            {
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var tableNorm = db.Поправочний_коефіцієнт.Where(a => a.Умови_праці == workingСonditions)
                                        .Select(a => a.Поправочний_коефіцієнт_ГСМ).ToList();
                    return Convert.ToDouble(tableNorm[0]);
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public double CoefficientTractorMoving(string distanceMoving)//поправочный коефициент переезд трактора
        {
            try
            {
                decimal distance = Convert.ToDecimal(distanceMoving);
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var tableNorm = db.Поправочний_коефіцієнт_Переїзд.Where(a => a.Відстань_переїзду >= distance).Select(a => a.Поправочний_коефіцієнт).ToList();
                    return Convert.ToDouble(tableNorm[0]);
                }
            }
            catch (Exception)
            {
                return 0;
            }           
        }

        public double CoefficientBlock(string distanceMoving)//поправочный коефициент помехи на делянке
        {
            try
            {
                decimal distance = Convert.ToDecimal(distanceMoving);
                using (БД_НарядEntities1 db = new БД_НарядEntities1())
                {
                    var tableNorm = db.Поправочний_коефіцієнт_Перешкоди.Where(a => a.Відсоток_Перешкоди >= distance).Select(a => a.Поправочний_коефіцієнт).ToList();
                    return Convert.ToDouble(tableNorm[0]);
                }
            }
            catch (Exception)
            {
                return 0;
            }           
        }
    }
}