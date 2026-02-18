# Template Next.js – Hakuna Mataweb

Template de base pour tous les projets frontend.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19

## Déploiement

- Prévu pour Vercel
- Variables d'environnement via `.env.local`

## Utilisation

### 1. Initialisation

```bash
# Copier ce template
cp -r templates/nextjs-base projects/clients/mon-projet-frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
```

### 2. Configuration Strapi

Ajoutez dans `.env.local` :

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=votre-token-api
```

### 3. Configuration ISR (Revalidation)

Le template inclut la configuration ISR (Incremental Static Regeneration) pour régénérer automatiquement les pages quand le contenu Strapi change.

#### ⚡ Mode de base (Recommandé - Fonctionne immédiatement)

**Pas besoin de webhook !** L'ISR fonctionne avec une revalidation temporelle :

- Les pages se régénèrent automatiquement toutes les heures
- Configuration minimale, fonctionne out-of-the-box
- Suffisant pour la plupart des sites web

#### 🚀 Mode avancé (Revalidation instantanée - Optionnel)

Pour des mises à jour instantanées quand le contenu change dans Strapi :

#### Variables d'environnement

Ajoutez dans `.env.local` (optionnel - seulement si vous voulez la revalidation instantanée) :

```env
REVALIDATE_SECRET=Brnb60gSKW3YOOWwZmWXX425mxv5fRpT1QKYCgk6e88=
```

#### Configuration dans Strapi

1. Allez dans **Settings > Webhooks** dans Strapi
2. Créez un nouveau webhook :
   - **Name**: `Next.js Revalidation`
   - **URL**: `https://votre-domaine.com/api/revalidate`
   - **Headers**: `x-webhook-secret: Brnb60gSKW3YOOWwZmWXX425mxv5fRpT1QKYCgk6e88=`
   - **Events**: Cochez `Entry publish`, `Entry update`, `Entry delete` pour le Content-Type `page`

#### Comment ça marche

- **Revalidation temporelle** (toujours active) : Les pages se régénèrent automatiquement toutes les heures
- **Revalidation à la demande** (optionnel) : Quand Strapi détecte un changement, il appelle le webhook qui invalide le cache immédiatement
- **Cache intelligent** : Utilise `unstable_cache` avec des tags pour une invalidation précise

### 4. Configuration du Preview Strapi (Recommandé)

Permettez aux éditeurs de prévisualiser les brouillons avant publication.

#### Variables d'environnement

Ajoutez dans `.env.local` :

```env
# Token Strapi avec accès aux brouillons (Full Access)
STRAPI_PREVIEW_TOKEN=votre-token-preview-256-chars

# Secret pour sécuriser l'endpoint de preview
PREVIEW_SECRET=votre-secret-aleatoire-44-chars

# Activer le Draft Mode (recommandé)
USE_DRAFT_MODE=true
```

**Générer les tokens** :

```bash
# Preview Secret (32 bytes minimum)
openssl rand -base64 32

# Token Preview : créez-le dans Strapi Admin
# Settings → API Tokens → Create (type: Full Access)
```

#### Configuration Strapi Preview Button

Dans Strapi Admin, configurez l'URL de preview :

1. **Content-Type Builder** → Sélectionnez votre Content-Type (ex: `Page`)
2. **Configure the view** → **Settings**
3. **Enable preview** : `true`
4. **Preview URL** :
   ```
   {NEXT_PUBLIC_SITE_URL}/api/preview?url={url}&secret={PREVIEW_SECRET}&status={status}
   ```

**⚠️ Important** : Strapi v5 utilise `status=draft/published` (breaking change depuis v4).

Le starter inclut une **conversion automatique** de `publicationState` vers `status`.

#### Comment ça marche

- Clic sur "Preview" dans Strapi → Active Draft Mode → Affiche le brouillon
- Clic sur "Published" → Désactive Draft Mode → Affiche la version publiée
- Draft Mode = cookie persistant, reste actif jusqu'à désactivation

#### Désactiver manuellement

Visitez `/api/draft/disable?returnUrl=/` pour sortir du mode preview.

📖 Documentation complète : [../../docs/strapi-preview-setup.md](../../docs/strapi-preview-setup.md)

---

### 5. Types TypeScript Strapi

#### Synchronisation des types

Les types sont générés côté Strapi et synchronisés automatiquement.

```bash
# Synchroniser les types depuis Strapi
npm run sync:types
```

#### Utilisation dans le code

Les types sont maintenant disponibles avec autocomplétion complète :

```tsx
import { createStrapiClient } from '@/lib/strapi-client'
import type { Page, PageEntity, PageCollectionResponse } from '@/types/strapi'

// Créer le client
const strapi = createStrapiClient({
  apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL!,
  apiToken: process.env.STRAPI_API_TOKEN,
})

// Récupérer des données avec types complets
export async function getPages(): Promise<PageEntity[]> {
  const response: PageCollectionResponse = await strapi.findMany<Page>(
    'pages',
    {
      sort: ['createdAt:desc'],
      pagination: { pageSize: 100 },
    }
  )

  return response.data
}

// Utilisation dans un Server Component
export default async function PagesPage() {
  const pages = await getPages()

  return (
    <div>
      {pages.map((page) => (
        <article key={page.id}>
          {/* TypeScript connaît la structure exacte */}
          <h2>{page.attributes.title}</h2>
          {/* Autocomplétion sur page.attributes.* */}
        </article>
      ))}
    </div>
  )
}
```

#### Quand synchroniser ?

- Après chaque modification de Content-Type dans Strapi
- Après un `git pull` qui modifie les schemas Strapi
- Au début d'un nouveau sprint de développement

