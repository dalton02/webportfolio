# Pináculo Digital: Repositório Base da equipe de Front-end (versão 0.7.5)

## Introdução

### Objetivo deste Repositório

Este repositório serve de base para auxiliar na criação de novos projetos. Ele contém componentes de referência e funções padronizadas que auxiliam no desenvolvimento de projetos.

Este projeto visa reduzir o tempo de instalação inicial de um projeto e a criação de componentes básicos. Ao criar componentes específicos para o projeto, as bases deste repositório devem ser excluídas, mantendo-se apenas os componentes finais desenvolvidos para o projeto em questão.

> **Exemplo:** O componente `BasicButton.svelte` é a base de qualquer botão que venha a ser desenvolvido para a aplicação. Ao final do projeto, quando todos os botões da aplicação estiverem criados, o `BasicButton.svelte` deve ser excluído.

### Instalação do Repositório Base

Após aceitar o convite para participar de um novo repositório de projeto, verifique se esse repositório já possui uma versão deste projeto base instalada. Caso não possua vá até a página deste  repositório no github e busque o botão `Use this template`. ste botão abre a opção de criar um novo repositório usando este projeto como base. A partir daí todo o restante da configuração inicial do repositório segue o fluxo comum do github.

### Lista de bibliotecas pré instaladas

**@stripe/stripe-js:** Biblioteca oficial do Stripe para integrar pagamentos com o Stripe em aplicações JavaScript. Ela é usada para conectar a aplicação frontend com a API do Stripe, gerenciando tokens de pagamento e elementos de pagamento seguro.

**@sveltejs/adapter-auto:** Um adaptador para SvelteKit que escolhe automaticamente o melhor ambiente de execução para a sua aplicação (como Node.js, Vercel, Netlify, etc.). Ele facilita o processo de deploy ao detectar o ambiente e configurar a aplicação adequadamente.

**@sveltejs/kit:** O SvelteKit é o framework completo para desenvolver aplicações full-stack com Svelte. Ele oferece roteamento, renderização no servidor, gerenciamento de estados, e outras funcionalidades que permitem criar aplicações modernas e otimizadas.

**@sveltejs/vite-plugin-svelte:** Plugin oficial do Svelte para o Vite, que permite que projetos Svelte sejam construídos e otimizados usando o Vite. O Vite é uma ferramenta de desenvolvimento rápida e leve que otimiza o processo de build e hot-reload durante o desenvolvimento.

**@tsconfig/svelte:** Configuração de TypeScript para projetos Svelte. Esse pacote contém uma configuração otimizada para usar TypeScript com Svelte, facilitando a integração entre ambos.

- **@types/node:** Tipos TypeScript para a API do Node.js, permitindo que o TypeScript entenda as funcionalidades do Node.js em um ambiente tipado. Essencial para projetos que utilizam Node.js e TypeScript.

- **@zerodevx/svelte-toast:** Um pacote de notificações (toasts) para Svelte. Ele permite que você crie notificações temporárias e configuráveis na interface da aplicação de forma simples e reativa.

- **autoprefixer@:** Uma ferramenta de pós-processamento CSS que adiciona prefixos de fornecedor automaticamente (como `-webkit-`, `-moz-`, etc.), garantindo que seu CSS seja compatível com uma ampla gama de navegadores.

- **axios:** Uma biblioteca popular para fazer requisições HTTP. É usada para fazer chamadas a APIs de forma simples, gerenciando promessas, erros e cabeçalhos de forma eficiente.

- **crypto-js:** Biblioteca de criptografia em JavaScript. É usada para criptografar e descriptografar dados, útil para manter informações sensíveis protegidas, como senhas ou dados de pagamento.

- **date-fns:** Uma biblioteca para manipulação de datas em JavaScript. Ela oferece uma ampla variedade de funções para lidar com formatação, cálculos e manipulação de datas.

- **papaparse:** Um parser rápido de CSV para JavaScript. Ele é usado para analisar e manipular arquivos CSV, permitindo a conversão de arquivos CSV em objetos JavaScript e vice-versa.

