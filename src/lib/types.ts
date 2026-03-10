// ============================================================
// Seoul365 Dental — Shared Types
// ============================================================
import { Hono } from 'hono'

export type Bindings = { DB: D1Database }
export type App = Hono<{ Bindings: Bindings }>
