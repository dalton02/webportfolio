# Currículo

Fonte LaTeX e PDFs dos currículos baixados pelo site. Os links do site importam os PDFs
daqui (`src/lib/utils/resume.ts`), e o Vite os copia para o build.

| Arquivo | Versão |
|---|---|
| `resume-pt.tex` → `resume-pt.pdf` | Português (BR) |
| `resume-en.tex` → `resume-en.pdf` | English |

## Gerar

```bash
./resume/build.sh               # compila os dois
./resume/build.sh resume-pt     # só um
```

Usa `pdflatex` local ou, se não houver, a imagem Docker `texlive/texlive`.
O CI do Pages não roda LaTeX: depois de editar um `.tex`, rode o script e **commite o PDF**.

## Não mexer

- `\input{glyphtounicode}` e `\pdfgentounicode=1` no preâmbulo: sem eles o texto extraído
  pelo ATS perde as ligaduras (`eficiente` vira `eciente`).
- Compilar sempre com **pdflatex** (não xelatex/lualatex).
- Nomes das seções e cabeçalho em texto puro, para a extração sair em ordem.
