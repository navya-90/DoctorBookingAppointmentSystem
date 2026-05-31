import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { upgradeSubscription } from "../api/subscriptionApi";

const UpgradeSuccess = () => {
  const [query] = useSearchParams();
  const planType = query.get("planType");  

  useEffect(() => {
    if (!planType) return;

    const paymentId = query.get("razorpay_payment_id");
    const paymentLinkId = query.get("razorpay_payment_link_id");
    const paymentLinkReferenceId = query.get("razorpay_payment_link_reference_id");
    const paymentLinkStatus = query.get("razorpay_payment_link_status");
    const signature = query.get("razorpay_signature");

    if (!paymentId || !paymentLinkId || !paymentLinkStatus || !signature) {
      console.error("Missing payment verification details");
      return;
    }

    const upgradePlan = async () => {
      try {
        await upgradeSubscription(planType.toUpperCase(), {
          paymentId,
          paymentLinkId,
          paymentLinkReferenceId,
          paymentLinkStatus,
          signature
        });
        console.log("Plan upgraded successfully!");
      } catch (err) {
        console.error("Plan upgrade failed", err);
      }
    };

    upgradePlan();
  }, [planType, query]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-lg mt-3">You've been upgraded to the <strong>{planType}</strong> plan.</p>
    </div>
  );
};

export default UpgradeSuccess;
