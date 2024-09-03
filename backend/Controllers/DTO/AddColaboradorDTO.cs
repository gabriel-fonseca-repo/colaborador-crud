using System.ComponentModel.DataAnnotations;
using backend.Controllers.Enum;

namespace backend.Controllers.DTO
{
    public class AddColaboradorDTO
    {
        public string? Nome { get; set; }

        public string? Sobrenome { get; set; }

        public string? Matricula { get; set; }

        public Cargo Cargo { get; set; }

        public decimal Salario { get; set; }
    }
}
