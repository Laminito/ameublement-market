# 🛋️ Instructions - Plateforme E-Commerce Meubles avec Kredika Credit

## 📋 Vue d'ensemble du projet

Créer une plateforme React moderne pour la vente de meubles et équipements d'intérieur avec :
- ✅ Vente directe (paiement cash)
- ✅ Vente à crédit (intégration Kredika Core SaaS)
- ✅ Catalogue meubles (chambres, salons, cuisines, bureaux)
- ✅ Visualisation 3D/360° des produits
- ✅ Configuration personnalisée des ensembles
- ✅ Devis et simulation de crédit

---

## 🚀 Prompt pour GitHub Copilot

```
Create a complete React e-commerce platform for "MeubleMarket" - a premium furniture and home decor store.

REQUIREMENTS:

1. TECH STACK:
   - React 18+ with TypeScript
   - Vite for build tool
   - Tailwind CSS for styling
   - React Router v6 for navigation
   - Zustand for state management
   - Axios for API calls
   - React Query for data fetching
   - Framer Motion for animations
   - React Hook Form + Zod for form validation

2. KREDIKA CREDIT INTEGRATION:
   - Partner API Base URL: http://localhost:7575/api/v1
   - Partner Credentials:
     * Client ID: pk_6c5c0cba8e854dac
     * Client Secret: kred_K1z5gceu7zdLAAnyaZF4fwROppp
   - Credit reservation flow for furniture purchases
   - Multi-installment payment tracking
   - Credit eligibility verification

3. CORE FEATURES:

   A. AUTHENTICATION & ACCOUNTS:
      - Customer registration/login
      - Social login (Google, Facebook)
      - Partner admin authentication
      - JWT token management
      - Password reset flow
      - Email verification

   B. PRODUCT CATALOG:
      - Categories:
        * Chambres à coucher (Bedrooms)
        * Salons (Living rooms)
        * Cuisines (Kitchens)
        * Bureaux (Offices)
        * Salles à manger (Dining rooms)
        * Décorations (Decorations)
        * Électroménagers (Appliances)
      - Advanced filters:
        * Price range
        * Material (Bois, Métal, Tissu, Cuir)
        * Style (Moderne, Classique, Scandinave, Industriel)
        * Color
        * Brand
        * Room size compatibility
      - Product bundles (e.g., Complete Bedroom Set)
      - 360° product viewer
      - Multiple images per product
      - Video demonstrations
      - AR preview (augmented reality - optional)

   C. PRODUCT DETAILS:
      - High-resolution image gallery
      - Zoom functionality
      - Detailed specifications:
        * Dimensions (L x W x H)
        * Weight
        * Materials
        * Assembly required (Yes/No)
        * Warranty information
        * Care instructions
      - Customer reviews & ratings
      - Q&A section
      - Related products
      - Similar products
      - "Complete the look" suggestions

   D. SHOPPING EXPERIENCE:
      - Shopping cart with product thumbnails
      - Save for later functionality
      - Wishlist
      - Product comparison (up to 4 items)
      - Bundle builder (create custom room sets)
      - Recently viewed products
      - Stock availability indicator
      - Delivery time estimation

   E. CHECKOUT PROCESS:
      - Multi-step checkout:
        1. Cart review
        2. Customer information
        3. Delivery address
        4. Delivery date selection
        5. Payment method (Cash/Credit)
        6. Order confirmation
      - Guest checkout option
      - Save multiple delivery addresses
      - Delivery scheduling
      - Special delivery instructions
      - Assembly service option (+fee)

   F. CREDIT PAYMENT SYSTEM (KREDIKA):
      - Credit eligibility check
      - Interactive credit simulator:
        * Select amount
        * Choose duration (3, 6, 9, 12, 18, 24 months)
        * View monthly installment
        * See total cost with interest
      - Credit application form
      - Create credit reservation via Kredika API
      - Generate payment instructions
      - Display payment methods:
        * Orange Money
        * Wave
        * Free Money
        * Bank transfer
        * Card payment
      - First installment payment
      - Installment schedule viewer
      - Payment reminders
      - Credit history

   G. ORDER MANAGEMENT:
      - Order confirmation email
      - Order tracking:
        * Order placed
        * Processing
        * In transit
        * Out for delivery
        * Delivered
      - Delivery tracking number
      - Order history
      - Reorder functionality
      - Order cancellation (within 24h)
      - Return/exchange request
      - Invoice download (PDF)

   H. CUSTOMER FEATURES:
      - Profile management
      - Order history
      - Active credits dashboard
      - Payment reminders
      - Saved addresses
      - Wishlist
      - Product reviews
      - Newsletter subscription
      - Loyalty points program

   I. ADMIN PANEL:
      - Dashboard with analytics:
        * Sales overview (daily, weekly, monthly)
        * Revenue charts
        * Popular products
        * Credit vs Cash sales ratio
        * Customer acquisition
      - Product management:
        * Add/Edit/Delete products
        * Bulk import (CSV/Excel)
        * Inventory management
        * Stock alerts
        * Product categorization
      - Order management:
        * View all orders
        * Update order status
        * Process refunds
        * Delivery coordination
      - Customer management:
        * Customer list
        * Customer details
        * Order history per customer
        * Credit history
      - Credit management:
        * All credit reservations
        * Payment status tracking
        * Overdue payments
        * Credit analytics
      - Content management:
        * Homepage banners
        * Promotions
        * Blog posts
        * FAQ management
      - Reports & Analytics:
        * Sales reports
        * Inventory reports
        * Credit performance
        * Customer insights

4. API INTEGRATION:

   Kredika Partner API Endpoints:
   - POST /auth/token - Partner authentication
   - POST /credit-reservations - Create credit reservation
   - GET /credit-reservations - List all reservations
   - GET /credit-reservations/{id} - Get specific reservation
   - POST /payment-instructions - Generate payment instructions
   - GET /installments - Get payment schedule
   - GET /installments/{id} - Get specific installment
   - POST /payment-events - Record payment (webhook)

5. DATA MODELS:

   Product:
   ```typescript
   interface Product {
     id: string;
     name: string;
     description: string;
     longDescription: string;
     category: CategoryType;
     subcategory?: string;
     price: number;
     discountPrice?: number;
     images: string[];
     video?: string;
     dimensions: {
       length: number;
       width: number;
       height: number;
       unit: 'cm' | 'm';
     };
     weight: number;
     material: string[];
     color: string[];
     style: StyleType;
     brand: string;
     stock: number;
     assemblyRequired: boolean;
     warranty: string;
     careInstructions: string;
     featured: boolean;
     rating: number;
     reviewCount: number;
     tags: string[];
     createdAt: Date;
     updatedAt: Date;
   }
   ```

   Bundle:
   ```typescript
   interface Bundle {
     id: string;
     name: string;
     description: string;
     products: {
       productId: string;
       quantity: number;
     }[];
     totalPrice: number;
     discountedPrice: number;
     savings: number;
     image: string;
   }
   ```

   Order:
   ```typescript
   interface Order {
     id: string;
     orderNumber: string;
     customerId: string;
     items: OrderItem[];
     subtotal: number;
     deliveryFee: number;
     assemblyFee: number;
     tax: number;
     totalAmount: number;
     paymentMethod: 'CASH' | 'CREDIT';
     paymentStatus: PaymentStatus;
     deliveryAddress: Address;
     deliveryDate?: Date;
     deliveryTime?: string;
     assemblyService: boolean;
     specialInstructions?: string;
     status: OrderStatus;
     creditReservationId?: string;
     trackingNumber?: string;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

   CreditApplication:
   ```typescript
   interface CreditApplication {
     orderId: string;
     customerId: string;
     amount: number;
     duration: 3 | 6 | 9 | 12 | 18 | 24;
     monthlyInstallment: number;
     totalWithInterest: number;
     interestRate: number;
     reservationId?: string;
     status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
     installments: Installment[];
     paymentInstructions?: PaymentInstruction[];
   }
   ```

6. UI/UX REQUIREMENTS:
   - Modern, elegant design
   - Color scheme: 
     * Primary: #2C3E50 (Dark Blue-Gray)
     * Secondary: #E67E22 (Orange)
     * Accent: #16A085 (Teal)
     * Background: #ECF0F1 (Light Gray)
   - Smooth page transitions
   - Image lazy loading
   - Skeleton loaders
   - Infinite scroll for products
   - Sticky header with cart preview
   - Mobile-first responsive design
   - Touch-friendly UI elements
   - Accessibility (WCAG 2.1 AA)
   - Toast notifications
   - Modal confirmations
   - Loading states for all actions

7. PROJECT STRUCTURE:
   ```
   src/
   ├── components/
   │   ├── layout/
   │   │   ├── Header.tsx
   │   │   ├── Footer.tsx
   │   │   ├── Sidebar.tsx
   │   │   ├── Navbar.tsx
   │   │   └── MobileMenu.tsx
   │   ├── products/
   │   │   ├── ProductCard.tsx
   │   │   ├── ProductGrid.tsx
   │   │   ├── ProductList.tsx
   │   │   ├── ProductDetail.tsx
   │   │   ├── ProductGallery.tsx
   │   │   ├── ProductFilter.tsx
   │   │   ├── ProductComparison.tsx
   │   │   └── BundleBuilder.tsx
   │   ├── cart/
   │   │   ├── CartItem.tsx
   │   │   ├── CartSummary.tsx
   │   │   ├── CartDrawer.tsx
   │   │   └── MiniCart.tsx
   │   ├── checkout/
   │   │   ├── CheckoutStepper.tsx
   │   │   ├── CustomerForm.tsx
   │   │   ├── DeliveryForm.tsx
   │   │   ├── PaymentMethod.tsx
   │   │   ├── OrderReview.tsx
   │   │   └── OrderConfirmation.tsx
   │   ├── credit/
   │   │   ├── CreditSimulator.tsx
   │   │   ├── CreditEligibility.tsx
   │   │   ├── CreditApplication.tsx
   │   │   ├── PaymentPlanSelector.tsx
   │   │   ├── PaymentInstructions.tsx
   │   │   ├── InstallmentCalendar.tsx
   │   │   └── PaymentHistory.tsx
   │   ├── ui/
   │   │   ├── Button.tsx
   │   │   ├── Input.tsx
   │   │   ├── Select.tsx
   │   │   ├── Modal.tsx
   │   │   ├── Toast.tsx
   │   │   ├── Skeleton.tsx
   │   │   ├── Badge.tsx
   │   │   ├── Card.tsx
   │   │   └── Tabs.tsx
   │   └── admin/
   │       ├── Dashboard.tsx
   │       ├── ProductManager.tsx
   │       ├── OrderManager.tsx
   │       ├── CustomerManager.tsx
   │       ├── CreditDashboard.tsx
   │       └── Analytics.tsx
   ├── pages/
   │   ├── Home.tsx
   │   ├── Products.tsx
   │   ├── ProductDetails.tsx
   │   ├── Bundles.tsx
   │   ├── Cart.tsx
   │   ├── Checkout.tsx
   │   ├── OrderSuccess.tsx
   │   ├── Orders.tsx
   │   ├── OrderTracking.tsx
   │   ├── Profile.tsx
   │   ├── Wishlist.tsx
   │   ├── Login.tsx
   │   ├── Register.tsx
   │   ├── CreditSimulator.tsx
   │   ├── MyCredits.tsx
   │   └── admin/
   │       ├── AdminDashboard.tsx
   │       ├── ProductsAdmin.tsx
   │       ├── OrdersAdmin.tsx
   │       └── CreditsAdmin.tsx
   ├── services/
   │   ├── api/
   │   │   ├── client.ts
   │   │   ├── authApi.ts
   │   │   ├── productApi.ts
   │   │   ├── orderApi.ts
   │   │   ├── kredikaApi.ts
   │   │   └── customerApi.ts
   │   ├── authService.ts
   │   ├── productService.ts
   │   ├── orderService.ts
   │   └── kredikaService.ts
   ├── store/
   │   ├── authStore.ts
   │   ├── cartStore.ts
   │   ├── productStore.ts
   │   ├── orderStore.ts
   │   └── creditStore.ts
   ├── hooks/
   │   ├── useAuth.ts
   │   ├── useCart.ts
   │   ├── useProducts.ts
   │   ├── useOrders.ts
   │   └── useKredika.ts
   ├── types/
   │   ├── product.ts
   │   ├── order.ts
   │   ├── customer.ts
   │   ├── kredika.ts
   │   └── common.ts
   ├── utils/
   │   ├── currency.ts
   │   ├── date.ts
   │   ├── validation.ts
   │   ├── calculator.ts
   │   └── helpers.ts
   └── constants/
       ├── routes.ts
       ├── api.ts
       └── config.ts
   ```

8. KEY IMPLEMENTATIONS:

   A. Credit Simulator Component:
   ```typescript
   interface CreditSimulatorProps {
     productPrice: number;
   }

   const CreditSimulator = ({ productPrice }) => {
     const [amount, setAmount] = useState(productPrice);
     const [duration, setDuration] = useState(12);
     const [monthlyPayment, setMonthlyPayment] = useState(0);
     
     useEffect(() => {
       calculateMonthlyPayment();
     }, [amount, duration]);

     const calculateMonthlyPayment = () => {
       const interestRate = getInterestRate(duration);
       const totalWithInterest = amount * (1 + interestRate);
       const monthly = totalWithInterest / duration;
       setMonthlyPayment(monthly);
     };

     return (
       // UI implementation
     );
   };
   ```

   B. Kredika Service:
   ```typescript
   class KredikaService {
     private token: string | null = null;
     private readonly baseURL = 'http://localhost:7575/api/v1';
     
     async authenticate() {
       const response = await axios.post(`${this.baseURL}/auth/token`, {
         clientId: 'pk_6c5c0cba8e854dac',
         clientSecret: 'kred_K1z5gceu7zdLAAnyaZF4fwROppp'
       });
       this.token = response.data.accessToken;
       return this.token;
     }

     async createReservation(data: CreditReservationRequest) {
       if (!this.token) await this.authenticate();
       
       const response = await axios.post(
         `${this.baseURL}/credit-reservations`,
         {
           customerFirstName: data.customer.firstName,
           customerLastName: data.customer.lastName,
           customerEmail: data.customer.email,
           customerPhone: data.customer.phone,
           creditAmount: data.amount,
           durationMonths: data.duration,
           purchaseDescription: `Achat meubles - Commande #${data.orderNumber}`
         },
         {
           headers: { Authorization: `Bearer ${this.token}` }
         }
       );
       
       return response.data;
     }

     async getInstallments(reservationId: string) {
       if (!this.token) await this.authenticate();
       
       const response = await axios.get(
         `${this.baseURL}/installments`,
         {
           params: { reservationId },
           headers: { Authorization: `Bearer ${this.token}` }
         }
       );
       
       return response.data;
     }

     async generatePaymentInstructions(reservationId: string) {
       if (!this.token) await this.authenticate();
       
       const response = await axios.post(
         `${this.baseURL}/payment-instructions`,
         { reservationId },
         {
           headers: { Authorization: `Bearer ${this.token}` }
         }
       );
       
       return response.data;
     }
   }
   ```

   C. Bundle Builder:
   ```typescript
   const BundleBuilder = () => {
     const [selectedProducts, setSelectedProducts] = useState([]);
     const [totalPrice, setTotalPrice] = useState(0);
     
     const addToBundle = (product: Product) => {
       setSelectedProducts([...selectedProducts, product]);
       calculateTotal();
     };
     
     const calculateTotal = () => {
       const total = selectedProducts.reduce(
         (sum, product) => sum + product.price, 
         0
       );
       // Apply bundle discount (e.g., 10% off)
       setTotalPrice(total * 0.9);
     };

     return (
       // UI for building custom furniture bundles
     );
   };
   ```

9. SAMPLE PRODUCT DATA:

   Categories & Examples:
   
   **Chambres à coucher:**
   - "Chambre Complète Moderne Wenge" - 450,000 FCFA
     * Lit 2 places (160x200)
     * 2 tables de chevet
     * Armoire 4 portes
     * Commode 3 tiroirs
   - "Ensemble Chambre Scandinave Blanc" - 380,000 FCFA
   - "Chambre Classique Chêne Massif" - 620,000 FCFA

   **Salons:**
   - "Salon d'angle 7 places Cuir" - 520,000 FCFA
   - "Canapé 3+2+1 Tissu Moderne" - 285,000 FCFA
   - "Ensemble Salon Luxe avec Table Basse" - 750,000 FCFA

   **Cuisines:**
   - "Cuisine Complète L-Shape" - 890,000 FCFA
   - "Buffet de Cuisine + Étagères" - 165,000 FCFA
   - "Table + 6 Chaises Salle à Manger" - 245,000 FCFA

   **Bureaux:**
   - "Bureau Direction + Fauteuil" - 195,000 FCFA
   - "Ensemble Bureau Moderne Blanc" - 145,000 FCFA
   - "Bibliothèque Murale 5 étagères" - 85,000 FCFA

   **Électroménagers:**
   - "Réfrigérateur Samsung 350L" - 385,000 FCFA
   - "Machine à Laver LG 8kg" - 275,000 FCFA
   - "Climatiseur Split 12000 BTU" - 295,000 FCFA

10. CREDIT PAYMENT FLOW:

    **Step-by-step Process:**
    
    1. **Product Selection:**
       - Customer browses catalog
       - Adds items to cart
       - Sees "Cash" and "Credit" price options

    2. **Cart Review:**
       - View all selected items
       - See credit simulation for total amount
       - Click "Proceed to Checkout"

    3. **Customer Information:**
       - Login or guest checkout
       - Fill personal details
       - Provide phone and email

    4. **Delivery Details:**
       - Enter delivery address
       - Select delivery date
       - Choose time slot
       - Add assembly service if needed

    5. **Payment Method Selection:**
       - Choose "Paiement à Crédit"
       - System shows credit simulator
       - Customer selects duration (3-24 months)
       - Sees monthly installment amount

    6. **Credit Application:**
       - Fill additional credit info if needed
       - Accept terms and conditions
       - Submit credit request

    7. **Kredika Integration:**
       - System authenticates with Kredika
       - Creates credit reservation
       - Receives reservation ID
       - Generates payment instructions

    8. **First Payment:**
       - Display payment methods
       - Show amount for first installment
       - Provide payment instructions
       - Customer completes payment

    9. **Confirmation:**
       - Order confirmed
       - Email sent with details
       - Installment schedule provided
       - Delivery scheduled

    10. **Follow-up:**
        - SMS reminders for next payments
        - Email invoices
        - Track delivery
        - Post-delivery survey

11. IMPORTANT FEATURES:

    - **Smart Search:**
      * Autocomplete suggestions
      * Search by category, brand, material
      * Voice search (optional)
      * Visual search (upload image)

    - **Product Recommendations:**
      * "Customers also bought"
      * "Complete the look"
      * Personalized recommendations
      * Recently viewed products

    - **Virtual Room Planner:**
      * Drag-and-drop furniture layout
      * Room dimension input
      * 3D visualization
      * Save room designs

    - **Delivery Tracking:**
      * Real-time GPS tracking
      * SMS/Email notifications
      * Delivery person contact
      * Estimated arrival time

    - **Assembly Service:**
      * Professional assembly option
      * Additional fee calculation
      * Schedule assembly date
      * Assembly video guides

    - **Customer Support:**
      * Live chat
      * WhatsApp integration
      * FAQ section
      * Video call for product consultation

    - **Loyalty Program:**
      * Points on every purchase
      * Tier levels (Bronze, Silver, Gold)
      * Exclusive discounts
      * Birthday rewards

    - **Reviews & Ratings:**
      * Photo/video reviews
      * Verified purchase badge
      * Helpful votes
      * Sort by rating/date

12. SECURITY & COMPLIANCE:

    - SSL/TLS encryption
    - PCI DSS compliance for payments
    - GDPR-compliant data handling
    - Secure token storage
    - Input sanitization
    - XSS protection
    - CSRF tokens
    - Rate limiting
    - Two-factor authentication (optional)

13. PERFORMANCE OPTIMIZATION:

    - Image optimization (WebP, AVIF)
    - Lazy loading
    - Code splitting
    - CDN for static assets
    - Service workers (PWA)
    - Caching strategies
    - Database indexing
    - API response compression

14. TESTING STRATEGY:

    - Unit tests (Jest + React Testing Library)
    - Integration tests
    - E2E tests (Playwright/Cypress)
    - Performance testing
    - Security testing
    - Accessibility testing
    - Mobile device testing

Build a complete, production-ready furniture e-commerce platform.
Use modern React patterns, TypeScript, and best practices.
Implement comprehensive error handling and loading states.
Create an elegant, user-friendly interface optimized for furniture shopping.
Ensure seamless credit integration with Kredika API.
Make it fast, secure, and accessible.
```

