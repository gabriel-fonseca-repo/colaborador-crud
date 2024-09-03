using backend.Controllers.Enum;

namespace backend.Controllers.Entities
{
    public class Colaborador
    {
        public int Id { get; set; }

        public string NomeCompleto => $"{Nome} {Sobrenome}";

        public required string Nome { get; set; }

        public required string Sobrenome { get; set; }

        public required string Matricula { get; set; }

        public required Cargo Cargo { get; set; }

        public required decimal Salario { get; set; }

        public required ICollection<Ponto> Pontos { get; set; }
    }
}
