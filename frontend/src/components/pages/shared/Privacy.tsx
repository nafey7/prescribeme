import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
              PrescribeMe ("we," "our," or "us") is committed to protecting your privacy
              and ensuring the security of your personal and health information. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our prescription management platform.
            </p>
            <p>
              Please read this Privacy Policy carefully. By using our Service, you agree
              to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </section>

        {/* HIPAA Compliance */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. HIPAA Compliance
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900">HIPAA Compliance</p>
              <p className="text-green-800 mt-2">
                We are committed to full compliance with the Health Insurance Portability
                and Accountability Act (HIPAA) and its privacy and security rules. We
                implement appropriate administrative, physical, and technical safeguards
                to protect your Protected Health Information (PHI).
              </p>
            </div>
          </div>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Information We Collect
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>We collect several types of information from and about users:</p>

            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3.1 Personal Information
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth, gender</li>
                  <li>Address and contact information</li>
                  <li>Account credentials</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3.2 Health Information (PHI)
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prescription information (medications, dosages, refill history)</li>
                  <li>Medical conditions and diagnoses</li>
                  <li>Allergies and adverse reactions</li>
                  <li>Lab results and medical test data</li>
                  <li>Healthcare provider information</li>
                  <li>Appointment history</li>
                  <li>Insurance information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3.3 Technical Information
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address, browser type, and version</li>
                  <li>Device information and operating system</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. How We Use Your Information
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process and manage your prescriptions</li>
              <li>Facilitate communication between you and healthcare providers</li>
              <li>Send you important notifications about prescriptions, appointments, and refills</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. How We Share Your Information
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We do not sell your personal or health information. We may share your
              information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Healthcare Providers:</span> With your
                doctors, pharmacies, and other healthcare providers involved in your care
              </li>
              <li>
                <span className="font-semibold">Service Providers:</span> With third-party
                service providers who assist in operating our Service, subject to strict
                confidentiality agreements
              </li>
              <li>
                <span className="font-semibold">Legal Requirements:</span> When required
                by law, court order, or governmental authority
              </li>
              <li>
                <span className="font-semibold">Business Transfers:</span> In connection
                with a merger, acquisition, or sale of company assets
              </li>
              <li>
                <span className="font-semibold">With Your Consent:</span> When you
                explicitly authorize us to share specific information
              </li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Data Security
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We implement industry-standard security measures to protect your
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for data in transit and at rest</li>
              <li>Multi-factor authentication options</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and employee training</li>
              <li>Secure data centers with physical security measures</li>
              <li>Regular backup and disaster recovery procedures</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-900 text-sm">
                While we strive to protect your information, no method of transmission
                over the Internet or electronic storage is 100% secure. We cannot
                guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Your Privacy Rights
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>You have the following rights regarding your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Access:</span> Request a copy of your
                personal and health information
              </li>
              <li>
                <span className="font-semibold">Correction:</span> Request corrections to
                inaccurate information
              </li>
              <li>
                <span className="font-semibold">Deletion:</span> Request deletion of your
                account and associated data
              </li>
              <li>
                <span className="font-semibold">Portability:</span> Request a copy of your
                data in a portable format
              </li>
              <li>
                <span className="font-semibold">Restriction:</span> Request limitations on
                how we use your information
              </li>
              <li>
                <span className="font-semibold">Objection:</span> Object to certain uses
                of your information
              </li>
              <li>
                <span className="font-semibold">Opt-out:</span> Unsubscribe from marketing
                communications
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at privacy@prescribeme.com or
              use the settings in your account.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Data Retention
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We retain your information for as long as necessary to provide our Service
              and comply with legal obligations. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information: Retained while your account is active</li>
              <li>Health information: Retained for 7 years after your last interaction</li>
              <li>Prescription records: Retained according to applicable pharmacy laws</li>
              <li>
                Billing records: Retained for 7 years to comply with tax regulations
              </li>
            </ul>
            <p>
              Upon account deletion, we will delete or anonymize your information within
              30 days, except where we are required by law to retain certain records.
            </p>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Cookies and Tracking Technologies
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We use cookies and similar tracking technologies to improve your experience:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Essential Cookies:</span> Required for
                basic functionality
              </li>
              <li>
                <span className="font-semibold">Analytics Cookies:</span> Help us
                understand how users interact with our Service
              </li>
              <li>
                <span className="font-semibold">Preference Cookies:</span> Remember your
                settings and preferences
              </li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling
              cookies may affect Service functionality.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Children's Privacy
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              Our Service is not intended for individuals under 18 years of age. We do
              not knowingly collect personal information from children under 18.
            </p>
            <p>
              If you are a parent or guardian and believe your child has provided us with
              personal information, please contact us, and we will delete such
              information from our systems.
            </p>
          </div>
        </section>

        {/* International Users */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. International Data Transfers
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              Your information may be transferred to and maintained on servers located
              outside of your state, province, country, or other governmental jurisdiction
              where data protection laws may differ.
            </p>
            <p>
              We ensure appropriate safeguards are in place to protect your information in
              accordance with this Privacy Policy and applicable laws.
            </p>
          </div>
        </section>

        {/* Changes to Privacy Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Changes to This Privacy Policy
          </h2>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of
              any changes by:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending you an email notification for material changes</li>
            </ul>
            <p>
              You are advised to review this Privacy Policy periodically for any changes.
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
              If you have questions or concerns about this Privacy Policy or our privacy
              practices, please contact:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="font-medium">Privacy Officer</p>
              <p>PrescribeMe, Inc.</p>
              <p>456 Health Ave, San Francisco, CA 94103</p>
              <p>Email: privacy@prescribeme.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="border-t border-gray-200 pt-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-900">
              <span className="font-semibold">Your Consent:</span> By using our Service,
              you consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </section>
      </div>

      {/* Footer Links */}
      <div className="text-center space-x-4 text-sm">
        <a href="/terms" className="text-primary-600 hover:text-primary-700">
          Terms & Conditions
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

export default Privacy;