---

## 🎯 Configuration Kredika

### Informations Partner

```json
{
  "partnerId": "355a950b-994c-430a-ab2d-a021e1bc11de",
  "partnerName": "MeubleMarket",
  "clientId": "pk_6c5c0cba8e854dac",
  "clientSecret": "kred_K1z5gceu7zdLAAnyaZF4fwROppp",
  "apiBaseUrl": "http://localhost:7575/api/v1"
}
```

### Taux d'intérêt par durée

```javascript
const INTEREST_RATES = {
  3: 0.05,   // 5% pour 3 mois
  6: 0.08,   // 8% pour 6 mois
  9: 0.10,   // 10% pour 9 mois
  12: 0.12,  // 12% pour 12 mois
  18: 0.15,  // 15% pour 18 mois
  24: 0.18   // 18% pour 24 mois
};
```

---

## 📦 Structure du Projet

```
meuble-market/
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── banners/
│   │   └── icons/
│   └── videos/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

### Palette de couleurs

```css
:root {
  /* Primary Colors */
  --primary-dark: #2C3E50;
  --primary: #34495E;
  --primary-light: #4A5F7F;
  
  /* Secondary Colors */
  --secondary: #E67E22;
  --secondary-dark: #D35400;
  --secondary-light: #F39C12;
  
  /* Accent */
  --accent: #16A085;
  --accent-dark: #138D75;
  --accent-light: #1ABC9C;
  
  /* Neutrals */
  --gray-50: #F8F9FA;
  --gray-100: #ECF0F1;
  --gray-200: #D5DBDB;
  --gray-300: #BDC3C7;
  --gray-400: #95A5A6;
  --gray-500: #7F8C8D;
  --gray-600: #566573;
  --gray-700: #34495E;
  --gray-800: #2C3E50;
  --gray-900: #1C2833;
  
  /* Semantic */
  --success: #27AE60;
  --warning: #F39C12;
  --error: #E74C3C;
  --info: #3498DB;
  
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #ECF0F1;
  --bg-dark: #2C3E50;
}
```

### Typographie

```css
/* Font Families */
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

