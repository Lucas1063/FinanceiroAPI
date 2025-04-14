using Microsoft.AspNetCore.Mvc;
using Calculadora_de_gastos.Models;
using Calculadora_de_gastos;

namespace Calculadora_de_gastos.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string SenhaHash { get; set; }
        public virtual ICollection<Movimentacao> Movimentacoes { get; set; }
        public virtual ICollection<Categoria> Categorias { get; set; }
    }

}
