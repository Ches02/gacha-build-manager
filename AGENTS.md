# Gacha Build Manager — Project Instructions

## 1. Project overview

This project is a Genshin Impact build tracker.

The first version is intentionally a **manual build notebook / tracker**, not a stat calculator.

The application should allow the user to record and organize:

* Characters
* Weapons
* Artifacts
* Artifact loadouts
* Build guides
* Loadouts

Numeric values should be stored now because they will be useful for future calculations, but **do not implement stat calculations unless explicitly requested**.

The project may eventually support other gacha games, but the current priority is making the Genshin version solid.

When examples are needed, use **Diluc** and other Genshin examples. Avoid using Raiden Shogun as the default example.

---

# 2. Development environment

Project path:

```text
C:\Users\Ches\gacha-build-manager
```

Main technologies:

* TypeScript
* Node.js
* Vite
* Tailwind CSS
* Prisma
* SQLite
* Node `http` server

Frontend development server:

```text
http://localhost:5173/
```

The backend currently uses Node's native `http` module instead of Express.

Do not introduce a new backend framework unless explicitly requested.

---

# 3. Database

The project currently uses:

* SQLite
* Prisma

Environment variable:

```env
DATABASE_URL="file:./gacha.db"
```

Prisma configuration:

* schema: `prisma/schema.prisma`
* migrations: `prisma/migrations`
* generated client: `src/generated/prisma`

Current generator:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Datasource:

```prisma
datasource db {
  provider = "sqlite"
}
```

Do not switch back to PostgreSQL/Supabase unless explicitly requested.

The project previously considered Supabase, but the current decision is to use a local SQLite database.

---

# 4. Architecture

The backend is intentionally simple.

Current structure:

```text
server/
├── services/
├── validators/
│   ├── commonValidator.ts
│   ├── characterValidator.ts
│   ├── weaponValidator.ts
│   ├── artifactValidator.ts
│   ├── artifactLoadoutValidator.ts
│   ├── buildGuideValidator.ts
│   └── loadoutValidator.ts
└── index.ts
```

Responsibilities:

### `server/index.ts`

Responsible for:

* HTTP server
* URL routing
* HTTP methods
* request body reading
* calling validators/services
* HTTP status codes
* JSON responses

Do not move database/business logic into `index.ts` unnecessarily.

### Validators

Validators are responsible for:

* request shape
* data types
* string lengths
* numeric ranges
* basic input validation

Validators should NOT be responsible for checking whether a database reference exists or belongs to the current user.

### Services

Services are responsible for:

* database operations
* ownership checks
* reference existence checks
* business rules involving database records

---

# 5. HTTP server conventions

The server uses Node's native `http` module.

Supported methods:

* GET
* POST
* PUT
* DELETE

JSON responses use:

```ts
res.setHeader("Content-Type", "application/json; charset=utf-8");
```

Unsupported methods should return:

```text
405
```

Unknown routes should return:

```text
404
```

Request bodies are currently read manually using:

```ts
let body = "";

req.on("data", (chunk) => {
  body += chunk;
});

req.on("end", async () => {
  // ...
});
```

Do not introduce helper abstractions such as `sendJson`, `readJsonBody`, or a generic `pathname` variable unless explicitly requested.

Existing routing style uses:

```ts
url.pathname.match(...)
```

for extracting IDs.

ID parsing should follow the existing pattern:

```ts
const id = Number(match[1]);

if (!Number.isInteger(id)) {
  // invalid ID
}
```

Keep routing explicit and readable.

---

# 6. Current user

Authentication does not exist yet.

The current temporary user is:

```ts
const CURRENT_USER_ID = 1;
```

This is intentionally temporary.

Future authentication will replace this mechanism.

Do not implement authentication unless explicitly requested.

---

# 7. API structure

Catalog/global GET routes:

```text
GET /api/characters
GET /api/characters/:key

GET /api/weapons
GET /api/weapons/:key

GET /api/artifact-sets
GET /api/artifact-sets/:key
```

