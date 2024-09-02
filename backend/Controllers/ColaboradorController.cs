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

        [HttpGet("{pageNumber}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<PaginateColaboradoresDTO>>> PaginateColaboradores(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber is < 0)
            {
                pageNumber = 0;
            }

            int skip = pageNumber * pageSize;

            var colaboradores = await _dataContext.Colaboradores
                .OrderBy(colaborador => colaborador.Id)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var countColaboradores = _dataContext.Colaboradores.Count();

            var colaboradoresDto = colaboradores.Select(colaborador => new GetColaboradorDTO
            {
                Id = colaborador.Id,
                Name = colaborador.Name,
                FirstName = colaborador.FirstName,
                LastName = colaborador.LastName
            }).ToList();

            var pagination = new PaginateColaboradoresDTO
            {
                Count = countColaboradores,
                Colaboradores = colaboradoresDto
            };

            return Ok(pagination);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetColaboradorDTO>> GetColaborador(int id)
        {
            var colaborador = await _dataContext.Colaboradores.FindAsync(id);

            if (colaborador is null)
            {
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
            if (string.IsNullOrWhiteSpace(colaborador.FirstName))
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.LastName))
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

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateColaborador(int id, UpdateColaboradorDTO colaborador)
        {
            if (colaborador is null)
                return BadRequest("Corpo da requisição faltando ou nulo.");
            if (id is 0 or < 0)
                return BadRequest("Id do colaborador inválido.");
            if (string.IsNullOrWhiteSpace(colaborador.FirstName))
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.LastName))
                return BadRequest("Sobrenome do colaborador faltando ou nulo.");

            var dbColaborador = await _dataContext.Colaboradores.FindAsync(id);

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