- **postcss:** Ferramenta para transformar CSS usando plugins. Ele permite adicionar funcionalidades como minificação, suporte a variáveis, e outras otimizações ao seu CSS.

- **svelte-check:** Uma ferramenta de verificação para Svelte que verifica erros de compilação e problemas com TypeScript no seu projeto, garantindo que o código esteja funcionando corretamente.

- **svelte-preprocess:** Um pacote que permite o uso de preprocessadores como TypeScript, SCSS, PostCSS, etc., dentro dos componentes Svelte. Isso facilita o uso de linguagens e ferramentas modernas diretamente no Svelte.

- **svelte:** O framework Svelte, uma biblioteca JavaScript reativa que permite criar interfaces de usuário de forma eficiente e performática, com compilação de componentes para JavaScript puro, sem runtime adicional.

- **tailwindcss:** Um framework CSS utilitário que facilita a estilização de componentes usando classes predefinidas. Tailwind oferece uma abordagem rápida e flexível para aplicar estilos em sua interface sem escrever CSS customizado extensivamente.

- **typescript:** TypeScript é uma linguagem de programação que estende o JavaScript com tipagem estática. Ele permite o uso de tipos, ajudando a evitar erros de runtime e melhorando o desenvolvimento com ferramentas de verificação de tipos.

- **vite:** Uma ferramenta de build e desenvolvimento que é rápida e otimizada para front-end moderno. Ele usa um servidor de desenvolvimento baseado em ES Modules, o que proporciona recarregamento rápido e builds otimizados para produção.

### Práticas Recomendadas

- **Uso de objetos como parâmetro:** É fortemente recomendado que os componentes recebam objetos como parâmetro para manter o código o mais limpo possível.
  
  > **Exemplo:** O componente `BasicButton` recebe como parâmetro o tipo personalizado `basicButton`, que consiste em uma label e uma função de clique. Ao passar o parâmetro dessa forma, o código fica mais limpo e facilita a gestão de possíveis erros de tipagem ao criar parâmetros para múltiplos botões.

- **Evite declarar funções diretamente no HTML:** Em vez de declarar funções diretamente nas tags HTML, crie funções separadas para melhorar a legibilidade e a organização do código. Exemplo:

  ```html
  <!-- Não recomendado -->
  <button on:click={() => var = !var}>

  <!-- Recomendado -->
  <button on:click={toggleVar}>
    ```

- **Uso de `consoleDev` para ambientes de desenvolvimento e produção:** No lugar de utilizar `console.log` diretamente, que pode vazar informações sensíveis em ambiente de produção, utilize uma função personalizada como `consoleDev`, que verifica o ambiente em que a aplicação está rodando. Se o ambiente for de desenvolvimento, ele permitirá a exibição de logs no console. Caso contrário, em produção, o log será suprimido.

- **Commits:** Realize um commit na sua branch sempre que concluir uma tarefa. Isso ajuda a manter o histórico de desenvolvimento atualizado e facilita a recuperação de versões anteriores, caso necessário.


### Uso de branchs

Cada desenvolvedor deve trabalhar em uma branch própria, e há três branches principais responsáveis pelos diferentes ambientes de desenvolvimento, homologação e produção.

1. **Branches Principais**

- **dev:** A branch `dev` é o ponto central de desenvolvimento. Ela contém a versão estável mais recente do código em que todos os desenvolvedores estão colaborando. Todos os commits devem ser integrados aqui antes de serem enviados para homologação. As branches individuais de cada desenvolvedor devem ser regularmente mescladas com a branch `dev` após revisão e aprovação de Pull Requests.

- **main:** A branch `main` é usada para alimentar o ambiente de homologação, onde as funcionalidades implementadas são testadas antes de irem para produção. Contém o código que passou pelos testes de desenvolvimento e está pronto para ser validado no ambiente de homologação. Após testes na branch `dev`, o código estável é mesclado com a branch `main` para homologação.

