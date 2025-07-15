import React from 'react';
import { Subscription } from '../types';
import Button from './Button';
import { Check } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  isCurrentPlan?: boolean;
  onSelectPlan: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  isCurrentPlan = false,
  onSelectPlan,
}) => {
  const { id, name, price, currency, features, isPopular } = subscription;
  
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';
  
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300
        ${isPopular ? 'border-blue-500 transform hover:-translate-y-1' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}
        ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {isPopular && (
        <div className="bg-blue-500 text-white text-center py-1 font-medium">
          Recommandé
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="bg-green-100 text-green-800 text-center py-1 font-medium">
          Votre forfait actuel
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{name}</h3>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{currencySymbol}{price}</span>
          {price > 0 && <span className="text-gray-500 ml-2">/mois</span>}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={() => onSelectPlan(id)}
          variant={isCurrentPlan ? 'outline' : 'primary'}
          fullWidth
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Forfait actuel' : 'Choisir ce forfait'}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;