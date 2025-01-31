import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Fin Flow",
  description: "Privacy Policy for the Fin Flow expense tracking application",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy for Fin Flow</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to Fin Flow. We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          use our Fin Flow expense tracking application.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. Information We Collect
        </h2>
        <p>
          We collect information that you provide directly to us when you use
          the Fin Flow app, including:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Personal information (e.g., name, email address)</li>
          <li>Financial information (e.g., expense data, income data)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          3. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Provide, maintain, and improve our Fin Flow services</li>
          <li>Process your transactions and send you related information</li>
          <li>
            Send you technical notices, updates, security alerts, and support
            messages
          </li>
          <li>
            Respond to your comments, questions, and customer service requests
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security
          measures to protect the security of your personal information.
          However, please note that no method of transmission over the Internet
          or method of electronic storage is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          5. Your Data Protection Rights
        </h2>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal information, such as the right to access, correct, or delete
          your data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          6. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the {`"Last Updated"`} date.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p className="mt-2">Email: divyanshu@divyanshulohani.xyz</p>
      </section>

      <footer className="mt-8 text-sm text-gray-600">
        <p>Last Updated: 29th Jan 2025</p>
      </footer>
    </div>
  );
}
