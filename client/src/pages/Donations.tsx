import { Heart, Phone, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Donations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Support MasterMinds Ebooks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us keep this platform running and accessible to all ZIMSEC students
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-sky-600" />
            Challenges We Face
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Running MasterMinds Ebooks comes with various ongoing costs and challenges:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Server hosting and maintenance costs to keep the platform running 24/7</li>
              <li>Cloud storage expenses for hosting thousands of educational materials</li>
              <li>Database management and backup systems to protect your data</li>
              <li>Development time to add new features and fix bugs</li>
              <li>Bandwidth costs for file downloads and uploads</li>
              <li>SSL certificates and security measures to keep your information safe</li>
            </ul>
            <p className="mt-6">
              Your support, no matter how small, helps us maintain and improve this free educational resource for all students.
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border-sky-200 dark:border-sky-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Make a Donation</h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border-2 border-sky-200 dark:border-sky-800">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Send any amount via EcoCash to:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-sky-600" />
                <div className="text-3xl font-bold text-sky-600" data-testid="text-ecocash-number">
                  0776046121
                </div>
              </div>
              <div className="text-lg font-semibold text-foreground" data-testid="text-recipient-name">
                Darrell Mucheri
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-center text-muted-foreground">
              <Heart className="w-4 h-4 inline text-red-500 mr-2" />
              Every contribution, big or small, makes a difference in keeping education accessible to all.
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for your support! Your generosity helps thousands of students access quality educational materials.
          </p>
        </div>
      </div>
    </div>
  );
}