- **prod:** A branch `prod` é a branch final de produção, onde o código que foi completamente testado e aprovado é lançado ao ambiente de produção. Alimenta o ambiente de produção e deve sempre conter a versão mais estável e lançada do sistema. Apenas o código que foi validado em `main` e está pronto para ser publicado é mesclado com a branch `prod`.

2. **Branches de Desenvolvedores**

Cada desenvolvedor deve ter sua própria branch nomeada de acordo com o seu nome, seguindo o formato `dev-nome-dev`. Exemplo:

  ```bash
  dev-fulano
  ```

O fluxo de trabalho para os desenvolvedores, após criar sua branch é o seguinte:

* Desenvolva novas funcionalidades ou correções diretamente na sua branch pessoal.

* Realize commits após realizar uma tarefa, garantindo que o histórico do Git seja limpo e fácil de acompanhar.

* Faça pull requests da sua branch pessoal para a branch dev assim que a funcionalidade estiver pronta para revisão.

### Passos Iniciais

1. **Crie sua branch e publique-a:** Ao iniciar uma nova tarefa ou funcionalidade, crie uma nova branch a partir da `main`. Nomeie a branch de forma clara e descritiva, utilizando o padrão de nomenclatura definido pela equipe.

2. **Instale as dependências:** Antes de iniciar o desenvolvimento, certifique-se de que todas as dependências necessárias estão instaladas. Utilize o comando a seguir no seu `terminal` para instalar as dependências:

    ```bash
    npm install
    ```

3. **Configuração de variáveis de ambiente:** Copie o arquivo `.env.example` e renomeie-o para `.env`. Configure as variáveis de ambiente conforme necessário para o ambiente de desenvolvimento local. Assegure-se de não versionar o arquivo `.env`, pois ele pode conter informações sensíveis.

4. **Design System:** Caso a tarefa de confgurar o design system lhe seja atribuída, baixe e instale o design system fornecido pela equipe de design, geralmente disponível no Figma. Certifique-se de seguir as diretrizes de estilo e componentes fornecidos pela equipe de design para manter a consistência visual do projeto.

5. **Execução do Projeto:** Com as dependências instaladas e o design system configurado, execute o projeto localmente para garantir que o ambiente esteja funcionando corretamente. Utilize o comando:

    ```bash
    npm run dev
    ```

6. **Documentação:** Leia a documentação do projeto e siga as diretrizes estabelecidas. Mantenha o código bem documentado, principalmente ao criar novos componentes ou funcionalidades. Isso facilita o entendimento do projeto para outros membros da equipe e futuros desenvolvedores.

### Boas Práticas de Desenvolvimento

- **Componentização e reutilização:** Sempre que possível, quebre funcionalidades grandes em componentes menores e reutilizáveis. Isso facilita a manutenção e permite a modularidade no código.

- **Clean Code:** Siga os princípios de código limpo, como utilizar nomes descritivos para variáveis e funções, evitar duplicação de código e garantir que cada função ou componente tenha uma única responsabilidade.

## Detalhamento do Repositório

### Estrutura de pastas

Este projeto foi criado a partir de um `skeleton project` do svelte e ele possui validação de `TypeScript`, além de outros módulos e bibliotecas integrados a ele.

As pastas principais(*as que contêm a marcação (?) são pasta opcionais*) e suas funções são:
```txt
./
├──src/
│  ├── components/
│  ├── lib/
│  ├── routes/
│  ├── app.css
│  └── app.html
└──static/
   ├── fonts/(?)
   ├── icons/
   ├── images/
   ├── midias/(?)
   ├── src/
   ├── manifest.json(?)
   ├── service-worker.js(?)
   ├── sitemap.xsl(?)
   └── sitemap.xslt(?)
```

**Pasta src**

A pasta `src` é o núcleo de um projeto Svelte. Ela contém todo o código-fonte do projeto, como componentes, bibliotecas, estilos e arquivos de roteamento. Aqui está um detalhamento da estrutura da pasta e de suas principais subpastas:

