# CLAUDE.md — Filadelfia App

> Este archivo es la **fuente de verdad operativa** para Claude Code en este repositorio.
> Léelo completo al inicio de cada sesión. Las reglas marcadas como **OBLIGATORIO** no son negociables.

---

## 1. Identidad del proyecto

**Nombre:** Filadelfia App
**Misión:** App de estudio bíblico con motor exegético asistido por IA, alineado con la **Misión Filadelfia**, teología paulina y hermenéutica literal-gramatical-histórica.
**Audiencia:** Creyentes, estudiantes de la Palabra, maestros y predicadores hispanohablantes.
**Marco doctrinal:** Evangélico conservador, dispensacional moderado, pentecostal clásico (Pearlman), premilenialista pretribulacional (Pentecost), hermenéutica de M. S. Terry.

---

## 2. Marco doctrinal — Reglas inviolables del contenido

**OBLIGATORIO. Cualquier código que genere, transforme o sirva contenido bíblico debe respetar estas reglas. Si un cambio las viola, no lo implementes; pregunta primero.**

1. **Sola Scriptura.** La Escritura interpreta a la Escritura.
2. **Analogia fidei.** Coherencia con el conjunto del canon.
3. **Sentido literal-gramatical-histórico** prevalece sobre lo alegórico.
4. **Distinción dispensacional** Israel / Iglesia cuando aplique.
5. **Cristocentrismo** (Lc 24:27, 44; Jn 5:39).
6. **Prohibida la eiségesis.** Jamás imponer ideas al texto.
7. **Respeto al género literario** del pasaje.

### Anti-patrones doctrinales bloqueados
La app **NO** debe generar, sugerir, almacenar ni servir:
- Interpretaciones alegóricas sin base textual.
- Sustitución de Escritura por tradición humana como autoridad.
- Profecía personal, fechas escatológicas concretas, "palabras proféticas" individuales.
- Teología de la prosperidad extrema, Nueva Era, gnosticismo, universalismo, esoterismo.
- Asesoramiento pastoral sobre crisis matrimoniales, decisiones morales graves o salud mental sin remitir a asesoría pastoral presencial.

---

## 3. Stack técnico

```
Frontend:    Next.js 15 (App Router) + TypeScript estricto + Tailwind + shadcn/ui
Backend:     Next.js API Routes
DB:          PostgreSQL (Supabase) + pgvector
Auth:        Supabase Auth
AI:          Anthropic API (Claude Sonnet 4.5 para exégesis; Haiku para tareas ligeras)
Embeddings:  voyage-3 (o text-embedding-3-large como fallback)
Biblia:      SQLite empaquetada + Postgres para sync de notas de usuario
Hosting:     Vercel (web) + Supabase (DB)
Package mgr: pnpm (workspaces)
Tests:       Vitest + Playwright (e2e)
Lint:        ESLint + Prettier + Husky pre-commit
```

**Versiones mínimas:** Node 20 LTS, pnpm 9, TypeScript 5.5+.

---

## 4. Estructura del monorepo

```
filadelfia-app/
├── apps/
│   └── web/                    # Next.js — UI y API routes
├── packages/
│   ├── bible-data/             # Cargadores y schemas de versiones bíblicas + Strong's
│   ├── exegesis-engine/        # Prompts, validadores, llamadas a Anthropic
│   ├── ui/                     # Componentes shadcn compartidos
│   └── types/                  # Tipos TypeScript compartidos
├── scripts/
│   ├── import-bibles.ts        # USFM/OSIS → DB
│   ├── import-strongs.ts
│   └── import-rag-content.ts   # Indexa Pearlman, Terry, Pentecost
├── prompts/
│   ├── system-exegete.md       # Prompt maestro (ver §7)
│   ├── levels/                 # 4 niveles: devocional, estudiante, profundo, académico
│   └── workflows/              # inductivo, devocional, strong, bosquejo, memorización
├── docs/
├── CLAUDE.md                   # este archivo
└── package.json
```

**Convención de imports:** usar alias `@filadelfia/<paquete>` definidos en `tsconfig.base.json`.

---

## 5. Versiones bíblicas — Política de licencias

**OBLIGATORIO. La app distingue TRES categorías de versiones, con tratamiento técnico distinto cada una. No mezclar categorías ni promover una versión a una categoría superior sin justificación documentada.**

### 5.1 Categoría A — Dominio público / licencia libre (uso pleno)
Lectura completa, comparación, almacenamiento sin restricciones.

- Reina-Valera 1909 (RV1909)
- Reina-Valera Antigua (RVA)
- Biblia del Oso (1569)
- Open Scriptures Hebrew Bible (OSHB) — texto masorético con morfología
- SBLGNT — Nuevo Testamento griego
- Textus Receptus (Scrivener 1894)
- Septuaginta (LXX, Rahlfs)

