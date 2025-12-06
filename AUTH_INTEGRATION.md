# 🔐 API Authentication Integration

**Date**: 6 Décembre 2025
**Branch**: `integration-api-backend`
**Status**: ✅ AUTHENTICATION INTEGRATION COMPLETE

---

## 📋 Résumé

L'intégration des APIs d'authentification et d'inscription est maintenant complète. Le frontend dispose d'un système complet de gestion d'authentification avec service centralisé et context global.

---

## 🛠️ Architecture Implémentée

### 1. **Services** (`src/services/`)

#### `api.ts`
Configuration centralisée des endpoints API:
- Base URL du serveur API
- Liste de tous les endpoints disponibles
- Fonction helper `getApiUrl()` pour construire les URLs

#### `authService.ts`
Service d'authentification complète:
- `login()` - Connexion utilisateur
- `register()` - Inscription nouvel utilisateur
- `logout()` - Déconnexion
- `verifyToken()` - Vérification du token JWT
- `refreshToken()` - Renouvellement du token
- Gestion du localStorage (token et user)
- Headers d'autorisation Bearer Token

### 2. **Context** (`src/contexts/`)

#### `AuthContext.tsx`
Context Provider pour l'authentification globale:
- État centralisé: `isAuthenticated`, `user`, `token`, `loading`, `error`
- Méthodes: `login()`, `register()`, `logout()`, `clearError()`
- Hook personnalisé: `useAuth()`
- Initialisation automatique au chargement de l'app

### 3. **Pages Mises à Jour**

#### `Login.tsx`
- ✅ Import de `AuthService`
- ✅ Utilisation du service pour l'API call
- ✅ Gestion complète des erreurs
- ✅ Redirection automatique après succès

#### `Register.tsx`
- ✅ Import de `AuthService`
- ✅ Utilisation du service pour l'API call
- ✅ Validation des données
- ✅ Gestion des erreurs API
- ✅ Redirection automatique après succès

---

## 🔄 Flux d'Authentification

### **Inscription**
```
1. User remplit le formulaire d'inscription
   ↓
2. Validation côté client (email, password, etc.)
   ↓
3. AuthService.register() appelé
   ↓
4. POST /auth/register envoyé au serveur
   ↓
5. Backend valide et crée l'utilisateur
   ↓
6. Response: { token, user }
   ↓
7. Token et User stockés dans localStorage
   ↓
8. User redirigé vers Home (/)
```

### **Connexion**
```
1. User remplit email/password
   ↓
2. Validation côté client
   ↓
3. AuthService.login() appelé
   ↓
4. POST /auth/login envoyé au serveur
   ↓
5. Backend vérifie les credentials
   ↓
6. Response: { token, user }
   ↓
7. Token et User stockés dans localStorage
   ↓
8. User redirigé vers Home (/)
```

### **Déconnexion**
```
1. User clique sur Logout
   ↓
2. AuthService.logout() appelé
   ↓
3. POST /auth/logout envoyé (si token disponible)
   ↓
4. localStorage vidé (token, user)
   ↓
5. State réinitialisé
   ↓
6. User redirigé vers Login
```

### **Vérification du Token**
```
1. Au démarrage de l'app
   ↓
2. AuthContext initialise l'état
   ↓
3. Token/User récupérés du localStorage
   ↓
4. AuthService.verifyToken() appelé
   ↓
5. Si valide → User maintient la session
   ↓
6. Si invalide → Tentative de refresh
   ↓
7. Si refresh réussi → Nouveau token stocké
   ↓
8. Si refresh échoue → Déconnexion complète
```

---

## 📝 Configuration Requise

### **.env** (à créer dans le root du projet)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_USER_KEY=auth_user

# Application
VITE_APP_NAME=MeubleMarket
VITE_APP_VERSION=0.0.0

# Environment
VITE_ENV=development
```

**Note:** Un fichier `.env.example` a été créé à titre de référence.

---

## 🔌 API Endpoints Utilisés

### **POST /auth/login**
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+221771234567",
    "avatar": "https://...",
    "role": "user",
    "createdAt": "2025-12-06T10:00:00Z"
  }
}
```

### **POST /auth/register**
```javascript
// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+221771234567",
  "password": "SecurePassword123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+221771234567",
    "role": "user",
    "createdAt": "2025-12-06T10:00:00Z"
  }
}
```

### **POST /auth/logout**
```javascript
// Request
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

### **GET /auth/verify**
```javascript
// Request
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "valid": true,
  "user": { /* user object */ }
}
```

### **POST /auth/refresh-token**
```javascript
// Request
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..." // Nouveau token
}
```

---

## 🚀 Utilisation dans les Composants

### **Accéder à l'état d'authentification**
```tsx
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenue, {user?.firstName}!</p>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
```

### **Utiliser le service d'authentification directement**
```tsx
import AuthService from '@/services/authService';

