# 🎨 Guia de Geração de Imagens com Inteligência Artificial

Este guia contém as **"receitas de prompts"** e diretrizes estéticas utilizadas para gerar as imagens de capa do site **Guia da Net**. Com essas instruções, você poderá gerar novas capas no futuro usando qualquer IA de imagem (como DALL-E 3, Midjourney, Imagen ou Firefly) e garantir que elas fiquem perfeitamente integradas à identidade visual do site.

---

## 📐 Diretrizes Estéticas da Marca

O visual do site é baseado em um estilo **editorial moderno, limpo e mobile-first**. As imagens geradas devem seguir estes princípios básicos:

1.  **Estilo de Arte:** Sempre use `Flat 2D vector illustration` (ilustração vetorial 2D plana). Evite renders 3D realistas, sombras complexas ou fotografias reais.
2.  **Visual Editorial:** As imagens devem parecer saídas de uma revista digital moderna, com traços limpos e foco no minimalismo (`editorial style`, `clean and minimalist`).
3.  **Composição Simples:** Sempre foque em apenas um objeto centralizado com elementos simples ao redor. Evite cenas poluídas, com muitos personagens ou detalhes de fundo complexos.
4.  **Cores Coerentes:** A paleta de cores deve utilizar tons pastéis baseados na identidade do site:
    *   **Fundo:** Sempre use fundo creme pastel (`cream pastel background`, `soft background`).
    *   **Detalhes:** Utilize variações suaves de verde-sage (`sage green`), terracota/tijolo (`terracotta orange` / `brick red`) e cinza suave (`light grey`).

---

## 📝 A "Fórmula" do Prompt (Template Universal)

Use esta estrutura padrão para preencher a sua IA e apenas alterne a descrição do objeto central:

> **[Inglês — Recomendado para maior precisão na IA]:**
> `Flat 2D vector illustration of a [DESCREVA O SEU OBJETO AQUI]. Elegant, clean, minimalist editorial style, cream pastel background, soft colors (sage green, light terracotta, and subtle grey), no human faces, no screens, no text.`

> **[Português — Caso a IA suporte bem]:**
> `Ilustração vetorial plana 2D de [DESCREVA O SEU OBJETO AQUI]. Estilo editorial elegante, limpo e minimalista, fundo creme pastel, cores suaves (verde-sage, terracota claro e cinza sutil), sem rostos humanos, sem telas, sem texto.`

---

## ⚡ Exemplos Práticos que Funcionaram no Projeto

Aqui estão os prompts exatos usados no site para você se inspirar:

### Exemplo 1: Wi-Fi 2.4 GHz vs 5 GHz
*   `Flat 2D vector illustration of a modern wireless internet router emitting two distinct types of signal waves: one wave is sage green, widely spaced, indicating 2.4 GHz (long range, lower speed), and the other wave is terracotta orange, tightly packed and fast, indicating 5 GHz (short range, high speed). Elegant, minimalist, clean design, editorial style, cream pastel background, no devices or screens around it, no text.`

### Exemplo 2: O que é Ping / Latência (Jogos)
*   `Flat 2D vector illustration of a modern clean game controller (console controller) in cream/light grey. Stylized lines of speed, high-frequency sound waves, and a tiny elegant stopwatch symbol appear around the controller, representing ultra-low latency and fast reaction time. Editorial minimalist style, cream pastel background, clean aesthetic, no screens, no text.`

### Exemplo 3: Onde posicionar o Roteador
*   `Flat 2D vector illustration showing a stylized floor plan of a modern house. A sleek Wi-Fi router is positioned perfectly on a shelf in the very center of the house, emitting smooth, soft concentric signal waves (sage green) that spread evenly across all the rooms (living room, bedrooms, kitchen) without obstacles. Elegant, clean layout, editorial style, pastel colors (cream, sage, terracotta), no text.`

---

## 🛠️ Como Associar no Site Após Gerar a Imagem
1.  Gere a imagem em formato `.png` ou `.jpg`.
2.  Copie o arquivo para a pasta do respectivo artigo (ex: `content/articles/wifi/seu-artigo.png`).
3.  Abra o arquivo central [content/articles.json](file:///c:/Users/User/Downloads/PalmasNet/Site%20Suporte/content/articles.json).
4.  Insira o atributo `"image"` apontando para a imagem:
    ```json
    "image": "content/articles/wifi/seu-artigo.png"
    ```
5.  Pronto! O site começará a exibir a nova imagem de capa instantaneamente.
