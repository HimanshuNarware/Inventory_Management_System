import React from "react";

const plans = [
  {
    name: "Starter",
    price: "$0/month",
    description: "Perfect for small retailers just getting started.",
    features: [
      "Basic Inventory Tracking",
      "Single Warehouse Support",
      "Email Support",
    ],
    buttonText: "Start Free",
    highlighted: false,
  },
  {
    name: "Business",
    price: "$49/month",
    description: "Designed for growing businesses managing multiple warehouses.",
    features: [
      "Multi-Warehouse Support",
      "Low Stock Alerts",
      "Role-based User Access",
      "Priority Email Support",
    ],
    buttonText: "Upgrade Now",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "For large-scale operations with advanced needs.",
    features: [
      "Unlimited Warehouses",
      "API Access & Integrations",
      "Dedicated Account Manager",
      "24/7 Support",
    ],
    buttonText: "Contact Sales",
    highlighted: false,
  },
];

const InventoryPricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing Plans</h1>
        <p className="text-gray-600">
          Choose a plan that fits your inventory needs and scale with ease.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-xl border ${
              plan.highlighted ? "border-blue-600 shadow-lg" : "border-gray-200"
            } bg-white p-8 flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-800 mb-4">{plan.price}</p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="text-left space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`mt-8 w-full py-3 px-4 rounded-md font-semibold transition ${
                plan.highlighted
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPricingPage;
