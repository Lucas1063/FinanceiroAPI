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

        [ForeignKey("TipoMovimentacaoId")]
        [JsonIgnore]
        public virtual TipoMovimentacao TipoMovimentacao { get; set; }

        public int CategoriaId { get; set; }

        [ForeignKey("CategoriaId")]
        [JsonIgnore]
        public virtual Categoria Categoria { get; set; }

        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        [JsonIgnore]
        public virtual Usuario Usuario { get; set; }
    }
}
