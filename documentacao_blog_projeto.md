# Documentação do Projeto
**Guia da Net — Conteúdo Educacional sobre Internet Residencial**
Versão 1.0

---

## 1. Visão Geral do Projeto

Este projeto consiste em um site estático voltado à educação digital de usuários de internet residencial. O objetivo é oferecer conteúdo didático, acessível e confiável sobre temas que surgem diariamente no suporte técnico: o que é Wi-Fi, como funciona o IPTV, quando usar cabo ou wireless, como reiniciar o roteador, entre muitos outros.

O site nasce da experiência prática de um profissional com anos de atuação em provedores regionais de fibra óptica, que identificou uma lacuna real: usuários que precisam de orientação básica sobre o uso da internet, mas que não encontram esse conteúdo de forma clara e adaptada à sua realidade.

O projeto é independente, sem vínculo com provedores e sem propaganda. A hospedagem é no GitHub Pages, sem custo.

---

## 2. O Problema que o Site Resolve

No suporte técnico de um provedor de internet, uma parcela significativa dos atendimentos não envolve falha real na conexão — envolve dúvidas do cliente sobre como usar a tecnologia que ele contratou. Exemplos recorrentes:

- Cliente não sabe a diferença entre internet via cabo e Wi-Fi
- Cliente não entende por que o sinal é fraco em outro cômodo
- Cliente não sabe o que é IPTV ou como funciona
- Cliente não consegue conectar um novo dispositivo à rede
- Cliente não sabe reiniciar o roteador corretamente
- Cliente desconhece o que é banda larga, Mbps, latência ou DNS

Esses atendimentos consomem tempo do suporte, geram frustração no cliente e não têm relação com falha do provedor. Ao mesmo tempo, simplesmente dizer que isso não é problema do provedor leva ao cancelamento. O site resolve isso ao oferecer um recurso de apoio: o atendente manda o link, o cliente aprende, o problema se resolve.

---

## 3. Público-Alvo

O público primário é o cliente residencial de provedores de internet de médio porte, com perfil:

- Acesso à internet via smartphone (maioria absoluta)
- Pouca ou nenhuma familiaridade com termos técnicos
- Prefere visualizar conteúdo em vídeo ou imagem, mas aceita texto curto e direto
- Recebe links via WhatsApp e os acessa diretamente pelo celular
- Não busca conteúdo técnico por iniciativa própria — chega ao site por indicação do suporte ou por busca no Google

O público secundário é o próprio atendente de suporte, que usa o site como ferramenta de consulta e encaminhamento durante os atendimentos.

---

## 4. Objetivos do Site

### 4.1 Objetivo Principal

Ser uma referência em educação digital para usuários domésticos de internet, oferecendo conteúdo claro e confiável que reduz dúvidas recorrentes e aumenta a autonomia do usuário.

### 4.2 Objetivos Secundários

- Ser útil para equipes de suporte técnico como ferramenta de encaminhamento (envio de links durante atendimento)
- Ranquear no Google para buscas relacionadas a dúvidas comuns de internet residencial
- Funcionar como portfólio de conhecimento técnico do autor

---

## 5. Identidade e Posicionamento

O site deve transmitir confiança, simplicidade e proximidade. Não é um blog técnico voltado a profissionais de TI — é um guia para quem nunca abriu um manual de roteador na vida.

### 5.1 Tom de Voz

- Simples e direto, como uma conversa entre amigos
- Sem jargão técnico desnecessário — quando um termo técnico for inevitável, ele é explicado na mesma frase
- Sem ser condescendente: o leitor é tratado como alguém inteligente que simplesmente não teve acesso à informação
- Exemplos do cotidiano sempre que possível

### 5.2 Nome do Site

O nome escolhido para o site é **Guia da Net**. O nome é neutro, independente de qualquer empresa, fácil de lembrar e transmite a ideia de orientação sobre internet. O site se posiciona como conteúdo gratuito, sem propaganda e sem vínculo com provedores.

### 5.3 Identidade Visual

A identidade visual será definida na fase de desenvolvimento, mas deve seguir as seguintes diretrizes:

- Tema claro — fundo branco, com boa legibilidade em ambientes iluminados, que é o contexto típico de uso no celular
- Paleta de cores limpa, moderna e profissional
- Tipografia legível em telas pequenas
- Ícones e ilustrações em SVG ou via biblioteca de ícones — nunca emojis
- Sem excesso de elementos visuais que distraiam do conteúdo