- **/components:**  A pasta `components` é onde são armazenados todos os componentes reutilizáveis da aplicação. Cada componente pode representar uma parte da interface de usuário (UI), como botões, formulários, modais, etc.
Os componentes são organizados em arquivos `.svelte`, onde estão definidos tanto a estrutura HTML, como o estilo CSS e a lógica JavaScript/TypeScript.
> **Exemplo de Componentes Comuns:**
**`Button.svelte`** – Um componente reutilizável para botões, que pode ser usado em diversas partes da aplicação.
**`Navbar.svelte`** – Um componente que implementa a barra de navegação global.
**`Modal.svelte`** – Um componente para exibir conteúdo modal (pop-up).

- **/lib:** A pasta `lib` contém bibliotecas utilitárias e funções reutilizáveis que podem ser importadas em várias partes do projeto. Aqui, você pode armazenar funções que lidam com manipulação de dados, validações, lógica de negócios, ou até mesmo wrappers para APIs.
Geralmente, as funções são separadas em arquivos de acordo com suas responsabilidades. Mais sobre o conteúdo desta pasta será abordado mais adiante.
> **Exemplos de Funções:**
**`formatDate.ts`** – Função para formatar datas.
**`api.ts`** – Um arquivo que contém funções para fazer requisições HTTP para APIs.
**`validateForm.ts`** – Função que verifica a validade de formulários.

- **/routes:** A pasta `routes` contém os arquivos de roteamento da aplicação. No SvelteKit, a estrutura de pastas dentro de `routes` define as URLs da aplicação. Cada arquivo `.svelte` dentro dessa pasta representa uma rota que pode ser acessada diretamente.
Os arquivos dentro de `routes` podem ser organizados por página ou por categorias. Arquivos `.svelte` diretamente na pasta `routes/` representam rotas de nível superior (sempre como arquivos `+page.svelte` ou `+layout.svelte`), enquanto subpastas criam rotas aninhadas (como `/dashboard` ou `/sobre`).
**Rotas Dinâmicas:** Pastas ou arquivos que iniciam com `[param]` são usados para rotas dinâmicas, onde `param` pode ser substituído por um valor específico (ex: `/user/[id]` para uma página de perfil de usuário).

- **app.css:** Este aruivo serve para a declaraça o do `Tailwind` a nível  global e é importado no `+layout.svelte` na raíz da pasta `routes/. Sua confiiguração é:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- **app.html:** O arquivo `app.html` é a estrutura HTML base que define o ponto de entrada de um projeto Svelte. Ele é responsável por fornecer o esqueleto HTML no qual o Svelte irá renderizar o conteúdo da aplicação. Ele serve como o modelo de layout básico para toda a aplicação e, geralmente, contém o container onde o conteúdo do Svelte será injetado dinamicamente.
Em um projeto SvelteKit, o `app.html` é gerado automaticamente e não precisa ser modificado com frequência, mas ele pode ser customizado em algumas situações.
**O que o app.html pode receber:**

##### 1.Customização de metadados

Você pode adicionar metatags adicionais para melhorar o SEO (Search Engine Optimization) e a acessibilidade da aplicação, além de ajustar a configuração de cache.
```html
<meta name="description" content="Descrição da aplicação" />
<meta name="author" content="Nome do Autor" />
<meta name="keywords" content="Svelte, Aplicação, SEO" />
<meta http-equiv="Cache-Control" content="no-cache" />
```

##### 2.Estilos globais e fontes

Links para arquivos CSS globais ou fontes personalizadas podem ser incluídos dentro do `<head>`. Isso é útil para fornecer estilos universais para toda a aplicação.
```html
<link rel="stylesheet" href="/styles.css" />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
```

##### 3.Favicons e ícones

Adicione favicons ou ícones para dispositivos móveis:
```html
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

##### 4.Scripts externos ou adicionais

