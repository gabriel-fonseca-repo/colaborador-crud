using backend.Controllers.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<Colaborador> Colaboradores { get; set; }
    }
}
