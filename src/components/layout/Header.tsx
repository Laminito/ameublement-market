import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Heart, User, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { ROUTES } from '@/constants/routes';

const Header = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              📞 +221 77 123 45 67 | ✉️ contact@meublemarket.sn
            </div>
            <div className="flex gap-4">
              <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-primary-600">
                Connexion
              </Link>
              <Link to={ROUTES.REGISTER} className="text-gray-600 hover:text-primary-600">
                Inscription
              </Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                MeubleMarket
              </h1>
              <p className="text-xs text-gray-500">Votre confort à crédit</p>
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
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Heart size={24} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <User size={24} className="text-gray-600" />
            </button>
            <Link 
              to={ROUTES.CART} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart size={24} className="text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition">
              <Menu size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
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
      </div>
    </header>
  );
};

export default Header;
