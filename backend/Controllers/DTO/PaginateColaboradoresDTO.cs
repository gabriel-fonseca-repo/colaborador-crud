namespace backend.Controllers.DTO
{
    public class PaginateColaboradoresDTO
    {
        public int Count { get; set; }

        public required List<GetColaboradorDTO> Colaboradores { get; set; }
    }
}
