import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-gray-600">Last updated: November 17, 2025</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              Welcome to PrescribeMe ("we," "our," or "us"). These Terms and Conditions
              ("Terms") govern your access to and use of our prescription management
              platform, including our website, mobile applications, and related services
              (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If
              you disagree with any part of these Terms, you may not access the Service.
            </p>
          </div>
        </section>

        {/* Account Registration */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Account Registration
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              To use certain features of our Service, you must register for an account.
              When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept all responsibility for activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              You must be at least 18 years old to create an account and use our Service.
            </p>
          </div>
        </section>

        {/* Use of Service */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Use of Service
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service in any way that violates any applicable law or regulation</li>
              <li>Impersonate or attempt to impersonate the Company, an employee, another user, or any other person or entity</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Use any robot, spider, or other automatic device to access the Service</li>
              <li>Introduce any viruses, trojan horses, worms, or other malicious code</li>
            </ul>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Medical Disclaimer
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-900">Important Notice:</p>
              <p className="text-yellow-800 mt-2">
                PrescribeMe is a prescription management platform. We do not provide
                medical advice, diagnosis, or treatment. The Service is not intended to
                replace the relationship between you and your healthcare provider.
              </p>
            </div>
            <p>
              Always seek the advice of your physician or other qualified health provider
              with any questions you may have regarding a medical condition. Never
              disregard professional medical advice or delay in seeking it because of
              something you have read on our Service.
            </p>
          </div>
        </section>

        {/* Privacy and Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Privacy and Data Protection
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we
              collect, use, and protect your personal information, including your health
              information.
            </p>
            <p>
              We comply with HIPAA (Health Insurance Portability and Accountability Act)
              and other applicable data protection laws. By using our Service, you
              consent to our collection and use of personal information as outlined in
              our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Intellectual Property Rights
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              The Service and its original content, features, and functionality are and
              will remain the exclusive property of PrescribeMe and its licensors.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any
              product or service without our prior written consent.
            </p>
          </div>
        </section>

        {/* User Content */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. User-Generated Content
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              Our Service may allow you to submit, upload, or share content, including
              health information, reviews, and feedback ("User Content"). You retain all
              rights to your User Content.
            </p>
            <p>
              By submitting User Content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, and display such content for the
              purpose of operating and improving our Service.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Termination
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason, including
              if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If
              you wish to terminate your account, you may do so by contacting us or using
              the account deletion feature in your settings.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation of Liability
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              In no event shall PrescribeMe, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without limitation,
              loss of profits, data, use, or goodwill.
            </p>
            <p>
              Our liability shall not exceed the amount paid by you, if any, for
              accessing the Service during the twelve (12) months prior to the event
              giving rise to the liability.
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Indemnification
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              You agree to defend, indemnify, and hold harmless PrescribeMe and its
              licensors from and against any claims, liabilities, damages, judgments,
              awards, losses, costs, expenses, or fees arising out of or relating to your
              violation of these Terms or your use of the Service.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Governing Law
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              These Terms shall be governed and construed in accordance with the laws of
              the State of California, United States, without regard to its conflict of
              law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or your use of the Service shall be
              resolved in the state or federal courts located in San Francisco County,
              California.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Changes to Terms
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We reserve the right to modify or replace these Terms at any time. If a
              revision is material, we will provide at least 30 days' notice prior to any
              new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become
              effective, you agree to be bound by the revised terms.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            13. Contact Us
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="font-medium">PrescribeMe, Inc.</p>
              <p>456 Health Ave, San Francisco, CA 94103</p>
              <p>Email: legal@prescribeme.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="border-t border-gray-200 pt-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-900">
              <span className="font-semibold">Acknowledgment:</span> By using our
              Service, you acknowledge that you have read these Terms and agree to be
              bound by them.
            </p>
          </div>
        </section>
      </div>

      {/* Footer Links */}
      <div className="text-center space-x-4 text-sm">
        <a href="/privacy" className="text-primary-600 hover:text-primary-700">
          Privacy Policy
        </a>
        <span className="text-gray-400">•</span>
        <a href="/help" className="text-primary-600 hover:text-primary-700">
          Help Center
        </a>
        <span className="text-gray-400">•</span>
        <a href="/contact" className="text-primary-600 hover:text-primary-700">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Terms;
