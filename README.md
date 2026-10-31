# Portfolio · Junior Dofonsou

Site portfolio de Junior Dofonsou, développeur web (frontend, API, e-commerce).
Phase 1 du plan technique (doc ClickUp « Portfolio Junior Dofonsou · Plan technique ») : portfolio V1, sans base de données.

**Stack** : Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · lucide-react · simple-icons (logos) · next/font (Jost, Hind, DM Mono, Caveat).

**Langues** : français (`/fr`) et anglais (`/en`). La racine `/` redirige vers `/en` si le navigateur est en anglais, sinon vers `/fr`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigne les valeurs
npm run dev                  # http://localhost:3000
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (affiche les badges « À confirmer ») |
| `npm run build` | Build de production (badges masqués) |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run format` | Prettier + tri des classes Tailwind |

## Variables d'environnement

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Oui en production | URL publique, utilisée par le SEO, le sitemap et l'image Open Graph |
| `NEXT_PUBLIC_BOOKING_URL` | Non | Lien Cal.com ou Calendly. Vide : le bouton « Réserver un appel » est remplacé par LinkedIn / Contact |

## Structure

```
src/
  app/
    [lang]/               Toutes les pages, en double : /fr/... et /en/...
      layout.tsx          Layout racine (<html lang>, polices, header, footer, SEO hreflang)
      page.tsx            Accueil
      parcours/           Parcours, citation, objectifs, expériences, compétences
      projets/            Liste filtrable + Labo
      projets/[slug]/     Étude de cas (générée statiquement, 2 langues)
      services/  contact/
      not-found.tsx, opengraph-image.tsx
    sitemap.ts, robots.ts, icon.svg, globals.css
  components/
    site/                 Header, LangSwitch, Hero, Fibers, SkillsBoard, TechLogo, SignedQuote, Objectives, Results…
    ui/                   Badges, boutons
  content/                TOUT le contenu, en FR et EN (types.ts)
  i18n/
    config.ts             Langues, liens localisés
    dictionaries.ts       Textes d'interface FR / EN
    seo.ts                canonical + hreflang
  lib/                    Couleurs des fibres, utilitaires
public/
  cv/                     CV-Junior-Dofonsou-FR.pdf et CV-Junior-Dofonsou-EN.pdf
  images/                 Photo de profil
  projects/<slug>/        Captures des projets
```

## Traduire

- **Textes d'interface** (boutons, titres, menus) : `src/i18n/dictionaries.ts`. L'anglais a le même type que le français : une clé oubliée casse `npm run typecheck`.
- **Contenu** : chaque fichier de `src/content/` a un bloc `fr` et un bloc `en` (projets, services, parcours, compétences, citation, objectifs, chiffres).
- **Ajouter une langue** : ajoute-la dans `locales` (`src/i18n/config.ts`), puis TypeScript te montre tous les textes à remplir.
- **Logos** : `src/components/site/TechLogo.tsx` prend les logos officiels dans `simple-icons`. Si une marque n'y est pas (VS Code, Chariow…), c'est la version dessinée de `LogoMarks.tsx` qui s'affiche.

## Modifier le contenu

Tout est dans `src/content/`. Aucune donnée n'est codée en dur dans les pages.

- **Ajouter un projet** : copie un bloc dans `src/content/projects.ts`, change le `slug` (il devient l'URL `/fr/projets/<slug>` et `/en/projets/<slug>`), remplis `text.fr` et `text.en`.
- **Ajouter une capture** : dépose l'image (WebP, 1600 px de large max, sans données clients) dans `public/projects/<slug>/`, puis :

  ```ts
  images: [{ src: "/projects/vibecore/accueil.webp", width: 1600, height: 1000, alt: { fr: "Page d'accueil de la boutique VIBECORE", en: "VIBECORE store homepage" } }],
  ```

- **Mettre un projet en avant sur l'accueil** : `featured: true`.
- **Masquer un projet** : `published: false`.
- **Résultats chiffrés** : uniquement vérifiables, et `resultsSource` est obligatoire, sinon le bloc ne s'affiche pas. Les chiffres de l'accueil sont dans `src/content/results.ts`.
- **Infos à valider** : liste-les dans `pending`. Elles s'affichent en jaune en développement et **jamais en production**.

## Avant la mise en ligne

Lance `npm run dev` et parcours les projets : chaque badge jaune est une info à compléter.
À date, il manque surtout les **captures** (tous les projets), l'**accord du client VIBECORE**, et ta **part exacte** dans le stage CI-TECH.

## Déploiement

Vercel ou Netlify, branchés sur ce dépôt GitHub : chaque push sur `main` déploie, chaque branche a son aperçu.
Pense à définir `NEXT_PUBLIC_SITE_URL` dans les variables d'environnement de l'hébergeur.

⚠️ L'offre gratuite Hobby de Vercel est réservée à un usage non commercial. Un portfolio qui reçoit des demandes de devis peut être considéré comme commercial : vérifie les conditions, sinon utilise Netlify ou l'offre Pro.

## Checklist de fin de sprint

- [ ] `npm run lint` et `npm run typecheck` sans erreur
- [ ] `npm run build` sans erreur
- [ ] Lighthouse mobile ≥ 90 (performance, accessibilité, SEO, bonnes pratiques)
- [ ] Navigation complète au clavier (Tab, Entrée, menu mobile)
- [ ] Test sur un vrai téléphone Android en 4G
- [ ] Animations désactivées avec « Réduire les animations » activé dans le système

## Prochaines phases

2. Conversion : formulaires message et devis (Server Actions + Zod + Supabase + Resend), Turnstile, Cal.com intégré
3. Admin : Supabase Auth, gestion des projets, services, demandes et rendez-vous
4. Christ : assistant IA basé uniquement sur le contenu validé