User-owned routes:

```text
/api/user/characters
/api/user/weapons
/api/user/artifacts
/api/user/artifact-loadouts
/api/user/build-guides
/api/user/loadouts
```

Each user resource supports the appropriate CRUD operations.

Global routes for user-owned entities were intentionally removed.

In particular, do NOT recreate:

```text
/api/artifacts
/api/loadouts
/api/build-guides
```

as global routes.

Build guides are user-owned.

---

# 8. API filtering

Catalog GET endpoints are expected to support query-string filters.

Characters:

```text
GET /api/characters?element=pyro
GET /api/characters?rarity=5
GET /api/characters?weaponType=sword
GET /api/characters?nation=mondstadt
GET /api/characters?element=pyro&rarity=5
```

Weapons:

```text
GET /api/weapons?rarity=5
GET /api/weapons?weaponType=claymore
GET /api/weapons?rarity=5&weaponType=claymore
```

The intended architecture is:

```text
index.ts
   ↓
service
   ↓
Prisma
```

Filtering should be implemented in services/Prisma rather than putting database filtering logic directly in `index.ts`.

Artifact set filtering can be added later.

Do not add excessive filtering before it is needed.

---

# 9. Translation system

The project uses a generic `Translation` table instead of separate translation tables for each entity.

Supported `entityType` values are exactly:

```text
character
weapon
weaponType
artefacto
artifactSlot
stat
```

Important:

* Use `weaponType`, not `weapontype`.
* Use `artefacto`, not `artifact`.
* Preserve these exact values/casing.

The goal is to separate:

### Definition data

Stable/non-localized data such as:

* keys
* rarity
* element
* weapon type
* nation
* base ATK
* etc.

from:

### Translation/display data

Localized values such as:

* English names
* Spanish names
* localized labels
* descriptive text where appropriate

Do not duplicate definition data merely because it is displayed in multiple languages.

---

# 10. Character model decisions

Characters have a global definition and user-owned character data.

Character definition contains things such as:

* `key`
* `rarity`
* `element`
* `weaponTypeKey`
* `nation`

Element belongs to the character definition.

Weapon type belongs to the character definition.

User-owned character data tracks:

* level
* constellation
* friendship
* ascension
* normal attack talent level
* elemental skill talent level
* elemental burst talent level

Character build data should not be forced to exist.

A character may exist without an active build/loadout.

A character can have multiple loadouts.

---

# 11. Weapon model decisions

Weapon definitions contain stable game data.

Important fields include:

* `key`
* `rarity`
* `baseATK`
* `subStatType`

The field is intentionally named:

```text
baseATK
```

`baseATK` represents the fixed base attack value used as the basis for future weapon level scaling.

`subStat` represents the base secondary-stat value.

The secondary stat type varies between weapons, therefore it is represented by a string/key rather than a hardcoded database column for each possible stat.

User-owned weapons track:

* level
* refinement

Weapon passive effects are descriptive/informational text.

Do NOT introduce a `passiveValue` field just to represent passive effects numerically.

Weapon level scaling is a future feature.

The intended future approach is to use master arrays/functions rather than creating large Prisma tables containing every level value from wiki data.

Do not implement weapon stat calculations unless explicitly requested.

---

# 12. Artifact model decisions

Artifacts are user-entered data in the MVP.

There is intentionally no artifact inventory system yet.

OCR/screenshot import is a possible future feature.

An artifact contains information such as:

* artifact set
* artifact slot
* level
* main stat type
* main stat value
* substats

Substats contain:

* stat type
* value

Numeric stat values must be stored.

Do not calculate artifact stats yet.

There is no `locked` field in the current artifact model.

Artifact slot concepts include:

* Flower
* Plume
* Sands
* Goblet
* Circlet

Fixed game constraints may be represented through artifact validation/data rules.

For example:

* Flower main stat is HP
* Plume main stat is ATK
* Sands supports HP%, ATK%, DEF%, EM, ER

Do not create unnecessary database entities for every game concept if the concept can remain a key/string.

