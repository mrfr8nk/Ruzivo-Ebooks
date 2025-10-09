import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        <Card className="p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using MasterMinds Ebooks, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Use of Service</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You agree to use MasterMinds Ebooks only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Upload or share copyrighted materials without proper authorization</li>
                  <li>Use the platform to distribute malicious software or harmful content</li>
                  <li>Attempt to gain unauthorized access to any part of the platform</li>
                  <li>Impersonate any person or entity</li>
                  <li>Engage in any activity that disrupts or interferes with the platform</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>When you create an account, you are responsible for:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Content and Copyright</h2>
              <p className="text-muted-foreground mb-4">
                Educational materials on MasterMinds Ebooks are provided for educational purposes only. Users who upload content represent that they have the right to share such materials.
              </p>
              <p className="text-muted-foreground">
                We respect intellectual property rights. If you believe any content infringes on your copyright, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
              <p className="text-muted-foreground">
                MasterMinds Ebooks is provided "as is" without any warranties, expressed or implied. We do not guarantee the accuracy, completeness, or reliability of any content on the platform. Use of the platform is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                MasterMinds Ebooks and its creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Modifications to Service</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify, suspend, or discontinue the platform at any time without notice. We may also update these Terms from time to time, and your continued use constitutes acceptance of such changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at support@mastermindz.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
