using Microsoft.EntityFrameworkCore;
using Calculadora_de_gastos.Models;
using Calculadora_de_gastos;

namespace FinanceiroAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<TipoMovimentacao> TipoMovimentacoes { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }  // Alterado para o Model correto

    }
}