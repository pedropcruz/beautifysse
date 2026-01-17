# Roadmap - Beautify Event Stream

## Alta Prioridade

- [ ] **Rate Limiting** - Adicionar rate limiting ao endpoint `/api/share` para prevenir abuso
- [ ] **Validação de Input** - Sanitizar conteúdo de streams antes de guardar/mostrar para prevenir XSS
- [ ] **Expiração de Streams** - Implementar TTL para streams partilhadas (cleanup automático)
- [ ] **CI com Testes** - Adicionar execução de testes unitários ao pipeline de CI

## Média Prioridade

- [ ] **Error Boundaries** - Adicionar error boundaries robustos nos componentes Vue
- [ ] **Loading States** - Skeleton loaders para chamadas API
- [ ] **Documentação de Parsers** - Documentação inline para lógica dos parsers
- [ ] **Testes E2E** - Implementar testes Playwright conforme estratégia de testing
- [ ] **Acessibilidade** - ARIA labels e melhorias de navegação por teclado
- [ ] **Performance** - Virtualização para streams com muitos eventos

## Baixa Prioridade

- [ ] **README** - Atualizar README com documentação específica do projeto
- [ ] **Novos Parsers** - Adicionar suporte para OpenAI streaming, Anthropic, etc.
- [ ] **Export** - Permitir exportar eventos parseados para JSON/CSV
- [ ] **Live Connection** - Conectar a endpoints SSE em tempo real
- [ ] **Time Deltas** - Mostrar tempo entre eventos
