# Guide de Création du Backend - Application E-commerce Ameublement

## 📋 Vue d'ensemble

Ce guide détaille la création d'un backend complet avec Node.js, Express, MongoDB pour supporter l'application frontend React, avec intégration Kredika pour les paiements.

### Stack Technologique
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Base de données**: MongoDB avec Mongoose
- **Documentation**: Swagger/OpenAPI
- **Authentification**: JWT native
- **Upload de fichiers**: Multer + Cloudinary/AWS S3
- **Paiement**: Kredika API
- **Validation**: Joi ou Yup
- **Tests**: Jest + Supertest

## 🚀 Initialisation du Projet

### 1. Création du projet
```bash
mkdir furniture-backend
cd furniture-backend
npm init -y
```

### 2. Installation des dépendances principales
```bash
# Dépendances principales
npm install express mongoose dotenv cors helmet morgan compression
npm install jsonwebtoken bcryptjs
npm install multer cloudinary
npm install joi express-validator
npm install swagger-ui-express swagger-jsdoc
npm install axios form-data

# Dépendances de développement
npm install -D nodemon jest supertest cross-env
npm install -D @types/node typescript ts-node
```

### 3. Structure du projet
```
furniture-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── kredika.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── favoriteController.js
│   │   ├── uploadController.js
│   │   ├── adminSettingsController.js
│   │   └── webhookController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Category.js
│   │   ├── AdminSettings.js
│   │   └── Favorite.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── favorites.js
│   │   ├── uploads.js
│   │   ├── admin.js
│   │   └── webhooks.js
│   ├── services/
│   │   ├── kredikaService.js
│   │   ├── uploadService.js
│   │   └── emailService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── docs/
│   │   └── swagger.js
│   └── app.js
├── uploads/
├── .env
├── .gitignore
└── server.js
```

## 🔧 Configuration

### 1. Variables d'environnement (.env)
```env
# Serveur
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/furniture-store

# JWT
JWT_SECRET=votre_jwt_secret_super_securise
JWT_EXPIRE=7d

# Cloudinary (pour les images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Kredika API
KREDIKA_API_URL=https://api.kredika.com
KREDIKA_API_KEY=votre_kredika_api_key
KREDIKA_SECRET_KEY=votre_kredika_secret_key
KREDIKA_WEBHOOK_SECRET=votre_webhook_secret

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe
```

### 2. Configuration MongoDB (src/config/database.js)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3. Configuration Cloudinary (src/config/cloudinary.js)
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

## 📊 Modèles de données

