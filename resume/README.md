# Currículo

Fonte LaTeX dos currículos baixados pelo site.

| Arquivo | Versão | PDF publicado |
|---|---|---|
| `resume-pt.tex` | Português (BR) | `static/dalton-gomes-curriculo-pt.pdf` |
| `resume-en.tex` | English | `static/dalton-gomes-resume-en.pdf` |

## Gerar

```bash
./resume/build.sh               # compila os dois e copia os PDFs para static/
./resume/build.sh resume-pt     # só um
./resume/build.sh --no-publish  # compila sem tocar em static/
```

Usa `pdflatex` local ou, se não houver, a imagem Docker `texlive/texlive`.
Os PDFs gerados aqui dentro são ignorados pelo git; só os de `static/` são versionados.

## Não mexer

- `\input{glyphtounicode}` e `\pdfgentounicode=1` no preâmbulo: sem eles o texto extraído
  pelo ATS perde as ligaduras (`eficiente` vira `eciente`).
- Compilar sempre com **pdflatex** (não xelatex/lualatex).
- Nomes das seções e cabeçalho em texto puro, para a extração sair em ordem.
