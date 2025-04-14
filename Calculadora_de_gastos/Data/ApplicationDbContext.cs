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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração do mapeamento para a tabela Movimentacoes
            modelBuilder.Entity<Movimentacao>(entity =>
            {
                entity.ToTable("Movimentacoes");

                // Mapeamento dos campos com nomes diferentes
                entity.Property(e => e.TipoMovimentacaoId)
                    .HasColumnName("TipoMovimentacaoId");

                entity.Property(e => e.CategoriaId)
                    .HasColumnName("CategoriaId");

                entity.Property(e => e.UsuarioId)

                    .HasColumnName("UsuarioId");

                // Configuração dos relacionamentos
                entity.HasOne(m => m.TipoMovimentacao)
                    .WithMany(t => t.Movimentacoes)
                    .HasForeignKey(m => m.TipoMovimentacaoId);

                entity.HasOne(m => m.Categoria)
                    .WithMany(c => c.Movimentacoes)
                    .HasForeignKey(m => m.CategoriaId);

                entity.HasOne(m => m.Usuario)
                    .WithMany(u => u.Movimentacoes)
                    .HasForeignKey(m => m.UsuarioId);
            });
        }
    }
}