---

## 🛒 Flux d'achat détaillé

### 1. Achat Cash (Paiement Direct)

```
Parcours Client:
┌─────────────────┐
│  Catalogue      │
│  - Browse       │
│  - Filter       │
│  - Search       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Product Detail │
│  - Images       │
│  - Specs        │
│  - Reviews      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add to Cart    │
│  - Quantity     │
│  - Options      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cart Review    │
│  - Edit items   │
│  - Apply promo  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Checkout       │
│  - Login/Guest  │
│  - Address      │
│  - Delivery     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Payment: CASH  │
│  - COD option   │
│  - Confirm      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Confirmation   │
│  - Order #      │
│  - Email sent   │
│  - Track link   │
└─────────────────┘
```

### 2. Achat à Crédit (Kredika Integration)

```
Parcours Crédit:
┌─────────────────┐
│  Cart Review    │
│  Total: 450,000 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Credit Check   │
│  - Eligibility  │
│  - Min/Max amt  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Simulator      │
│  - Amount       │
│  - Duration     │
│  - Monthly calc │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Choose Plan    │
│  ○ 6 mois       │
│  ● 12 mois      │
│  ○ 24 mois      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Application    │
│  - Personal info│
│  - Employment   │
│  - References   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Kredika API     │
│ - Authenticate  │
│ - Create Resv   │
│ - Get Resv ID   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Payment Instruc │
│ - Orange Money  │
│ - Wave          │
│ - Bank Transfer │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ First Payment   │
│ Amount: 41,500  │
│ (1/12)          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Confirmation    │
│ - Order placed  │
│ - Schedule sent │
│ - Delivery date │
└─────────────────┘
```

