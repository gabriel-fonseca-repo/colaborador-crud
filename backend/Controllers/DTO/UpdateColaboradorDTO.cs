namespace backend.Controllers.DTO
{
    public class UpdateColaboradorDTO
    {
        public int Id { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }
    }
}
