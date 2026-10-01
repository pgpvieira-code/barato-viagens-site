# Site Barato Viagens

Landing page estática (HTML, CSS e JavaScript), sem build.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `config.js` | **Único arquivo a editar.** Logo, cores, WhatsApp, Instagram, links dos grupos, promoções, vouchers, FAQ e dados legais. |
| `index.html` | Estrutura e textos fixos da página. |
| `styles.css` | Visual. |
| `app.js` | Monta a página a partir do `config.js`. Não precisa editar. |
| `exemplo.js` | Dados fictícios, usados só em `index.html?exemplo=1`. |
| `assets/img/` | Fotos otimizadas (WebP). |

## Como funciona a adaptação automática

- Grupo sem `link` não aparece. Sem nenhum grupo, a seção mostra um aviso e leva ao WhatsApp/Instagram, se existirem.
- O botão "Entrar nos grupos" vira "Falar no WhatsApp" ou "Seguir no Instagram" quando não há grupos. Sem nenhum canal, o botão some.
- Sem número de WhatsApp: o botão flutuante e o "Consultar pelo WhatsApp" somem.
- Sem promoções/vouchers: aparece um estado vazio convidando a acompanhar os canais.
- Filtros mostram só as categorias que têm ofertas.
- Promoção com `validaAte` vencida sai do site automaticamente.
- Razão social, CNPJ, Política de Privacidade e Termos de Uso só aparecem se preenchidos.

## Ver localmente

Abra `index.html` no navegador, ou rode na pasta `site/`:

```
python3 -m http.server 8765
```

e acesse http://localhost:8765 (ou http://localhost:8765/?exemplo=1 para ver com dados de exemplo).

## Publicar

Envie **somente a pasta `site/`** para a hospedagem (Netlify, Vercel, Hostinger, GitHub Pages etc.).
Não publique a pasta-mãe `BARATO VIAGENS`: ela contém documentos pessoais e da empresa.

## Créditos das fotos

Fotos do Unsplash (licença Unsplash), convertidas para WebP:

- hero-rio: photo-1483729558449-99ef09a8c325
- milhas: photo-1436491865332-7a61a109cc05
- promocoes: photo-1506929562872-bb421503ef21
- vouchers: photo-1530789253388-582c481c54b0
- cta-praia: photo-1507525428034-b723cf961d3e
- como-funciona: photo-1488646953014-85cb44e25828
- exemplo-maldivas: photo-1512100356356-de1b84283e18
- exemplo-hotel: photo-1566073771259-6a8506099945
- exemplo-paris: photo-1502602898657-3e91760cbb34
- exemplo-mergulho: photo-1544551763-46a013bb70d5
- exemplo-resort: photo-1540541338287-41700207dee6

(URL: `https://unsplash.com/photos/<id>` ou `https://images.unsplash.com/photo-<id>`)
