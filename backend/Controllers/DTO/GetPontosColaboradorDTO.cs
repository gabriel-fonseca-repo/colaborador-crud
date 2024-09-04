namespace backend.Controllers.DTO
{
    public class GetPontosColaboradorDTO
    {
        public int Id { get; set; }

        public required DateTime HorarioDataEntrada { get; set; }

        public DateTime? HorarioDataSaida { get; set; }

        public bool Ativo { get; set; }

        public required ICollection<GetPausasDTO> Pausas { get; set; }
    }
}
