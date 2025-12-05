import { Link, useLocation } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import { CreditCard, Wallet, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PaymentState {
  productId?: string;
  paymentMode?: 'cash' | 'credit';
  creditDuration?: 3 | 6 | 9 | 12 | 18 | 24;
  priceCash?: number;
  priceCredit?: number;
}

const Payment = () => {
  const location = useLocation();
  const state = (location.state || {}) as PaymentState;

  const mode = state.paymentMode || 'cash';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-primary-600 transition">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Continuer vos achats
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            {mode === 'cash' ? (
              <Wallet className="text-green-600" size={24} />
            ) : (
              <CreditCard className="text-purple-600" size={24} />
            )}
            <h1 className="text-xl sm:text-2xl font-bold">
              {mode === 'cash' ? 'Paiement Cash' : `Paiement à Crédit (${state.creditDuration || 12} mois)`}
            </h1>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant à payer</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(mode === 'cash' ? (state.priceCash || 0) : (state.priceCredit || 0))}
                </span>
              </div>
            </div>

            {mode === 'credit' && (
              <div className="bg-purple-50 p-5 rounded-xl">
                <div className="font-semibold mb-2">Étapes à suivre</div>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Votre demande de crédit a été pré-enregistrée.</li>
                  <li>Un conseiller vous contactera pour finaliser la validation.</li>
                  <li>Après validation, vous recevrez un calendrier des échéances.</li>
                </ul>
              </div>
            )}

            {mode === 'cash' && (
              <div className="bg-green-50 p-5 rounded-xl">
                <div className="font-semibold mb-2">Moyens de paiement</div>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Mobile Money (Wave, Orange Money, Free Money)</li>
                  <li>Virement bancaire</li>
                  <li>Paiement à la livraison (espèces ou TPE)</li>
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3 bg-blue-50 p-5 rounded-xl">
              <CheckCircle2 className="text-blue-600" />
              <div className="text-sm text-gray-700">
                Votre commande est bien enregistrée. Un récapitulatif vous a été envoyé.
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link to="/" className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold">Retour à l’accueil</Link>
              <Link to="/orders" className="px-5 py-3 rounded-xl bg-primary-600 text-white hover:opacity-90 font-semibold">Voir mes commandes</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
