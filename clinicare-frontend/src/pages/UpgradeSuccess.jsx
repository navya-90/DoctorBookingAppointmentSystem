import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { upgradeSubscription } from "../api/subscriptionApi";

const UpgradeSuccess = () => {
  const [query] = useSearchParams();
  const planType = query.get("planType");  

  useEffect(() => {
    if (!planType) return;

    const upgradePlan = async () => {
      try {
        await upgradeSubscription(planType.toUpperCase());
        console.log("Plan upgraded!");
      } catch (err) {
        console.error("Plan upgrade failed", err);
      }
    };

    upgradePlan();
  }, [planType]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-lg mt-3">You've been upgraded to the <strong>{planType}</strong> plan.</p>
    </div>
  );
};

export default UpgradeSuccess;
