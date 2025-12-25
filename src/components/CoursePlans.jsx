import React from "react";
import { CheckCircle } from "lucide-react";

export default function CoursePlans() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold ml-10 mb-12 text-blue-900 " >
          Choose a plan for your organization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TEAM PLAN */}
          <div className="bg-white border rounded-lg p-6 flex flex-col">
            <div className="border-t-4 border-orange-500 pt-4">
              <h3 className="text-xl font-bold mb-1">Monthly Plan</h3>
              <p className="text-sm text-gra-600 mb-4">
                👥 2 to 50 people · For your team
              </p>

              <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-md font-semibold mb-6 hover:bg-purple-50">
                Start subscription
              </button>

              <p className="text-lg font-bold mb-1">₹2,000 a month per user</p>
              <p className="text-sm text-gray-500 mb-4">
                Billed annually. Cancel anytime.
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Access to 13,000+ top courses
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Certification prep
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Goal-focused recommendations
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  AI-powered coaching
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Analytics and adoption reports
                </li>
              </ul>
            </div>
          </div>

          {/* QUARTERLY PLAN */}
          <div className="bg-white border rounded-lg p-6 flex flex-col">
            <div className="border-t-4 border-indigo-600 pt-4">
              <h3 className="text-xl font-bold mb-1">Quarterly Plan</h3>
              <p className="text-sm text-gray-600 mb-4">
                🏢 More than 20 people · For your organization
              </p>

              <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md font-semibold mb-6 hover:bg-indigo-50">
                Request a demo
              </button>

              <p className="text-lg font-bold mb-4">
                Contact sales for pricing
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Access to 30,000+ courses
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Certification prep
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Advanced analytics & insights
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Dedicated customer success team
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Customizable content & add-ons
                </li>
              </ul>
            </div>
          </div>

          {/* YEAR PLAN */}
          <div className="bg-white border rounded-lg p-6 flex flex-col">
            <div className="border-t-4 border-pink-600 pt-4">
              <h3 className="text-xl font-bold mb-1">Yearly Plan</h3>
              <p className="text-sm text-gray-600 mb-4">
                🏢 More than 20 people · For your organization
              </p>

              <button className="border border-pink-600 text-pink-600 px-4 py-2 rounded-md font-semibold mb-6 hover:bg-indigo-50">
                Request a demo
              </button>

              <p className="text-lg font-bold mb-4">
                Contact sales for pricing
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Access to 30,000+ courses
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Certification prep
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Advanced analytics & insights
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Dedicated customer success team
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  Customizable content & add-ons
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
