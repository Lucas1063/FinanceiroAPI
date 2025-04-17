﻿using Microsoft.AspNetCore.Mvc;
using FinanceiroAPI.Data;
using Microsoft.EntityFrameworkCore;
using Calculadora_de_gastos.Models;
using Calculadora_de_gastos;


namespace Calculadora_de_gastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimentacaoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovimentacaoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movimentacao>>> GetMovimentacoes()
        {
            return await _context.Movimentacoes
                .Include(m => m.CategoriaId)
                .Include(m => m.TipoMovimentacaoId)
                .Include(m => m.UsuarioId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Movimentacao>> GetById(int id) //fazer o get pelo ID do usuario // fazer get pelo ID da categoria // ID da receita
        {
            var movimentacao = await _context.Movimentacoes
                .Include(m => m.CategoriaId)
                .Include(m => m.TipoMovimentacaoId)
                .Include(m => m.UsuarioId)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movimentacao == null)
                return NotFound();

            var dto = new Movimentacao
            {
                Descricao = movimentacao.Descricao,
                Valor = movimentacao.Valor,
                Data = movimentacao.Data,
                Fixo = movimentacao.Fixo,
                TipoMovimentacaoId = movimentacao.TipoMovimentacaoId,
                CategoriaId = movimentacao.CategoriaId,
                UsuarioId = movimentacao.UsuarioId
            };

            return dto;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Movimentacao movimentacao)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var novaMovimentacao = new Movimentacao
                {
                    Descricao = movimentacao.Descricao,
                    Valor = movimentacao.Valor,
                    Data = DateTime.SpecifyKind(movimentacao.Data, DateTimeKind.Utc),
                    Fixo = movimentacao.Fixo,
                    TipoMovimentacaoId = movimentacao.TipoMovimentacaoId,
                    CategoriaId = movimentacao.CategoriaId,
                    UsuarioId = movimentacao.UsuarioId
                };

                _context.Movimentacoes.Add(novaMovimentacao);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = novaMovimentacao.Id }, novaMovimentacao);
            }
            catch (Exception ex)
            {
                // Captura erro interno (InnerException), se existir
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : "Sem detalhes adicionais.";

                return StatusCode(500, $"Erro ao salvar movimentação: {ex.Message} | Detalhes: {innerMessage}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimentacao(int id, [FromBody] Movimentacao dto)
        {
            var movimentacaoExistente = await _context.Movimentacoes.FindAsync(id);

            if (movimentacaoExistente == null)
                return NotFound();

            // Atualizar os campos
            movimentacaoExistente.Descricao =Descricao;
            movimentacaoExistente.Valor = dto.Valor;
            movimentacaoExistente.Data = dto.Data;
            movimentacaoExistente.Fixo = dto.Fixo;
            movimentacaoExistente.TipoMovimentacaoId = dto.TipoMovimentacaoId;
            movimentacaoExistente.CategoriaId = dto.CategoriaId;
            movimentacaoExistente.UsuarioId = dto.UsuarioId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimentacao(int id)
        {
            var movimentacao = await _context.Movimentacoes.FindAsync(id);
            if (movimentacao == null)
                return NotFound();

            _context.Movimentacoes.Remove(movimentacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
