import React from 'react';

interface PrivacyPolicyPopupProps {
  onClose: () => void;
}

const PolicyPopup: React.FC<PrivacyPolicyPopupProps> = ({ onClose }) => {
  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded shadow-lg max-w-lg'>
        <h2 className='text-2xl font-bold mb-4'>Privacy Policy</h2>
        <p>
          Your privacy is important to us here at CodeLens. This privacy policy
          explains how we collect, use, and protect your personal information.
          By using our services, you consent to the collection and use of your
          information as described in this policy.
        </p>
        <ul className='list-disc ml-5 mt-2'>
          <li>
            Information Collection: We collect information that you provide to
            us when you register, such as your name, email, and role.
          </li>
          <li>
            Information Use: We use your information to provide and improve our
            services, and to communicate with you.
          </li>
          <li>
            Information Protection: We implement security measures to protect
            your information from unauthorized access.
          </li>
        </ul>
        <h3 className='text-2xl font-bold mt-4 mb-2'>
          Language Model Processing
        </h3>
        <p>
          At CodeLens, we leverage advanced Large Language Models (LLMs) to
          process user's submitted responses. This helps to enhance our services
          by providing more accurate and efficient responses. By submitting your
          answers, you agree to the following:
        </p>
        <ul className='list-disc ml-5 mt-2'>
          <li>
            Your submissions will be processed by an LLM to generate responses
            and improve our services.
          </li>
          <li>
            The data submitted will be treated with the same level of
            confidentiality and protection as your other personal information.
          </li>
          <li>
            We will not share your submissions with third parties without your
            consent, except as necessary to provide our services or as required
            by law.
          </li>
        </ul>
        <button
          onClick={onClose}
          className='mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PolicyPopup;
