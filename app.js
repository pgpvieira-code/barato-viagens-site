/* Barato Viagens — renderização a partir de config.js. Não é preciso editar este arquivo. */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.get("exemplo") === "1") {
    var s = document.createElement("script");
    s.src = "exemplo.js";
    s.onload = function () { start(true); };
    s.onerror = function () { start(false); };
    document.head.appendChild(s);
  } else {
    start(false);
  }

  function start(demo) {
    var C = window.SITE_CONFIG || {};
    if (demo && window.SITE_EXEMPLO) C = window.SITE_EXEMPLO(C);
    init(C, demo);
  }

  /* ---------------- helpers ---------------- */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function has(v) { return v != null && String(v).trim() !== ""; }
  function icon(id, cls) { return '<svg class="ico ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  var CAT_OFERTA = {
    passagens: "Passagens",
    hospedagens: "Hospedagens",
    pacotes: "Pacotes",
    passeios: "Passeios",
  };
  var CAT_VOUCHER = {
    hospedagem: "Hospedagem",
    passeios: "Passeios",
    atracoes: "Atrações",
    outros: "Outros serviços turísticos",
  };

  function notExpired(item) {
    if (!has(item.validaAte)) return true;
    var d = new Date(item.validaAte + "T23:59:59");
    return isNaN(d) || d >= new Date();
  }

  /* ---------------- init ---------------- */
  function init(C, demo) {
    var marca = C.marca || {};
    var contato = C.contato || {};
    var redes = C.redes || {};
    var legal = C.legal || {};
    var faqCfg = C.faq || {};
    var nome = marca.nome || "Barato Viagens";
    var responsavel = (C.atendimento && C.atendimento.responsavel) || "equipe " + nome;

    var waNumber = String(contato.whatsapp || "").replace(/\D/g, "");
    var igUser = String(redes.instagram || "").replace(/^@/, "").trim();
    var igUrl = igUser ? "https://www.instagram.com/" + encodeURIComponent(igUser) + "/" : "";
    function wa(msg) {
      return waNumber ? "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg || contato.mensagemPadrao || "") : "";
    }

    var grupos = (C.grupos || []).filter(function (g) { return has(g.link); });
    var ofertas = (C.promocoes || []).filter(function (o) { return has(o.titulo) && notExpired(o); });
    var vouchers = (C.vouchers || []).filter(function (v) { return has(v.titulo) && notExpired(v); });
    var vipCfg = C.grupoExclusivo || {};
    var vipHref = vipCfg.ativo ? (has(vipCfg.linkPagamento) ? vipCfg.linkPagamento : wa(vipCfg.mensagemWhatsApp)) : "";
    var vip = vipHref ? vipCfg : null;

    if (demo) {
      var banner = $("#demo-banner");
      banner.hidden = false;
      var setBh = function () { document.documentElement.style.setProperty("--banner-h", banner.offsetHeight + "px"); };
      setBh();
      window.addEventListener("resize", setBh);
    }

    /* cores */
    var cores = marca.cores || {};
    var root = document.documentElement.style;
    if (cores.azul) root.setProperty("--navy", cores.azul);
    if (cores.azulEscuro) root.setProperty("--navy-deep", cores.azulEscuro);
    if (cores.amarelo) root.setProperty("--signal", cores.amarelo);

    /* marca */
    $all("[data-brand]").forEach(function (el) {
      el.innerHTML = has(marca.logo)
        ? '<img src="' + esc(marca.logo) + '" alt="' + esc(nome) + '" height="40">'
        : '<span class="brand__mark" aria-hidden="true">' + icon("arrow") + "</span>" +
          '<span class="brand__name">' + esc(nome).replace(/ /, " <b>") + "</b></span>";
    });

    /* destino do "seguir": grupos > WhatsApp > Instagram > nada */
    var follow = grupos.length || vip
      ? { href: "#grupos", label: "Entrar nos grupos", ext: false }
      : waNumber
        ? { href: wa("Olá! Quero acompanhar as oportunidades da " + nome + "."), label: "Falar no WhatsApp", ext: true }
        : igUrl
          ? { href: igUrl, label: "Seguir no Instagram", ext: true }
          : null;

    $all('[data-cta="grupos"]').forEach(function (a) {
      if (!follow) { a.remove(); return; }
      a.href = follow.href;
      a.firstChild.nodeValue = follow.label + (a.querySelector("svg") ? " " : "");
      if (follow.ext) { a.target = "_blank"; a.rel = "noopener"; }
    });
    $all('[data-cta="acompanhar"]').forEach(function (a) {
      if (!follow) { a.remove(); return; }
      a.href = follow.href;
      if (follow.ext) { a.target = "_blank"; a.rel = "noopener"; }
    });

    /* botão flutuante */
    var waFloat = $("#wa-float");
    if (waNumber) {
      waFloat.href = wa();
      waFloat.hidden = false;
      waFloat.setAttribute("aria-label", "Falar com a " + nome + " pelo WhatsApp");
    }

    renderGroups();
    renderOffers();
    renderVouchers();
    renderHow();
    renderFaq();
    renderContacts();
    setupMenu();
    setupHeader();
    setupBoard();
    setupReveal();

    /* ---------------- grupos ---------------- */
    function renderGroups() {
      var grid = $("#groups-grid");
      if (vip) {
        var bens = (vip.beneficios || []).filter(has);
        $("#vip-slot").innerHTML =
          '<article class="vip" data-reveal aria-labelledby="vip-title">' +
            '<div class="vip__main">' +
              '<span class="vip__badge">' + icon("ticket") + "Exclusivo</span>" +
              '<h3 id="vip-title">' + esc(vip.titulo || "Grupo Exclusivo") + "</h3>" +
              (has(vip.descricao) ? '<p class="vip__desc">' + esc(vip.descricao) + "</p>" : "") +
              (bens.length ? '<ul class="vip__list">' + bens.map(function (b) { return "<li>" + icon("check") + esc(b) + "</li>"; }).join("") + "</ul>" : "") +
              (has(vip.complemento) ? '<p class="vip__more">' + esc(vip.complemento) + "</p>" : "") +
            "</div>" +
            '<div class="vip__stub">' +
              (has(vip.preco) ? '<p class="vip__price"><span class="vip__value">' + esc(vip.preco) + "</span>" + (has(vip.periodo) ? '<span class="vip__period">' + esc(vip.periodo) + "</span>" : "") + "</p>" : "") +
              '<a class="btn btn--signal btn--lg vip__btn" href="' + esc(vipHref) + '" target="_blank" rel="noopener">' +
                (has(vip.linkPagamento) ? "" : icon("whatsapp") + " ") + esc(vip.botao || "Quero entrar") + "</a>" +
              '<p class="vip__note">' + (has(vip.linkPagamento) ? "Pagamento pelo link indicado." : "Você fala com a " + esc(responsavel) + " pelo WhatsApp e recebe as instruções de pagamento e acesso.") + "</p>" +
            "</div>" +
          "</article>";
      } else {
        $("#vip-slot").remove();
      }
      if (vip && !grupos.length) { grid.remove(); return; }
      if (grupos.length) {
        grid.className = "groups__grid groups__grid--" + grupos.length;
        grid.innerHTML = grupos.map(function (g) {
          return (
            '<article class="gate" data-reveal>' +
              (has(g.imagem) ? '<div class="gate__img"><img src="' + esc(g.imagem) + '" alt="" loading="lazy" width="1000" height="667"></div>' : "") +
              '<div class="gate__body">' +
                "<h3>" + esc(g.titulo) + "</h3>" +
                "<p>" + esc(g.descricao) + "</p>" +
                (has(g.acesso) ? '<p class="gate__note">' + icon("info") + esc(g.acesso) + "</p>" : "") +
                '<a class="btn btn--signal" href="' + esc(g.link) + '" target="_blank" rel="noopener">' +
                  "Entrar no grupo " + icon("arrow") +
                  '<span class="sr-only"> de ' + esc(g.titulo) + " (abre em nova aba)</span></a>" +
              "</div>" +
            "</article>"
          );
        }).join("");
        return;
      }
      var actions = "";
      if (waNumber) actions += '<a class="btn btn--signal" target="_blank" rel="noopener" href="' + esc(wa("Olá! Quero entrar nos grupos da " + nome + ".")) + '">' + icon("whatsapp") + " Perguntar pelo WhatsApp</a>";
      if (igUrl) actions += '<a class="btn ' + (waNumber ? "btn--ghost" : "btn--signal") + '" target="_blank" rel="noopener" href="' + esc(igUrl) + '">' + icon("instagram") + " Seguir @" + esc(igUser) + "</a>";
      grid.className = "groups__grid";
      grid.innerHTML =
        '<div class="empty empty--dark" data-reveal>' +
          '<span class="empty__icon">' + icon("users") + "</span>" +
          "<div><h3>Os links dos grupos ainda não foram publicados aqui.</h3>" +
          "<p>Os grupos reunirão oportunidades com milhas e passagens, promoções de viagens e vouchers de turismo." +
          (actions ? " Enquanto isso, acompanhe a " + esc(nome) + " pelos canais abaixo." : "") + "</p>" +
          (actions ? '<div class="empty__actions">' + actions + "</div>" : "") +
          "</div></div>";
    }

    /* ---------------- promoções ---------------- */
    function renderOffers() {
      var grid = $("#offers-grid");
      var filters = $("#filters");
      if (!ofertas.length) {
        filters.hidden = true;
        grid.className = "offers__grid";
        grid.innerHTML = emptyState(
          "search",
          "Nenhuma promoção publicada no momento.",
          "As ofertas aparecem aqui assim que a equipe cadastrar. Para não perder nenhuma, acompanhe os canais da " + esc(nome) + "."
        );
        return;
      }
      var cats = Object.keys(CAT_OFERTA).filter(function (k) {
        return ofertas.some(function (o) { return o.categoria === k; });
      });
      var btns = [{ k: "todas", label: "Todas", n: ofertas.length }].concat(cats.map(function (k) {
        return { k: k, label: CAT_OFERTA[k], n: ofertas.filter(function (o) { return o.categoria === k; }).length };
      }));
      filters.hidden = btns.length <= 2;
      filters.innerHTML = btns.map(function (b, i) {
        return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-filter="' + b.k + '">' +
          esc(b.label) + ' <span class="chip__n">' + b.n + "</span></button>";
      }).join("");
      filters.addEventListener("click", function (e) {
        var b = e.target.closest("[data-filter]");
        if (!b) return;
        $all("#filters .chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b); });
        draw(b.getAttribute("data-filter"));
      });
      grid.addEventListener("click", function (e) {
        var b = e.target.closest("[data-offer]");
        if (b) openOffer(b.getAttribute("data-offer"), b);
      });
      draw("todas");

      function draw(k) {
        var list = k === "todas" ? ofertas : ofertas.filter(function (o) { return o.categoria === k; });
        grid.className = "offers__grid";
        grid.innerHTML = list.map(passCard).join("");
        $("#offers-status").textContent = list.length + (list.length === 1 ? " oferta exibida" : " ofertas exibidas");
        grid.animate && grid.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 260, easing: "cubic-bezier(.16,1,.3,1)" });
      }
    }

    function passCard(o, i) {
      var idx = ofertas.indexOf(o);
      return (
        '<article class="pass">' +
          '<div class="pass__img">' +
            (has(o.imagem) ? '<img src="' + esc(o.imagem) + '" alt="" loading="lazy" width="1000" height="667">' : '<span class="pass__noimg">' + icon("plane") + "</span>") +
            '<span class="tag">' + esc(CAT_OFERTA[o.categoria] || "Oferta") + "</span>" +
          "</div>" +
          '<div class="pass__body">' +
            (has(o.origem)
              ? '<p class="pass__route"><span>' + esc(o.origem) + "</span>" + icon("plane", "pass__plane") + "<span>" + esc(o.titulo) + "</span></p>" +
                "<h3 class=\"sr-only\">" + esc(o.titulo) + "</h3>"
              : "<h3>" + esc(o.titulo) + "</h3>") +
            (has(o.periodo) ? '<p class="pass__meta">' + icon("calendar") + esc(o.periodo) + "</p>" : "") +
            (has(o.resumo) ? '<p class="pass__desc">' + esc(o.resumo) + "</p>" : "") +
          "</div>" +
          '<div class="pass__stub">' +
            (has(o.preco)
              ? '<p class="price"><span class="price__v">' + esc(o.preco) + "</span>" + (has(o.condicoes) ? '<span class="price__c">' + esc(o.condicoes) + "</span>" : "") + "</p>"
              : '<p class="price price--none">Valor sob consulta</p>') +
            '<button type="button" class="btn btn--navy" data-offer="' + idx + '">Ver detalhes<span class="sr-only"> de ' + esc(o.titulo) + "</span></button>" +
          "</div>" +
        "</article>"
      );
    }

    /* ---------------- detalhe (dialog) ---------------- */
    var sheet = $("#sheet");
    var lastTrigger = null;
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet || e.target.closest("[data-close]")) closeSheet();
    });
    sheet.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      if (lastTrigger) lastTrigger.focus();
    });
    function closeSheet() { sheet.close(); }

    function openOffer(idx, trigger) {
      var o = ofertas[+idx];
      if (!o) return;
      lastTrigger = trigger;
      var cat = CAT_OFERTA[o.categoria] || "Oferta";
      var msg = "Olá, " + nome + "! Tenho interesse na oferta \"" + o.titulo + "\"" +
        (has(o.origem) ? " saindo de " + o.origem : "") +
        (has(o.periodo) ? " (" + o.periodo + ")" : "") +
        " que vi no site. [" + cat + (has(o.id) ? " · " + o.id : "") + "]";
      var cta = waNumber
        ? '<a class="btn btn--wa btn--lg" target="_blank" rel="noopener" href="' + esc(wa(msg)) + '">' + icon("whatsapp") + " Consultar pelo WhatsApp</a>"
        : has(o.link)
          ? '<a class="btn btn--signal btn--lg" target="_blank" rel="noopener" href="' + esc(o.link) + '">Ir para o canal indicado ' + icon("arrow") + "</a>"
          : igUrl
            ? '<a class="btn btn--signal btn--lg" target="_blank" rel="noopener" href="' + esc(igUrl) + '">' + icon("instagram") + " Consultar pelo Instagram</a>"
            : "";
      var inclui = (o.inclui || []).filter(has);
      $("#sheet-content").innerHTML =
        '<button type="button" class="sheet__close" data-close aria-label="Fechar detalhes">' + icon("x") + "</button>" +
        (has(o.imagem) ? '<div class="sheet__img"><img src="' + esc(o.imagem) + '" alt=""></div>' : "") +
        '<div class="sheet__body">' +
          '<span class="tag tag--static">' + esc(cat) + "</span>" +
          '<h2 id="sheet-title">' + esc(o.titulo) + "</h2>" +
          '<dl class="facts">' +
            (has(o.origem) ? fact("plane", "Origem", o.origem) : "") +
            (has(o.periodo) ? fact("calendar", "Período", o.periodo) : "") +
            (has(o.validaAte) ? fact("clock", "Oferta válida até", formatDate(o.validaAte)) : "") +
          "</dl>" +
          (has(o.resumo) ? '<p class="sheet__lead">' + esc(o.resumo) + "</p>" : "") +
          (inclui.length ? "<h3>O que está incluído</h3><ul class=\"checks\">" + inclui.map(function (x) { return "<li>" + icon("check") + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
          (has(o.detalhes) ? "<h3>Detalhes</h3><p>" + esc(o.detalhes).replace(/\n/g, "<br>") + "</p>" : "") +
          '<div class="sheet__price">' +
            (has(o.preco) ? '<p class="price"><span class="price__v">' + esc(o.preco) + "</span>" + (has(o.condicoes) ? '<span class="price__c">' + esc(o.condicoes) + "</span>" : "") + "</p>" : '<p class="price price--none">Valor sob consulta</p>') +
            cta +
          "</div>" +
          '<p class="sheet__seller">' + icon("info") + "Atendimento e venda realizados pela " + esc(responsavel) + ". Valores e disponibilidade podem mudar até a confirmação.</p>" +
        "</div>";
      document.body.classList.add("no-scroll");
      sheet.showModal();
      sheet.querySelector(".sheet__inner").scrollTop = 0;
    }
    function fact(ic, k, v) {
      return '<div class="fact">' + icon(ic) + "<dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>";
    }
    function formatDate(iso) {
      var p = String(iso).split("-");
      return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
    }

    /* ---------------- vouchers ---------------- */
    function renderVouchers() {
      var box = $("#vouchers-list");
      if (!vouchers.length) {
        box.innerHTML = emptyState("ticket", "Nenhum voucher disponível no momento.",
          "Quando houver vouchers de hospedagem, passeios ou atrações, eles aparecerão aqui com validade, regras e forma de resgate.");
        return;
      }
      var cats = Object.keys(CAT_VOUCHER).filter(function (k) { return vouchers.some(function (v) { return v.categoria === k; }); });
      var semCat = vouchers.filter(function (v) { return !CAT_VOUCHER[v.categoria]; });
      var html = cats.map(function (k) {
        return group(CAT_VOUCHER[k], vouchers.filter(function (v) { return v.categoria === k; }));
      }).join("");
      if (semCat.length) html += group(cats.length ? "Outros" : "", semCat);
      box.innerHTML = html;

      function group(title, list) {
        return '<div class="vgroup">' + (title && (cats.length > 1 || semCat.length) ? "<h3 class=\"vgroup__title\">" + esc(title) + "</h3>" : "") +
          '<div class="vgroup__grid">' + list.map(coupon).join("") + "</div></div>";
      }
    }
    function coupon(v) {
      var msg = "Olá, " + nome + "! Quero saber mais sobre o voucher \"" + v.titulo + "\"" + (has(v.local) ? " em " + v.local : "") + " que vi no site." + (has(v.id) ? " [" + v.id + "]" : "");
      var cta = waNumber
        ? '<a class="btn btn--navy" target="_blank" rel="noopener" href="' + esc(wa(msg)) + '">Consultar voucher' + '<span class="sr-only"> ' + esc(v.titulo) + "</span></a>"
        : has(v.link)
          ? '<a class="btn btn--navy" target="_blank" rel="noopener" href="' + esc(v.link) + '">Consultar voucher</a>'
          : igUrl ? '<a class="btn btn--navy" target="_blank" rel="noopener" href="' + esc(igUrl) + '">Consultar voucher</a>' : "";
      function row(k, val) { return has(val) ? "<div><dt>" + k + "</dt><dd>" + esc(val) + "</dd></div>" : ""; }
      return (
        '<article class="coupon" data-reveal>' +
          '<div class="coupon__main">' +
            (has(v.imagem) ? '<div class="coupon__img"><img src="' + esc(v.imagem) + '" alt="" loading="lazy"></div>' : "") +
            '<div class="coupon__text">' +
              "<h4>" + esc(v.titulo) + "</h4>" +
              (has(v.beneficio) ? '<p class="coupon__benefit">' + esc(v.beneficio) + "</p>" : "") +
              (has(v.local) ? '<p class="coupon__place">' + icon("pin") + esc(v.local) + "</p>" : "") +
              '<dl class="coupon__rules">' +
                row("Validade", v.validade) +
                row("Reserva", v.reserva) +
                row("Restrições", v.restricoes) +
                row("Como resgatar", v.resgate) +
              "</dl>" +
            "</div>" +
          "</div>" +
          '<div class="coupon__stub">' +
            (has(v.valor) ? '<p class="coupon__value"><span>Valor</span>' + esc(v.valor) + "</p>" : "") +
            cta +
          "</div>" +
        "</article>"
      );
    }

    function emptyState(ic, title, text) {
      var actions = "";
      if (grupos.length) actions += '<a class="btn btn--navy" href="#grupos">Ver os grupos</a>';
      else if (waNumber) actions += '<a class="btn btn--navy" target="_blank" rel="noopener" href="' + esc(wa()) + '">' + icon("whatsapp") + " Falar no WhatsApp</a>";
      if (igUrl) actions += '<a class="btn btn--outline" target="_blank" rel="noopener" href="' + esc(igUrl) + '">' + icon("instagram") + " @" + esc(igUser) + "</a>";
      return '<div class="empty" data-reveal><span class="empty__icon">' + icon(ic) + "</span><div><h3>" + title + "</h3><p>" + text + "</p>" +
        (actions ? '<div class="empty__actions">' + actions + "</div>" : "") + "</div></div>";
    }

    /* ---------------- como funciona ---------------- */
    function renderHow() {
      var channel = waNumber ? "pelo WhatsApp" : igUrl ? "pelo Instagram" : "pelos canais indicados";
      $("[data-seller-text]").textContent =
        "Fale com a " + responsavel + " " + channel + " ou siga o canal de contratação indicado na oferta. " +
        "O atendimento e a venda são feitos pela " + responsavel + ".";
    }

    /* ---------------- FAQ ---------------- */
    function renderFaq() {
      var canais = [];
      if (waNumber) canais.push("pelo WhatsApp (botão verde no canto da tela)");
      if (igUrl) canais.push("pelo Instagram @" + igUser);
      if (has(contato.email)) canais.push("pelo e-mail " + contato.email);
      if (has(contato.telefone)) canais.push("pelo telefone " + contato.telefone);
      var canaisTxt = canais.length ? canais.join(", ").replace(/, ([^,]*)$/, " ou $1") : "";

      var vipTxt = vip
        ? " O " + (vip.titulo || "Grupo Exclusivo") + " custa " + vip.preco + (has(vip.periodo) ? " " + vip.periodo : "") +
          ": toque em \"" + (vip.botao || "Quero entrar") + "\" na seção Grupos" +
          (has(vip.linkPagamento) ? " e conclua o pagamento pelo link." : " e fale com a equipe pelo WhatsApp para receber as instruções de pagamento e o acesso.")
        : "";
      var gruposTxt = vip && !grupos.length ? vipTxt.slice(1) : grupos.length
        ? "Na seção Grupos, toque em \"Entrar no grupo\" no cartão do tema que preferir (" +
          grupos.map(function (g) { return g.titulo.toLowerCase(); }).join(", ") +
          "). O link abre o grupo no WhatsApp." +
          (grupos.some(function (g) { return has(g.acesso); }) ? " As condições de participação estão indicadas em cada cartão." : "")
        : "Os links dos grupos ainda não foram publicados nesta página." +
          (canaisTxt ? " Enquanto isso, fale com a equipe " + canaisTxt + "." : "");
      if (vip && grupos.length) gruposTxt += vipTxt;

      var itens = [
        ["Como faço para entrar nos grupos?", faqCfg.comoEntrar || gruposTxt],
        ["Quais oportunidades são divulgadas?", faqCfg.quaisOportunidades ||
          "Oportunidades com milhas e passagens aéreas, promoções de viagens (passagens, hospedagens, pacotes e passeios) e vouchers de turismo. As ofertas variam conforme a disponibilidade de cada momento."],
        ["Preciso ter milhas para aproveitar as ofertas?", faqCfg.precisaMilhas ||
          "Cada oferta informa como pode ser contratada. Quando envolver o uso de milhas, isso aparece nas condições da oferta. Em caso de dúvida, consulte a equipe antes de decidir."],
        ["Como consulto uma promoção?", faqCfg.comoConsultar ||
          ("Na seção Promoções, toque em \"Ver detalhes\" para ver datas, o que está incluído, valores e condições. " +
            (waNumber ? "Depois, use \"Consultar pelo WhatsApp\": a mensagem já vai com o nome da oferta escolhida." :
              canaisTxt ? "Depois, fale com a equipe " + canaisTxt + " informando o nome da oferta." : "Depois, siga o canal indicado na oferta."))],
        ["Como utilizo um voucher?", faqCfg.comoUsarVoucher ||
          "Cada voucher informa o local de utilização, a validade, se é preciso reservar, as restrições e as orientações de resgate. Siga essas orientações e, se tiver dúvidas, consulte a equipe antes da viagem."],
        ["Como falo com a equipe?", faqCfg.comoFalar ||
          (canaisTxt ? "Você pode falar com a " + responsavel + " " + canaisTxt + "." +
            (has(contato.horarioAtendimento) ? " Horário de atendimento: " + contato.horarioAtendimento + "." : "")
            : "Os canais de atendimento serão informados nesta página.")],
      ].concat((faqCfg.extras || []).filter(function (x) { return has(x.pergunta) && has(x.resposta); }).map(function (x) { return [x.pergunta, x.resposta]; }));

      $("#faq-list").innerHTML = itens.map(function (q, i) {
        return '<details class="qa"' + (i === 0 ? " open" : "") + "><summary><span>" + esc(q[0]) + '</span><span class="qa__sign" aria-hidden="true"></span></summary><div class="qa__a"><p>' + esc(q[1]) + "</p></div></details>";
      }).join("");
    }

    /* ---------------- contatos / rodapé ---------------- */
    function renderContacts() {
      var items = [];
      if (waNumber) items.push({ ic: "whatsapp", label: "WhatsApp", href: wa(), text: has(contato.telefone) ? contato.telefone : "Conversar agora", ext: true });
      if (igUrl) items.push({ ic: "instagram", label: "Instagram", href: igUrl, text: "@" + igUser, ext: true });
      if (has(contato.email)) items.push({ ic: "mail", label: "E-mail", href: "mailto:" + contato.email, text: contato.email });
      if (has(contato.telefone) && !waNumber) items.push({ ic: "phone", label: "Telefone", href: "tel:" + contato.telefone.replace(/[^\d+]/g, ""), text: contato.telefone });

      function li(c) {
        return '<li><a href="' + esc(c.href) + '"' + (c.ext ? ' target="_blank" rel="noopener"' : "") + ">" + icon(c.ic) +
          '<span><small>' + esc(c.label) + "</small>" + esc(c.text) + "</span></a></li>";
      }
      var cc = $("#closing-contacts");
      if (items.length) cc.innerHTML = items.map(li).join(""); else cc.remove();

      $("#footer-contact").innerHTML = items.length
        ? "<h3>Contato</h3><ul>" + items.map(li).join("") + "</ul>" + (has(contato.horarioAtendimento) ? '<p class="footer__hours">' + icon("clock") + esc(contato.horarioAtendimento) + "</p>" : "")
        : "";

      var legalBits = ["© " + new Date().getFullYear() + " " + esc(nome)];
      if (has(legal.razaoSocial)) legalBits.push(esc(legal.razaoSocial));
      if (has(legal.cnpj)) legalBits.push("CNPJ " + esc(legal.cnpj));
      var links = [];
      if (has(legal.politicaPrivacidade)) links.push('<a href="' + esc(legal.politicaPrivacidade) + '">Política de Privacidade</a>');
      if (has(legal.termosUso)) links.push('<a href="' + esc(legal.termosUso) + '">Termos de Uso</a>');
      $("#footer-legal").innerHTML = "<p>" + legalBits.join(" · ") + "</p>" + (links.length ? "<p>" + links.join("") + "</p>" : "");
    }

    /* ---------------- menu / header ---------------- */
    function setupMenu() {
      var btn = $("#menu-btn"), nav = $("#nav");
      function set(open) {
        btn.setAttribute("aria-expanded", open);
        nav.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
        btn.querySelector(".sr-only").textContent = open ? "Fechar menu" : "Abrir menu";
      }
      btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    }

    function setupHeader() {
      var bar = $(".topbar");
      var fl = $("#wa-float");
      function onScroll() {
        bar.classList.toggle("is-solid", window.scrollY > 24);
        fl.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.6);
      }
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      var links = $all('.nav a[href^="#"]:not(.btn)');
      if (!("IntersectionObserver" in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            var on = l.getAttribute("href") === "#" + en.target.id;
            l.classList.toggle("is-current", on);
            if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["grupos", "promocoes", "vouchers", "como-funciona", "contato"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    /* ---------------- painel split-flap ---------------- */
    function setupBoard() {
      var words = ["Milhas", "Passagens", "Hospedagens", "Pacotes", "Passeios", "Vouchers"];
      var el = $("#board-flaps");
      var width = words.reduce(function (m, w) { return Math.max(m, w.length); }, 0);
      var cells = [];
      for (var i = 0; i < width; i++) {
        var c = document.createElement("span");
        c.className = "flap";
        el.appendChild(c);
        cells.push(c);
      }
      function paint(w) {
        var up = w.toUpperCase();
        cells.forEach(function (c, i) { c.textContent = up[i] || ""; c.classList.toggle("flap--blank", !up[i]); });
      }
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var n = 0;
      paint(words[0]);
      if (reduce) return;
      var ABC = "ABCDEFGHIJKLMNOPRSTUV";
      setInterval(function () {
        if (document.hidden) return;
        n = (n + 1) % words.length;
        var target = words[n].toUpperCase();
        cells.forEach(function (c, i) {
          var steps = 2 + Math.floor(Math.random() * 3) + i % 3;
          var k = 0;
          (function tick() {
            c.classList.remove("flap--flip");
            void c.offsetWidth;
            c.classList.add("flap--flip");
            if (k < steps) {
              c.textContent = ABC[Math.floor(Math.random() * ABC.length)];
              c.classList.remove("flap--blank");
              k++;
              setTimeout(tick, 70);
            } else {
              c.textContent = target[i] || "";
              c.classList.toggle("flap--blank", !target[i]);
            }
          })();
        });
      }, 2800);
    }

    /* ---------------- reveal ---------------- */
    function setupReveal() {
      if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.documentElement.classList.add("can-reveal");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      $all("[data-reveal], .section-head, .route__stop, .qa").forEach(function (el, i) {
        el.style.setProperty("--d", (i % 3) * 70 + "ms");
        io.observe(el);
      });
    }
  }
})();