---

# 13. Artifact sets

Artifact set definitions are global catalog data.

Artifact sets have:

* 2-piece effect
* 4-piece effect

These effects are informational/descriptive text.

Do not create separate numeric fields for passive values unless explicitly requested.

Artifact sets conceptually support the normal five artifact slots.

Do not create redundant per-slot definition rows unless there is a concrete reason to do so.

---

# 14. ArtifactLoadout

`ArtifactLoadout` is user-owned.

It represents a reusable collection/configuration of actual artifacts.

It can contain:

* name
* description
* artifact IDs

Artifact IDs must reference artifacts owned by the current user.

There is no need for a global artifact-loadout route.

Use:

```text
/api/user/artifact-loadouts
```

---

# 15. BuildGuide

Build guides are user-owned.

A BuildGuide is an informational recommendation/configuration.

Important design decision:

**BuildGuide is independent from characters.**

A Loadout connects characters to a BuildGuide.

A BuildGuide currently supports:

* name
* description
* characters
* weapons
* artifact sets
* main stats
* stat priorities

The current design intentionally has:

**1 option per guide.**

Do not turn BuildGuide into a multi-option recommendation system unless explicitly requested.

---

# 16. BuildGuide artifact sets

A guide can contain artifact-set recommendations.

The database uses a composite identity based on:

```text
buildGuideId
artifactSetKey
pieces
```

The intended composite key is:

```prisma
@@id([buildGuideId, artifactSetKey, pieces])
```

This allows the same artifact set to appear twice in the same guide with different piece counts.

For example:

```text
Set A — 2 pieces
Set A — 4 pieces
```

Two-piece and four-piece recommendations are both valid.

---

# 17. 2+2 artifact recommendations

Build guides should support 2+2 combinations.

The user should be able to choose the desired 2-piece effects and then select compatible sets.

Example:

```text
18% ATK + 18% ATK
```

The UI should eventually autocomplete compatible artifact sets.

Do not hardcode only one particular set combination.

---

# 18. Loadout

Loadout represents the current equipment/setup of one character.

Loadout is user-owned.

A Loadout must link to one Character and may optionally link to:

* Weapon
* ArtifactLoadout

A Loadout can follow zero or more BuildGuides through `LoadoutBuildGuide`.

Build guides are informational references: they do not restrict which weapon or
artifacts can be assigned to the Loadout.

Do not introduce templates, inheritance, overrides, or `LoadoutCharacter` in
the MVP. Those are possible future upgrades if reusable preset loadouts become
necessary.

There is intentionally no equip restriction.

The same real weapon or artifact may be assigned to multiple characters/loadouts.

---

# 19. Shared equipment indicator

The UI should eventually indicate when an actual weapon/artifact is being used by another equipped loadout.

The intended UX is:

* small orange dot
* hover text explaining that the item is currently being used
* example: `"está siendo utilizado por X pjs"`

Do NOT use a popup for this.

Do not block assignment merely because an item is already assigned elsewhere.

---

# 20. Validation architecture

Validation is intentionally divided into two levels.

### Validator

Checks:

* data type
* required/optional fields
* ranges
* string lengths
* basic structure

### Service

Checks:

* referenced record exists
* referenced record belongs to current user
* database/business rules

Reference errors use:

```ts
export class ReferenceValidationError extends Error {
  details: string[];

  constructor(details: string[]) {
    super("Referencia inválida");
    this.name = "ReferenceValidationError";
    this.details = details;
  }
}
```

Reference errors return HTTP 400 with:

```json
{
  "error": "Referencia inválida",
  "details": [
    "..."
  ]
}
```

---

# 21. Common validation helpers

`server/validators/commonValidator.ts` centralizes reusable validation helpers.

Current helpers include:

```ts
validateText
validateOptionalText
validateInteger
validateIntegerRange
validateId
validateOptionalId
validatePositiveNumber
validateStringArray
validateIdArray
```

Important semantics:

### `validateText`