### 5.2 Categoría B — Cita limitada bajo términos del editor (NTV, NVI)

**Estas versiones NO son de dominio público. Sus editores permiten citar versículos sin solicitar permiso escrito siempre que se cumplan condiciones estrictas. Almacenarlas y servirlas como "versión de lectura" general excedería los términos y requeriría licencia comercial formal.**

#### Versiones en esta categoría
- **NTV (Nueva Traducción Viviente)** — © Tyndale House Foundation
- **NVI (Nueva Versión Internacional)** — © Biblica, Inc.

#### Condiciones de uso (resumen vinculante)
1. Máximo **500 versículos** citados en una misma obra.
2. Los versículos citados **no pueden superar el 25 %** del contenido de la obra.
3. **No se puede citar un libro bíblico completo.**
4. La cita debe llevar el **crédito completo** del editor (ver §5.4).
5. El uso debe ser **no comercial** o, si es comercial, requiere licencia formal previa.

#### Implementación técnica obligatoria
Para mantener el cumplimiento, NTV y NVI **solo pueden aparecer en estos contextos**:

| Contexto | Permitido | Bloqueado |
|---|---|---|
| Comparación versículo a versículo dentro de una respuesta exegética | ✅ | — |
| Cita dentro de un análisis del motor exegético | ✅ | — |
| Cita dentro de un devocional generado | ✅ | — |
| Mostrar un capítulo completo en modo lectura | — | ❌ |
| Mostrar un libro completo en modo lectura | — | ❌ |
| Plan de lectura que recorra la NTV/NVI secuencialmente | — | ❌ |
| Exportar / imprimir / compartir el texto NTV/NVI fuera de su contexto exegético | — | ❌ |

#### Guardarraíles de código que DEBEN existir
1. **Flag por versión:** la tabla `bible_versions` tiene un campo `usage_mode` con valores `full` (Categoría A) o `citation_only` (Categoría B).
2. **Endpoint `/api/passage`** rechaza con `403` cualquier solicitud para una versión `citation_only` que pida más de **N versículos contiguos** (configurable, recomendado `N = 10`).
3. **Endpoint `/api/chapter`** y `/api/book` **bloquean** todas las versiones `citation_only`.
4. **Contador de uso por sesión y por respuesta del motor:** máximo **5 versículos NTV** y **5 versículos NVI** por respuesta exegética; máximo **20** por sesión de usuario en una hora. Implementar en `packages/exegesis-engine/src/quotaTracker.ts`.
5. **Sin caché de capítulos enteros:** no almacenar en CDN ni en cliente capítulos completos de versiones `citation_only`.
6. **Crédito automático:** todo render de versículo NTV/NVI inyecta el crédito del §5.4 al pie del bloque de texto. Si el render no lleva crédito, el componente lanza error en build.
7. **Test obligatorio:** `tests/copyright/citation-limits.test.ts` verifica los puntos 2-6 anteriores. Falla el build si no pasa.

### 5.3 Categoría C — Requiere licencia escrita (NO importar hasta tener documento)
Versiones cuyos términos no permiten cita libre o requieren acuerdo comercial explícito.

- RV1960 (Sociedades Bíblicas Unidas)
- LBLA (Lockman Foundation)
- Kadosh Israelita Mesiánica
- TLAD
- HATAS
- Cualquier Peshita en español con copyright vigente

Para importar cualquiera de estas: crear issue, gestionar licencia con el editor, archivar contrato en `docs/licencias/<version>.pdf`, **luego** importar.

### 5.4 Créditos obligatorios

Toda cita de Categoría B debe mostrar el crédito al pie del bloque o en una nota a pie de respuesta. Strings canónicos en `packages/bible-data/src/credits.ts`:

```ts
export const VERSION_CREDITS = {
  NTV: 'La Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation. Usada con permiso de Tyndale House Publishers. Todos los derechos reservados.',
  NVI: 'La Santa Biblia, Nueva Versión Internacional® NVI® © 1999, 2015 por Biblica, Inc.® Usada con permiso. Todos los derechos reservados mundialmente.',
} as const;
```

El crédito **no se omite nunca**, incluso en respuestas breves. Si se cita NTV y NVI en la misma respuesta, ambos créditos aparecen.

### 5.5 Antes de monetizar
Si en algún momento la app se monetiza (suscripciones, compras, anuncios), **detener distribución de NTV/NVI** y gestionar licencia comercial con Tyndale y Biblica antes de relanzar con esas versiones. Los términos de "uso no comercial" dejan de aplicar.

### 5.6 Procedimiento ante una nueva versión
1. Determinar categoría (A, B o C) según los términos del editor.
2. Documentar en `docs/fuentes-biblicas.md`: URL del origen, licencia, categoría asignada, fecha de verificación.
3. Si Categoría C: gestionar licencia antes de importar.
4. Si Categoría B: implementar los guardarraíles del §5.2 antes de exponer la versión a usuarios.