---

## 📱 Pages principales

### Page d'accueil

**Sections:**
1. **Hero Slider** - Promotions principales
2. **Catégories** - Icônes cliquables
3. **Produits en vedette** - Carousel
4. **Bundles** - Ensembles complets
5. **Nouveautés** - Derniers arrivages
6. **Crédit facile** - Explication du système
7. **Témoignages** - Avis clients
8. **Blog** - Conseils déco
9. **Newsletter** - Inscription

### Catalogue produits

**Fonctionnalités:**
- Filtres multiples (sidebar)
- Tri (prix, popularité, nouveauté)
- Vue grille/liste
- Pagination ou infinite scroll
- Nombre de résultats
- Quick view modal
- Comparaison produits
- Export liste (PDF)

### Détail produit

**Éléments:**
- Galerie photos (zoom, 360°)
- Nom et prix
- Badges (Nouveau, Promo, Stock limité)
- Options de paiement
- Simulateur crédit intégré
- Caractéristiques techniques
- Guide des tailles/dimensions
- Avis clients
- Q&A
- Produits similaires
- Vidéo démo

### Panier

**Composants:**
- Liste produits avec images
- Modifier quantités
- Supprimer articles
- Code promo
- Récapitulatif:
  - Sous-total
  - Frais de livraison
  - Montage (+15,000 FCFA)
  - Total
