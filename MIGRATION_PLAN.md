# CryptoFees Migration Plan: Next.js 12 to Nuxt 3

## Overview

This document outlines the in-place migration of CryptoFees from Next.js 12 (React) to Nuxt 3 (Vue 3).

**Current Stack:**
- Next.js 12 with React 16.13.1
- TypeScript (non-strict)
- CSS-in-JS (styled-jsx)
- MongoDB, Redis, PostgreSQL
- CryptoStats SDK for data
- i18n (4 languages)

**Target Stack:**
- Nuxt 3 with Vue 3
- TypeScript (strict)
- Scoped CSS (Vue SFC)
- Pinia for state management
- Same database integrations
- English only (simplified i18n)

---

## Phase 1: Project Setup & Configuration

### 1.1 Initialize Nuxt 3 Structure

Create new Nuxt 3 configuration files alongside existing Next.js files:

```
New files to create:
- nuxt.config.ts
- app.vue
- tsconfig.nuxt.json (temporary, merge later)
```

### 1.2 Update package.json

Replace React dependencies with Vue/Nuxt equivalents:

| Remove | Add |
|--------|-----|
| next | nuxt |
| react, react-dom | vue |
| react-ga | vue-gtag |
| react-select | @vueform/multiselect |
| react-datepicker | @vuepic/vue-datepicker |
| react-feather | @vueuse/icons (or keep feather-icons) |
| react-transition-group | Vue built-in transitions |
| react-popper | floating-vue |
| react-i18next, i18next | @nuxtjs/i18n |
| next-plausible | @nuxtjs/plausible |
| next-images | @nuxt/image |

Keep unchanged:
- recharts (will wrap for Vue or replace with vue-chartjs)
- @cryptostats/sdk (framework-agnostic core)
- mongodb, redis, pg
- date-fns, numeral, sharp

### 1.3 Configuration Files

