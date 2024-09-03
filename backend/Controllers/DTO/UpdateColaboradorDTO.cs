using backend.Controllers.Enum;

namespace backend.Controllers.DTO
{
    public class UpdateColaboradorDTO
    {
        public string? Nome { get; set; }

        public string? Sobrenome { get; set; }

        public string? Matricula { get; set; }

        public Cargo Cargo { get; set; }

        public decimal Salario { get; set; }
    }
}
