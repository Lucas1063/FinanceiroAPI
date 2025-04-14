using Microsoft.AspNetCore.Mvc;
using Calculadora_de_gastos.Models;
using FinanceiroAPI.Data;
using Microsoft.EntityFrameworkCore;
namespace Calculadora_de_gastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoMovimentacaoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TipoMovimentacaoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoMovimentacao>>> GetTipos()
        {
            return await _context.TipoMovimentacoes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoMovimentacao>> GetTipo(int id)
        {
            var tipo = await _context.TipoMovimentacoes.FindAsync(id);

            if (tipo == null)
                return NotFound();

            return tipo;
        }

        [HttpPost]
        public async Task<ActionResult<TipoMovimentacao>> PostTipo(TipoMovimentacao tipo)
        {
            _context.TipoMovimentacoes.Add(tipo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTipo), new { id = tipo.Id }, tipo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipo(int id, TipoMovimentacao tipo)
        {
            if (id != tipo.Id)
                return BadRequest();

            _context.Entry(tipo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TipoMovimentacoes.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipo(int id)
        {
            var tipo = await _context.TipoMovimentacoes.FindAsync(id);
            if (tipo == null)
                return NotFound();

            _context.TipoMovimentacoes.Remove(tipo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