### 1. Modèle User (src/models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'France' }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 2. Modèle Product (src/models/Product.js)
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  video: {
    url: { type: String },
    publicId: { type: String },
    thumbnail: { type: String },
    duration: { type: Number }, // en secondes
    fileSize: { type: Number } // en bytes
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  materials: [String],
  colors: [String],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  brand: String,
  sku: {
    type: String,
    unique: true,
    required: true
  },
  tags: [String],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: -1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
```

### 3. Modèle Order (src/models/Order.js)
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    name: String, // Sauvegarde du nom au moment de la commande
    image: String  // Sauvegarde de l'image principale
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'France' },
    phone: String
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['kredika', 'card', 'paypal'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    kredikaTransactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date
  },
  notes: String,
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Génération automatique du numéro de commande
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

### 4. Modèle Category (src/models/Category.js)
```javascript
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: String,
  image: {
    url: String,
    publicId: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
```

### 5. Modèle AdminSettings (src/models/AdminSettings.js)
```javascript
const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  // Configuration générale
  siteName: {
    type: String,
    default: 'Furniture Store'
  },
  siteDescription: {
    type: String,
    default: 'Votre magasin de meubles en ligne'
  },
  contactEmail: {
    type: String,
    default: 'contact@furniture-store.com'
  },
  
  // Configuration des frais de livraison
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 500 // Livraison gratuite au-dessus de 500€
    },
    standardShippingCost: {
      type: Number,
      default: 50
    },
    expressShippingCost: {
      type: Number,
      default: 85
    },
    internationalShippingCost: {
      type: Number,
      default: 120
    }
  },

  // Configuration des taxes
  taxes: {
    vatRate: {
      type: Number,
      default: 0.2 // 20% TVA
    },
    ecoTaxRate: {
      type: Number,
      default: 0.02 // 2% éco-taxe
    }
  },

  // Configuration Kredika et commissions
  kredika: {
    commissionRate: {
      type: Number,
      default: 0.029 // 2.9% commission par défaut
    },
    fixedCommission: {
      type: Number,
      default: 0.30 // 0.30€ fixe par transaction
    },
    minimumAmount: {
      type: Number,
      default: 1 // Montant minimum pour Kredika (1€)
    },
    maximumAmount: {
      type: Number,
      default: 3000 // Montant maximum pour Kredika (3000€)
    },
    installmentOptions: [{
      months: { type: Number, required: true },
      interestRate: { type: Number, required: true },
      minAmount: { type: Number, required: true },
      isActive: { type: Boolean, default: true }
    }],
    // Configuration des frais par durée
    feeStructure: {
      threeMonths: { rate: 0.0, fixedFee: 15 },
      sixMonths: { rate: 0.025, fixedFee: 20 },
      twelveMonths: { rate: 0.05, fixedFee: 25 },
      twentyFourMonths: { rate: 0.08, fixedFee: 35 }
    }
  },

  // Configuration des remises et promotions
  promotions: {
    maxDiscountPercentage: {
      type: Number,
      default: 70 // Maximum 70% de remise
    },
    loyaltyPointsRate: {
      type: Number,
      default: 0.01 // 1% en points de fidélité
    },
    referralBonus: {
      type: Number,
      default: 25 // 25€ bonus parrainage
    }
  },

  // Configuration des notifications
  notifications: {
    emailNotifications: {
      newOrder: { type: Boolean, default: true },
      paymentConfirmed: { type: Boolean, default: true },
      orderShipped: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true }
    },
    smsNotifications: {
      orderConfirmation: { type: Boolean, default: false },
      deliveryUpdate: { type: Boolean, default: false }
    },
    pushNotifications: {
      enabled: { type: Boolean, default: true },
      topics: [String]
    }
  },

  // Configuration du contenu
  content: {
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: 'Site en maintenance' }
    },
    featuredProductsCount: {
      type: Number,
      default: 8
    },
    productsPerPage: {
      type: Number,
      default: 12
    },
    allowGuestCheckout: {
      type: Boolean,
      default: true
    }
  },

  // Configuration des médias
  media: {
    maxImageSize: {
      type: Number,
      default: 5242880 // 5MB
    },
    maxVideoSize: {
      type: Number,
      default: 52428800 // 50MB
    },
    allowedImageTypes: {
      type: [String],
      default: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    },
    allowedVideoTypes: {
      type: [String],
      default: ['video/mp4', 'video/webm', 'video/ogg']
    },
    imageCompressionQuality: {
      type: Number,
      default: 85
    }
  },

  // Paramètres modifiés par l'admin
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Middleware pour s'assurer qu'il n'y a qu'une seule instance
adminSettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this({});
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
```

## 🔐 Authentification et Middleware

### 1. Middleware d'authentification (src/middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
```

### 2. Middleware d'upload (src/middleware/upload.js)
```javascript
const multer = require('multer');
const path = require('path');

// Configuration pour l'upload en mémoire
const storage = multer.memoryStorage();

// Filter pour les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configuration pour images de produits (multiple)
const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 images par produit
  },
  fileFilter: imageFilter
}).array('images', 5);

// Configuration pour avatar utilisateur (single)
const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: imageFilter
}).single('avatar');

// Filter pour les vidéos
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|ogg|avi|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /video\//.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// Configuration pour vidéo de produit (single)
const uploadProductVideo = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: videoFilter
}).single('video');

// Configuration pour upload mixte (images + vidéo)
const uploadProductMedia = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB pour les vidéos
    files: 6 // Maximum 5 images + 1 vidéo
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      return imageFilter(req, file, cb);
    } else if (file.fieldname === 'video') {
      return videoFilter(req, file, cb);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]);

module.exports = {
  uploadProductImages,
  uploadAvatar,
  uploadProductVideo,
  uploadProductMedia
};
```

## 🎯 Contrôleurs

