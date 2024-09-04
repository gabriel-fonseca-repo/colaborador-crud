using Microsoft.VisualBasic;

namespace backend.Controllers.Entities
{
    public class Ponto
    {
        public int Id { get; set; }

        public required DateTime HorarioDataEntrada { get; set; } = DateTime.Now;

        public DateTime? HorarioDataSaida { get; set; }

        public bool Ativo { get; set; }

        public required int ColaboradorId { get; set; }

        public required Colaborador Colaborador { get; set; }

        public required ICollection<Pausa> Pausas { get; set; }
    }
}
