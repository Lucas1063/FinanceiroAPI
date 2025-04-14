using Microsoft.AspNetCore.Mvc;
using Calculadora_de_gastos.Models;
using Calculadora_de_gastos;

namespace Calculadora_de_gastos.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int UsuarioId { get; set; }
        public virtual ICollection<Movimentacao> Movimentacoes { get; set; }
    }

}