---

## 6. Reglas de integridad del contenido bíblico

**OBLIGATORIO. Estas reglas se aplican al código, a los tests y al motor exegético.**

1. **Cero invención de versículos.** Ninguna respuesta puede contener una referencia bíblica que no exista en la DB. Implementar `validators/verseReferenceValidator.ts` y aplicarlo a toda salida del motor exegético antes de devolverla al cliente.
2. **Cero invención de números Strong.** Validar contra la tabla `strongs` antes de mostrar.
3. **Cero invención de citas patrísticas o académicas.** Las únicas citas no bíblicas permitidas son las que provienen del corpus RAG indexado (Pearlman, Terry, Pentecost) o de un campo `source` verificable.
4. **Distinción explícita** en toda respuesta entre: (a) lo que el texto dice, (b) lo que la tradición enseña, (c) lo que es opinión teológica.
5. **Si el motor no puede verificar un dato, debe declarar literalmente:** *"No puedo verificar este dato con las fuentes disponibles."*
6. **Toda cita bíblica debe llevar:** libro, capítulo, versículo y versión.
7. **Toda palabra original** debe ir acompañada de su número Strong y transliteración.

---

## 7. Motor exegético — Arquitectura

### 7.1 Prompt maestro
Vive en `prompts/system-exegete.md`. Es el sistema de instrucciones que se envía a la API de Anthropic en cada llamada. **No modificar sin revisión doctrinal.**

### 7.2 Niveles de profundidad
Cada respuesta declara su nivel en metadata. El cliente solicita el nivel; el motor selecciona la variante del prompt:

| Nivel | Variante prompt | Audiencia |
|---|---|---|
| 1 — Devocional | `prompts/levels/devocional.md` | Creyente general |
| 2 — Estudiante | `prompts/levels/estudiante.md` | Discipulado, escuela bíblica |
| 3 — Profundo | `prompts/levels/profundo.md` | Maestros, predicadores |
| 4 — Académico | `prompts/levels/academico.md` | Estudio formal |

### 7.3 Workflows
Cada caso de uso es un workflow con su prompt template:

- `inductivo.md` — Observación → Interpretación → Aplicación
- `devocional.md` — devocional diario breve
- `strong.md` — búsqueda léxica
- `comparacion.md` — comparación versículo a versículo
- `referencias.md` — referencias cruzadas
- `bosquejo.md` — bosquejos de predicación
- `preguntas-oia.md` — preguntas inductivas guiadas
- `memorizacion.md` — análisis de texto para memorizar

### 7.4 Formato de respuesta estándar
Toda respuesta de estudio sigue el schema `ExegeticalResponse` en `packages/types/exegesis.ts`, que incluye los bloques: pasaje, texto comparado, contexto, análisis léxico, género literario, interpretación, referencias cruzadas, armonía doctrinal, aplicación, notas/variantes, nivel de certeza.

### 7.5 Pipeline de validación
Toda respuesta del motor pasa **en orden**:

1. `verseReferenceValidator` — toda referencia citada existe en DB.
2. `strongNumberValidator` — todo Strong citado existe.
3. `doctrinalGuardrails` — no contiene anti-patrones del §2.
4. `confidenceTagger` — asigna nivel de certeza Alto/Medio/Bajo.
5. `citationFormatter` — normaliza referencias al formato estándar.

Si un validador falla, la respuesta se reintenta una vez con feedback al modelo. Si falla dos veces, se devuelve al usuario un mensaje de error transparente, **nunca** contenido degradado.

---

## 8. Convenciones de código

### TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- Nunca `any`. Usar `unknown` y narrow.
- Tipos en `packages/types/`. No duplicar.
- Schemas de runtime con **Zod** en cualquier frontera (API, DB, parsing externo).

### Nomenclatura
- Archivos: `kebab-case.ts`.
- Componentes React: `PascalCase.tsx`.
- Hooks: `useCamelCase.ts`.
- Tipos: `PascalCase`. Funciones: `camelCase`. Constantes: `SCREAMING_SNAKE_CASE`.
- Referencias bíblicas internas: formato canónico `LIBRO C:V` (ej. `JUAN 3:16`), parseable por `parseReference()` en `packages/bible-data/src/reference.ts`.

### Idioma
- Código, identificadores, comentarios técnicos y commits: **inglés**.
- Contenido bíblico, prompts, documentación de usuario, mensajes UI: **español**.
- `CLAUDE.md`, `README.md` y docs internas: **español**.

