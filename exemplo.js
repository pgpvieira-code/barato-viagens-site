/* ==========================================================================
   DADOS FICTÍCIOS DE EXEMPLO — carregados apenas em index.html?exemplo=1
   Servem só para visualizar como a página fica preenchida.
   Nada aqui é oferta real. Não é usado na página normal.
   ========================================================================== */
window.SITE_EXEMPLO = function (base) {
  var c = JSON.parse(JSON.stringify(base));
  c.contato.whatsapp = "5500000000000";
  c.contato.email = "contato@exemplo.com";
  c.contato.horarioAtendimento = "Segunda a sexta, das 9h às 18h (exemplo)";
  c.redes.instagram = c.redes.instagram || "exemplo";
  c.grupos.forEach(function (g) { g.link = g.link || "https://chat.whatsapp.com/EXEMPLO"; });

  c.promocoes = [
    {
      id: "exemplo-maldivas", categoria: "pacotes", titulo: "Maldivas (exemplo)",
      imagem: "assets/img/exemplo-maldivas.webp", origem: "São Paulo (GRU)",
      periodo: "Maio de 2027", resumo: "Aéreo + 6 noites em resort com café da manhã.",
      inclui: ["Passagem ida e volta", "6 noites de hospedagem", "Traslado de hidroavião"],
      preco: "R$ 0.000", condicoes: "Valor fictício, apenas ilustrativo.",
      detalhes: "Este é um cartão de exemplo para mostrar como as informações completas aparecem.",
    },
    {
      id: "exemplo-paris", categoria: "passagens", titulo: "Paris (exemplo)",
      imagem: "assets/img/exemplo-paris.webp", origem: "Rio de Janeiro (GIG)",
      periodo: "Setembro a novembro de 2027", resumo: "Ida e volta com bagagem de mão.",
      inclui: ["Passagem ida e volta", "Bagagem de mão"],
      preco: "", condicoes: "",
    },
    {
      id: "exemplo-hotel", categoria: "hospedagens", titulo: "Pousada na serra (exemplo)",
      imagem: "assets/img/exemplo-hotel.webp",
      periodo: "Fins de semana de julho", resumo: "2 diárias com café da manhã para casal.",
      preco: "R$ 000", condicoes: "Valor fictício.",
    },
    {
      id: "exemplo-mergulho", categoria: "passeios", titulo: "Batismo de mergulho (exemplo)",
      imagem: "assets/img/exemplo-mergulho.webp",
      periodo: "Datas flexíveis", resumo: "Saída de barco com instrutor e equipamento.",
    },
  ];

  c.vouchers = [
    {
      id: "exemplo-resort", categoria: "hospedagem", titulo: "Day use em resort (exemplo)",
      imagem: "assets/img/exemplo-resort.webp",
      beneficio: "Acesso às piscinas e almoço para 1 pessoa", local: "Cidade/UF (exemplo)",
      valor: "R$ 000", validade: "Até 31/12/2027", reserva: "Necessária com 48h de antecedência",
      restricoes: "Não válido em feriados.", resgate: "Apresente o código na recepção com documento com foto.",
    },
    {
      id: "exemplo-passeio", categoria: "passeios", titulo: "Passeio de escuna (exemplo)",
      beneficio: "1 passeio adulto de meio período", local: "Litoral (exemplo)",
      validade: "Até 30/06/2027", reserva: "Não é necessária",
      restricoes: "Sujeito às condições do mar.", resgate: "Informe o código no embarque.",
    },
  ];
  return c;
};
