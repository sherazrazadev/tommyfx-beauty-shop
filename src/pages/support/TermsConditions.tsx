import React from 'react';

const TermsConditions = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>By accessing and using TommyFX Beauty website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Products and Services</h2>
            <p>All products are subject to availability. We reserve the right to discontinue any product at any time without notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Orders and Payment</h2>
            <ul className="list-disc pl-6">
              <li>All orders are subject to acceptance and availability</li>
              <li>Prices are subject to change without notice</li>
              <li>Payment must be made in full before shipping</li>
              <li>We accept Cash on Delivery and bank transfers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
            <p>We ship within Pakistan only. Delivery times are estimates and may vary based on location and product availability.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
            <ul className="list-disc pl-6">
              <li>Returns accepted within 30 days of purchase</li>
              <li>Products must be unused and in original packaging</li>
              <li>Customer is responsible for return shipping costs</li>
              <li>Refunds processed within 7-10 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p>TommyFX Beauty shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>For questions about these Terms and Conditions, contact us at:</p>
            <p>Email: tommyfx.pk@gmail.com<br />Phone: +92 306-714-5010</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;