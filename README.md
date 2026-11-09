# Portfolio · Junior Dofonsou

Site portfolio de Junior Dofonsou, développeur web (frontend, API, e-commerce).
Phases 1 et 2 du plan technique (doc ClickUp « Portfolio Junior Dofonsou · Plan technique ») : portfolio bilingue + formulaires de contact, devis et rendez-vous.

**Stack** : Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS 4 · lucide-react · simple-icons (logos) · next/font (Jost, Hind, DM Mono, Caveat) · Supabase · Brevo ou Resend · Cloudflare Turnstile · Cal.com.

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

Copie `.env.example` en `.env.local` (Windows : `Copy-Item .env.example .env.local`). Tout est commenté dans le fichier.

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, sitemap, Open Graph). Obligatoire en production |
| `NEXT_PUBLIC_CAL_LINK` | Lien Cal.com, ex. `juniordofonsou/30min` : agenda intégré dans Contact > Rendez-vous |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Enregistre les demandes en base. **La clé service_role est secrète** |
| `EMAIL_PROVIDER`, `BREVO_API_KEY` ou `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_TO` | E-mails : notification pour toi + accusé de réception pour le visiteur (Brevo ou Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Anti-spam Cloudflare Turnstile |

## Phase 2 · Formulaires (message, devis, rendez-vous)

La page Contact a trois onglets : **Message**, **Devis** (guidé en 4 étapes) et **Rendez-vous** (Cal.com).
Liens directs possibles : `/fr/contact#devis`, `/fr/contact#devis-shopify` (prestation présélectionnée), `/fr/contact#rdv`.

**Ce qui se passe à l'envoi** (`src/app/[lang]/contact/actions.ts`) :
1. Champ piège + envoi trop rapide → le robot croit que c'est envoyé, rien n'est enregistré.
2. Validation de tous les champs côté serveur.
3. Vérification Turnstile (si configuré).
4. Limite : 3 demandes par heure et par connexion (IP hachée, jamais stockée en clair).
5. Enregistrement dans Supabase, avec une référence `MSG-0001` / `DV-0001`.
6. Deux e-mails (Brevo ou Resend) : une notification pour toi (tu réponds directement au visiteur) et un accusé de réception dans sa langue.

**Sans aucune configuration**, en `npm run dev`, les formulaires marchent quand même : la demande s'affiche dans le terminal. En production, sans Supabase ni service d'e-mail, le formulaire affiche ton e-mail à la place.

### Mise en place (une fois, environ 30 min)

1. **Supabase** (gratuit) : crée un projet, ouvre *SQL Editor*, colle le contenu de `supabase/migrations/0001_leads.sql`, exécute. Récupère l'URL et la clé `service_role` dans *Project Settings > API*.
2. **E-mails, au choix** :
   - **Brevo** (gratuit, 300 e-mails par jour) : *Senders* > ajoute et valide ton adresse, puis *SMTP & API* > *API Keys* > crée une clé. Sans domaine vérifié, Brevo envoie quand même, avec une adresse d'expéditeur à lui. Dès que tu as un domaine, authentifie-le dans *Domains*.
   - **Resend** (gratuit, 3 000 par mois) : sans domaine vérifié, il n'envoie qu'à ta propre adresse (notification oui, accusé de réception non).
3. **Cloudflare Turnstile** (gratuit) : *Turnstile > Add site*, ajoute ton domaine et `localhost`, récupère les deux clés.
4. **Cal.com** (gratuit) : crée un événement « Appel découverte » de 30 min, mets ton lien dans `NEXT_PUBLIC_CAL_LINK`.
5. Ajoute les mêmes variables chez ton hébergeur (Netlify > Site configuration > Environment variables), puis redéploie.

### Tester avant la mise en ligne
- [ ] Un message et un devis arrivent dans ta boîte mail **et** dans Supabase (*Table Editor > leads*)
- [ ] L'accusé de réception arrive, en français depuis `/fr` et en anglais depuis `/en`
- [ ] 4 envois de suite → le 4e est refusé
- [ ] Avec la clé publique `anon`, `leads` est illisible (RLS)
- [ ] L'agenda Cal.com s'affiche dans l'onglet Rendez-vous

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

2. ~~Conversion~~ : fait (voir plus haut)
3. Admin : Supabase Auth, gestion des projets, services, demandes et rendez-vous
4. Christ : assistant IA basé uniquement sur le contenu validé