- Boutons:
  - "Continuer mes achats"
  - "Payer comptant"
  - "Payer à crédit"

### Checkout

**Étapes:**
1. **Connexion**
   - Login existant
   - Guest checkout
   - Créer compte

2. **Informations personnelles**
   - Nom, prénom
   - Email, téléphone
   - Date de naissance

3. **Adresse de livraison**
   - Rue, quartier
   - Ville, commune
   - Code postal
   - Point de repère
   - Sauvegarder adresse

4. **Planification livraison**
   - Calendrier date
   - Créneaux horaires
   - Instructions spéciales
   - Service montage (opt-in)

5. **Mode de paiement**
   - Cash (paiement à la livraison)
   - Crédit (Kredika)

6. **Validation crédit** (si crédit)
   - Simulation
   - Choix durée
   - Application
   - Première échéance

7. **Confirmation**
   - Récapitulatif complet
   - Acceptation CGV
   - Bouton "Confirmer"

### Mon compte

**Sections:**
- **Dashboard**
  - Commandes récentes
  - Crédits actifs
  - Points fidélité

- **Mes commandes**
  - Liste chronologique
  - Statut
  - Tracking
  - Factures

- **Mes crédits**
  - Crédits en cours
  - Calendrier paiements
  - Historique paiements
  - Prochaine échéance

