using Calculadora_de_gastos.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Calculadora_de_gastos.Models
{
    public class Movimentacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }

        [Column(TypeName = "timestamp with time zone")]
        public DateTime Data { get; set; }

        public bool Fixo { get; set; }

        public int TipoMovimentacaoId { get; set; }
  
        public TipoMovimentacao? TipoMovimentacao { get; set; }

        public int CategoriaId { get; set; }

   
        public Categoria? Categoria { get; set; }

        public int UsuarioId { get; set; }

        public Usuario? Usuario { get; set; }
    }
}
