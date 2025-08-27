import { CheckCircle } from "lucide-react";

const PricingCard = ({ plan, onClick }) => {
  return (
    <div className={`bg-white rounded-2xl p-8 border-2 ${
      plan.popular 
        ? 'border-blue-600 shadow-xl scale-105' 
        : 'border-gray-200 hover:border-blue-300'
    } transition-all duration-300`}>
      {plan.popular && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">
          {plan.price === "Free" ? "Free" : `₹${plan.price}`}
        </span>
        <span className="text-gray-600">/{plan.period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
          plan.popular
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {plan.name === 'Basic' ? 'Start Free' : 'Get Started'}
      </button>
    </div>
  );
};

export default PricingCard;
