// FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by visiting our Track Order page or by clicking the tracking link in your order confirmation email."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused and unopened products. Products must be in original packaging with receipt."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within Pakistan. Free shipping is available on orders over Rs. 2000."
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all TommyFX products are 100% cruelty-free and never tested on animals."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 2 hours of placing them. After that, please contact our support team."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD), bank transfers, and major credit/debit cards."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at tommyfx.pk@gmail.com or call +92 306-714-5010."
    }
  ];

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <h3 className="font-semibold">{faq.question}</h3>
                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
