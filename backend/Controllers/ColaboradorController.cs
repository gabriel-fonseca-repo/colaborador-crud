using backend.Controllers.DTO;
using backend.Controllers.Entities;
using backend.Controllers.Enum;
using backend.Controllers.Utils;
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
        public async Task<ActionResult<PaginateColaboradoresDTO>> PaginateColaboradores(int pageNumber = 1, int pageSize = 10)
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
                NomeCompleto = colaborador.NomeCompleto,
                Nome = colaborador.Nome,
                Sobrenome = colaborador.Sobrenome,
                Cargo = colaborador.Cargo,
                Matricula = colaborador.Matricula,
                Salario = colaborador.Salario
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
                Id = colaborador.Id,
                NomeCompleto = colaborador.NomeCompleto,
                Nome = colaborador.Nome,
                Sobrenome = colaborador.Sobrenome,
                Cargo = colaborador.Cargo,
                Matricula = colaborador.Matricula,
                Salario = colaborador.Salario
            };

            return Ok(colaboradorDto);
        }

        [HttpPost]
        public async Task<ActionResult<string>> AddColaborador(AddColaboradorDTO colaborador)
        {
            if (colaborador is null)
                return BadRequest("Corpo da requisição faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.Nome))
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.Sobrenome))
                return BadRequest("Sobrenome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.Matricula))
                return BadRequest("Matrícula do colaborador faltando ou nula.");
            if (colaborador.Cargo is <= 0)
                return BadRequest("Cargo do colaborador faltando ou nulo.");
            if (colaborador.Salario is <= 0.0m)
                return BadRequest("Salário do colaborador precisa ser maior que 0.");

            var dbColaboradorByMatricula = _dataContext.Colaboradores.FirstOrDefault(c => c.Matricula == colaborador.Matricula);

            if (dbColaboradorByMatricula is not null)
                return BadRequest($"Matrícula de valor {colaborador.Matricula} já cadastrada.");

            var dbColaborador = new Colaborador
            {
                Nome = colaborador.Nome,
                Sobrenome = colaborador.Sobrenome,
                Matricula = colaborador.Matricula,
                Cargo = colaborador.Cargo,
                Salario = colaborador.Salario,
                Pontos = []
            };

            _dataContext.Colaboradores.Add(dbColaborador);
            await _dataContext.SaveChangesAsync();

            return Ok("Colaborador cadastrado com sucesso.");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateColaborador(int id, UpdateColaboradorDTO colaborador)
        {
            if (colaborador is null)
                return BadRequest("Corpo da requisição faltando ou nulo.");
            if (id is 0 or < 0)
                return BadRequest("Id do colaborador inválido.");
            if (string.IsNullOrWhiteSpace(colaborador.Nome))
                return BadRequest("Nome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.Sobrenome))
                return BadRequest("Sobrenome do colaborador faltando ou nulo.");
            if (string.IsNullOrWhiteSpace(colaborador.Matricula))
                return BadRequest("Matrícula do colaborador faltando ou nula.");
            if (colaborador.Cargo is <= 0)
                return BadRequest("Cargo do colaborador faltando ou nulo.");
            if (colaborador.Salario is <= 0.0m)
                return BadRequest("Salário do colaborador precisa ser maior que 0.");

            var dbColaboradorByMatricula = _dataContext.Colaboradores.FirstOrDefault(c => c.Matricula == colaborador.Matricula);

            if (dbColaboradorByMatricula is not null)
                return BadRequest($"Matrícula de valor {colaborador.Matricula} já cadastrada.");

            var dbColaborador = await _dataContext.Colaboradores.FindAsync(id);

            if (dbColaborador is null)
                return NotFound("Colaborador não encontrado.");

            dbColaborador.Nome = colaborador.Nome;
            dbColaborador.Sobrenome = colaborador.Sobrenome;
            dbColaborador.Matricula = colaborador.Matricula;
            dbColaborador.Cargo = colaborador.Cargo;
            dbColaborador.Salario = colaborador.Salario;

            await _dataContext.SaveChangesAsync();
            return Ok("Colaborador atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> DeleteColaborador(int id)
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

        [HttpGet("Cargos")]
        public ActionResult<IEnumerable<GetCargosDTO>> GetCargos()
        {
            var enumNames = Cargo.GetNames(typeof(Cargo)).Cast<string>();
            var enumValues = Cargo.GetValues(typeof(Cargo)).Cast<int>();

            var enumsList = enumNames.Zip(enumValues, (name, value) =>
            {
                return new { ViewValue = name.Replace("_", " "), Value = value };
            });

            return Ok(enumsList);
        }

        [HttpGet("Autocomplete")]
        public async Task<ActionResult<List<GetAutocompleteDTO>>> GetAutocomplete([FromQuery] string filter)
        {
            var colaboradores = await _dataContext.Colaboradores
                .Where(c => EF.Functions.Like((c.Matricula + " - " + c.Nome + " " + c.Sobrenome).ToLower(), $"%{filter.ToLower()}%"))
                .Take(10)
                .ToListAsync();

            var autocompleteData = colaboradores.Select(colaborador => new GetAutocompleteDTO
            {
                Id = colaborador.Id,
                CampoAutocomplete = colaborador.Matricula + " - " + colaborador.NomeCompleto
            }).ToList();

            return Ok(autocompleteData);
        }

        [HttpGet("Relatorio/{ano}/{mes}")]
        public FileStreamResult GetRelatorioMensal(int ano, int mes)
        {
            var dadosRelatorio = _dataContext.Pontos
                .Include(p => p.Pausas)
                .Where(p => p.HorarioDataEntrada.Year == ano && p.HorarioDataEntrada.Month == mes)
                .Select(p => new
                {
                    p.Colaborador,
                    p.Colaborador.Matricula,
                    Nome = p.Colaborador.NomeCompleto,
                    p.HorarioDataEntrada.Date,
                    HorasTrabalhadas = RelatorioUtils.CalcularHorasTrabalhadas(p)
                })
                .AsEnumerable()
                .GroupBy(p => new { p.Colaborador.Id, p.Colaborador.Matricula, p.Colaborador.NomeCompleto, p.Date })
                .Select(g => new RelatorioColaboradorDTO
                {
                    ColaboradorId = g.Key.Id,
                    NomeColaborador = g.Key.NomeCompleto,
                    Matricula = g.Key.Matricula,
                    Data = g.Key.Date,
                    HorasTrabalhadas = TimeSpan.FromMinutes(g.Sum(x => x.HorasTrabalhadas.TotalMinutes))
                })
                .OrderBy(x => x.ColaboradorId).ThenBy(x => x.Data);

            var idsComPontos = dadosRelatorio.Select(c => c.ColaboradorId).Distinct();

            var colaboradoresSemPontos = _dataContext.Colaboradores
                .Where(c => !idsComPontos.Contains(c.Id))
                .ToList()
                .Select(c => new RelatorioColaboradorDTO
                {
                    ColaboradorId = c.Id,
                    NomeColaborador = c.NomeCompleto,
                    Matricula = c.Matricula,
                    Data = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1),
                    HorasTrabalhadas = TimeSpan.Zero
                })
                .OrderBy(c => c.ColaboradorId)
                .ThenBy(x => x.Data);

            var stream = RelatorioUtils.RelatorioCsvStream(
                [.. dadosRelatorio.Concat(colaboradoresSemPontos)]
            );

            return File(stream, "text/csv", $"Relatorio_{ano}_{mes}.csv");
        }
    }
}