### Commits (Conventional Commits)
```
feat(exegesis): add Strong's validator
fix(bible-data): correct USFM parser edge case for Psalm 119
chore(deps): bump @anthropic-ai/sdk
docs(claude): clarify versioning policy
```

---

## 9. Tests

**OBLIGATORIO para cualquier código que toque contenido bíblico.**

- Toda función de parsing de Biblia debe tener tests con versículos conocidos (ej. `Juan 3:16 en RV1909 → "Porque de tal manera amó Dios al mundo..."`).
- Toda función de lookup Strong debe tener tests con palabras conocidas (ej. `G26 → ἀγάπη / agápē / amor`).
- Cada validador del §7.5 tiene tests positivos y negativos.
- El motor exegético tiene tests de regresión con snapshots de respuestas para pasajes ancla: Génesis 1:1, Juan 3:16, Romanos 1:16-17, Efesios 2:8-9, Apocalipsis 1:1.

**Comando:** `pnpm test` corre todo. `pnpm test:watch` para desarrollo.

---

## 10. Seguridad y secretos

- **Nunca** hardcodear claves de API. Todo en `.env.local` (no commiteado).
- `.env.example` debe estar actualizado con todas las variables, con valores ficticios.
- Claves requeridas:
  - `ANTHROPIC_API_KEY`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `VOYAGE_API_KEY` (embeddings)
- Las llamadas a Anthropic se hacen **siempre desde el servidor** (API routes), nunca desde el cliente.
- Rate limiting por usuario en endpoints de IA. Implementar con `@upstash/ratelimit`.

---

## 11. Comandos comunes

```bash
pnpm install                    # Instalar todo
pnpm dev                        # Levantar Next.js en :3000
pnpm build                      # Build de producción
pnpm test                       # Vitest
pnpm test:e2e                   # Playwright
pnpm lint                       # ESLint
pnpm typecheck                  # tsc --noEmit en todos los paquetes
pnpm db:migrate                 # Migraciones Supabase
pnpm db:seed                    # Cargar datos iniciales (versiones, Strong's)
pnpm import:bibles              # Importar versiones bíblicas desde /data/raw
pnpm import:rag                 # Indexar PDFs teológicos a pgvector
```

---

## 12. Reglas operativas para Claude Code

**Cuando trabajes en este repositorio:**

1. **Lee este archivo completo al inicio de cada sesión.**
2. **Antes de crear un archivo nuevo**, verifica si existe uno similar y propón extender en lugar de duplicar.
3. **Antes de instalar una dependencia nueva**, justifica por qué no se puede resolver con las ya instaladas.
4. **Cualquier cambio que toque** `prompts/`, `packages/exegesis-engine/`, o validadores del §7.5 **requiere** que avises explícitamente al usuario y esperes confirmación.
5. **Nunca commitees** secretos, `.env.local`, archivos de versiones bíblicas con copyright, ni dumps de DB con datos de usuarios.
6. **Si una tarea ambigua puede violar §2 o §6**, detente y pregunta.
7. **Genera tests junto con el código**, no después.
8. **No inventes APIs ni endpoints** de Anthropic, Supabase u otros servicios; verifica primero con la documentación oficial.
9. **Si una tarea es grande** (más de ~200 líneas o varios archivos), propón un plan antes de implementar.
10. **Después de cambios significativos**, corre `pnpm typecheck && pnpm test && pnpm lint` y reporta el resultado.

---

## 13. Recursos externos canónicos

- **Textos hebreo/griego abiertos:** OSHB (https://hb.openscriptures.org), SBLGNT (https://sblgnt.com).
- **Versiones en español de dominio público:** eBible.org, unfoldingWord.
- **Strong's público (JSON):** repositorios `openbibleinfo/Bible-Translation-Tags` y similares en GitHub.
- **Lexicos de referencia (uso citativo limitado):** BDB (hebreo), Thayer (griego), Vine. **Verificar dominio público antes de incluir contenido completo.**
- **API Anthropic:** https://docs.claude.com

---

## 14. Estado actual del proyecto

> Actualizar esta sección al cierre de cada sesión.

- **Fase actual:** Fase 0 — Cimientos ✅ completada
- **Arquitectura:** App Next.js única (no monorepo) — decisión tomada en sesión 2026-05-14
- **Próximo hito:** Fase 1 — Conectar Supabase + importar RV1909 + Strong's
- **Bloqueadores:** Ninguno
- **Última actualización:** 2026-05-14

### Entregables Fase 0
- Next.js 16 + TypeScript strict + Tailwind + App Router
- PWA configurada (next-pwa, manifest.json, íconos SVG placeholder)
- `.env.example` con todas las variables requeridas
- `.gitignore` extendido (env, PWA generated files, bible data con copyright)
- Repo GitHub: `filadelfia-app` — conectado a Vercel

---

*"Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia"* — 2 Timoteo 3:16 (RV1909)