- **Profil**
  - Informations personnelles
  - Modifier email/téléphone
  - Changer mot de passe

- **Adresses**
  - Adresses enregistrées
  - Ajouter/Modifier/Supprimer
  - Adresse par défaut

- **Wishlist**
  - Produits favoris
  - Partager liste

- **Avis**
  - Produits à évaluer
  - Mes avis publiés

### Admin Panel

**Modules:**

1. **Dashboard**
   - KPIs (ventes, revenus, commandes)
   - Graphiques tendances
   - Top produits
   - Alertes stock

2. **Produits**
   - Liste produits (table)
   - Ajouter produit
   - Import CSV
   - Catégories
   - Marques
   - Stock management

3. **Commandes**
   - Liste commandes
   - Filtres (statut, date, montant)
   - Détails commande
   - Mise à jour statut
   - Imprimer bon livraison
   - Remboursements

4. **Clients**
   - Liste clients
   - Détails client
   - Historique achats
   - Crédits client
   - Bloquer/Débloquer

5. **Crédits**
   - Réservations actives
   - En attente
   - Complétées
   - Impayés
   - Statistiques crédit
   - Export rapports

6. **Livraisons**
   - Planning livraisons
   - Assigner livreur
   - Zones de livraison
   - Tarifs livraison

7. **Contenu**
   - Bannières homepage
   - Promotions
   - Blog posts
   - FAQ

8. **Paramètres**
   - Infos entreprise
   - Frais livraison
   - Taux crédit
   - Emails templates
   - Intégrations API

---

## 💳 Système de crédit

### Calcul des mensualités

```typescript
interface CreditCalculation {
  amount: number;           // Montant emprunté
  duration: number;         // Durée en mois
  interestRate: number;     // Taux d'intérêt
  monthlyPayment: number;   // Mensualité
  totalPayment: number;     // Total à rembourser
  totalInterest: number;    // Intérêts totaux
}

function calculateCredit(
  amount: number, 
  duration: number
): CreditCalculation {
  const rate = INTEREST_RATES[duration];
  const totalInterest = amount * rate;
  const totalPayment = amount + totalInterest;
  const monthlyPayment = totalPayment / duration;

  return {
    amount,
    duration,
    interestRate: rate,
    monthlyPayment: Math.ceil(monthlyPayment),
    totalPayment: Math.ceil(totalPayment),
    totalInterest: Math.ceil(totalInterest)
  };
}

// Exemple:
// Achat chambre: 450,000 FCFA
// Durée: 12 mois
// Taux: 12%
// Intérêts: 54,000 FCFA
// Total: 504,000 FCFA
// Mensualité: 42,000 FCFA
```

