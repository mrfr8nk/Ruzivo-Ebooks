
import { Mail, Phone, Globe, Github, Linkedin, Twitter, MessageSquare, Code, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Developer() {
  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+263 719 647 303",
      href: "tel:+263719647303",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      label: "Email",
      value: "darrelmucheri@gmail.com",
      href: "mailto:darrelmucheri@gmail.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      label: "Portfolio",
      value: "dynamictech.gleeze.com",
      href: "https://dynamictech.gleeze.com",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" }
  ];

  const skills = [
    "Full-Stack Development",
    "React & TypeScript",
    "Node.js & Express",
    "MongoDB & Database Design",
    "UI/UX Design",
    "Cloud Deployment",
    "RESTful APIs",
    "Responsive Design"
  ];

  const projects = [
    {
      title: "Ruzivo Ebooks Platform",
      description: "A comprehensive educational resource platform for ZIMSEC students",
      tech: ["React", "TypeScript", "MongoDB", "Express"]
    },
    {
      title: "Dynamic Tech Solutions",
      description: "Professional web development and digital solutions",
      tech: ["Full-Stack", "Cloud", "API Integration"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-sky-950 dark:to-blue-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-400/30 backdrop-blur-sm">
            <Code className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-medium text-sky-700 dark:text-sky-300">Meet the Developer</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Darrell Mucheri
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Full-Stack Developer & Creator of Ruzivo Ebooks Platform
          </p>
          
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className={`p-3 bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-in-up">
          {contactInfo.map((contact, i) => (
            <a
              key={i}
              href={contact.href}
              className="group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Card className="border-2 border-sky-200/50 dark:border-sky-700/50 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${contact.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <contact.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{contact.label}</h3>
                  <p className="text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-2">
                    {contact.value}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* About & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-sky-200/50 dark:border-sky-700/50 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-sky-600" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm a passionate full-stack developer specializing in creating modern, user-friendly web applications. 
                With expertise in React, TypeScript, and Node.js, I build scalable solutions that make a difference.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Ruzivo Ebooks platform was created to empower ZIMSEC students with accessible educational resources, 
                demonstrating my commitment to using technology for social impact.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-sky-200/50 dark:border-sky-700/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Code className="w-6 h-6 text-blue-600" />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-300 dark:border-sky-700 rounded-lg text-sm font-medium text-sky-700 dark:text-sky-300 hover:scale-105 transition-transform"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <Card key={i} className="border-2 border-sky-200/50 dark:border-sky-700/50 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-300 dark:border-blue-700 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-2 border-sky-200/50 dark:border-sky-700/50 bg-gradient-to-br from-sky-500/10 to-blue-500/10 animate-fade-in">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-sky-600" />
            <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have a project in mind or need assistance with web development? 
              I'm always open to discussing new opportunities and collaborations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:darrelmucheri@gmail.com">
                <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
              </a>
              <a href="tel:+263719647303">
                <Button variant="outline" className="gap-2 border-2 border-sky-300 dark:border-sky-700">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
