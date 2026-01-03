import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Leaf, 
  Recycle,
  Globe,
  Award
} from 'lucide-react';

const values = [
  {
    icon: Leaf,
    title: 'Environmental Responsibility',
    description: 'We are committed to promoting sustainable waste management practices that protect our environment for future generations.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our system is designed to empower citizens and improve communication between communities and municipal authorities.',
  },
  {
    icon: Recycle,
    title: 'Waste Reduction',
    description: 'We encourage proper waste segregation and recycling to minimize landfill waste and promote circular economy.',
  },
  {
    icon: Award,
    title: 'Excellence in Service',
    description: 'We strive for quick response times and high-quality service delivery in all waste management operations.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'User Registration',
    description: 'Citizens register on the platform to access complaint submission and tracking features.',
  },
  {
    step: 2,
    title: 'Complaint Submission',
    description: 'Users report waste-related issues with location details, photos, and descriptions.',
  },
  {
    step: 3,
    title: 'Admin Review',
    description: 'Administrators review complaints and assign them to appropriate drivers or helpers.',
  },
  {
    step: 4,
    title: 'Task Execution',
    description: 'Drivers visit the location, resolve the issue, and update the complaint status.',
  },
  {
    step: 5,
    title: 'Verification',
    description: 'The system notifies users about resolution and collects feedback for improvement.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Waste Management System
            </h1>
            <p className="text-lg text-muted-foreground">
              Transforming waste management through technology and community collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To digitize waste complaint management, reduce manual processes, improve 
                  communication between citizens and municipal authorities, and promote proper 
                  waste disposal practices. We aim to create cleaner, healthier communities 
                  through efficient and transparent waste management operations.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading digital platform for waste management in municipalities 
                  across the nation. We envision a future where every citizen has easy access 
                  to waste management services, and every complaint is resolved efficiently, 
                  contributing to a cleaner and greener India.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide every aspect of our waste management system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Our System Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process from complaint submission to resolution.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
              
              {howItWorks.map((item, index) => (
                <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shrink-0 z-10">
                    {item.step}
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Making a difference in communities across the region.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Globe, value: '50+', label: 'Cities Covered' },
              { icon: Users, value: '100K+', label: 'Registered Users' },
              { icon: Recycle, value: '500K+', label: 'Tons Recycled' },
              { icon: Heart, value: '98%', label: 'Happy Citizens' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
