using backend.Controllers.DTO;
using backend.Controllers.Entities;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using System.Formats.Asn1;
using System.Globalization;
using System.Text;

namespace backend.Controllers.Utils
{
    public class RelatorioUtils
    {
        public static TimeSpan CalcularHorasTrabalhadas(Ponto ponto)
        {
            if (!ponto.HorarioDataSaida.HasValue)
            {
                return TimeSpan.Zero;
            }

            var totalHoras = ponto.HorarioDataSaida.Value - ponto.HorarioDataEntrada;
            var totalTempoPausado = ponto.Pausas
                .Where(p => !p.Ativa && p.Fim.HasValue)
                .Sum(static p => (p.Fim.Value - p.Inicio).TotalMinutes);

            return totalHoras - TimeSpan.FromMinutes(totalTempoPausado);
        }

        public static MemoryStream RelatorioCsvStream(IEnumerable<RelatorioColaboradorDTO> relatorios)
        {
            var stream = new MemoryStream();
            using (var writer = new StreamWriter(stream, new UTF8Encoding(true), 1024, true))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(relatorios);
            }
            stream.Position = 0;
            return stream;
        }

    }

}
