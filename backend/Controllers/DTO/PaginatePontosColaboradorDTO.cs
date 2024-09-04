using backend.Controllers.Entities;

namespace backend.Controllers.DTO
{
    public class PaginatePontosColaboradorDTO
    {
        public int Count { get; set; }

        public required List<GetPontosColaboradorDTO> Pontos { get; set; }
    }
}