### 5.4 Proibição de Emojis

O uso de emojis é expressamente proibido em qualquer parte do site — títulos, artigos, menus, botões ou qualquer outro elemento de interface. Os motivos são técnicos e de posicionamento:

- Emojis variam de aparência entre sistemas operacionais e versões de Android e iOS — o mesmo caractere pode ter visual completamente diferente ou simplesmente não existir em plataformas mais antigas
- A ausência de um emoji em determinada plataforma resulta em um caractere de substituição visível (caixa vazia ou ponto de interrogação), o que constitui um erro de exibição
- Emojis transmitem informalidade excessiva, reduzindo a percepção de credibilidade e profissionalismo do conteúdo

No lugar de emojis, o site deve utilizar ícones SVG inline ou via biblioteca de ícones (ex: Lucide, Heroicons, Phosphor Icons), que garantem aparência consistente em qualquer dispositivo e resolução, independente do sistema operacional ou versão do Android e iOS.

---

## 6. Design e Experiência do Usuário

### 6.1 Prioridade Mobile-First

Este é um princípio inegociável do projeto. O site é projetado primeiro para telas de smartphone e depois adaptado para desktop — o oposto da abordagem convencional. O motivo é simples: a grande maioria dos clientes receberá links via WhatsApp e os abrirá diretamente no celular.

Isso significa que toda decisão de layout, tamanho de fonte, espaçamento, botões e navegação deve ser tomada pensando primeiro na tela de 360–430px de largura de um smartphone comum.

### 6.2 Páginas do Site

O site é composto pelas seguintes páginas:

- **Home** — página inicial com destaque de artigos selecionados manualmente pelo autor, e acesso às categorias
- **Categoria** — listagem de todos os artigos de uma categoria
- **Artigo** — página individual de leitura
- **Busca** — resultados de busca por palavras-chave

Não há página "Sobre" ou qualquer outra página institucional. O conteúdo fala por si.

### 6.3 URLs

As URLs dos artigos seguem o padrão `/categoria/titulo-do-artigo` (ex: `/wifi/o-que-e-wifi`). Esse formato é descritivo, favorece o SEO e deixa clara a hierarquia do conteúdo. Os títulos nas URLs devem ser em letras minúsculas, sem acentos, com palavras separadas por hífen.

### 6.4 Navegação

A navegação deve ser intuitiva e mínima. O usuário que chega via link direto não deve se perder. Elementos essenciais:

- Menu simples e acessível por toque
- Campo de busca visível e funcional
- Categorias claras para exploração do conteúdo
- Botão de voltar ao topo em artigos longos

### 6.5 Leitura

Artigos devem ser agradáveis de ler no celular. Parágrafos curtos, frases diretas, uso moderado de negrito para destacar o que é mais importante, e imagens ou ilustrações quando ajudarem a explicar algo que o texto não consegue transmitir sozinho.

---

## 7. Conteúdo

### 7.1 Estrutura de Categorias

O conteúdo será organizado em categorias temáticas. As categorias a seguir são sugestões iniciais baseadas nos temas mais recorrentes no suporte — podem ser expandidas conforme o projeto evolui:

- Wi-Fi e Roteador — sinal, cobertura, senha, reinicialização, frequências
- Cabo de Rede — quando usar, tipos, vantagens sobre o wireless
- IPTV — o que é, como funciona, diferença de streaming convencional
- Velocidade e Qualidade — o que é Mbps, latência, teste de velocidade, o que afeta a conexão
- Dispositivos — como conectar TV, celular, computador, videogame
- Glossário — termos técnicos explicados de forma simples

### 7.2 Formato dos Artigos

O formato padrão de marcação de texto como Markdown (.md) foi avaliado e descartado para este projeto. Markdown oferece formatação limitada e não atende à necessidade de controle visual fino exigida por artigos didáticos com elementos como destaques, boxes de atenção, ilustrações posicionadas e layouts adaptados ao mobile.

Os artigos serão escritos diretamente em HTML. Essa escolha oferece controle total sobre a formatação e permite criar artigos visualmente ricos sem depender de conversores ou limitações de sintaxe. O HTML também é a linguagem nativa do site, eliminando camadas desnecessárias entre o conteúdo e o que o leitor vê.

