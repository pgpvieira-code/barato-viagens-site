/* ==========================================================================
   BARATO VIAGENS — CONFIGURAÇÃO DO SITE
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para atualizar a página.

   Regras importantes:
   • Campo vazio ("") ou lista vazia ([]) = o site esconde aquilo sozinho.
     Nenhum botão aparece sem destino real.
   • Preços, datas e disponibilidade: use somente dados reais.
   • Depois de editar, salve e recarregue a página.
   • Para ver a página preenchida com dados FICTÍCIOS de exemplo
     (útil para testar), abra: index.html?exemplo=1
   ========================================================================== */

window.SITE_CONFIG = {
  /* ---------------- MARCA ---------------- */
  marca: {
    nome: "Barato Viagens",
    // Caminho da logo (ex.: "assets/img/logo.svg"). Vazio = mostra o nome em texto.
    logo: "assets/img/logo-transparente.webp",
    // Cores principais. Troque aqui para adaptar à identidade da logo.
    cores: {
      azul: "#004A9E",       // azul da logo (fundos e títulos)
      azulEscuro: "#002A66", // variação mais escura
      amarelo: "#FFAB2E",    // laranja da logo: destaques e botões principais
    },
  },

  /* ---------------- CONTATO ---------------- */
  contato: {
    // WhatsApp com DDI + DDD + número, só dígitos. Ex.: "5548999998888"
    // Vazio = botão flutuante e botões "Consultar pelo WhatsApp" somem.
    whatsapp: "5548996196934",
    // Mensagem inicial padrão do WhatsApp
    mensagemPadrao: "Olá, Barato Viagens! Vim pelo site e gostaria de mais informações.",
    email: "baratoviagens@gmail.com",
    telefone: "(48) 99619-6934", // como deve aparecer, ex.: "(48) 99999-8888"
    horarioAtendimento: "", // ex.: "Segunda a sexta, das 9h às 18h"
  },

  /* ---------------- REDES SOCIAIS ---------------- */
  redes: {
    // Somente o usuário, sem @. Ex.: "baratoviagens"
    instagram: "baratoviagens_",
  },

  /* ---------------- GRUPOS ----------------
     Só aparecem os grupos com "link" preenchido.
     tipo: "milhas" | "promocoes" | "vouchers"
     acesso: descreva SOMENTE se souber (ex.: "Participação gratuita").
             Vazio = nada é dito sobre gratuidade.                        */
  grupos: [
    {
      tipo: "milhas",
      titulo: "Milhas e passagens",
      descricao: "Oportunidades com milhas, emissões e passagens aéreas assim que surgirem.",
      imagem: "assets/img/milhas.webp",
      link: "",
      acesso: "",
    },
    {
      tipo: "promocoes",
      titulo: "Promoções de viagens",
      descricao: "Pacotes, hospedagens e tarifas em promoção para destinos no Brasil e no exterior.",
      imagem: "assets/img/promocoes.webp",
      link: "",
      acesso: "",
    },
    {
      tipo: "vouchers",
      titulo: "Vouchers e turismo",
      descricao: "Vouchers de hospedagem, passeios e atrações para aproveitar no seu destino.",
      imagem: "assets/img/vouchers.webp",
      link: "",
      acesso: "",
    },
  ],

  /* ---------------- GRUPO EXCLUSIVO (pago) ----------------
     ativo: false = some do site.
     A entrada é pelo WhatsApp: o botão abre a conversa com a mensagem abaixo.
     Se tiver link de pagamento, coloque em "linkPagamento" (o botão passa a usá-lo). */
  grupoExclusivo: {
    ativo: true,
    titulo: "Grupo Exclusivo Barato Viagens",
    descricao: "Um grupo de WhatsApp fechado para quem quer viajar mais pagando menos.",
    beneficios: [
      "Promoções exclusivas",
      "Voos baratos",
      "Oportunidades com milhas",
      "Compra de passagens com milhas",
      "Promoções de milhas",
      "Dicas de viagens",
    ],
    complemento: "E muito mais.",
    preco: "R$ 149,90",
    periodo: "por mês",
    botao: "Quero entrar no grupo exclusivo",
    mensagemWhatsApp: "Olá, Barato Viagens! Quero entrar no Grupo Exclusivo de R$ 149,90 por mês. Como faço?",
    linkPagamento: "",
  },

  /* ---------------- PROMOÇÕES ----------------
     categoria: "passagens" | "hospedagens" | "pacotes" | "passeios"
     Campos opcionais podem ficar vazios; o cartão se adapta.
     Modelo (copie, remova as barras // e preencha):

     {
       id: "floripa-mar26",               // único, sem espaços
       categoria: "passagens",
       titulo: "Florianópolis",
       imagem: "assets/img/sua-foto.webp", // ou URL de imagem
       origem: "São Paulo (GRU)",
       periodo: "Março a maio de 2026",
       resumo: "Ida e volta com bagagem de mão.",
       inclui: ["Passagem ida e volta", "Bagagem de mão 10 kg"],
       preco: "R$ 499",                    // texto livre; vazio = sem preço
       condicoes: "Por pessoa, sujeito a disponibilidade.",
       detalhes: "Texto completo exibido ao abrir a oferta.",
       validaAte: "2026-03-15",            // opcional (AAAA-MM-DD); após a data some do site
     },
  */
  promocoes: [],

  /* ---------------- VOUCHERS ----------------
     categoria: "hospedagem" | "passeios" | "atracoes" | "outros"
     Modelo:

     {
       id: "voucher-parque",
       categoria: "atracoes",
       titulo: "Ingresso parque aquático",
       imagem: "assets/img/sua-foto.webp",
       beneficio: "1 ingresso adulto de dia inteiro",
       local: "Parque X — Cidade/UF",
       valor: "R$ 89",                  // vazio se não se aplica
       validade: "Até 30/06/2026",
       reserva: "Necessária com 48h de antecedência", // ou "Não é necessária"
       restricoes: "Não válido em feriados.",
       resgate: "Apresente o código na bilheteria com documento com foto.",
     },
  */
  vouchers: [],

  /* ---------------- ATENDIMENTO ----------------
     Quem realiza a venda/atendimento das ofertas.                          */
  atendimento: {
    responsavel: "equipe Barato Viagens",
  },

  /* ---------------- PERGUNTAS FREQUENTES ----------------
     As respostas padrão se montam sozinhas com os dados acima.
     Preencha um campo abaixo para substituir a resposta padrão.           */
  faq: {
    comoEntrar: "",
    quaisOportunidades: "",
    precisaMilhas: "",
    comoConsultar: "",
    comoUsarVoucher: "",
    comoFalar: "",
    // Perguntas adicionais: [{ pergunta: "...", resposta: "..." }]
    extras: [],
  },

  /* ---------------- DADOS LEGAIS ----------------
     Só aparecem se preenchidos.                                             */
  legal: {
    razaoSocial: "",
    cnpj: "",
    politicaPrivacidade: "", // URL ou caminho, ex.: "privacidade.html"
    termosUso: "",
  },
};
