using backend.Controllers.Enum;

namespace backend.Controllers.DTO
{
    public class GetColaboradorDTO
    {
        public int Id { get; set; }

        public string? NomeCompleto { get; set; }

        public string? Nome { get; set; }

        public string? Sobrenome { get; set; }

        public string? Matricula { get; set; }

        public Cargo Cargo { get; set; }

        public decimal Salario { get; set; }
    }
}
