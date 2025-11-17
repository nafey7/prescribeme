import React, { useState } from 'react';
import { SearchBar, Tabs } from '../../common';
import type { Tab } from '../../common/Tabs';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  available: string;
}

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'Prescriptions',
      question: 'How do I request a prescription refill?',
      answer:
        'You can request a refill by going to your prescriptions page, selecting the prescription you need refilled, and clicking the "Request Refill" button. Your doctor and pharmacy will be notified automatically.',
    },
    {
      id: '2',
      category: 'Prescriptions',
      question: 'How long does it take for a refill to be processed?',
      answer:
        'Refill requests are typically processed within 24-48 hours. You\'ll receive a notification once your prescription is ready for pickup or delivery.',
    },
    {
      id: '3',
      category: 'Prescriptions',
      question: 'Can I change my pharmacy?',
      answer:
        'Yes, you can change your pharmacy by going to your prescription details page and clicking "Change Pharmacy". Select your new preferred pharmacy from the list.',
    },
    {
      id: '4',
      category: 'Appointments',
      question: 'How do I schedule an appointment?',
      answer:
        'Navigate to the "Find a Doctor" page, select your preferred doctor, and click "Book Appointment". Choose an available time slot and confirm your booking.',
    },
    {
      id: '5',
      category: 'Appointments',
      question: 'Can I cancel or reschedule my appointment?',
      answer:
        'Yes, you can cancel or reschedule up to 24 hours before your appointment. Go to your dashboard, find your appointment, and select the option to reschedule or cancel.',
    },
    {
      id: '6',
      category: 'Account',
      question: 'How do I update my personal information?',
      answer:
        'Go to Settings > Profile and update your personal information including name, email, phone number, and address. Don\'t forget to save your changes.',
    },
    {
      id: '7',
      category: 'Account',
      question: 'How do I enable two-factor authentication?',
      answer:
        'Navigate to Settings > Security and click "Enable" next to Two-Factor Authentication. Follow the on-screen instructions to set up 2FA using your phone.',
    },
    {
      id: '8',
      category: 'Billing',
      question: 'How can I view my billing history?',
      answer:
        'Go to your account settings and select the "Billing" tab to view your complete billing history, including all payments and insurance claims.',
    },
    {
      id: '9',
      category: 'Medical Records',
      question: 'How do I access my medical history?',
      answer:
        'Your complete medical history is available under the "Medical History" section. You can view conditions, allergies, surgeries, immunizations, and lab results.',
    },
    {
      id: '10',
      category: 'Medical Records',
      question: 'Can I download my medical records?',
      answer:
        'Yes, you can download your medical records by going to Settings > Privacy and clicking "Download My Data". You\'ll receive a comprehensive PDF file.',
    },
  ];

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: 'chat',
      action: 'Start Chat',
      available: 'Available 24/7',
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: 'email',
      action: 'Send Email',
      available: 'Response within 24h',
    },
    {
      id: '3',
      title: 'Phone Support',
      description: 'Call our support hotline for immediate assistance',
      icon: 'phone',
      action: 'Call Now',
      available: 'Mon-Fri, 8AM-8PM EST',
    },
    {
      id: '4',
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      icon: 'book',
      action: 'Browse Articles',
      available: 'Always available',
    },
  ];

  const tabs: Tab[] = [
    { key: 'faq', label: 'FAQ' },
    { key: 'contact', label: 'Contact Support' },
    { key: 'guides', label: 'User Guides' },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <p className="mt-2 text-lg text-gray-600">
          Find answers, get support, or contact our team
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          placeholder="Search for help articles, FAQs, or topics..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{faqs.length}</h3>
          <p className="text-sm text-gray-600">FAQ Articles</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">&lt; 2 min</h3>
          <p className="text-sm text-gray-600">Avg. Response Time</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">98%</h3>
          <p className="text-sm text-gray-600">Customer Satisfaction</p>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      No results found for "{searchQuery}". Try a different search term.
                    </p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {faq.category}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {faq.question}
                          </span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedFAQ === faq.id ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-sm text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose a support channel
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {supportOptions.map((option) => (
                    <div
                      key={option.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            {option.icon === 'chat' && (
                              <svg
                                className="w-6 h-6 text-primary-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                              </svg>
                            )}
                            {option.icon === 'email' && (
                              <svg
                                className="w-6 h-6 text-primary-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            {option.icon === 'phone' && (
                              <svg
                                className="w-6 h-6 text-primary-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            )}
                            {option.icon === 'book' && (
                              <svg
                                className="w-6 h-6 text-primary-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900">
                            {option.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{option.available}</p>
                          <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                            {option.action} →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Send us a message
                </h3>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your issue or question..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* User Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Getting Started Guides
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Managing Your Prescriptions',
                    description: 'Learn how to view, refill, and track your medications',
                    duration: '5 min read',
                  },
                  {
                    title: 'Booking Appointments',
                    description: 'Step-by-step guide to scheduling and managing appointments',
                    duration: '4 min read',
                  },
                  {
                    title: 'Understanding Your Medical History',
                    description: 'Navigate your conditions, allergies, and health records',
                    duration: '6 min read',
                  },
                  {
                    title: 'Account Security Best Practices',
                    description: 'Protect your account with 2FA and strong passwords',
                    duration: '3 min read',
                  },
                ].map((guide, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="text-base font-semibold text-gray-900">
                      {guide.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{guide.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{guide.duration}</span>
                      <span className="text-sm font-medium text-primary-600">
                        Read Guide →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
