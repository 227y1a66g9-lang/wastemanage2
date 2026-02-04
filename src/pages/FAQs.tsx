import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is the Waste Management System (WMS)?',
        a: 'WMS is a digital platform that allows citizens to report waste-related issues in their locality. The system connects citizens with municipal authorities and cleaning staff to ensure quick resolution of complaints.',
      },
      {
        q: 'Who can use this system?',
        a: 'The system is designed for three types of users: Citizens (to report complaints), Administrators (to manage and assign complaints), and Drivers/Helpers (to resolve complaints on the ground).',
      },
      {
        q: 'Is the system available 24/7?',
        a: 'Yes, you can submit complaints anytime. However, complaint resolution depends on working hours and availability of cleaning staff.',
      },
    ],
  },
  {
    category: 'Complaint Submission',
    questions: [
      {
        q: 'How do I submit a waste complaint?',
        a: 'Login to your user account, click on "Create Complaint", fill in the required details including area, address, and description of the issue. You can also upload photos for better understanding.',
      },
      {
        q: 'What information is required for a complaint?',
        a: 'You need to provide the area, locality, landmark, full address, and a description of the waste issue. Photos are optional but recommended for faster resolution.',
      },
      {
        q: 'Can I track my complaint status?',
        a: 'Yes, you can view all your submitted complaints and their current status (Pending, Assigned, In Progress, Completed, or Rejected) from your dashboard.',
      },
      {
        q: 'How long does it take to resolve a complaint?',
        a: 'Resolution time depends on the type and severity of the issue. Most complaints are resolved within 24-48 hours after assignment to a driver.',
      },
    ],
  },
  {
    category: 'Waste Segregation',
    questions: [
      {
        q: 'What is waste segregation?',
        a: 'Waste segregation is the process of separating different types of waste at the source. This includes separating biodegradable (wet) waste, recyclable (dry) waste, and hazardous waste.',
      },
      {
        q: 'Why is waste segregation important?',
        a: 'Proper segregation helps in efficient recycling, reduces landfill waste, and makes waste processing more effective. It also contributes to environmental protection.',
      },
      {
        q: 'What goes into wet waste?',
        a: 'Wet waste includes food scraps, vegetable peels, fruit waste, tea leaves, coffee grounds, and other biodegradable organic matter.',
      },
      {
        q: 'What items are considered dry waste?',
        a: 'Dry waste includes paper, cardboard, plastic bottles, metal cans, glass containers, and other recyclable materials.',
      },
    ],
  },
  {
    category: 'System Usage',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click on "User Portal" from the navigation menu, then select "Sign Up". Fill in your email, password, and name to create your account.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Contact the system administrator or use the password reset feature on the login page to receive a reset link via email.',
      },
      {
        q: 'Can I update or cancel a submitted complaint?',
        a: 'Once submitted, complaints cannot be directly edited. However, you can add notes or contact the administrator for any updates.',
      },
      {
        q: 'How do I contact support?',
        a: 'You can reach our support team at support@wms.gov or call our helpline at 1800-WASTE-00 during working hours.',
      },
    ],
  },
];

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about the Waste Management System.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No FAQs found matching your search.</p>
              </div>
            ) : (
              filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border-border"
                      >
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Contact our support team.
          </p>
          <a
            href="mailto:support@wms.gov"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Email Support
          </a>
        </div>
      </section>
    </Layout>
  );
}
