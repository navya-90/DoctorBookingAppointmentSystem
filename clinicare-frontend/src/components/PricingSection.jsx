import PricingCard from "./PricingCard";
import { createPaymentLink } from "../api/PaymentApi";

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    period: "forever",
    features: [
      "3 appointments",
      "Basic scheduling",
      "Email notifications",
      "Patient portal access"
    ],
    popular: false
  },
  {
    name: "Monthly",
    price: "299",
    period: "month",
    features: [
      "Unlimited appointments",
      "Priority scheduling",
      "SMS & email notifications",
      "Advanced analytics",
      "24/7 support"
    ],
    popular: true
  },
  {
    name: "Annually",
    price: "999",
    period: "month",
    features: [
      "Multi-clinic management",
      "Custom integrations",
      "Advanced reporting",
      "Dedicated account manager",
      "API access"
    ],
    popular: false
  }
];

const PricingSection = () => {
  const handlePlanClick = async (planName) => {
    if (planName === "Free") {
      alert("You're already on the Basic plan!");
      return;
    }

    try {
      const res = await createPaymentLink(planName.toUpperCase()); // Matches enum in backend
      window.location.href = res.payment_link_url;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              onClick={() => handlePlanClick(plan.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