Para evitar que os artigos fiquem hardcoded no HTML principal do site — o que tornaria a expansão inviável e a manutenção caótica — é necessária uma arquitetura de separação de conteúdo. Cada artigo deve existir como um arquivo HTML independente, carregado dinamicamente ou referenciado de forma estruturada pelo sistema do site. O mecanismo exato será definido na fase de desenvolvimento, mas a separação entre estrutura do site e conteúdo dos artigos é um requisito não negociável.

**Mídia nos artigos:** cada artigo pode conter texto, imagens e vídeos incorporados (YouTube), combinados conforme o tema exigir. Não há um formato fixo — o autor decide o que melhor serve ao conteúdo de cada artigo.

**Imagens:** produzidas com auxílio de inteligência artificial, com critério. O autor será seletivo na escolha — imagens com aspecto excessivamente artificial ou irreal serão descartadas. A preferência é por ilustrações que pareçam naturais e funcionais, que apoiem a explicação sem distrair.

**Data de publicação:** cada artigo exibirá a data em que foi publicado, de forma discreta — sem destaque visual, apenas para referência do leitor caso o conteúdo fique desatualizado no futuro. Não há exibição de autor.

**Compartilhamento:** cada artigo terá um botão de compartilhamento via WhatsApp e um botão de copiar link, posicionados de forma acessível no mobile. O compartilhamento é um vetor importante de distribuição, já que o público-alvo recebe e repassa links via WhatsApp.

### 7.3 Expansibilidade

O site foi concebido para crescer de forma contínua e incremental. Os artigos não serão criados junto com o projeto — eles serão adicionados ao longo do tempo, à medida que o autor identificar novas dúvidas recorrentes no suporte ou decidir cobrir novos temas.

Isso impõe um requisito estrutural claro: adicionar um novo artigo ao site deve ser uma operação simples, previsível e que não exija alteração no código principal do site. O sistema deve ser capaz de reconhecer e incorporar novos artigos automaticamente ou com o mínimo de configuração manual. Criar um arquivo de artigo, colocá-lo no lugar certo e — quando necessário — registrá-lo em um índice ou manifesto central deve ser o único trabalho do autor para publicar novo conteúdo.

### 7.4 Produção e Edição de Conteúdo

Os artigos serão produzidos com auxílio de inteligência artificial: o autor fornece o contexto técnico real, a IA transforma em linguagem acessível e estrutura o HTML. Esse fluxo garante velocidade de produção sem abrir mão da precisão técnica.

No entanto, o autor realizará edições manuais nos artigos com frequência — ajustes pontuais de texto, correções, atualizações de informação ou reformatações visuais. Editar HTML bruto é impraticável para uso cotidiano, especialmente para quem não é desenvolvedor.

Por isso, o projeto deve prever a criação de um editor de artigos: uma interface visual simples que permita ao autor abrir um artigo existente, editar seu conteúdo em formato legível (sem precisar ver o HTML cru) e salvar as alterações. Esse editor não precisa ser um CMS completo — deve ser algo leve, funcional e focado exclusivamente na edição do conteúdo dos artigos.

O editor será uma ferramenta local, executada no próprio navegador abrindo um arquivo HTML diretamente do computador do autor — sem necessidade de servidor, instalação ou dependência externa. O autor abre o arquivo do editor no navegador, edita, salva.

---

## 8. Funcionalidades do Site

### 8.1 Funcionalidades Essenciais

- Listagem de artigos por categoria
- Página de artigo individual com leitura limpa
- Data de publicação discreta em cada artigo
- Botão de compartilhamento via WhatsApp e copiar link em cada artigo
- Busca de conteúdo por palavras-chave
- Menu de navegação responsivo
- Sistema de artigos separados do código principal, com suporte a expansão incremental

### 8.2 Ferramenta de Edição (separada do site)

Editor leve para criação e edição de artigos, executado localmente no navegador abrindo um arquivo HTML do computador do autor — sem servidor, sem instalação. Não é uma funcionalidade do site em si, mas um componente do projeto que viabiliza a manutenção do conteúdo sem exigir edição direta de HTML.

O editor deve suportar:

- **Criar artigo novo** — interface para redigir o conteúdo, definir categoria, título e data de publicação, e gerar o arquivo HTML do artigo no formato esperado pelo site
- **Editar artigo existente** — abrir um arquivo HTML de artigo já existente e editar seu conteúdo em formato legível, sem expor o HTML cru ao autor
- **Gerenciar destaques da home** — selecionar quais artigos aparecem em destaque na página inicial, sem necessidade de editar arquivos manualmente