Required non-empty string.

Rejects:

* empty/whitespace-only strings
* strings over max length
* `<`
* `>`
* `"`
* `'`
* backtick
* control characters

### `validateOptionalText`

Accepts:

* undefined
* null

If a value is supplied, it must be a valid string and obey the same length/character rules.

### `validateId`

Requires a positive integer.

### `validateOptionalId`

Accepts `null`, otherwise behaves like `validateId`.

### `validatePositiveNumber`

Requires a finite number greater than or equal to zero.

Despite the helper name, zero is valid because it is used for stats that may legitimately be zero.

### `validateStringArray`

Validates an array of strings using `validateText`.

### `validateIdArray`

Validates an array of positive integer IDs.

Do not recreate these helpers inside individual validators.

Keep domain-specific object/array structure rules inside their respective validator.

---

# 22. Current validator rules

## Character

Create:

* definitionKey: required text, max 40
* level: integer 0–90
* constellation: integer 0–6
* friendship: integer 0–10
* ascension: integer 0–6
* normalAttackLevel: integer 0–10
* elementalSkillLevel: integer 0–10
* elementalBurstLevel: integer 0–10

Update:

* all fields optional, same constraints when supplied

---

## Weapon

Create:

* definitionKey: required text, max 40
* level: integer 0–90
* refinement: integer 1–5

Update:

* all fields optional, same constraints when supplied

---

## Artifact

Create:

* setKey: required text, max 40
* slotKey: required text, max 40
* level: integer 0–20
* mainStatTypeKey: required text, max 40
* mainStatValue: nonnegative finite number
* subStats: optional array, max 4

Each substat:

* statTypeKey: text, max 40
* value: nonnegative finite number

Update:

* corresponding fields optional

---

## ArtifactLoadout

* name: required text, max 60
* description: when supplied, required non-empty text, max 500
* artifactIds: optional array of positive integer IDs

Important:

Do not silently change the current description semantics.

Currently `ArtifactLoadout` uses `validateText` for description when it is defined.

Therefore:

```text
description: null
```

or

```text
description: ""
```

is NOT automatically valid for ArtifactLoadout.

---

## BuildGuide

* name: required text, max 60
* description: when supplied, required non-empty text, max 500
* characters: optional string array, max 40 per value
* weapons: optional string array, max 40 per value
* artifactSets: optional array
* mainStats: optional array
* statPriorities: optional array

Artifact set entries:

* artifactSetKey: text, max 40
* pieces: integer 2–4
* pieces must explicitly be either 2 or 4

Main stat entries:

* slotKey: text, max 40
* statTypeKey: text, max 40

Stat priority entries:

* statTypeKey: text, max 40
* priority: integer 1–20
* targetValue: optional finite number

Do not change BuildGuide description semantics merely while refactoring validators.

---

## Loadout

* name: required text, max 60
* description: optional text, max 500
* description may be:

  * undefined
  * null
  * empty string
* characterId: required positive ID on create; optional positive ID on update
* weaponId: optional positive ID
* artifactLoadoutId: optional positive ID
* buildGuideIds: optional array of positive IDs

This behavior is intentional.

---

# 23. Loadout reference validation

`Loadout` references are checked in the service layer.

For the current user:

* characterId must reference a Character owned by the user
* weaponId must reference a Weapon owned by the user
* artifactLoadoutId must reference an ArtifactLoadout owned by the user
* every buildGuideIds value must reference a BuildGuide owned by the user

`null` and `undefined` are skipped for optional references. `characterId` is
required when creating a Loadout.

A missing or foreign reference should produce a `ReferenceValidationError`.

Example:

```text
characterId no existe o no pertenece al usuario
```

The same ownership principle should be used when validating other user-owned references.

---

# 24. Error handling

Reference validation errors:

```text
HTTP 400
```

with:

```json
{
  "error": "Referencia inválida",
  "details": []
}
```

Validation errors should clearly identify the invalid field.

Do not expose raw Prisma errors to the client.

Keep API responses consistent.