#### Structure des fichiers

```
nextjs-base/
├── src/
│   ├── types/
│   │   └── strapi/
│   │       └── index.ts           # Types synchronisés (NE PAS MODIFIER)
│   ├── lib/
│   │   ├── strapi-client.ts       # Client Strapi typé
│   │   └── strapi-usage-example.tsx  # Exemples d'utilisation
│   └── app/                       # Vos pages et composants
└── scripts/
    └── sync-types-from-strapi.js  # Script de synchronisation
```

### 6. Développement

```bash
# Lancer le serveur de développement
npm run dev

# Le site est accessible sur http://localhost:3000
```

### 7. Build et déploiement

```bash
# Build de production
npm run build

# Tester le build localement
npm start

# Déployer sur Vercel
vercel
```

## Client Strapi typé

Le template inclut un client Strapi complet avec support TypeScript.

### Méthodes disponibles

```typescript
// Récupérer une collection
strapi.findMany<T>(contentType, options)

// Récupérer une entrée par ID
strapi.findOne<T>(contentType, id, options)

// Créer une entrée
strapi.create<T>(contentType, data)

// Mettre à jour
strapi.update<T>(contentType, id, data)

// Supprimer
strapi.delete<T>(contentType, id)
```

### Options de requête

```typescript
{
  populate: '*',                    // ou ['author', 'image']
  filters: { title: { $eq: 'Hello' } },
  sort: ['createdAt:desc'],
  pagination: { page: 1, pageSize: 10 },
  fields: ['title', 'content'],
  locale: 'fr',
  publicationState: 'live'
}
```

### Exemples complets

Consultez [src/lib/strapi-usage-example.tsx](src/lib/strapi-usage-example.tsx) pour des exemples détaillés.

## Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run sync:types   # Synchroniser les types Strapi
npm run lighthouse   # Test de performance Lighthouse
```

## Test de performance

Le template inclut un outil de test Lighthouse pour mesurer les performances, l'accessibilité, le SEO et les bonnes pratiques.

### Lancer un test Lighthouse

```bash
# Les serveurs Next.js et Strapi doivent être démarrés
npm run lighthouse
```

Les rapports sont générés dans `.lighthouse/` :

- `report.report.html` - Rapport visuel détaillé
- `report.report.json` - Données brutes JSON

### Scores recommandés

- **Performance** : > 90
- **Accessibilité** : > 95
- **Best Practices** : > 95
- **SEO** : > 90

Consultez `.lighthouse/README.md` pour plus de détails.

## Configuration TypeScript

Le projet est configuré avec des options strictes pour une sécurité maximale :

- Types Strapi auto-générés
- Autocomplétion complète
- Détection des erreurs à la compilation

## Bonnes pratiques

### Types Strapi

- ✅ Utilisez toujours les types générés
- ✅ Synchronisez régulièrement avec `npm run sync:types`
- ❌ Ne modifiez jamais `src/types/strapi/index.ts`
- ✅ Utilisez le client Strapi typé pour les requêtes

### Structure des données

```typescript
// ❌ Mauvais : accès direct sans types
const title = data.attributes.title // Pas d'autocomplétion

// ✅ Bon : avec types
const response: PageResponse = await strapi.findOne<Page>('pages', id)
const title = response.data?.attributes.title // Autocomplétion !
```

### Gestion des erreurs

```typescript
try {
  const pages = await strapi.findMany<Page>('pages')
  return pages.data
} catch (error) {
  console.error('Erreur Strapi:', error)
  return []
}
```

## Troubleshooting

### Types non trouvés

```bash
# Vérifier que les types existent
ls -la src/types/strapi/

# Synchroniser depuis Strapi
npm run sync:types
```

### Types obsolètes

```bash
# Depuis le projet Strapi
cd ../strapi-base
npm run types

# Revenir sur Next.js et synchroniser
cd ../nextjs-base
npm run sync:types
```

### Erreurs TypeScript

Si TypeScript ne trouve pas les types :

1. Vérifiez que `src/types/strapi/index.ts` existe
2. Relancez le serveur de développement
3. Rechargez VS Code (Cmd+Shift+P > "Reload Window")

## Variables d'environnement

### Développement (`.env.local`)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=votre-token-de-dev
STRAPI_PREVIEW_TOKEN=votre-token-preview-full-access
PREVIEW_SECRET=votre-secret-aleatoire
USE_DRAFT_MODE=true
# (Optionnel) Désactiver le mode sombre globalement dans le starter :
# NEXT_PUBLIC_DISABLE_DARK=true
```

Vous pouvez désactiver le mode sombre globalement en définissant `NEXT_PUBLIC_DISABLE_DARK=true` dans votre `.env.local`. Quand cette variable est vraie, le starter ajoute un attribut `data-disable-dark` sur la balise `<html>` empêchant l'application des règles CSS liées au mode sombre (définies via `@media (prefers-color-scheme: dark)`).

> **Note:** `NEXT_PUBLIC_SITE_URL` est utilisé pour générer les URLs absolues du site (par ex. `sitemap.xml` et `robots.txt`) et sert aussi de `metadataBase` pour la génération des metadata. Définissez-le en local et en production (ex: Vercel) avec votre domaine, ex: `NEXT_PUBLIC_SITE_URL=https://mon-site.com`.

### Production (Vercel)

Configurez les mêmes variables dans l'interface Vercel :

- `NEXT_PUBLIC_STRAPI_URL` : URL de production Strapi
- `STRAPI_API_TOKEN` : Token API de production

⚠️ **Ne jamais modifier ce template directement**  
Pour un nouveau projet : copiez le dossier complet dans `/projects/clients/`