### Échéancier de paiement

```typescript
interface Installment {
  number: number;
  dueDate: Date;
  amount: number;
  principal: number;
  interest: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidDate?: Date;
  paymentMethod?: string;
}

function generateSchedule(
  startDate: Date,
  calculation: CreditCalculation
): Installment[] {
  const schedule: Installment[] = [];
  const monthlyInterest = calculation.totalInterest / calculation.duration;
  const monthlyPrincipal = calculation.amount / calculation.duration;

  for (let i = 1; i <= calculation.duration; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      number: i,
      dueDate,
      amount: calculation.monthlyPayment,
      principal: Math.ceil(monthlyPrincipal),
      interest: Math.ceil(monthlyInterest),
      status: 'PENDING'
    });
  }

  return schedule;
}
```

---

## 🔔 Notifications & Reminders

### Types de notifications

1. **Email**
   - Confirmation commande
   - Statut livraison
   - Rappel paiement (7 jours avant)
   - Rappel paiement (1 jour avant)
   - Paiement reçu
   - Retard de paiement

2. **SMS**
   - Code de confirmation
   - Livraison en cours
   - Rappel échéance
   - Paiement confirmé

3. **Push Notifications** (PWA)
   - Promotions
   - Nouveautés
   - Rappels personnalisés

4. **In-App**
   - Alertes compte
   - Messages support
   - Nouveaux avis

---

## 🚚 Gestion des livraisons

### Zones et tarifs

```typescript
interface DeliveryZone {
  name: string;
  cities: string[];
  baseFee: number;
  additionalPerKm: number;
  estimatedDays: number;
}

const DELIVERY_ZONES = [
  {
    name: 'Dakar Centre',
    cities: ['Plateau', 'Médina', 'Gueule Tapée'],
    baseFee: 5000,
    additionalPerKm: 0,
    estimatedDays: 1
  },
  {
    name: 'Dakar Périphérie',
    cities: ['Pikine', 'Guédiawaye', 'Parcelles'],
    baseFee: 8000,
    additionalPerKm: 500,
    estimatedDays: 2
  },
  {
    name: 'Banlieue',
    cities: ['Rufisque', 'Sangalkam', 'Bambilor'],
    baseFee: 15000,
    additionalPerKm: 1000,
    estimatedDays: 3
  }
];
```

### Service de montage

```typescript
interface AssemblyService {
  productCategory: string;
  fee: number;
  estimatedTime: number; // en minutes
  required: boolean;
}

const ASSEMBLY_FEES = {
  'chambre': 15000,
  'salon': 12000,
  'cuisine': 25000,
  'bureau': 8000,
  'table': 5000
};
```

---

## 📊 Analytics & Reporting

### Métriques clés

```typescript
interface DashboardMetrics {
  // Ventes
  totalSales: number;
  salesGrowth: number;
  averageOrderValue: number;
  
  // Commandes
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  
  // Clients
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  
  // Crédit
  activeCreditAccounts: number;
  creditSalesRatio: number;
  totalCreditAmount: number;
  overduePayments: number;
  
  // Inventaire
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  
  // Performance
  conversionRate: number;
  cartAbandonmentRate: number;
  averageDeliveryTime: number;
}
```

---

## 🔒 Sécurité

### Protection des données

```typescript
// Chiffrement des données sensibles
import CryptoJS from 'crypto-js';

const encryptData = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data), 
    key
  ).toString();
};

const decryptData = (ciphertext: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Stockage sécurisé des tokens
class SecureStorage {
  private static encryptionKey = process.env.VITE_ENCRYPTION_KEY;
  
  static setItem(key: string, value: any) {
    const encrypted = encryptData(value, this.encryptionKey);
    localStorage.setItem(key, encrypted);
  }
  
  static getItem(key: string) {
    const encrypted = localStorage.getItem(key);
    return encrypted ? decryptData(encrypted, this.encryptionKey) : null;
  }
}
```

---

## 🎯 Plan de développement (MVP)

### Phase 1 - Semaines 1-2 (Core Setup)
- ✅ Setup projet (Vite + React + TypeScript + Tailwind)
- ✅ Configuration routing
- ✅ Design system & composants UI
- ✅ Layout principal (Header, Footer, Sidebar)
- ✅ Authentification basique
- ✅ Page d'accueil statique

### Phase 2 - Semaines 3-4 (Catalogue)
- ✅ Modèles de données produits
- ✅ Services API produits
- ✅ Page catalogue avec filtres
- ✅ Page détail produit
- ✅ Galerie images + zoom
- ✅ Système de notation/avis

### Phase 3 - Semaine 5 (Panier & Checkout)
- ✅ Gestion panier (Zustand store)
- ✅ Page panier
- ✅ Mini-cart header
- ✅ Checkout multi-étapes
- ✅ Formulaires validation (React Hook Form + Zod)
- ✅ Gestion adresses

