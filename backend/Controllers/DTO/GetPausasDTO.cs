namespace backend.Controllers.DTO
{
    public class GetPausasDTO
    {
        public int Id { get; set; }

        public required DateTime Inicio { get; set; }

        public DateTime Fim { get; set; }

        public required bool Ativa { get; set; }
    }
}
