# Tech Stack Rules

## Approved Libraries

### Frontend (`client/`)
| Package | Purpose | Version |
|---------|---------|---------|
| `react` | UI framework | 18.x |
| `react-dom` | DOM rendering | 18.x |
| `vite` | Dev server + bundler | 8.x |
| `react-markdown` | Render markdown in bot responses | 9.x |

### Backend (`server/`)
| Package | Purpose | Version |
|---------|---------|---------|
| `express` | HTTP server | 5.x |
| `groq-sdk` | Groq AI API client | 0.9.x |
| `dotenv` | Load `.env` variables | 18.x |
| `cors` | Cross-origin requests | 2.x |

## Never Add These

The following must **never** be introduced to this project:

- ❌ Databases (MongoDB, PostgreSQL, SQLite, etc.)
- ❌ Authentication (JWT, OAuth, sessions, Passport.js)
- ❌ RAG / vector databases (Pinecone, Chroma, Weaviate)
- ❌ LangChain or any AI orchestration framework
- ❌ Docker or containerisation
- ❌ AWS services (S3, Lambda, DynamoDB, etc.)
- ❌ Redis or any caching layer
- ❌ WebSockets (Socket.io, ws)
- ❌ Complex state management (Redux, Zustand, Jotai)
- ❌ CSS frameworks (Tailwind, Bootstrap, Material UI)
- ❌ TypeScript (keep it plain JavaScript)
- ❌ Testing libraries unless explicitly requested

## AI Model

- **Provider**: Groq (`https://api.groq.com`)
- **Current model**: `openai/gpt-oss-120b`
- **SDK**: `groq-sdk` (CommonJS `require`)
- **API key env var**: `GROQ_API_KEY` in `server/.env`
- The API key must **never** appear in any frontend code or HTTP response

## API Design

- Single endpoint: `POST /api/chat`
- Request: `{ message: string, history: HistoryEntry[] }`
- Success response: `{ reply: string }` — HTTP 200
- Error responses: `{ error: string }` — HTTP 400 / 502 / 500
- History format uses Groq/OpenAI roles: `user` and `assistant`
- Frontend uses `user` and `bot` for display; maps `bot → model` for history sent to backend

## Vite Proxy

The Vite dev server proxies `/api/*` to `http://localhost:3001` — no CORS configuration needed during development. This is set in `client/vite.config.js`.