### Phase 4 - Semaine 6 (Intégration Kredika)
- ✅ Service Kredika API
- ✅ Authentification Partner
- ✅ Simulateur crédit
- ✅ Création réservations
- ✅ Instructions de paiement
- ✅ Calendrier échéances

### Phase 5 - Semaine 7 (Commandes & Livraisons)
- ✅ Système de commandes
- ✅ Statuts commandes
- ✅ Calcul frais livraison
- ✅ Planification livraison
- ✅ Tracking commandes
- ✅ Historique achats

### Phase 6 - Semaine 8 (Espace Client)
- ✅ Dashboard client
- ✅ Profil utilisateur
- ✅ Mes commandes
- ✅ Mes crédits
- ✅ Wishlist
- ✅ Notifications

### Phase 7 - Semaines 9-10 (Admin Panel)
- ✅ Dashboard admin
- ✅ Gestion produits (CRUD)
- ✅ Gestion commandes
- ✅ Gestion clients
- ✅ Dashboard crédits
- ✅ Analytics & rapports

### Phase 8 - Semaine 11 (Optimisations)
- ✅ Performance (lazy loading, code splitting)
- ✅ SEO optimization
- ✅ PWA setup
- ✅ Responsive design perfection
- ✅ Accessibility (A11y)
- ✅ Error boundaries

### Phase 9 - Semaine 12 (Tests & Déploiement)
- ✅ Tests unitaires
- ✅ Tests intégration
- ✅ Tests E2E
- ✅ Corrections bugs
- ✅ Documentation
- ✅ Déploiement production

---

## 🌐 Déploiement

### Variables d'environnement

```env
# API URLs
VITE_API_URL=https://api.meublemarket.sn
VITE_KREDIKA_API_URL=https://api.kredika.sn/api/v1

# Kredika Credentials
VITE_KREDIKA_CLIENT_ID=pk_6c5c0cba8e854dac
VITE_KREDIKA_CLIENT_SECRET=kred_K1z5gceu7zdLAAnyaZF4fwROppp

# Storage
VITE_ENCRYPTION_KEY=your-secret-encryption-key

# External Services
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Email
VITE_SENDGRID_API_KEY=your-sendgrid-key

# SMS
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-token
```

### Build & Deployment

```bash
# Build pour production
npm run build

# Preview build
npm run preview

# Deploy sur Vercel
vercel --prod

# Deploy sur Netlify
netlify deploy --prod
```

---

## 📚 Documentation API

### Endpoints principaux

**Authentification:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

**Produits:**
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin)
PUT    /api/products/:id (admin)
DELETE /api/products/:id (admin)
GET    /api/products/search?q=
GET    /api/products/category/:category
```

**Commandes:**
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id/status (admin)
DELETE /api/orders/:id
```

**Kredika:**
```
POST   /api/kredika/authenticate
POST   /api/kredika/reservations
GET    /api/kredika/reservations/:id
GET    /api/kredika/installments
POST   /api/kredika/payment-instructions
```

---

## ✨ Fonctionnalités avancées (Post-MVP)

### Future enhancements

- [ ] **AR Visualization** - Voir les meubles dans sa maison via AR
- [ ] **Virtual Showroom** - Visite 3D du magasin
- [ ] **AI Recommendations** - Suggestions personnalisées par IA
- [ ] **Voice Search** - Recherche vocale
- [ ] **Social Shopping** - Partage wishlists, achats groupés
- [ ] **Live Chat Support** - Chat en temps réel
- [ ] **Video Calls** - Consultation vidéo avec vendeur
- [ ] **Subscription Model** - Abonnement mensuel meubles
- [ ] **Trade-In Program** - Reprise anciens meubles
- [ ] **Interior Design Service** - Service décoration
- [ ] **Rental Option** - Location de meubles
- [ ] **Corporate Sales** - Ventes B2B entreprises
- [ ] **Gift Cards** - Cartes cadeaux
- [ ] **Referral Program** - Programme parrainage
- [ ] **Mobile App** - Application React Native

---

## 🆘 Support & Ressources

### Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- React Query: https://tanstack.com/query

### Kredika API
- Documentation: [BACKEND_REQUIREMENTS.md]
- Swagger: http://localhost:7575/swagger-ui.html
- Support: dev@kredika.sn

### Contact
- Email: support@meublemarket.sn
- Phone: +221 77 XXX XX XX
- WhatsApp: +221 77 XXX XX XX

---

## 📝 Notes importantes

1. **Images produits** : Utiliser des images haute résolution (min 1200x1200px)
2. **Performance** : Optimiser toutes les images (WebP, compression)
3. **Mobile First** : 70% du trafic vient du mobile
4. **SEO** : Meta tags, structured data, sitemap.xml
5. **Accessibilité** : WCAG 2.1 AA compliance
6. **Loading States** : Toujours afficher des skeletons
7. **Error Handling** : Messages d'erreur clairs et utiles
8. **Cache Strategy** : Mettre en cache produits, catégories
9. **Analytics** : Tracker tous les événements importants
10. **Security** : Never expose secrets, sanitize inputs

---

**Bon développement ! 🚀🛋️**