---

# 25. API response style

Responses should use clear JSON objects.

For example:

```json
{
  "loadout": {
    "id": 1,
    "name": "Diluc DPS"
  }
}
```

Pretty JSON is useful during development/testing.

Current development responses may use:

```ts
JSON.stringify(data, null, 2)
```

Do not unnecessarily redesign response shapes.

---

# 26. Coding style

Prefer:

* clear TypeScript
* explicit logic
* readable variable names
* small functions
* comments where they clarify intent
* minimal abstraction
* straightforward control flow

Avoid:

* over-engineering
* unnecessary generic frameworks
* unnecessary helper layers
* premature optimization
* giant abstractions
* changing architecture just for style

The project is intentionally being built incrementally.

---

# 27. File naming

Service filenames should use camelCase.

Example:

```text
buildGuideService.ts
```

NOT:

```text
BuildGuideService.ts
```

Keep naming consistent with the existing project.

---

# 28. Refactoring rules

When refactoring:

1. Preserve existing behavior.
2. Do not change database semantics unless explicitly requested.
3. Do not change API response shapes unnecessarily.
4. Do not rename public API fields casually.
5. Do not introduce unrelated features.
6. Prefer one targeted regression check after a small refactor.
7. Avoid asking for repetitive manual API tests when the change is already covered.
8. If a small refactor passes its targeted regression, move on.

The user strongly prefers avoiding repetitive API regression checks.

---

# 29. Git workflow

The repository is already initialized with Git.

Branch:

```text
master
```

An initial setup commit already exists:

```text
chore: initial project setup
```

When a logical unit of work is complete, use a focused commit.

Before committing:

```bash
git status
```

Then stage relevant files and commit.

Do not create commits for every tiny line change.

Do not push to GitHub unless explicitly requested.

---

# 30. Current project philosophy

The most important rule is:

**Do not build more than the project currently needs.**

The MVP is a build tracker / notebook.

Future features may include:

* stat calculations
* weapon level scaling
* OCR artifact import
* authentication
* admin/catalog management
* more gacha games
* richer build recommendations
* conflict tracking
* web deployment

But these are future work.

When implementing a new feature, first check whether it is already part of the current model/design.

Do not assume that a common feature in other build trackers belongs in this project.

---

# 31. Working with the user

The user prefers:

* Spanish communication
* practical step-by-step explanations
* complete copy-pasteable files when code changes are substantial
* concise explanations around the code
* comments in code when useful
* avoiding unnecessary complexity
* testing only what is relevant

When proposing a code change:

1. Explain briefly what is changing.
2. Explain which files are affected.
3. Prefer giving complete files when practical.
4. Give exact commands to run.
5. Keep the next step clear.

Do not overwhelm the user with unrelated architecture changes.

---

# 32. Important current state

The backend currently compiles successfully with:

```bash
npx tsc --noEmit
```

The validation refactor was tested successfully.

The API routing/validation refactor was also tested successfully.

The current project is ready to continue incrementally.

The next likely backend improvement is catalog GET filtering, especially:

```text
Characters:
- element
- rarity
- weaponType
- nation

Weapons:
- rarity
- weaponType
```

Implement this through services and Prisma rather than putting filtering logic directly in `index.ts`.

---

# 33. Do not undo these decisions

Unless the user explicitly changes their mind, do NOT:

* switch SQLite back to Supabase/PostgreSQL
* introduce Express just because it is common
* reintroduce global artifact/loadout/build-guide routes
* turn BuildGuide into a global catalog
* make BuildGuide character-dependent
* create a mandatory inventory system for artifacts
* add stat calculations to the MVP
* create huge Prisma tables for every weapon level/stat value
* add passive numeric values to weapon definitions
* create redundant translation tables
* replace the generic Translation model with separate translation tables
* force equipment uniqueness
* use popups for shared equipment conflicts
* use Raiden as the default example
* over-abstract the validators/services
* add authentication before it is requested

These are intentional project decisions, not temporary omissions.
