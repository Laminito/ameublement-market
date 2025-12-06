import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Heart, User, Search, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600 text-xs sm:text-sm">
              <span className="hidden sm:inline">📞 +221 77 123 45 67 | ✉️ contact@meublemarket.sn</span>
              <span className="sm:hidden">📞 +221 77 123 45 67</span>
            </div>
            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
              {!isAuthenticated ? (
                <>
                  <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-primary-600">
                    Connexion
                  </Link>
                  <Link to={ROUTES.REGISTER} className="text-gray-600 hover:text-primary-600">
                    Inscription
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">M</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                MeubleMarket
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Votre confort à crédit</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des meubles..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition">
              <Heart size={20} className="text-gray-600" />
            </button>
            {isAuthenticated && (
              <button 
                onClick={() => navigate(ROUTES.PROFILE)}
                className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition"
                title="My Profile"
              >
                <User size={20} className="text-gray-600" />
              </button>
            )}
            <Link 
              to={ROUTES.CART} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart size={20} className="text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              {mobileMenuOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex gap-8 py-3 border-t border-gray-100">
          <Link to={ROUTES.HOME} className="text-gray-700 hover:text-primary-600 font-medium transition">
            Accueil
          </Link>
          <Link to={ROUTES.PRODUCTS} className="text-gray-700 hover:text-primary-600 font-medium transition">
            Produits
          </Link>
          <Link to={ROUTES.WISHLIST} className="text-gray-700 hover:text-primary-600 font-medium transition">
            Favoris
          </Link>
          <Link to={ROUTES.ORDERS} className="text-gray-700 hover:text-primary-600 font-medium transition">
            Mes commandes
          </Link>
        </nav>

        {/* Navigation Mobile */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col gap-2">
              <Link 
                to={ROUTES.HOME} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg"
              >
                🏠 Accueil
              </Link>
              <Link 
                to={ROUTES.PRODUCTS} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg"
              >
                🛋️ Produits
              </Link>
              <Link 
                to={ROUTES.WISHLIST} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg"
              >
                ❤️ Favoris
              </Link>
              <Link 
                to={ROUTES.ORDERS} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg"
              >
                📦 Mes commandes
              </Link>
              {isAuthenticated && (
                <Link 
                  to={ROUTES.PROFILE} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg"
                >
                  👤 Mon profil
                </Link>
              )}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {!isAuthenticated ? (
                  <Link 
                    to={ROUTES.LOGIN} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium transition px-4 py-3 rounded-lg block"
                  >
                    👤 Connexion
                  </Link>
                ) : null}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
