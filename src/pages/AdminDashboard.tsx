import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, BarChart3, Settings, ArrowRight, TrendingUp, ShoppingCart, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminProductService from '@/services/adminProductService';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirection si pas admin
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [isAdmin, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les produits
      const productsResponse = await AdminProductService.getAllProducts(1, 1);
      const totalProducts = productsResponse.totalItems || 0;

      // TODO: Ajouter les endpoints pour les stats complètes quand disponibles
      setStats({
        totalProducts,
        totalUsers: 0,
        totalRevenue: 0,
        totalOrders: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
              <p className="text-gray-600 mt-1">Bienvenue, {user?.name || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">{error}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Produits totaux</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-2">Produits dans le catalogue</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Utilisateurs totaux</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-2">Comptes utilisateur</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ShoppingCart className="text-yellow-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Commandes totales</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-2">Commandes passées</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Revenu total</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalRevenue.toLocaleString()} DZD
            </p>
            <p className="text-xs text-gray-500 mt-2">Revenue généré</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Produits</h2>
                <p className="text-gray-600">Gérer l'inventaire et les produits</p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Ajouter des nouveaux produits
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Modifier les informations produit
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Gérer les images et descriptions
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Supprimer les produits
              </li>
            </ul>

            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Accéder à la gestion
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Upcoming Features */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow opacity-75">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Commandes et Utilisateurs</h2>
                <p className="text-gray-600">Bientôt disponible</p>
              </div>
              <Settings className="text-gray-400" size={32} />
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Voir les commandes
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Gérer les utilisateurs
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Voir les statistiques détaillées
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Générer des rapports
              </li>
            </ul>

            <button disabled className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed">
              <BarChart3 size={20} />
              Bientôt...
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Voir tous les produits</h3>
              <p className="text-sm text-gray-600">Accéder à la liste complète des produits</p>
            </Link>

            <Link
              to="/admin/products"
              className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <h3 className="font-semibold text-green-600 mb-2">Ajouter un produit</h3>
              <p className="text-sm text-gray-600">Créer un nouveau produit</p>
            </Link>

            <div className="p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-gray-500 mb-2">Voir les commandes</h3>
              <p className="text-sm text-gray-600">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
