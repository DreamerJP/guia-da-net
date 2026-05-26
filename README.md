# Guia da Net

Site estático em português brasileiro com conteúdo educacional sobre internet residencial. Independente, sem propaganda e sem vínculo com provedores. Hospedado no GitHub Pages, mobile-first e sem back-end.

## Estrutura

- `index.html`: shell do site.
- `404.html`: fallback para URLs bonitas em hospedagem estática.
- `assets/`: CSS, JavaScript e ilustrações.
- `content/articles.json`: índice central de categorias, artigos e destaques da home.
- `content/articles/`: arquivos HTML independentes de cada artigo.
- `editor.html`: ferramenta local para criar e editar artigos e gerenciar destaques.

## Rodar localmente

Use um servidor estático simples na raiz do projeto:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Criar ou editar artigos

Abra `editor.html` diretamente no navegador. Em navegadores Chromium atuais, o editor pode abrir e salvar arquivos locais usando o seletor de arquivos do próprio navegador. Quando o salvamento direto não estiver disponível, ele baixa o arquivo atualizado para você substituir no projeto.

Para publicar um artigo novo:

1. Crie o conteúdo no editor e salve o HTML em `content/articles/<categoria>/<slug>.html`.
2. Abra `content/articles.json` na aba `Destaques`.
3. Use `Adicionar artigo atual` para inserir ou atualizar a entrada do artigo.
4. Salve o índice.

## GitHub Pages

Publique a raiz do projeto. O site usa URLs como `/wifi/o-que-e-wifi` e carrega os artigos a partir do manifesto JSON.

O arquivo `404.html` redireciona rotas diretas para o shell do site. Ele vem configurado para domínio raiz. Se publicar em uma URL de projeto, como `usuario.github.io/repositorio`, ajuste `basePath` em `404.html` para `/repositorio`.
