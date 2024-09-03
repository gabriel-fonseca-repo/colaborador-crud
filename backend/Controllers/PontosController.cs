using backend.Controllers.DTO;
using backend.Controllers.Entities;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PontosController(DataContext dataContext) : ControllerBase
    {

        private readonly DataContext _dataContext = dataContext;

        [HttpGet("{idColaborador}/{pageNumber}/{pageSize}")]
        public async Task<ActionResult<PaginatePontosColaboradorDTO>> PaginateColaboradores(int idColaborador, int pageNumber = 1, int pageSize = 10)
        {
            var colaborador = await _dataContext.Colaboradores.FindAsync(idColaborador);

            if (colaborador is null)
            {
                return NotFound("Colaborador não encontrado.");
            }

            if (colaborador.Pontos == null || colaborador.Pontos.Count != 0)
                return NotFound("Colaborador não bateu pontos até o momento.");

            if (pageNumber is < 0)
            {
                pageNumber = 0;
            }

            int skip = pageNumber * pageSize;

            var pontos = await _dataContext.Pontos
                .Where(ponto => ponto.ColaboradorId == idColaborador)
                .OrderBy(ponto => ponto.HorarioDataEntrada)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var countPontos = _dataContext.Pontos.Where(ponto => ponto.ColaboradorId == idColaborador).Count();

            var pontosDto = pontos.Select(ponto => new GetPontosColaboradorDTO
            {
                Id = ponto.Id,
                HorarioDataEntrada = ponto.HorarioDataEntrada,
                HorarioDataSaida = ponto.HorarioDataSaida,
                Ativo = ponto.Ativo,
                Pausas = ponto.Pausas.Select(pausa => new GetPausasDTO
                {
                    Id = pausa.Id,
                    Inicio = pausa.Inicio,
                    Fim = pausa.Fim,
                    Ativa = pausa.Ativa
                }).ToList()
            }).ToList();

            var pagination = new PaginatePontosColaboradorDTO
            {
                Count = countPontos,
                Pontos = pontosDto
            };

            return Ok(pagination);
        }

        [HttpPost("Bater/{idColaborador}")]
        public async Task<ActionResult<string>> BaterPontoEntrada(int idColaborador)
        {
            var colaborador = await _dataContext.Colaboradores.FindAsync(idColaborador);

            if (colaborador is null)
            {
                return NotFound("Colaborador não encontrado.");
            }

            colaborador.Pontos ??= [];

            if (colaborador.Pontos == null || colaborador.Pontos.Count != 0)
            {
                colaborador.Pontos = [];
            }
            else
            {
                var ponto = colaborador.Pontos
                    .Where(p => p.Ativo == true)
                    .OrderBy(p => p.HorarioDataEntrada)
                    .Last();

                if (ponto != null)
                    return BadRequest("Ponto de entrada já batido.");
            }

            var dbPonto = new Ponto
            {
                HorarioDataEntrada = DateTime.Now,
                Ativo = true,
                ColaboradorId = colaborador.Id,
                Colaborador = colaborador,
                Pausas = []
            };

            _dataContext.Pontos.Add(dbPonto);
            await _dataContext.SaveChangesAsync();

            return Ok("Ponto batido com sucesso. Contagem iniciada.");
        }

        [HttpPut("Bater/{idColaborador}")]
        public async Task<ActionResult<string>> BaterPontoSaida(int idColaborador)
        {
            var colaborador = await _dataContext.Colaboradores.FindAsync(idColaborador);

            if (colaborador is null)
            {
                return NotFound("Colaborador não encontrado.");
            }

            if (colaborador.Pontos == null || colaborador.Pontos.Count != 0)
                return NotFound("Colaborador não bateu pontos até o momento.");

            var ponto = colaborador.Pontos
                .Where(p => p.Ativo == true)
                .OrderBy(p => p.HorarioDataEntrada)
                .Last();

            if (ponto == null)
                return BadRequest("Ponto já foi finalizado.");

            ponto.HorarioDataSaida = DateTime.Now;
            ponto.Ativo = false;

            _dataContext.Pontos.Update(ponto);
            await _dataContext.SaveChangesAsync();

            return Ok("Ponto batido com sucesso. Contagem finalizada.");
        }

        [HttpPost("Pausar/{idPonto}")]
        public async Task<ActionResult<string>> PausarPonto(int idPonto)
        {
            var ponto = await _dataContext.Pontos.FindAsync(idPonto);

            if (ponto is null)
                return NotFound("Ponto não encontrado.");
            if (!ponto.Ativo)
                return BadRequest("Ponto já pausado.");

            ponto.Ativo = false;

            var pausa = new Pausa
            {
                Inicio = DateTime.Now,
                Ativa = true,
                PontoId = ponto.Id,
                Ponto = ponto
            };

            if (ponto.Pausas == null || ponto.Pausas.Count != 0)
                ponto.Pausas = [];


            ponto.Pausas.Add(pausa);

            _dataContext.Pausas.Add(pausa);
            await _dataContext.SaveChangesAsync();

            return Ok("Ponto pausado com sucesso. Contagem interrompida.");
        }

        [HttpPut("Despausar/{idPonto}")]
        public async Task<ActionResult<string>> DespausarPonto(int idPonto)
        {
            var ponto = await _dataContext.Pontos.FindAsync(idPonto);

            if (ponto is null)
                return NotFound("Ponto não encontrado.");
            if (ponto.Ativo)
                return BadRequest("Ponto não está pausado.");
            if (ponto.Pausas == null || ponto.Pausas.Count != 0)
                return BadRequest("Ponto não possui pausas.");

            ponto.Ativo = true;

            var pausa = ponto.Pausas
                .Where(p => p.Ativa == true)
                .OrderBy(p => p.Inicio)
                .Last();

            if (pausa == null)
                return BadRequest("Ponto não está pausado.");

            pausa.Ativa = false;

            _dataContext.Pausas.Update(pausa);
            await _dataContext.SaveChangesAsync();

            return Ok("Ponto despausado com sucesso. Contagem interrompida.");
        }

    }

}
