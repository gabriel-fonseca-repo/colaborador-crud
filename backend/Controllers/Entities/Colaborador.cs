namespace backend.Controllers.Entities
{
    public class Colaborador
    {
        public int Id { get; set; }

        public string Name => $"{FirstName} {LastName}";

        public required string FirstName { get; set; }

        public required string LastName { get; set; }
    }
}
