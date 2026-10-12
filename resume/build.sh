#!/usr/bin/env bash
#
# Gera resume-en.pdf e resume-pt.pdf e copia os PDFs para ../static/, de onde
# o site os serve para download (nomes definidos em src/lib/json/ui.json).
#
# Usa o pdflatex local se existir; caso contrário, cai para uma imagem Docker
# do TeX Live. Se nenhum dos dois estiver disponível, avisa e mostra como instalar.
#
# Uso:
#   ./build.sh                # compila os dois
#   ./build.sh resume-pt      # compila apenas um
#   ./build.sh --docker       # força o uso do Docker
#   ./build.sh --keep-aux     # mantém .aux/.log/.out para depurar
#   ./build.sh --no-publish   # não copia os PDFs para ../static/
#
set -euo pipefail

cd "$(dirname "$0")"

DOCKER_IMAGE="texlive/texlive:latest"
KEEP_AUX=0
FORCE_DOCKER=0
PUBLISH=1
DOCS=()

# Nome do PDF publicado em ../static/ para cada documento.
declare -A STATIC_NAME=(
  [resume-pt]="dalton-gomes-curriculo-pt.pdf"
  [resume-en]="dalton-gomes-resume-en.pdf"
)

# ---------------------------------------------------------------- argumentos --
while [[ $# -gt 0 ]]; do
  case "$1" in
    --docker)   FORCE_DOCKER=1 ;;
    --keep-aux) KEEP_AUX=1 ;;
    --no-publish) PUBLISH=0 ;;
    -h|--help)  sed -n '3,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*)         echo "Opção desconhecida: $1" >&2; exit 2 ;;
    *)          DOCS+=("${1%.tex}") ;;
  esac
  shift
done
[[ ${#DOCS[@]} -eq 0 ]] && DOCS=(resume-en resume-pt)

# ------------------------------------------------------------------- engine ---
# pdflatex é obrigatório: o template depende de \pdfgentounicode, que é uma
# primitiva do pdfTeX. xelatex/lualatex não têm esse comando e vão falhar.
if [[ $FORCE_DOCKER -eq 0 ]] && command -v pdflatex >/dev/null 2>&1; then
  ENGINE="local"
elif command -v docker >/dev/null 2>&1; then
  ENGINE="docker"
else
  cat >&2 <<'EOF'
Nenhum compilador LaTeX encontrado.

Escolha uma opção:

  1. Instalar o TeX Live local (Arch):
       sudo pacman -S texlive-basic texlive-latex texlive-latexrecommended \
                      texlive-langportuguese texlive-binextra

  2. Instalar o Docker e rodar de novo (o script detecta sozinho):
       sudo pacman -S docker && sudo systemctl enable --now docker
       sudo usermod -aG docker "$USER"   # e reabra a sessão

  3. Compilar no Overleaf, sem instalar nada: overleaf.com -> New Project ->
     Upload Project -> envie o .tex -> Menu -> Compiler -> pdfLaTeX
EOF
  exit 1
fi

run_pdflatex() {
  local doc="$1"
  if [[ "$ENGINE" == "local" ]]; then
    pdflatex -interaction=nonstopmode -halt-on-error "$doc.tex"
  else
    docker run --rm \
      --user "$(id -u):$(id -g)" \
      -v "$PWD:/work" -w /work \
      "$DOCKER_IMAGE" \
      pdflatex -interaction=nonstopmode -halt-on-error "$doc.tex"
  fi
}

# ------------------------------------------------------- checagem de extração --
# O ponto central deste template é o PDF render texto extraível por ATS.
# Se o pdftotext existir, conferimos isso automaticamente.
check_extraction() {
  local doc="$1"
  command -v pdftotext >/dev/null 2>&1 || return 0

  local txt words
  txt="$(pdftotext -layout "$doc.pdf" - 2>/dev/null || true)"
  words=$(printf '%s' "$txt" | wc -w)

  if [[ "$words" -lt 200 ]]; then
    echo "   AVISO: só $words palavras extraídas. O PDF pode estar sem camada de texto."
    return 0
  fi
  echo "   $words palavras extraíveis."

  # Ligaduras sem mapeamento Unicode: o modo de falha que o \pdfgentounicode evita.
  if printf '%s' "$txt" | grep -qP '[\x{FB00}-\x{FB06}]' 2>/dev/null; then
    echo "   AVISO: ligaduras Unicode brutas no texto extraído."
    echo "          Confira se \\input{glyphtounicode} e \\pdfgentounicode=1 estão no preâmbulo."
  fi

  # Sinal positivo: uma sequência 'fi' precisa sobreviver como duas letras.
  if printf '%s' "$txt" | grep -q 'fi'; then
    echo "   Ligaduras OK (sequência 'fi' extraída como texto normal)."
  fi

  # No arquivo PT, acentos precisam sair como caracteres reais.
  if [[ "$doc" == *-pt ]] && ! printf '%s' "$txt" | grep -q '[áâãçéêíóôõú]'; then
    echo "   AVISO: nenhum acento encontrado no texto extraído do PDF em português."
  fi
}

# --------------------------------------------------------------------- build --
echo "Compilando com: $ENGINE"
[[ "$ENGINE" == "docker" ]] && echo "Imagem: $DOCKER_IMAGE (o primeiro download é grande)"
echo

failed=()
for doc in "${DOCS[@]}"; do
  if [[ ! -f "$doc.tex" ]]; then
    echo "$doc.tex não existe, pulando." >&2
    failed+=("$doc")
    continue
  fi

  echo "-> $doc.tex"
  # Duas passadas: a segunda estabiliza o layout depois que o .aux existe.
  if ! run_pdflatex "$doc" >"$doc.build.log" 2>&1 || \
     ! run_pdflatex "$doc" >"$doc.build.log" 2>&1; then
    echo "   FALHOU. Últimos erros:"
    grep -A3 -m5 '^!' "$doc.build.log" | sed 's/^/     /' || tail -20 "$doc.build.log" | sed 's/^/     /'
    echo "   Log completo: $doc.build.log"
    failed+=("$doc")
    continue
  fi

  pages=$(grep -oP 'Output written on .*\(\K[0-9]+' "$doc.build.log" | tail -1 || true)
  echo "   OK: $doc.pdf (${pages:-?} página(s))"
  check_extraction "$doc"

  if [[ $PUBLISH -eq 1 && -n "${STATIC_NAME[$doc]:-}" ]]; then
    cp "$doc.pdf" "../static/${STATIC_NAME[$doc]}"
    echo "   Publicado em static/${STATIC_NAME[$doc]}"
  fi

  if [[ $KEEP_AUX -eq 0 ]]; then
    rm -f "$doc.aux" "$doc.log" "$doc.out" "$doc.build.log"
  fi
  echo
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "Falhas: ${failed[*]}" >&2
  exit 1
fi
echo "Pronto."
