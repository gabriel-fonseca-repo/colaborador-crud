using backend.Controllers.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace backend.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<Colaborador> Colaboradores { get; set; }

        public DbSet<Ponto> Pontos { get; set; }

        public DbSet<Pausa> Pausas { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Colaborador>()
                .HasIndex(u => u.Matricula)
                .IsUnique();

            builder.Entity<Ponto>()
                .HasOne(p => p.Colaborador)
                .WithMany(c => c.Pontos)
                .HasForeignKey(p => p.ColaboradorId);

            builder.Entity<Pausa>()
                .HasOne(p => p.Ponto)
                .WithMany(c => c.Pausas)
                .HasForeignKey(p => p.PontoId);
        }
    }
}