Caso você precise incluir bibliotecas JavaScript externas, elas podem ser adicionadas ao arquivo `app.html`. Certifique-se de adicionar bibliotecas externas no final do `<body>` para garantir que a página seja carregada antes que os scripts sejam executados.
```html
<!-- Script de biblioteca externa -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

##### 5.Analytics e monitoramento

Se você deseja monitorar o tráfego da aplicação com ferramentas como Google Analytics ou outros serviços de monitoramento, você pode incluir os scripts de integração diretamente no arquivo `app.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXX-Y');
</script>
```

##### 6.Idiomas e acessibilidade

O atributo lang na tag <html> define o idioma padrão da página. Certifique-se de ajustá-lo ao idioma da aplicação:
```html
<html lang="pt-br">
```

##### 7.Manifesto e PWA

Se sua aplicação for um PWA, você pode incluir o manifesto da web e links relacionados no arquivo app.html para configurar o comportamento do aplicativo em dispositivos móveis.
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#ffffff" />
```

##### Resumo do app.html

O arquivo app.html em um projeto Svelte é a base estrutural para a aplicação. Ele serve como um esqueleto onde o conteúdo dinâmico gerado pelo Svelte será injetado. Este arquivo pode ser customizado com metadados, links para fontes externas, scripts, favicons, e outras configurações essenciais para SEO, acessibilidade e responsividade. A organização do app.html influencia diretamente o carregamento da página e a experiência do usuário, tornando-o um ponto importante de personalização em um projeto Svelte.

**Pasta static**

A pasta `static` armazena todos os arquivos estáticos que não são processados diretamente pelo Svelte, mas que podem ser acessados diretamente pelos navegadores. Esses arquivos incluem imagens, ícones, fontes, e outros recursos que não precisam de processamento dinâmico. O conteúdo desta pasta é servido como estático no ambiente de produção.

- **/fonts:** *Caso a fonte do projeto seja injetada diretamente no `app.html` na pasta `src`, não há necessidade da criação desta pasta.* A pasta `fonts` contém fontes personalizadas que podem ser utilizadas pela aplicação. Isso inclui arquivos de fontes como `.woff`, `.woff2`, `.ttf`, ou `.otf`, que podem ser carregados diretamente no navegador.

> **Fontes Comuns:**
  **Custom Font:** Fontes personalizadas que não estão disponíveis por padrão nos navegadores, e que são essenciais para o branding ou o estilo visual do projeto.
  **Web Fonts:** Fontes otimizadas para a web, como `.woff`, `.woff2` `ttf` e `otf`, que são comumente usadas para garantir tempos de carregamento mais rápidos.


- **/icons:** A pasta `icons` contém ícones usados na aplicação, como logotipos, favicons e outros ícones gráficos para botões e navegação. Esses ícones são frequentemente pequenos em tamanho e devem estar no formato `.svg`.

> **Ícones Comuns:**
**Favicon:** Um pequeno ícone exibido na aba do navegador ao lado do título da página.
**Logotipo:** A imagem do logotipo da marca ou aplicação.
**Ícones UI:** Ícones para elementos da interface do usuário, como botões de ação, navegação ou ícones de status.

- **/images:** A pasta `images` contém as imagens utilizadas no site ou na aplicação. Essas imagens podem ser banners, fotos, gráficos ou qualquer outro tipo de imagem não vetorial que precise ser carregada de forma estática. As imagens armazenadas nesta pasta devem estar em `webp`.

> **Imagens Comuns:**
**Banners:** Imagens grandes usadas em cabeçalhos de páginas ou seções principais.
**Imagens de Produtos:** Se for um e-commerce, essa pasta pode conter fotos dos produtos.
**Fotos de Background:** Imagens usadas como fundos visuais para várias seções.

- **/midias:** Esta pasta contêm eventuais aruqivos de mídia, como áudios e vídeos, não há um padrão de formato para os aruqivos armazenados nesta pasta. *Caso não hajam arquivos do mídia não é necessário criar esta pasta.*