### 8.3 Funcionalidades Fora do Escopo

As seguintes funcionalidades foram conscientemente excluídas do escopo inicial para manter o projeto simples e viável:

- Sistema de comentários
- Login ou área do cliente
- Formulário de contato ou suporte
- Newsletter ou cadastro de e-mail

---

## 9. Tecnologia e Hospedagem

O site será desenvolvido como site estático, sem back-end ou banco de dados. Essa escolha garante performance, segurança, baixo custo e facilidade de hospedagem.

### 9.1 Idioma

O site é integralmente em português brasileiro. Não há previsão de suporte a outros idiomas.

### 9.2 Hospedagem

GitHub Pages — gratuito, confiável e suficiente para a fase inicial. Domínio personalizado pode ser adicionado posteriormente se o projeto for adotado pelo provedor.

### 9.3 Geração do Site

A escolha do gerador de site estático (ex: Jekyll, Hugo, Astro, 11ty) será feita na fase de desenvolvimento com base na facilidade de uso, suporte a busca e performance mobile. A documentação não prescreve uma tecnologia específica — a IA responsável pelo desenvolvimento deve escolher a mais adequada com base nesses critérios.

### 9.4 SEO

O site deve ser estruturado com boas práticas de SEO desde o início:

- Títulos e descrições otimizados por artigo
- URLs limpas e descritivas
- Tempo de carregamento rápido (essencial para mobile e para o Google)
- Estrutura de cabeçalhos correta (H1, H2, H3)
- Foco em buscas relacionadas a dúvidas comuns de internet residencial

---

## 10. Qualidade e Padrão do Código

O código do projeto deve ser moderno, minimalista, organizado e bem trabalhado. Este não é um projeto genérico — não deve parecer gerado automaticamente, não deve usar soluções de prateleira sem critério, e não deve entregar o mínimo funcional como se fosse suficiente.

O padrão esperado é o de um desenvolvedor experiente que se importa com o que está construindo. Isso se aplica a cada camada do projeto: estrutura de arquivos, nomenclatura, CSS, HTML semântico, JavaScript, e à ferramenta de edição.

Diretrizes concretas:

- **Estrutura de arquivos clara e intencional** — cada arquivo existe por um motivo, está no lugar certo e tem um nome que comunica sua função
- **CSS moderno e organizado** — variáveis, hierarquia consistente, sem gambiarras, sem repetição desnecessária
- **HTML semântico** — uso correto das tags, acessibilidade considerada, estrutura que faz sentido fora do contexto visual
- **JavaScript enxuto** — só o necessário, sem dependências desnecessárias, sem código morto
- **Consistência** — padrões mantidos do início ao fim, sem mistura de estilos ou abordagens
- **Legibilidade** — código que outro desenvolvedor (ou a própria IA em uma sessão futura) consegue entender e dar continuidade sem precisar decifrar

O resultado deve ser algo que, ao ser aberto por um desenvolvedor, transmita cuidado e competência — não algo que pareça gerado em cinco minutos de prompt.

---

## 11. Decisões em Aberto

As seguintes decisões foram intencionalmente deixadas em aberto para serem resolvidas pela IA de desenvolvimento com base em critérios técnicos e de design. Não são lacunas — são escolhas que dependem de conhecimento especializado que o autor não detém e que não devem ser arbitradas sem embasamento.

**Índice/manifesto de artigos:** o documento define que adicionar um artigo não deve exigir alteração no código principal do site, e que o editor gerencia os destaques da home. O mecanismo concreto — arquivo de índice central, geração automática, manifesto JSON ou outra abordagem — deve ser escolhido pela IA com base no que melhor serve à simplicidade de manutenção e à expansibilidade.

**Layout da home:** a página inicial destaca artigos selecionados manualmente e dá acesso às categorias. A composição visual — quantidade de destaques, forma de apresentação, hierarquia dos elementos — deve ser definida pela IA com base em boas práticas de design mobile-first e nos princípios de identidade visual descritos na seção 5.

---

## 12. Notas Finais

Este documento não contém instruções de código ou implementação técnica. Seu propósito é transmitir a intenção, o contexto, o tom e os limites do projeto para que qualquer ferramenta de desenvolvimento — humana ou de inteligência artificial — possa construir o site com a visão correta desde o início.

A clareza sobre o que o site é (e o que não é) é mais valiosa do que qualquer especificação técnica prematura.
