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

            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);

            builder.Entity<Colaborador>()
                .HasIndex(u => u.Matricula)
                .IsUnique();

            builder.Entity<Ponto>()
                .HasOne(p => p.Colaborador)
                .WithMany(c => c.Pontos)
                .HasForeignKey(p => p.ColaboradorId);

            builder.Entity<Ponto>()
                .Property(p => p.HorarioDataSaida)
                .IsRequired(false);

            builder.Entity<Pausa>()
                .HasOne(p => p.Ponto)
                .WithMany(c => c.Pausas)
                .HasForeignKey(p => p.PontoId);

            builder.Entity<Pausa>()
                .Property(p => p.Fim)
                .IsRequired(false);
        }
    }
}
