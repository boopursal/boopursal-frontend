# Guide de Migration : React vers Next.js (Architecture Pro)

Ce projet `next-client` est la nouvelle version frontend de votre application "Les Achats Industriels".
Il cohabite avec l'ancien backend Symfony sans le modifier.

## 🚀 Démarrage

Pour lancer le projet en local :

```bash
cd next-client
npm run dev
```

Visitez `http://localhost:3000/login` pour voir le nouveau design.

## 📁 Structure du Projet

- **`/app`** : Les pages de l'application (Router Next.js 13+).
    - `/login` : Nouvelle page de connexion (Exemple Premium).
    - `/dashboard` : (À créer) Votre futur tableau de bord.
- **`/lib`** : Logique métier et utilitaires.
    - `api.ts` : Client Axios configuré pour parler à votre API Symfony existing.
- **`/components`** : Vos composants réutilisables (Boutons, Cartes, etc.).

## 🛠 Comment migrer une page (Exemple)

Prenons l'exemple de la page "Fournisseurs".

1. **Créer la route** : Créez le dossier `app/fournisseurs/page.tsx`.
2. **Récupérer les données** :
   ```typescript
   import api from '@/lib/api';

   // Dans votre composant
   const fetchFournisseurs = async () => {
       const response = await api.get('/api/fournisseurs');
       return response.data;
   }
   ```
3. **Appliquer le Design** : Utilisez les classes TailwindCSS au lieu de useStyles (Material-UI).

## 🎨 Palette de Couleurs & Design

Nous utilisons une approche "Dark Mode Premium" par défaut pour le login, mais le système supporte le mode clair.
- **Fond** : Slate 900 (`bg-slate-900`) pour une profondeur élégante.
- **Accents** : Blue 600 (`text-blue-600`) pour la confiance.
- **Glassmorphism** : `bg-white/5 backdrop-blur-xl` pour les cartes.

## 📦 Prochaines Étapes recommandées

1. Migrer le `AuthProvider` (Gestion de la session utilisateur).
2. Créer le Layout du Dashboard (Sidebar + Navbar).
3. Migrer les tableaux de données (DataGrids) vers TanStack Table.