- **/src:** A pasta `src` dentro da pasta `static` é um local onde podem ser armazenados arquivos de código fonte ou bibliotecas que precisam ser carregados diretamente no navegador, como arquivos de bibliotecas CSS. Essa pasta pode ser usada para hospedar fontes externas ou scripts que não são processados diretamente pelo Svelte.

> **Arquivos Comuns:**
**Arquivos CSS:** Estilos CSS que são importados diretamente no HTML ou carregados de forma estática.

#### Módulos opcionais da pasta /static

A pasta `/static` possui quatro arquivos que são opcionais dependendo do tipo do projeto.
 - **Se o projeto for um PWA:** Nesse caso o projeto deve conter os arquivos `manifest.json` e `service-worker.js` esses arquivos devem ser referênciados no `+layout.svelte` que fica na raíz da pasta `/routes`.
 - **Se o projeto tiver site map contratato:** Se houver a contrataça o de site map para o projeto devem ser adicionados os arquivos `sitemap.xsl` e `sitemap.xslt` para fazer o roteamento e a exibição do sitemap do projeto.

Abaixo segue uma descrição de cada arquivo opcional:

- **manifest.json:** O arquivo manifest.json é usado em aplicativos web progressivos (PWA) para definir as informações básicas do aplicativo, como nome, ícones e cor de fundo. Ele ajuda a controlar como o aplicativo é exibido ao ser instalado em um dispositivo.

> - **Principais campos:**
**name**: Nome completo do aplicativo.
**short_name**: Nome curto, usado quando há limitação de espaço.
**start_url**: URL que será carregada ao iniciar o aplicativo.
**display**: Define como o app será exibido. Opções: `fullscreen`, `standalone`, `minimal-ui`, `browser`.
**background_color**: Cor de fundo da tela de carregamento inicial.
**theme_color**: Cor da barra de navegação e de outros elementos do navegador.
**icons**: Lista de ícones usados para representar o aplicativo em diferentes tamanhos.

- **service-worker.js:** O arquivo `service-worker.js` é responsável por gerenciar o cache e habilitar funcionalidades offline em aplicativos web. Ele intercepta as requisições de rede e gerencia os recursos no cache.

> **Principais Funções**
**install:** O evento de instalação permite que o service worker configure o cache inicial.
**fetch:** O evento de busca permite que o service worker intercepte as requisições de rede e sirva recursos do cache ou da rede, conforme necessário.

> **Funções Comuns**
Armazenamento em cache de arquivos para funcionalidade offline.
Atualização automática de arquivos no cache quando uma nova versão do aplicativo é lançada.
Intercetar e responder requisições de rede com base no cache local.

- **sitemap.xsl:** O arquivo `sitemap.xsl` é usado para informar aos motores de busca (como Google, Bing) sobre as páginas do seu site que estão disponíveis para indexação. Ele ajuda a melhorar o SEO e a visibilidade do seu site.

> **Principais Elementos**
`<urlset>:` Contém todas as URLs do site.
`<url>:` Representa uma única página.
`<loc>:` URL da página.
`<lastmod>:` Data da última modificação da página.
`<changefreq>:` Frequência de atualização do conteúdo (daily, weekly, monthly, etc.).
`<priority>:` Prioridade da URL em relação às outras (de 0.0 a 1.0).

- **sitemap.xslt:** O arquivo `sitemap.xslt` é um arquivo de estilo que pode ser usado para formatar o `sitemap.xsl` de uma forma visualmente amigável quando acessado diretamente em um navegador.

> **Principais Elementos**
`<xsl:template match="/">:` Define o layout HTML que será aplicado ao sitemap.xml.
`<xsl:for-each>:` Itera sobre os elementos url no sitemap.xml para exibir suas informações.
CSS Inline: Estiliza a tabela e o conteúdo para uma melhor apresentação visual.

### Resumo do detalhamento de pastas