### 1. Contrôleur Auth (src/controllers/authController.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
```

### 2. Contrôleur Products (src/controllers/productController.js)
```javascript
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Construction du filtre
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Options de tri
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts
};
```

### 3. Contrôleur Orders (src/controllers/orderController.js)
```javascript
const Order = require('../models/Order');
const Product = require('../models/Product');
const kredikaService = require('../services/kredikaService');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validation des produits et calcul des prix
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.inStock) {
        return res.status(400).json({ 
          message: `Product ${product?.name || 'unknown'} is not available` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0]?.url
      });
    }

    // Calcul des frais
    const shipping = subtotal > 500 ? 0 : 50; // Livraison gratuite > 500€
    const tax = subtotal * 0.2; // TVA 20%
    const total = subtotal + shipping + tax;

    // Créer la commande
    const order = new Order({
      user: userId,
      items: validatedItems,
      shippingAddress,
      pricing: {
        subtotal,
        shipping,
        tax,
        total
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      }
    });

    await order.save();

    // Si paiement Kredika, initier la transaction
    if (paymentMethod === 'kredika') {
      try {
        const kredikaResponse = await kredikaService.createPayment({
          orderId: order._id,
          amount: total,
          currency: 'EUR',
          customer: {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName
          }
        });

        order.payment.kredikaTransactionId = kredikaResponse.transactionId;
        await order.save();

        return res.status(201).json({
          success: true,
          order,
          paymentUrl: kredikaResponse.paymentUrl
        });
      } catch (kredikaError) {
        console.error('Kredika payment error:', kredikaError);
        return res.status(400).json({ 
          message: 'Payment processing failed',
          error: kredikaError.message 
        });
      }
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
```

### 4. Contrôleur Favorites (src/controllers/favoriteController.js)
```javascript
const User = require('../models/User');
const Product = require('../models/Product');

const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ajouter aux favoris si pas déjà présent
    const user = await User.findById(userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Product added to favorites'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== productId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
};
```

### 5. Contrôleur AdminSettings (src/controllers/adminSettingsController.js)
```javascript
const AdminSettings = require('../models/AdminSettings');
const kredikaService = require('../services/kredikaService');

const getSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.getInstance();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.getInstance();
    
    // Mettre à jour uniquement les champs fournis
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
          // Pour les objets imbriqués, fusionner les propriétés
          settings[key] = { ...settings[key], ...req.body[key] };
        } else {
          settings[key] = req.body[key];
        }
      }
    });
    
    settings.lastModifiedBy = req.user.id;
    await settings.save();
    
    // Si les paramètres Kredika ont été modifiés, mettre à jour le service
    if (req.body.kredika) {
      kredikaService.updateConfig(settings.kredika);
    }
    
    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateKredikaSettings = async (req, res) => {
  try {
    const {
      commissionRate,
      fixedCommission,
      minimumAmount,
      maximumAmount,
      installmentOptions,
      feeStructure
    } = req.body;
    
    const settings = await AdminSettings.getInstance();
    
    // Validation des paramètres Kredika
    if (commissionRate && (commissionRate < 0 || commissionRate > 0.1)) {
      return res.status(400).json({
        message: 'Commission rate must be between 0% and 10%'
      });
    }
    
    if (minimumAmount && minimumAmount < 1) {
      return res.status(400).json({
        message: 'Minimum amount cannot be less than 1€'
      });
    }
    
    // Mettre à jour les paramètres Kredika
    settings.kredika = {
      ...settings.kredika,
      ...(commissionRate && { commissionRate }),
      ...(fixedCommission && { fixedCommission }),
      ...(minimumAmount && { minimumAmount }),
      ...(maximumAmount && { maximumAmount }),
      ...(installmentOptions && { installmentOptions }),
      ...(feeStructure && { feeStructure })
    };
    
    settings.lastModifiedBy = req.user.id;
    await settings.save();
    
    // Mettre à jour la configuration du service Kredika
    kredikaService.updateConfig(settings.kredika);
    
    res.json({
      success: true,
      data: settings.kredika,
      message: 'Kredika settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateKredikaFees = async (req, res) => {
  try {
    const { amount, months } = req.query;
    
    if (!amount || !months) {
      return res.status(400).json({
        message: 'Amount and months are required'
      });
    }
    
    const settings = await AdminSettings.getInstance();
    const kredikaSettings = settings.kredika;
    
    // Calculer les frais basés sur la durée
    let feeConfig;
    switch (parseInt(months)) {
      case 3:
        feeConfig = kredikaSettings.feeStructure.threeMonths;
        break;
      case 6:
        feeConfig = kredikaSettings.feeStructure.sixMonths;
        break;
      case 12:
        feeConfig = kredikaSettings.feeStructure.twelveMonths;
        break;
      case 24:
        feeConfig = kredikaSettings.feeStructure.twentyFourMonths;
        break;
      default:
        return res.status(400).json({
          message: 'Invalid installment duration'
        });
    }
    
    const baseAmount = parseFloat(amount);
    const interestAmount = baseAmount * feeConfig.rate;
    const fixedFee = feeConfig.fixedFee;
    const totalAmount = baseAmount + interestAmount + fixedFee;
    const monthlyPayment = totalAmount / parseInt(months);
    
    // Commission pour l'admin
    const adminCommission = baseAmount * kredikaSettings.commissionRate + kredikaSettings.fixedCommission;
    
    res.json({
      success: true,
      data: {
        baseAmount,
        interestAmount,
        fixedFee,
        totalAmount,
        monthlyPayment,
        adminCommission,
        months: parseInt(months),
        apr: feeConfig.rate * 100 // Taux annuel en pourcentage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetToDefaults = async (req, res) => {
  try {
    // Supprimer les paramètres existants
    await AdminSettings.deleteMany({});
    
    // Créer de nouveaux paramètres par défaut
    const defaultSettings = new AdminSettings({});
    defaultSettings.lastModifiedBy = req.user.id;
    await defaultSettings.save();
    
    res.json({
      success: true,
      data: defaultSettings,
      message: 'Settings reset to defaults successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateKredikaSettings,
  calculateKredikaFees,
  resetToDefaults
};
```

## 💳 Service Kredika

### Service Kredika (src/services/kredikaService.js)
```javascript
const axios = require('axios');
const crypto = require('crypto');

class KredikaService {
  constructor() {
    this.apiUrl = process.env.KREDIKA_API_URL;
    this.apiKey = process.env.KREDIKA_API_KEY;
    this.secretKey = process.env.KREDIKA_SECRET_KEY;
    this.config = null; // Configuration admin dynamique
  }

  // Mettre à jour la configuration depuis les paramètres admin
  updateConfig(kredikaSettings) {
    this.config = kredikaSettings;
  }

  // Obtenir la configuration actuelle
  async getConfig() {
    if (!this.config) {
      const AdminSettings = require('../models/AdminSettings');
      const settings = await AdminSettings.getInstance();
      this.config = settings.kredika;
    }
    return this.config;
  }

  // Créer une signature pour sécuriser les requêtes
  createSignature(data) {
    const payload = JSON.stringify(data);
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');
  }

  // Initier un paiement
  async createPayment(orderData) {
    try {
      const config = await this.getConfig();
      
      // Vérifier les limites de montant
      if (orderData.amount < config.minimumAmount || orderData.amount > config.maximumAmount) {
        throw new Error(`Payment amount must be between ${config.minimumAmount}€ and ${config.maximumAmount}€`);
      }
      
      const paymentData = {
        amount: orderData.amount * 100, // Kredika travaille en centimes
        currency: orderData.currency,
        orderId: orderData.orderId.toString(),
        customer: orderData.customer,
        installments: orderData.installments || 1,
        metadata: {
          source: 'furniture-store',
          timestamp: Date.now(),
          commissionRate: config.commissionRate,
          fixedCommission: config.fixedCommission
        },
        returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
        webhookUrl: `${process.env.BACKEND_URL}/api/webhooks/kredika`
      };

      const signature = this.createSignature(paymentData);

      const response = await axios.post(`${this.apiUrl}/payments`, paymentData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Signature': signature,
          'Content-Type': 'application/json'
        }
      });

      return {
        transactionId: response.data.transactionId,
        paymentUrl: response.data.paymentUrl,
        status: response.data.status
      };
    } catch (error) {
      console.error('Kredika payment creation error:', error.response?.data || error.message);
      throw new Error(`Payment creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(transactionId) {
    try {
      const response = await axios.get(`${this.apiUrl}/payments/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        orderId: response.data.orderId
      };
    } catch (error) {
      console.error('Kredika payment status error:', error.response?.data || error.message);
      throw new Error(`Payment status check failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Traiter un webhook Kredika
  processWebhook(payload, signature) {
    try {
      // Vérifier la signature du webhook
      const expectedSignature = crypto
        .createHmac('sha256', process.env.KREDIKA_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }

      return {
        valid: true,
        event: payload.event,
        transactionId: payload.transactionId,
        orderId: payload.orderId,
        status: payload.status,
        amount: payload.amount
      };
    } catch (error) {
      console.error('Webhook processing error:', error.message);
      return { valid: false, error: error.message };
    }
  }

  // Rembourser un paiement
  async refundPayment(transactionId, amount = null) {
    try {
      const refundData = {
        transactionId,
        amount: amount ? amount * 100 : null // Si amount n'est pas spécifié, remboursement total
      };

      const response = await axios.post(`${this.apiUrl}/refunds`, refundData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        refundId: response.data.refundId,
        status: response.data.status,
        amount: response.data.amount
      };
    } catch (error) {
      console.error('Kredika refund error:', error.response?.data || error.message);
      throw new Error(`Refund failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Calculer la commission admin pour un paiement
  async calculateCommission(amount, installments = 1) {
    const config = await this.getConfig();
    
    let feeStructure;
    switch (installments) {
      case 3:
        feeStructure = config.feeStructure.threeMonths;
        break;
      case 6:
        feeStructure = config.feeStructure.sixMonths;
        break;
      case 12:
        feeStructure = config.feeStructure.twelveMonths;
        break;
      case 24:
        feeStructure = config.feeStructure.twentyFourMonths;
        break;
      default:
        feeStructure = { rate: 0, fixedFee: 0 };
    }
    
    const percentageCommission = amount * config.commissionRate;
    const fixedCommission = config.fixedCommission;
    const interestAmount = amount * feeStructure.rate;
    const totalCommission = percentageCommission + fixedCommission;
    
    return {
      baseAmount: amount,
      percentageCommission,
      fixedCommission,
      totalCommission,
      interestAmount,
      installmentFee: feeStructure.fixedFee,
      netAmount: amount - totalCommission
    };
  }

  // Obtenir les options de paiement échelonné disponibles
  async getAvailableInstallments(amount) {
    const config = await this.getConfig();
    
    return config.installmentOptions
      .filter(option => option.isActive && amount >= option.minAmount)
      .map(option => ({
        months: option.months,
        interestRate: option.interestRate,
        minAmount: option.minAmount,
        monthlyPayment: (amount + (amount * option.interestRate)) / option.months
      }));
  }
}

module.exports = new KredikaService();
```

### Webhook Handler pour Kredika
```javascript
// src/controllers/webhookController.js
const Order = require('../models/Order');
const kredikaService = require('../services/kredikaService');

const handleKredikaWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    const webhookData = kredikaService.processWebhook(req.body, signature);

    if (!webhookData.valid) {
      return res.status(400).json({ error: 'Invalid webhook' });
    }

    const { event, transactionId, orderId, status } = webhookData;

    // Trouver la commande
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Traiter selon le type d'événement
    switch (event) {
      case 'payment.succeeded':
        order.payment.status = 'paid';
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        order.statusHistory.push({
          status: 'confirmed',
          note: 'Payment confirmed via Kredika'
        });
        break;

      case 'payment.failed':
        order.payment.status = 'failed';
        order.status = 'cancelled';
        order.statusHistory.push({
          status: 'cancelled',
          note: 'Payment failed'
        });
        break;

      case 'payment.refunded':
        order.payment.status = 'refunded';
        order.statusHistory.push({
          status: 'refunded',
          note: 'Payment refunded'
        });
        break;
    }

    await order.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = { handleKredikaWebhook };
```

## 📤 Service d'Upload

### Service Upload (src/services/uploadService.js)
```javascript
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

class UploadService {
  // Upload d'images multiples pour produits
  async uploadProductImages(files) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadSingleImage(file, 'products')
      );
      
      const results = await Promise.all(uploadPromises);
      return results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        alt: ''
      }));
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Upload d'avatar utilisateur
  async uploadAvatar(file) {
    try {
      const result = await this.uploadSingleImage(file, 'avatars', {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      throw new Error(`Avatar upload failed: ${error.message}`);
    }
  }

  // Upload d'une image unique
  uploadSingleImage(file, folder, transformation = {}) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: transformation
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convertir le buffer en stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });
  }

  // Supprimer une image
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  // Supprimer plusieurs images
  async deleteImages(publicIds) {
    try {
      const deletePromises = publicIds.map(id => 
        cloudinary.uploader.destroy(id)
      );
      return await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(`Images deletion failed: ${error.message}`);
    }
  }

  // Upload de vidéo de produit
  async uploadProductVideo(file) {
    try {
      const result = await this.uploadSingleVideo(file, 'products/videos', {
        quality: 'auto:best',
        format: 'mp4'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        fileSize: result.bytes,
        thumbnail: result.secure_url.replace('.mp4', '.jpg')
      };
    } catch (error) {
      throw new Error(`Video upload failed: ${error.message}`);
    }
  }

  // Upload d'une vidéo unique
  uploadSingleVideo(file, folder, transformation = {}) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'video',
          transformation: transformation
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convertir le buffer en stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });
  }

  // Supprimer une vidéo
  async deleteVideo(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video'
      });
      return result;
    } catch (error) {
      throw new Error(`Video deletion failed: ${error.message}`);
    }
  }

  // Upload combiné images + vidéo
  async uploadProductMedia(files) {
    try {
      const results = { images: [], video: null };

      // Upload des images si présentes
      if (files.images && files.images.length > 0) {
        results.images = await this.uploadProductImages(files.images);
      }

      // Upload de la vidéo si présente
      if (files.video && files.video.length > 0) {
        results.video = await this.uploadProductVideo(files.video[0]);
      }

      return results;
    } catch (error) {
      throw new Error(`Media upload failed: ${error.message}`);
    }
  }
}

module.exports = new UploadService();
```

### Contrôleur Upload (src/controllers/uploadController.js)
```javascript
const uploadService = require('../services/uploadService');
const User = require('../models/User');

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Supprimer l'ancien avatar s'il existe
    const user = await User.findById(req.user.id);
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await uploadService.deleteImage(`avatars/${publicId}`);
    }

    // Upload du nouveau avatar
    const uploadResult = await uploadService.uploadAvatar(req.file);

    // Mettre à jour l'utilisateur
    user.avatar = uploadResult.url;
    await user.save();

    res.json({
      success: true,
      avatar: uploadResult.url,
      message: 'Avatar updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadResults = await uploadService.uploadProductImages(req.files);

    res.json({
      success: true,
      images: uploadResults,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProductVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const uploadResult = await uploadService.uploadProductVideo(req.file);

    res.json({
      success: true,
      video: uploadResult,
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProductMedia = async (req, res) => {
  try {
    if (!req.files || (!req.files.images && !req.files.video)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadResults = await uploadService.uploadProductMedia(req.files);

    res.json({
      success: true,
      media: uploadResults,
      message: 'Media uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAvatar,
  uploadProductImages,
  uploadProductVideo,
  uploadProductMedia
};
```

## 🛣️ Routes API

### Routes principales (src/app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const favoriteRoutes = require('./routes/favorites');
const uploadRoutes = require('./routes/uploads');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares de sécurité et performance
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Parsing du body (webhook Kredika nécessite raw pour la signature)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentation Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
```

### Routes Auth (src/routes/auth.js)
```javascript
const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, getProfile);

module.exports = router;
```

### Routes Admin (src/routes/admin.js)
```javascript
const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadProductMedia } = require('../middleware/upload');
const {
  getSettings,
  updateSettings,
  updateKredikaSettings,
  calculateKredikaFees,
  resetToDefaults
} = require('../controllers/adminSettingsController');
const { uploadProductMedia: uploadMedia } = require('../controllers/uploadController');

const router = express.Router();

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get admin settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/settings', adminAuth, getSettings);

/**
 * @swagger
 * /api/admin/settings:
 *   put:
 *     summary: Update admin settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteName:
 *                 type: string
 *               shipping:
 *                 type: object
 *               taxes:
 *                 type: object
 *               kredika:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/settings', adminAuth, updateSettings);

/**
 * @swagger
 * /api/admin/settings/kredika:
 *   put:
 *     summary: Update Kredika settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionRate:
 *                 type: number
 *                 description: Commission rate (0-0.1)
 *               fixedCommission:
 *                 type: number
 *               minimumAmount:
 *                 type: number
 *               maximumAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Kredika settings updated successfully
 */
router.put('/settings/kredika', adminAuth, updateKredikaSettings);

/**
 * @swagger
 * /api/admin/kredika/calculate-fees:
 *   get:
 *     summary: Calculate Kredika fees for given amount and duration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: months
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [3, 6, 12, 24]
 *     responses:
 *       200:
 *         description: Fee calculation successful
 */
router.get('/kredika/calculate-fees', adminAuth, calculateKredikaFees);

/**
 * @swagger
 * /api/admin/settings/reset:
 *   post:
 *     summary: Reset settings to defaults
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings reset successfully
 */
router.post('/settings/reset', adminAuth, resetToDefaults);

/**
 * @swagger
 * /api/admin/upload/product-media:
 *   post:
 *     summary: Upload product images and video
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 */
router.post('/upload/product-media', adminAuth, uploadProductMedia, uploadMedia);

module.exports = router;
```

## 📋 Documentation Swagger

### Configuration Swagger (src/docs/swagger.js)
```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Furniture Store API',
      version: '1.0.0',
      description: 'API pour l\'application e-commerce d\'ameublement avec intégration Kredika',
      contact: {
        name: 'API Support',
        email: 'support@furniture-store.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-api-domain.com'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            originalPrice: { type: 'number' },
            discount: { type: 'number' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  publicId: { type: 'string' },
                  alt: { type: 'string' }
                }
              }
            },
            category: { $ref: '#/components/schemas/Category' },
            inStock: { type: 'boolean' },
            featured: { type: 'boolean' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            user: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' }
                }
              }
            },
            status: { 
              type: 'string',
              enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
            },
            payment: {
              type: 'object',
              properties: {
                method: { type: 'string' },
                status: { type: 'string' },
                kredikaTransactionId: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

module.exports = swaggerJsdoc(options);
```

## 🚀 Démarrage et Scripts

### Package.json scripts
```json
{
  "name": "furniture-backend",
  "version": "1.0.0",
  "description": "Backend for furniture e-commerce app with Kredika integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "seed": "node scripts/seedDatabase.js"
  },
  "keywords": ["ecommerce", "furniture", "kredika", "nodejs", "express"],
  "author": "Your Name",
  "license": "MIT"
}
```

### Serveur principal (server.js)
```javascript
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = server;
```

### Script de seedage (scripts/seedDatabase.js)
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import des modèles
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

const connectDB = require('../src/config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Nettoyer les collections existantes
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Data cleared...');

    // Créer un utilisateur admin
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@furniture-store.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Créer des catégories
    const categories = await Category.insertMany([
      { name: 'Salon', slug: 'salon', description: 'Meubles pour le salon' },
      { name: 'Chambre', slug: 'chambre', description: 'Meubles pour la chambre' },
      { name: 'Cuisine', slug: 'cuisine', description: 'Meubles pour la cuisine' },
      { name: 'Bureau', slug: 'bureau', description: 'Meubles de bureau' }
    ]);

    // Créer des produits de test
    const products = [
      {
        name: 'Canapé 3 places moderne',
        description: 'Canapé confortable en tissu gris moderne',
        price: 899,
        originalPrice: 1099,
        discount: 18,
        category: categories[0]._id,
        images: [
          { url: 'https://example.com/canape1.jpg', publicId: 'canape1', alt: 'Canapé 3 places' }
        ],
        sku: 'CANAPE-001',
        featured: true,
        inStock: true,
        stockQuantity: 10
      },
      {
        name: 'Table basse en chêne',
        description: 'Table basse en bois de chêne massif',
        price: 299,
        category: categories[0]._id,
        images: [
          { url: 'https://example.com/table1.jpg', publicId: 'table1', alt: 'Table basse' }
        ],
        sku: 'TABLE-001',
        featured: true,
        inStock: true,
        stockQuantity: 15
      }
      // Ajoutez plus de produits selon vos besoins
    ];

    await Product.insertMany(products);

    console.log('✅ Database seeded successfully');
    console.log('👤 Admin user created: admin@furniture-store.com / admin123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
```

## 🔒 Sécurité et Production

### Middleware de gestion d'erreurs (src/middleware/errorHandler.js)
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

### Variables d'environnement pour production
```env
# Production
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com

# Base de données (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture-store

# JWT
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_production_cloud
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET=your_production_secret

# Kredika Production
KREDIKA_API_URL=https://api.kredika.com
KREDIKA_API_KEY=your_production_kredika_key
KREDIKA_SECRET_KEY=your_production_kredika_secret
KREDIKA_WEBHOOK_SECRET=your_production_webhook_secret
```

## 🧪 Tests

### Configuration Jest (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/docs/**',
    '!src/config/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

### Tests d'exemple (tests/auth.test.js)
```javascript
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });
});
```

## 📝 Déploiement

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: furniture-store
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

## ✅ Checklist de déploiement

### Avant le déploiement
- [ ] Configurer toutes les variables d'environnement
- [ ] Tester l'intégration Kredika en mode sandbox
- [ ] Configurer Cloudinary pour la production
- [ ] Sécuriser MongoDB (authentification, réseau)
- [ ] Configurer les CORS pour le domaine de production
- [ ] Tester tous les endpoints avec Postman/Insomnia
- [ ] Vérifier la configuration SSL/HTTPS
- [ ] Configurer les webhooks Kredika
- [ ] Tester les uploads d'images
- [ ] Exécuter les tests automatisés

### Après le déploiement
- [ ] Vérifier la santé de l'API (`/health`)
- [ ] Tester un paiement Kredika complet
- [ ] Vérifier les logs d'erreur
- [ ] Configurer la surveillance (monitoring)
- [ ] Tester les fonctionnalités de favoris
- [ ] Vérifier le suivi des commandes
- [ ] Valider les webhooks en production

## 📹 Gestion des Vidéos Produits

### Upload de Média Mixte (Images + Vidéo)
```javascript
// Exemple d'utilisation côté frontend
const uploadProductMedia = async (productId, files) => {
  const formData = new FormData();
  
  // Ajouter les images
  files.images.forEach((image, index) => {
    formData.append('images', image);
  });
  
  // Ajouter la vidéo
  if (files.video) {
    formData.append('video', files.video);
  }
  
  const response = await fetch('/api/admin/upload/product-media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};
```

### Affichage des Vidéos dans le Frontend
```javascript
// Composant VideoPlayer pour React
const ProductVideo = ({ video }) => {
  if (!video?.url) return null;
  
  return (
    <div className="relative">
      <video 
        controls 
        poster={video.thumbnail}
        className="w-full h-auto rounded-lg"
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
        {formatDuration(video.duration)}
      </div>
    </div>
  );
};
```

## ⚙️ Configuration Admin Dynamique

### Interface de Configuration Kredika
```javascript
// Exemple d'interface admin pour configurer Kredika
const KredikaSettings = () => {
  const [settings, setSettings] = useState({});
  
  const updateKredikaSettings = async (newSettings) => {
    const response = await fetch('/api/admin/settings/kredika', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newSettings)
    });
    
    if (response.ok) {
      alert('Paramètres Kredika mis à jour avec succès');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Taux de commission (%)</label>
        <input 
          type="number" 
          step="0.001"
          max="10"
          value={settings.commissionRate * 100}
          onChange={(e) => setSettings({
            ...settings,
            commissionRate: e.target.value / 100
          })}
        />
      </div>
      
      <div>
        <label>Commission fixe (€)</label>
        <input 
          type="number" 
          step="0.01"
          value={settings.fixedCommission}
          onChange={(e) => setSettings({
            ...settings,
            fixedCommission: parseFloat(e.target.value)
          })}
        />
      </div>
      
      <button type="submit">Sauvegarder</button>
    </form>
  );
};
```

### Calculateur de Frais en Temps Réel
```javascript
// Calculateur de frais Kredika pour l'admin
const FeeCalculator = () => {
  const [amount, setAmount] = useState(100);
  const [months, setMonths] = useState(3);
  const [fees, setFees] = useState(null);
  
  const calculateFees = async () => {
    const response = await fetch(
      `/api/admin/kredika/calculate-fees?amount=${amount}&months=${months}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const result = await response.json();
    setFees(result.data);
  };
  
  useEffect(() => {
    calculateFees();
  }, [amount, months]);
  
  return (
    <div className="p-4 border rounded">
      <h3>Calculateur de Frais Kredika</h3>
      
      <div>
        <label>Montant (€)</label>
        <input 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <div>
        <label>Durée</label>
        <select 
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        >
          <option value={3}>3 mois</option>
          <option value={6}>6 mois</option>
          <option value={12}>12 mois</option>
          <option value={24}>24 mois</option>
        </select>
      </div>
      
      {fees && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>Montant de base: {fees.baseAmount}€</p>
          <p>Intérêts: {fees.interestAmount.toFixed(2)}€</p>
          <p>Frais fixes: {fees.fixedFee}€</p>
          <p>Total client: {fees.totalAmount.toFixed(2)}€</p>
          <p>Paiement mensuel: {fees.monthlyPayment.toFixed(2)}€</p>
          <p><strong>Commission admin: {fees.adminCommission.toFixed(2)}€</strong></p>
        </div>
      )}
    </div>
  );
};
```

## 🎯 Endpoints API Principaux

### Gestion des Produits avec Vidéo
```bash
# Créer un produit avec images et vidéo
POST /api/admin/products
Content-Type: multipart/form-data

# Body:
name: "Canapé moderne"
description: "Description du produit"
price: 899
images: [file1.jpg, file2.jpg]
video: product_demo.mp4
```

### Configuration Admin
```bash
# Obtenir les paramètres actuels
GET /api/admin/settings

# Mettre à jour les paramètres Kredika
PUT /api/admin/settings/kredika
{
  "commissionRate": 0.029,
  "fixedCommission": 0.30,
  "feeStructure": {
    "threeMonths": { "rate": 0.0, "fixedFee": 15 },
    "sixMonths": { "rate": 0.025, "fixedFee": 20 }
  }
}

# Calculer les frais
GET /api/admin/kredika/calculate-fees?amount=500&months=6
```

### Intégration Frontend-Backend
```javascript
// Service pour l'admin
class AdminService {
  static async updateShippingRates(rates) {
    return fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ shipping: rates })
    });
  }
  
  static async getKredikaCommission(amount, installments) {
    const response = await fetch(
      `/api/admin/kredika/calculate-fees?amount=${amount}&months=${installments}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );
    return response.json();
  }
}
```

## 📱 Optimisations Vidéo

### Configuration Cloudinary pour Vidéos
```javascript
// Paramètres optimisés pour les vidéos produits
const videoTransformations = {
  quality: 'auto:best',
  format: 'mp4',
  video_codec: 'h264',
  audio_codec: 'aac',
  flags: 'progressive',
  // Génération automatique de thumbnail
  transformation: [
    {
      width: 800,
      height: 600,
      crop: 'limit'
    },
    {
      quality: 'auto:good',
      fetch_format: 'auto'
    }
  ]
};
```

### Compression et Optimisation
```javascript
// Middleware pour optimiser les vidéos avant upload
const optimizeVideo = async (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (file.size > maxSize) {
    throw new Error(`Video file too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
  }
  
  // Vérifier la durée (max 2 minutes pour les démos produits)
  const maxDuration = 120; // 2 minutes
  // Logic to check video duration would go here
  
  return file;
};
```

## 🔄 Webhooks et Synchronisation

### Webhook pour Mise à Jour des Commissions
```javascript
// Webhook pour synchroniser les changements de commission
app.post('/api/webhooks/kredika/commission-update', (req, res) => {
  const { newCommissionRate, effectiveDate } = req.body;
  
  // Mettre à jour les paramètres admin
  AdminSettings.getInstance().then(settings => {
    settings.kredika.commissionRate = newCommissionRate;
    settings.lastModifiedBy = 'system';
    return settings.save();
  });
  
  res.status(200).json({ success: true });
});
```

Ce guide vous donne maintenant une base complète pour développer le backend de votre application e-commerce avec :

✅ **Support complet des vidéos** pour les produits
✅ **Configuration admin dynamique** pour tous les paramètres
✅ **Gestion flexible des commissions Kredika**
✅ **Interface d'administration** pour ajuster les taux
✅ **Calculateurs en temps réel** des frais et commissions
✅ **Upload optimisé** images + vidéos
✅ **Webhooks avancés** pour la synchronisation

Le système est maintenant entièrement configurable par l'administrateur sans nécessiter de redéploiement du code.