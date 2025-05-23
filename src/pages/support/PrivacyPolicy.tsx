import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Provide customer support</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Improve our products and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6">
              <li>With service providers who help us operate our business</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>Email: tommyfx.pk@gmail.com<br />Phone: +92 306-714-5010</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
