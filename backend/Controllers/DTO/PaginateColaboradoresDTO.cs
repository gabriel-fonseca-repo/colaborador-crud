namespace backend.Controllers.DTO
{
    public class PaginateColaboradoresDTO
    {
        public int Count { get; set; }

        public List<GetColaboradorDTO> Colaboradores { get; set; }
    }
}
