import { Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        <Card className="p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                At MasterMinds Ebooks, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                  <p>When you create an account, we collect your username and password (encrypted).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                  <p>We collect information about how you interact with our platform, including downloads and browsing activity.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Device Information</h3>
                  <p>We may collect information about the device you use to access our platform, including IP address and browser type.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide and maintain our services</li>
                <li>To improve and personalize your experience</li>
                <li>To track download statistics and platform usage</li>
                <li>To communicate important updates and announcements</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information. All passwords are encrypted, and we use secure protocols to transmit data. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share aggregated, non-personally identifiable information for statistical purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of certain data collection practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your experience, remember your preferences, and maintain your session.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at support@mastermindz.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
