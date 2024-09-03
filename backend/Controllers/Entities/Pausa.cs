namespace backend.Controllers.Entities
{
    public class Pausa
    {
        public int Id { get; set; }

        public required DateTime Inicio { get; set; }

        public DateTime Fim { get; set; }

        public required int PontoId { get; set; }

        public required Ponto Ponto { get; set; }

        public required bool Ativa { get; set; }
    }
}
