# Discord Eureka Gaming Affiliate — Project Context

## Identidade
- **Tipo**: Next.js 16 app + scripts Python (deals automatizados)
- **Fun\u00e7\u00e3o**: Postar ofertas/gr\u00e1tis da comunidade Eureka no Discord e WhatsApp
- **Stack**: Next.js 16.2 + React 19.2 + Tailwind 4 + TypeScript 5
- **Hospedagem**: Vercel (Next.js) + Cloudflare Worker (scripts)
- **GitHub**: tem `.github/workflows/` (check_content.yml, post_deals.yml)

## Estrutura
- `app/` — Next.js App Router
  - `page.tsx` — home com deals
  - `components/` — componentes
  - `data/` — dados est\u00e1ticos
  - `globals.css`, `layout.tsx`
- `public/` — assets (logos, file.svg, etc)
- `scripts/`
  - `cloudflare_worker.js` — worker de deals
  - `daily_scheduler.py` — agendamento di\u00e1rio
  - `eureka_content_notifier.py` — notificador de conte\u00fado Eureka
  - `free_games_deals.py` — deals de jogos gr\u00e1tis
  - `instant_gaming_deals.py` — deals Instant Gaming
  - `update_web_deals.py` — atualiza web com novos deals
  - `run_deals.bat` — script Windows pra rodar deals
  - `posted_*_history.json` — hist\u00f3rico (deals, free games, live, slots, youtube, last store)
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- `.github/workflows/` — CI/CD

## MCPs integrados
- `discord` (Guild ID 635634937898336256)
- `youtube` / `ia-youtube` (YouTube Data API v3)
- `github-mcp-server` (Actions, PRs)

## Regras locais

### Deals automation
- **Nunca duplicar post**: checar `posted_*_history.json` antes de postar.
- **Rate limit do Discord**: respeitar limite de mensagens por canal.
- **Hist\u00f3rico cresce**: rodar script de prune mensal.

### Stack
- **Next.js 16.2.4**: usar App Router (n\u00e3o Pages Router).
- **Tailwind 4**: usar `@tailwindcss/postcss`.
- **React 19.2**: server components por padr\u00e3o, client s\u00f3 quando precisar.

### Skills priorit\u00e1rias
- `nextjs-app-router-patterns`, `nextjs-best-practices`, `react-server-components`
- `tailwindcss-v4`, `design-system`
- `rest-api-patterns`, `api-error-responses`
- `digital-marketing-br` (do staging)
- `growth-hacking-marketing` (do staging)

### Seguran\u00e7a
- **Discord token**: NUNCA commitar (j\u00e1 est\u00e1 no MCP config, validar que est\u00e1 em `.env` local).
- **GitHub PAT**: idem, rotacionar trimestralmente.

### Tokens
- Toda resposta aplica `.agents/rules/token-optimization.md` do Jarvis.
