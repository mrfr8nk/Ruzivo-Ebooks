import { Mail, Phone, MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover-elevate">
            <div className="inline-flex items-center justify-center p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl mb-4">
              <Mail className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-email">
              support@mastermindz.com
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-phone">
              +263 77 604 6121
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-4">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">Response Time</h3>
            <p className="text-sm text-muted-foreground">
              Within 24 hours
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  data-testid="input-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What is this about?"
                required
                data-testid="input-subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message..."
                rows={6}
                required
                data-testid="input-message"
              />
            </div>

            <Button type="submit" className="w-full gap-2" data-testid="button-submit">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
