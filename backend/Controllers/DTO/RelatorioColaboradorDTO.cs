namespace backend.Controllers.DTO
{
    public class RelatorioColaboradorDTO
    {
        public int ColaboradorId { get; set; }

        public required string Matricula { get; set; }

        public required string NomeColaborador { get; set; }

        public required DateTime Data { get; set; }

        public TimeSpan HorasTrabalhadas { get; set; }
    }
}
