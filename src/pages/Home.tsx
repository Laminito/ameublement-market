import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, TruckIcon, Shield, Heart, Sparkles, Calendar, Wallet } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

const Home = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles size={16} />
                <span>Nouvelle façon d'acheter vos meubles</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Votre confort,
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  accessible à tous
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Démocratiser l'accès aux biens essentiels, c'est notre mission. 
                Aménagez votre maison dès aujourd'hui et payez en plusieurs fois, 
                sans stress, sans frais cachés.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to={ROUTES.PRODUCTS}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Découvrir nos produits
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to={ROUTES.CREDIT_SIMULATOR}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <CreditCard size={20} />
                  Simuler mon crédit
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3-24</div>
                  <div className="text-sm text-gray-700 font-medium">Mois de crédit</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">0%</div>
                  <div className="text-sm text-gray-700 font-medium">Frais cachés</div>
                </div>
                <div className="text-center bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">24h</div>
                  <div className="text-sm text-gray-700 font-medium">Approbation</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <img 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop"
                  alt="Salon moderne"
                  className="rounded-2xl w-full h-96 object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                      <CreditCard className="text-success-600" size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Paiement facile</div>
                      <div className="text-sm text-gray-600">Jusqu'à 24 mois</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Notre mission : 
              <span className="block text-primary-600">Démocratiser l'accès au confort</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Nous croyons que chaque famille mérite un foyer confortable et bien équipé. 
              C'est pourquoi nous avons créé MeubleMarket : une plateforme qui rend l'ameublement 
              accessible à tous, grâce à des solutions de paiement flexibles et transparentes.
            </p>
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Heart className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-purple-900">Accessible</h3>
                <p className="text-gray-700">Des meubles de qualité pour tous les budgets</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-orange-900">Transparent</h3>
                <p className="text-gray-700">Aucun frais caché, tout est clair dès le départ</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-teal-900">Simple</h3>
                <p className="text-gray-700">Un processus d'achat rapide et sans complications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600">En 4 étapes simples, transformez votre maison</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-accent-200 to-success-200 hidden md:block"></div>
            {[
              {
                step: '01',
                icon: <Sparkles size={32} />,
                title: 'Choisissez vos meubles',
                description: 'Parcourez notre catalogue et sélectionnez les produits qui vous plaisent',
                bgGradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
                textColor: 'text-primary-100'
              },
              {
                step: '02',
                icon: <Calendar size={32} />,
                title: 'Sélectionnez votre durée',
                description: 'Choisissez de payer en 3, 6, 9, 12, 18 ou 24 mois',
                bgGradient: 'bg-gradient-to-br from-accent-500 to-accent-600',
                textColor: 'text-accent-100'
              },
              {
                step: '03',
                icon: <CreditCard size={32} />,
                title: 'Validez votre crédit',
                description: 'Remplissez le formulaire simple et obtenez une réponse en 24h',
                bgGradient: 'bg-gradient-to-br from-success-500 to-success-600',
                textColor: 'text-success-100'
              },
              {
                step: '04',
                icon: <TruckIcon size={32} />,
                title: 'Recevez vos meubles',
                description: 'Nous livrons et installons chez vous, vous payez en plusieurs fois',
                bgGradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
                textColor: 'text-primary-100'
              }
            ].map((item) => (
              <div key={item.step} className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className={`w-16 h-16 ${item.bgGradient} rounded-2xl flex items-center justify-center text-white mb-4 relative z-10`}>
                  {item.icon}
                </div>
                <div className={`text-6xl font-bold ${item.textColor} absolute top-2 right-4`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir MeubleMarket ?</h2>
            <p className="text-xl text-gray-600">Des avantages pensés pour vous</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 'flexible',
                icon: <Wallet size={40} />,
                title: 'Paiements flexibles',
                description: 'Payez en plusieurs fois sans augmenter votre budget mensuel',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                id: 'secure',
                icon: <Shield size={40} />,
                title: 'Sécurisé et fiable',
                description: 'Vos données sont protégées et vos paiements sécurisés',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                id: 'delivery',
                icon: <TruckIcon size={40} />,
                title: 'Livraison gratuite',
                description: 'Nous livrons et installons vos meubles à domicile',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                id: 'transparent',
                icon: <CreditCard size={40} />,
                title: 'Sans frais cachés',
                description: 'Transparence totale sur tous les coûts et intérêts',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                id: 'support',
                icon: <Heart size={40} />,
                title: 'Service client dédié',
                description: 'Une équipe à votre écoute 7j/7 pour vous accompagner',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                id: 'quality',
                icon: <Sparkles size={40} />,
                title: 'Qualité garantie',
                description: 'Des meubles sélectionnés pour leur durabilité',
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((benefit) => (
              <div key={benefit.id} className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all">
                <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-xl mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits Vedettes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nos Produits Vedettes</h2>
            <p className="text-xl text-gray-600">Découvrez notre sélection des meilleurs meubles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              Voir tous les produits
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre intérieur ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de familles qui ont déjà fait confiance à MeubleMarket 
            pour aménager leur maison avec sérénité.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to={ROUTES.PRODUCTS}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all"
            >
              Commencer mes achats
            </Link>
            <Link 
              to={ROUTES.CREDIT_SIMULATOR}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-yellow-400/30 hover:scale-105 transition-all"
            >
              Calculer mes mensualités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
