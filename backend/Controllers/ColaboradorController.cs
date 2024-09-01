using backend.Controllers.DTO;
using backend.Controllers.Entities;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ColaboradorController(DataContext dataContext) : Controller
    {

        private readonly DataContext _dataContext = dataContext;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetColaboradorDTO>>> GetAllColaboradores()
        {
            var colaboradores = await _dataContext.Colaboradores.ToListAsync();
            var colaboradoresDto = colaboradores.Select(colaborador => new GetColaboradorDTO
            {
                Name = colaborador.Name,
                FirstName = colaborador.FirstName,
                LastName = colaborador.LastName
            }).ToList();
            return Ok(colaboradoresDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetColaboradorDTO>> GetColaborador(int id)
        {
            var colaborador = await _dataContext.Colaboradores.FindAsync(id);

            if (colaborador is null) {
                return NotFound("Colaborador não encontrado.");
            }

            var colaboradorDto = new GetColaboradorDTO
            {
                Name = colaborador.Name,
                FirstName = colaborador.FirstName,
                LastName = colaborador.LastName
            };

            return Ok(colaboradorDto);
        }

        [HttpPost]
        public async Task<ActionResult> AddColaborador(AddColaboradorDTO colaborador)
        {

            if (colaborador is null)
                return BadRequest("Corpo da requisição faltando ou nulo.");
            if (colaborador.FirstName is null)
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (colaborador.LastName is null)
                return BadRequest("Sobrenome do colaborador faltando ou nulo.");

            var dbColaborador = new Colaborador
            {
                FirstName = colaborador.FirstName,
                LastName = colaborador.LastName
            };

            _dataContext.Colaboradores.Add(dbColaborador);
            await _dataContext.SaveChangesAsync();

            return Ok("Colaborador cadastrado com sucesso.");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateColaborador(UpdateColaboradorDTO colaborador)
        {
            if (colaborador is null)
                return BadRequest("Corpo da requisição faltando ou nulo.");
            if (colaborador.Id is 0 or < 0)
                return BadRequest("Id do colaborador inválido.");
            if (colaborador.FirstName is null)
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (colaborador.LastName is null)
                return BadRequest("Sobrenome do colaborador faltando ou nulo.");

            var dbColaborador = await _dataContext.Colaboradores.FindAsync(colaborador.Id);

            if (dbColaborador is null)
                return NotFound("Colaborador não encontrado.");

            dbColaborador.FirstName = colaborador.FirstName;
            dbColaborador.LastName = colaborador.LastName;

            await _dataContext.SaveChangesAsync();
            return Ok("Colaborador atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteColaborador(int id)
        {
            if (id is 0 or < 0)
                return BadRequest("Id do colaborador inválido.");

            var dbColaborador = await _dataContext.Colaboradores.FindAsync(id);

            if (dbColaborador is null)
                return NotFound("Colaborador não encontrado.");

            _dataContext.Colaboradores.Remove(dbColaborador);
            await _dataContext.SaveChangesAsync();

            return Ok("Colaborador removido com sucesso.");
        }
    }
}
