# Project TODO

- [x] Definir o modelo de dados partilhado para músicas, notícias e media editorial
- [x] Aplicar migrações da base de dados e verificar as tabelas
- [x] Implementar consultas públicas para músicas e notícias publicadas
- [x] Implementar operações administrativas protegidas por permissões de administrador
- [x] Integrar armazenamento partilhado para áudio, capas e imagens de notícias
- [x] Migrar os registos editoriais elegíveis: notícias editoriais publicadas e áudio legado recuperável; excluir testes e músicas sem ficheiro original, que devem ser republicados pelo administrador
- [x] Criar catálogo público com estados de carregamento, vazio e erro
- [x] Criar painel editorial com formulários de música e notícia
- [x] Garantir publicação imediata após sucesso da operação
- [x] Implementar reprodução e download públicos das músicas
- [x] Validar campos de artista, categoria, produtor, descrição, capa e duração
- [x] Escrever testes Vitest para permissões, consultas e mutações editoriais
- [x] Validar visualmente experiência pública e painel administrativo em desktop e mobile
- [x] Corrigir regressões encontradas nos testes
- [x] Guardar checkpoint final da versão funcional

# Correção de erros — nova ronda

- [x] Auditar erros atuais da consola, servidor, build e rede
- [x] Reproduzir o erro no catálogo público e no painel administrativo
- [x] Corrigir autenticação administrativa e sessão partilhada
- [x] Corrigir publicação de músicas e notícias no site anterior
- [x] Corrigir reprodução, duração e download públicos
- [x] Executar testes Vitest, build e validação visual após as correções
- [x] Guardar checkpoint da versão corrigida

# Correção de aviso React

- [x] Auditar listas do Dashboard e identificar filhos sem chave única
- [x] Corrigir chaves de todas as listas afetadas
- [x] Validar consola, testes, build e checkpoint após a correção

# Lançamentos editoriais

- [x] Adicionar tipos de lançamento: single, ep e álbum
- [x] Guardar metadados editoriais e capa no servidor
- [x] Implementar upload de capa com validação e armazenamento partilhado
- [x] Mostrar tipo de lançamento e capa no painel administrativo
- [x] Mostrar álbuns, EPs e singles com as capas no site público
- [x] Testar publicação, persistência, permissões e responsividade
- [x] Guardar checkpoint da funcionalidade
