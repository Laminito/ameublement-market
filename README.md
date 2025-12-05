# 🛋️ MeubleMarket - Plateforme E-Commerce avec Crédit

Une plateforme moderne de vente de meubles avec solution de paiement à crédit intégrée, propulsée par Kredika.

## 🎯 Mission

**Démocratiser l'accès au confort** en rendant l'ameublement accessible à tous grâce à des solutions de paiement flexibles et transparentes.

## ✨ Fonctionnalités

- 🏠 **Catalogue de meubles** - Chambres, salons, cuisines, bureaux et plus
- 💳 **Paiement à crédit** - Payez en 3, 6, 9, 12, 18 ou 24 mois
- 🔍 **Recherche et filtres avancés** - Trouvez facilement vos meubles
- 🛒 **Panier intelligent** - Gestion facile de vos achats
- 📱 **Design responsive** - Fonctionne sur tous les appareils
- 🎨 **Interface moderne** - Design simple et attractif avec des couleurs légères

## 🚀 Technologies

- **React 18+** avec TypeScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling moderne et responsive
- **React Router** - Navigation fluide
- **Zustand** - Gestion d'état simple
- **Axios** - Requêtes API
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

## 🎨 Palette de couleurs

- **Primary** (Bleu) : #0ea5e9
- **Accent** (Orange) : #f77f00  
- **Success** (Vert) : #22c55e
- **Fond** : Gris clair (#f9fafb)

## 📁 Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── layout/      # Header, Footer, Layout
│   ├── products/    # Composants produits
│   ├── cart/        # Composants panier
│   └── credit/      # Composants crédit
├── pages/           # Pages de l'application
├── store/           # Zustand stores
├── types/           # Types TypeScript
├── utils/           # Fonctions utilitaires
├── constants/       # Constantes et configuration
└── services/        # Services API
```

## 🔌 Intégration Kredika

L'application s'intègre avec l'API Kredika pour gérer les paiements à crédit:

- URL de base : `http://localhost:7575/api/v1`
- Authentification partenaire
- Création de réservations de crédit
- Gestion des échéanciers de paiement
- Instructions de paiement (Orange Money, Wave, Free Money, etc.)

## 🎯 Avantages clés

- ✅ **Accessible** - Des meubles de qualité pour tous les budgets
- ✅ **Transparent** - Aucun frais caché, tout est clair
- ✅ **Simple** - Processus d'achat rapide et intuitif
- ✅ **Flexible** - Choix de la durée de paiement (3-24 mois)
- ✅ **Sécurisé** - Paiements protégés et données cryptées
- ✅ **Livraison** - Installation à domicile disponible

## 📝 Comment ça marche

1. **Choisissez vos meubles** - Parcourez notre catalogue
2. **Sélectionnez votre durée** - 3, 6, 9, 12, 18 ou 24 mois
3. **Validez votre crédit** - Réponse en 24h
4. **Recevez vos meubles** - Livraison et installation à domicile

## 🛠️ Développement

Le projet utilise:
- ESLint pour le linting
- TypeScript pour la type safety
- Vite pour un dev rapide avec HMR
- Tailwind CSS v4 avec @tailwindcss/postcss

## 📄 License

Ce projet a été créé pour démocratiser l'accès aux biens essentiels.

---

Fait avec ❤️ pour rendre le confort accessible à tous.


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