// Login
try {
  const response = await AuthService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('User:', response.user);
} catch (error) {
  console.error('Login failed:', error);
}

// Get token
const token = AuthService.getToken();

// Check authentication
const isAuth = AuthService.isAuthenticated();

// Get user
const user = AuthService.getUser();

// Get Authorization header
const headers = AuthService.getAuthHeader();
```

---

## 🔒 Sécurité

### **Implémenté**
- ✅ JWT Token Bearer Authentication
- ✅ Token stocké dans localStorage
- ✅ Validation des credentials côté client
- ✅ Gestion des erreurs API
- ✅ Vérification automatique du token
- ✅ Refresh token automatique

### **À Vérifier sur Backend**
- ⚠️ HTTPS en production
- ⚠️ CORS configuré correctement
- ⚠️ Token expiration (TTL)
- ⚠️ Password hashing sécurisé
- ⚠️ Rate limiting sur les endpoints d'auth
- ⚠️ Validation des inputs côté serveur

---

## 📁 Fichiers Créés

```
src/
├── services/
│   ├── api.ts                    (Configuration API)
│   └── authService.ts            (Service d'authentification)
├── contexts/
│   └── AuthContext.tsx           (Auth Provider & Hook)
└── pages/
    ├── Login.tsx                 (Updated with AuthService)
    └── Register.tsx              (Updated with AuthService)

Root/
└── .env.example                  (Configuration template)
```

---

## 🧪 Test Rapide

### **1. Démarrer le serveur backend**
```bash
cd furniture-backend
npm install
npm start
# Le serveur doit écouter sur http://localhost:3000
```

### **2. Vérifier la variable d'environnement**
```bash
# Créer .env dans le root du projet
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### **3. Démarrer le frontend**
```bash
npm run dev
# L'app s'ouvre sur http://localhost:5173
```

### **4. Tester l'inscription**
- Aller à `/register`
- Remplir le formulaire avec des données valides
- Cliquer "S'inscrire"
- Vérifier la redirection vers Home (/)
- Vérifier le token dans localStorage: `F12 → Application → Local Storage`

### **5. Tester la connexion**
- Aller à `/login`
- Entrer email/password
- Cliquer "Se connecter"
- Vérifier la redirection vers Home (/)

### **6. Vérifier l'état d'authentification**
```javascript
// Dans la console du navigateur (F12)
JSON.parse(localStorage.getItem('auth_user'))
localStorage.getItem('auth_token')
```

---

## ✅ Checklist d'Intégration

- [x] Service API créé avec endpoints
- [x] Service d'authentification implémenté
- [x] Auth Context créé et configuré
- [x] AuthProvider ajouté au main.tsx
- [x] Pages Login/Register mises à jour
- [x] JWT token persistance
- [x] Gestion des erreurs
- [x] Documentation complète

---

## 🔄 Prochaines Étapes

### **Phase 2: Intégration Profil**
- [ ] Créer `userService.ts` pour les APIs de profil
- [ ] Mettre à jour `Profile.tsx` avec le service
- [ ] Implémenter PUT /users/profile
- [ ] Implémenter POST /uploads/avatar

### **Phase 3: Intégration Produits**
- [ ] Créer `productService.ts`
- [ ] Mettre à jour `Home.tsx` avec les produits
- [ ] Mettre à jour `Products.tsx` avec pagination
- [ ] Implémenter les filtres

### **Phase 4: Intégration Commandes**
- [ ] Créer `orderService.ts`
- [ ] Mettre à jour `Checkout.tsx`
- [ ] Mettre à jour `Orders.tsx`
- [ ] Mettre à jour `OrderDetails.tsx`

---

## 🐛 Troubleshooting

### **Erreur: "Cannot find name 'setUserData'"**
✅ **Résolu**: Variable inutilisée supprimée lors du build

### **Erreur: "VITE_API_URL is undefined"**
→ Créer un fichier `.env` avec `VITE_API_URL=http://localhost:3000/api`

### **Erreur: "CORS error"**
→ Vérifier la configuration CORS du backend
→ S'assurer que `FRONTEND_URL` est en whitelist

### **Erreur: "Token not found"**
→ Vérifier que la clé localStorage est correcte (`auth_token`)
→ Vérifier que le backend retourne bien un token

### **Page reste sur Login après inscription**
→ Vérifier que le response du backend retourne `{ token, user }`
→ Vérifier les logs du navigateur (F12 → Console)

---

## 📚 Références

- **Service API**: `src/services/api.ts`
- **Auth Service**: `src/services/authService.ts`
- **Auth Context**: `src/contexts/AuthContext.tsx`
- **Login Page**: `src/pages/Login.tsx`
- **Register Page**: `src/pages/Register.tsx`
- **Backend API**: `BACKEND_API_COMPLETE.md`

---

**Status**: 🎉 **PRÊT POUR TESTING**

L'intégration d'authentification est complète et prête pour être testée avec le backend!
