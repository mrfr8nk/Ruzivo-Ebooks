import { BookOpen, Target, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            About Ruzivo Ebooks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering ZIMSEC students with accessible, high-quality educational resources
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Ruzivo Ebooks was created by Darrell Mucheri with a simple yet powerful mission: to make quality educational resources accessible to every ZIMSEC student, regardless of their location or economic background.
            </p>
            <p>
              Understanding the challenges students face in accessing textbooks, past exam papers, and study materials, we built this platform to bridge the gap between students and the resources they need to excel in their studies.
            </p>
            <p>
              Today, Ruzivo Ebooks serves thousands of students across Zimbabwe, providing free access to O-Level and A-Level materials, past papers, and study guides.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="inline-flex items-center justify-center p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl mb-4">
              <Target className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground">
              To democratize education by providing free, easy access to quality study materials for all ZIMSEC students, helping them achieve their academic goals.
            </p>
          </Card>

          <Card className="p-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground">
              To become the leading educational resource platform in Zimbabwe, continuously expanding our library and supporting students at every stage of their academic journey.
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-sky-600">📚 Comprehensive Library</h3>
              <p className="text-sm text-muted-foreground">
                Access to textbooks, past exam papers, greenbooks, bluebooks, and syllabus documents for both O-Level and A-Level.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">🎯 ZIMSEC Focused</h3>
              <p className="text-sm text-muted-foreground">
                Materials specifically tailored to the ZIMSEC curriculum, ensuring relevance and quality.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-600">💻 Easy Access</h3>
              <p className="text-sm text-muted-foreground">
                Download materials anytime, anywhere. All you need is an internet connection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-600">🆓 Completely Free</h3>
              <p className="text-sm text-muted-foreground">
                No hidden costs, no subscriptions. Education should be accessible to everyone.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