**nuxt.config.ts:**
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  app: {
    head: {
      title: 'CryptoFees.info',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'There\'s tons of crypto projects. Which ones are people actually paying to use?' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://use.typekit.net/jrq0bbf.css' },
      ],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  runtimeConfig: {
    mongoUri: process.env.MONGO_URI,
    redisUrl: process.env.REDIS_URL,
    pgConnectionString: process.env.PG_CONNECTION_STRING,
    public: {
      plausibleDomain: 'cryptofees.info',
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  devtools: { enabled: true },
})
```

---

## Phase 2: Directory Structure Migration

### 2.1 Create Nuxt 3 Directory Structure

```
crypto-fees/
├── app.vue                    # Root component (NEW)
├── nuxt.config.ts             # Nuxt config (NEW)
├── pages/                     # Keep, convert to Vue
│   ├── index.vue              # <- index.tsx
│   ├── faqs.vue               # <- faqs.tsx
│   ├── api-docs.vue           # <- api-docs.tsx
│   ├── submit-project.vue     # <- submit-project.tsx
│   ├── 2021.vue               # <- 2021.tsx
│   ├── protocol/
│   │   └── [id].vue           # <- protocol/[id].tsx
│   └── history/
│       └── [date].vue         # <- history/[date].tsx
├── components/                # Keep, convert to Vue
│   ├── List.vue               # <- List.tsx
│   ├── Row.vue                # <- Row.tsx
│   ├── Chart.vue              # <- Chart.tsx
│   ├── Footer.vue             # <- Footer.tsx
│   ├── Header.vue             # NEW (replace @cryptostats/header)
│   ├── SponsorCTA.vue         # NEW (replace @cryptostats/sponsor_cta)
│   └── ... (all other components)
├── composables/               # NEW
│   ├── useFees.ts             # Fee data fetching
│   ├── useProtocols.ts        # Protocol data
│   └── useFilters.ts          # Filter state
├── stores/                    # NEW (Pinia)
│   ├── fees.ts                # Fee data store
│   └── ui.ts                  # UI state store
├── server/                    # NEW (replaces pages/api)
│   ├── routes/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── fees.ts
│   │   │   │   ├── feesByDay.ts
│   │   │   │   └── protocols.ts
│   │   │   ├── social/
│   │   │   │   ├── [id].ts
│   │   │   │   └── top.png.ts
│   │   │   ├── screenshot.ts
│   │   │   └── historic-data.csv.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── db.ts              # Database connections
│   │   ├── mongo.ts           # <- data/db/mongo.ts
│   │   ├── redis.ts           # <- data/db/redis.ts
│   │   └── api-handler.ts     # <- utils/api.ts
│   └── middleware/
│       └── db.ts              # DB initialization
├── data/                      # Keep, minimal changes
│   ├── adapters/              # Keep as-is
│   ├── lib/                   # Keep as-is
│   ├── queries.ts             # Keep as-is
│   ├── utils.ts               # Keep as-is
│   ├── types.ts               # Keep as-is
│   └── sdk.ts                 # Keep as-is
├── assets/
│   └── css/
│       └── main.css           # Global styles
├── public/                    # Keep as-is
└── types/                     # NEW
    └── index.d.ts             # Global type definitions
```

### 2.2 Files to Delete After Migration

```
Delete after Vue conversion complete:
- pages/_app.tsx
- pages/_document.tsx (if exists)
- next.config.js
- .babelrc
- All .tsx files in pages/ and components/
- i18n.json (simplified to English)
```

---

## Phase 3: Component Migration

### 3.1 Migration Order (by dependency)

1. **Utility/Leaf Components** (no dependencies on other custom components)
   - Icon.tsx -> Icon.vue
   - Button components
   - Modal.tsx -> Modal.vue

2. **Data Display Components**
   - Row.tsx -> Row.vue
   - ProtocolDetails.tsx -> ProtocolDetails.vue

3. **Complex Components**
   - List.tsx -> List.vue
   - Chart.tsx -> Chart.vue (with vue-chartjs or wrapped recharts)

4. **Layout Components**
   - Header.vue (NEW - replace @cryptostats/header)
   - Footer.tsx -> Footer.vue
   - SponsorCTA.vue (NEW - replace @cryptostats/sponsor_cta)

5. **Page Components**
   - index.tsx -> index.vue
   - protocol/[id].tsx -> protocol/[id].vue
   - history/[date].tsx -> history/[date].vue
   - Other pages

### 3.2 React to Vue Conversion Patterns

| React Pattern | Vue 3 Equivalent |
|---------------|------------------|
| `useState` | `ref()` or `reactive()` |
| `useEffect` | `onMounted`, `watch`, `watchEffect` |
| `useMemo` | `computed()` |
| `useCallback` | Regular function (Vue handles reactivity) |
| `useContext` | `provide/inject` or Pinia store |
| `props` | `defineProps<T>()` |
| `children` | `<slot />` |
| `className` | `class` |
| `onClick` | `@click` |
| `onChange` | `@update:modelValue` or `@change` |
| `style={{ }}` | `:style="{ }"` |
| `{condition && <Component />}` | `<Component v-if="condition" />` |
| `{items.map(item => <Item />)}` | `<Item v-for="item in items" />` |
| `<style jsx>` | `<style scoped>` |

### 3.3 Example Conversion: Row Component

**Before (React):**
```tsx
const Row: React.FC<RowProps> = ({ protocol, sort }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`row ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <span>{protocol.name}</span>
      <span>${protocol.fees.toFixed(2)}</span>
      <style jsx>{`
        .row { padding: 10px; }
        .open { background: #f0f0f0; }
      `}</style>
    </div>
  );
};
```

**After (Vue):**
```vue
<script setup lang="ts">
interface Props {
  protocol: Protocol
  sort: string
}

const props = defineProps<Props>()
const open = ref(false)
</script>

<template>
  <div :class="['row', { open }]" @click="open = !open">
    <span>{{ protocol.name }}</span>
    <span>${{ protocol.fees.toFixed(2) }}</span>
  </div>
</template>

<style scoped>
.row { padding: 10px; }
.open { background: #f0f0f0; }
</style>
```

---

## Phase 4: State Management (Pinia)

### 4.1 Stores to Create

**stores/fees.ts:**
```typescript
export const useFeesStore = defineStore('fees', () => {
  const protocols = ref<Protocol[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  async function fetchFees() {
    isLoading.value = true
    try {
      const data = await $fetch('/api/v1/fees')
      protocols.value = data
      lastUpdated.value = new Date()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return { protocols, isLoading, error, lastUpdated, fetchFees }
})
```

**stores/ui.ts:**
```typescript
export const useUIStore = defineStore('ui', () => {
  const filterCardOpen = ref(false)
  const shareModalOpen = ref(false)
  const sortBy = ref<'daily' | 'weekly'>('daily')
  const bundlingEnabled = ref(false)
  const activeFilters = ref<Filters>({ categories: [], chains: [] })

  return {
    filterCardOpen,
    shareModalOpen,
    sortBy,
    bundlingEnabled,
    activeFilters,
  }
})
```

---

## Phase 5: Server Routes Migration

### 5.1 API Route Mapping

| Next.js Route | Nuxt 3 Route |
|---------------|--------------|
| pages/api/v1/fees.ts | server/routes/api/v1/fees.ts |
| pages/api/v1/feesByDay.ts | server/routes/api/v1/feesByDay.ts |
| pages/api/v1/protocols.ts | server/routes/api/v1/protocols.ts |
| pages/api/social/[id].ts | server/routes/api/social/[id].ts |
| pages/api/social/top.png.ts | server/routes/api/social/top.png.ts |
| pages/api/screenshot.ts | server/routes/api/screenshot.ts |
| pages/api/historic-data.csv.ts | server/routes/api/historic-data.csv.ts |
| pages/api/index.ts | server/routes/api/index.ts |

### 5.2 Example Conversion: fees.ts

**Before (Next.js):**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getFees();
  res.setHeader('Cache-Control', 's-maxage=900');
  res.json(data);
}
```

**After (Nuxt 3):**
```typescript
export default defineEventHandler(async (event) => {
  const data = await getFees()

  setHeader(event, 'Cache-Control', 's-maxage=900')

  return data
})
```

---

## Phase 6: Data Fetching Migration

### 6.1 getStaticProps -> useAsyncData

**Before (Next.js):**
```typescript
export const getStaticProps: GetStaticProps = async () => {
  const data = await getFees();
  return {
    props: { data },
    revalidate: 1200,
  };
};
```

**After (Nuxt 3):**
```vue
<script setup lang="ts">
const { data, refresh } = await useAsyncData('fees', () => $fetch('/api/v1/fees'), {
  // ISR-like behavior configured in nuxt.config.ts routeRules
})
</script>
```

### 6.2 Route Rules for Caching

Add to nuxt.config.ts:
```typescript
routeRules: {
  '/': { isr: 1200 }, // 20 minutes
  '/api/v1/**': { headers: { 'cache-control': 's-maxage=900' } },
}
```

---

## Phase 7: Styling Migration

### 7.1 Global Styles

Create `assets/css/main.css` with:
- Font imports (sofia-pro from Typekit)
- CSS variables for colors
- Base reset styles
- Common utility classes

### 7.2 Component Style Migration

Convert each `<style jsx>` block to `<style scoped>`:
- Remove template literals
- Keep CSS as-is (syntax is identical)
- Use CSS variables for theming

---

## Phase 8: Header & Sponsor Components

### 8.1 Replace @cryptostats/header

Create custom Header.vue component that:
- Matches the visual design of the current header
- Links to CryptoStats ecosystem sites
- Handles mobile responsiveness

### 8.2 Replace @cryptostats/sponsor_cta

Create custom SponsorCTA.vue component:
- Display sponsor information
- CTA button styling
- Optional dismissal

---

## Phase 9: Testing & Cleanup

### 9.1 Testing Checklist

- [ ] Home page loads with protocol data
- [ ] Protocol detail pages render correctly
- [ ] History pages work with date picker
- [ ] All API endpoints return correct data
- [ ] Filters work correctly
- [ ] Bundling toggle works
- [ ] Charts render properly
- [ ] Share functionality works
- [ ] Mobile responsive layout
- [ ] Caching headers correct
- [ ] Database connections stable

### 9.2 Cleanup Tasks

1. Remove all React/Next.js files
2. Remove unused dependencies from package.json
3. Update README.md with new dev instructions
4. Remove .babelrc, next.config.js
5. Update TypeScript config
6. Update CI/CD configuration (if any)

---

## Phase 10: Deployment

### 10.1 Environment Variables

Ensure all env vars are set:
```
NUXT_MONGO_URI=
NUXT_REDIS_URL=
NUXT_PG_CONNECTION_STRING=
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=cryptofees.info
```

### 10.2 Build & Deploy

```bash
npm run build
npm run preview  # Test production build locally
```

---

## Migration Tracking

### Estimated Component Count

| Category | Count | Status |
|----------|-------|--------|
| Pages | 7 | Pending |
| Components | 23 | Pending |
| API Routes | 8 | Pending |
| Stores | 2 | Pending |
| Composables | 3 | Pending |

### Critical Dependencies

1. Chart library decision (vue-chartjs vs wrapped recharts)
2. Date picker component selection
3. Select component selection
4. Tooltip/popover library selection

---

## Questions to Resolve Before Starting

1. **Charts**: Should we use vue-chartjs (native Vue) or wrap recharts? Vue-chartjs would be cleaner but requires rewriting chart configurations.

2. **Image Generation**: The social card generation uses sharp + canvas. This should work in Nuxt 3 server routes but may need testing.

3. **CryptoStats SDK**: The SDK loads adapters dynamically. Need to verify this works in Nuxt 3's server context.

---

## Ready for Approval

Please review this plan and let me know:
1. If you approve, I'll begin Phase 1
2. Any modifications needed
3. Priority order preferences
4. Any components/pages to skip initially
