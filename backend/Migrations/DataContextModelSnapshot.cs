﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Controllers.Entities.Colaborador", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Cargo")
                        .HasColumnType("integer");

                    b.Property<string>("Matricula")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("Salario")
                        .HasColumnType("numeric");

                    b.Property<string>("Sobrenome")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Matricula")
                        .IsUnique();

                    b.ToTable("Colaboradores");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Pausa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Ativa")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("Fim")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("Inicio")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("PontoId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PontoId");

                    b.ToTable("Pausas");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Ponto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Ativo")
                        .HasColumnType("boolean");

                    b.Property<int>("ColaboradorId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("HorarioDataEntrada")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("HorarioDataSaida")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ColaboradorId");

                    b.ToTable("Pontos");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Pausa", b =>
                {
                    b.HasOne("backend.Controllers.Entities.Ponto", "Ponto")
                        .WithMany("Pausas")
                        .HasForeignKey("PontoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ponto");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Ponto", b =>
                {
                    b.HasOne("backend.Controllers.Entities.Colaborador", "Colaborador")
                        .WithMany("Pontos")
                        .HasForeignKey("ColaboradorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Colaborador");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Colaborador", b =>
                {
                    b.Navigation("Pontos");
                });

            modelBuilder.Entity("backend.Controllers.Entities.Ponto", b =>
                {
                    b.Navigation("Pausas");
                });
#pragma warning restore 612, 618
        }
    }
}