- A **pasta `static`** em um projeto Svelte serve para armazenar arquivos estáticos que não são processados durante o build, mas são acessados diretamente pelo navegador.
  - A **pasta `icons`** armazena ícones da aplicação, como favicons e logotipos.
  - A **pasta `images`** contém imagens que serão usadas na interface, como banners e fotos de produtos.
  - A **pasta `fonts`** guarda fontes personalizadas que são carregadas diretamente no navegador.
  - A **pasta `midias`** contém arquivos de áudio e vídeo que possam ser auto hospedados no projeto.
  - A **pasta `src`** contém arquivos de código-fonte externo ou bibliotecas que não são processadas diretamente pelo Svelte.
  - **manifest.json:** Define como seu aplicativo web é exibido quando instalado como PWA.
  - **service-worker.js:** Gerencia o cache e torna o aplicativo disponível offline.
  - **sitemap.xml:** Fornece uma lista de URLs para motores de busca indexarem.
  - **sitemap.xsl:** Estiliza o sitemap.xml para exibição amigável em navegadores.

Essa estrutura modular facilita o gerenciamento de ativos estáticos, garantindo que tudo esteja organizado e fácil de acessar tanto no desenvolvimento quanto na produção.

### Detalhamento de Componentes

A pasta de `components` contém três subpastas:
```txt
components/
├──assets/
├──elements/
└──sections/
```
Todos os arquivos armazenados nestas pastas dveem ser do tipo `.svelte`. Abaixo segue um detalhamento das características dos arqquivos que devem estar em cada pasta.

- **Assets:** Contém componentes básicos e atômicos, com uma única responsabilidade, como botões, inputs, ícones, etc.
  
- **Elements:** Contém componentes formados por vários assets. Eles combinam esses elementos menores em uma unidade funcional, como formulários, cartões complexos, barras de pesquisa, etc.
  
- **Sections:** Contém componentes maiores que compõem seções inteiras da página, construídas a partir de múltiplos elements e possivelmente alguns assets, como cabeçalhos, rodapés, barras laterais, etc.

### Pasta `/lib` e suas utilidades

A pasta `./src/lib` mencionada anteriormente contém bibliotecas utilitárias e funções reutilizáveis que podem ser importadas em várias partes do projeto. Ela possui a seguinte estrutura:

```txt
lib/
├──functions/
├──localData/
├──settings/
└──types/
```

- **/functions:** Armazena funções utilitárias que podem ser usadas em diferentes partes da aplicação. Essas funções são responsáveis por realizar tarefas específicas e reutilizáveis, como manipulação de strings, datas, ou operações matemáticas.

> **Exemplos do que essa pasta contém:**
`utils.ts:` Arquivo de funções utilitárias de escopo global.
`/api:` Pasta com requisições padrão dos tipos `post`,`put`, `delete`
`/sanitizers:` Funções de formatação e validação de dados inputaods, como textos, datas e números.

- **/localData:** Pasta para armazenar dados estáticos e gerais sem muita relevância no projeto.

> **Exemplo de aruqivos:**
`brasil.ts:` Lista de todos os estados e cidades do Brasil.
`store.ts:` Arquivo para armazenar todas as variáveis `writable` de acesso geral.
`temp.ts:` Armazena dados estáticos temporários que serão removidos após a integração.

- **/settings:** Armazena configurações e constantes globais usadas na aplicação. Pode incluir valores de configuração, URLs de API, chaves de API, ou qualquer outro tipo de dado que seja importante para a configuração global do projeto.

> **Exemplos de arquivos:**
`dev:` Arquivo que possui a declaração da chave de api e do `title` do projeto.
`userPreferences.ts:` Arquivo que armazena as apreferências do usuários de tema, linguagem, etc.

- **/types:** Contém definições de tipos TypeScript, como interfaces, tipos de dados e enums. Esses tipos ajudam a garantir a consistência do código e facilitam a tipagem estática ao longo do projeto.


## Conclusão

Este repositório base é um guia para padronizar e acelerar o desenvolvimento de novos projetos na equipe de front-end. Através do uso correto dos componentes, boas práticas e uma configuração inicial eficiente, conseguimos otimizar o tempo de desenvolvimento e garantir consistência e qualidade em todos os projetos.