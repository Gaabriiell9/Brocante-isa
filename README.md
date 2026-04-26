# Brocante d'Isabella

Site de vide-dressing minimaliste et élégant, prêt à déployer sur Vercel.

**Stack** : Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Supabase (Postgres + Storage + Auth)

---

## Fonctionnalités

### Côté public
- Grille de produits avec filtre par catégorie
- Page détail avec galerie photos (navigation, miniatures, dots)
- Bouton de contact WhatsApp + email pré-rempli
- Section "Déjà vendus" séparée
- Statuts visuels : disponible / réservé / vendu
- SEO : Open Graph, sitemap automatique, ISR (revalidation 30s)

### Côté admin (`/admin`)
- Login email/password (Supabase Auth)
- Tableau de bord avec stats (total, disponibles, réservés, CA généré)
- Ajout/édition/suppression d'articles
- Upload multi-photos avec drag-and-drop, réorganisation et suppression
- Marquage rapide du statut (disponible / réservé / vendu)
- Routes protégées par middleware

---

## Installation

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

**a)** Créer un projet sur [supabase.com](https://supabase.com)

**b)** Dans le SQL Editor, exécuter le contenu de `supabase/schema.sql`. Ça crée :
- La table `products` avec tous les champs et triggers
- Les policies RLS (lecture publique, écriture authentifiée)
- Le bucket Storage `product-images` (public, max 10 MB)
- Les policies du bucket

**c)** Créer le compte admin pour Isabella :
- Aller dans **Authentication > Users > Add user**
- Choisir "Create new user", entrer son email et un mot de passe
- ⚠️ **Important** : laisser "Auto Confirm User" coché

### 3. Variables d'environnement

Copier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Puis remplir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_SITE_NAME=Brocante d'Isabella
NEXT_PUBLIC_WHATSAPP_NUMBER=33612345678
NEXT_PUBLIC_CONTACT_EMAIL=isabella@exemple.com
```

> Pour `NEXT_PUBLIC_WHATSAPP_NUMBER` : format international **sans le `+`** (ex. `33612345678` pour la France, `594694123456` pour la Guyane).

### 4. Lancer en dev

```bash
npm run dev
```

Site accessible sur http://localhost:3000  
Admin sur http://localhost:3000/admin

---

## Déploiement Vercel

```bash
# Si pas encore fait
npm install -g vercel

# Depuis le dossier du projet
vercel
```

Pendant le setup :
- Lier au compte Vercel
- Choisir un nom de projet
- Configurer les variables d'environnement (les mêmes que `.env.local`)

Ensuite, pour les déploiements suivants :

```bash
vercel --prod
```

Ou pousser sur `main` si le projet est lié à GitHub.

### Domaine personnalisé

Ajouter dans Vercel > Settings > Domains. Si tu veux le sous-domaine `brocante.gf-web.fr` ou `isabella.gf-web.fr`, créer un CNAME chez Cloudflare pointant vers Vercel.

---

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx              # Layout racine + fonts (Fraunces + Manrope)
│   ├── page.tsx                # Accueil (grille de produits)
│   ├── globals.css             # Tailwind + variables CSS
│   ├── not-found.tsx           # 404
│   ├── product/[id]/page.tsx   # Page détail produit
│   └── admin/
│       ├── page.tsx            # Login
│       ├── dashboard/page.tsx  # Tableau de bord
│       ├── new/page.tsx        # Nouvel article
│       └── edit/[id]/page.tsx  # Édition article
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx         # Carte produit (grille)
│   ├── ImageGallery.tsx        # Galerie page détail
│   ├── ImageUploader.tsx       # Upload + drag-reorder
│   ├── ProductForm.tsx         # Formulaire create/edit
│   ├── ContactButtons.tsx      # WhatsApp + email
│   ├── CategoryFilter.tsx      # Filtre catégories
│   └── LogoutButton.tsx
├── lib/
│   ├── supabase-browser.ts     # Client Supabase navigateur
│   └── supabase-server.ts      # Client Supabase serveur
├── middleware.ts               # Protection routes /admin/*
└── types/product.ts            # Types + labels (FR)
```

---

## Personnalisation rapide

### Couleurs (palette cream / terracotta)
Modifier `tailwind.config.ts` (clés `cream`, `ink`, `terracotta`, `sage`).

### Typo
Dans `src/app/layout.tsx`, remplacer `Fraunces` / `Manrope` par d'autres polices Google Fonts.

### Catégories
Ajouter des catégories dans :
- `supabase/schema.sql` (contrainte `check`)
- `src/types/product.ts` (`ProductCategory` + `CATEGORY_LABELS`)
- `src/components/CategoryFilter.tsx` (tableau `CATEGORIES`)

### Texte du hero
Dans `src/app/page.tsx`, section `Hero`.

---

## Notes techniques

- **ISR (Incremental Static Regeneration)** : pages publiques avec `revalidate = 30` → les nouveaux articles apparaissent dans les 30s sans rebuild.
- **Sécurité** : RLS Supabase = même si quelqu'un récupère la `ANON_KEY` (publique), il ne peut que lire. Toute écriture nécessite une session authentifiée valide.
- **Upload** : direct depuis le navigateur vers Supabase Storage avec la session JWT. Pas besoin d'API route intermédiaire.
- **Slugs** : générés automatiquement via trigger Postgres à l'insert.

---

## TODO / améliorations futures

- [ ] Recherche par mot-clé
- [ ] Tri (prix asc/desc, plus récent)
- [ ] Compression d'image côté client avant upload (sharp ou browser-image-compression)
- [ ] Notifications email automatiques quand un article est marqué "réservé"
- [ ] PWA pour ajout depuis mobile

Bonne brocante ! 🌿
