import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trash2, 
  Users, 
  Truck, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Recycle,
  Leaf
} from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Complaints Resolved' },
  { value: '500+', label: 'Active Drivers' },
  { value: '50+', label: 'Areas Covered' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  {
    icon: Trash2,
    title: 'Report Issues',
    description: 'Easily report waste management issues in your locality with photos and location details.',
  },
  {
    icon: Truck,
    title: 'Quick Response',
    description: 'Our dedicated team of drivers and helpers respond promptly to all complaints.',
  },
  {
    icon: Shield,
    title: 'Track Progress',
    description: 'Monitor the status of your complaints from submission to resolution.',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly',
    description: 'Promoting proper waste segregation and environmentally responsible disposal.',
  },
];

const roles = [
  {
    icon: Shield,
    title: 'Admin Portal',
    description: 'Manage complaints, drivers, and bins. Full control over the waste management system.',
    path: '/admin/login',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Users,
    title: 'User Portal',
    description: 'Report waste issues in your area and track the status of your complaints.',
    path: '/user/login',
    color: 'from-primary to-emerald-600',
  },
  {
    icon: Truck,
    title: 'Driver Portal',
    description: 'View assigned complaints, update status, and manage your cleaning tasks.',
    path: '/driver/login',
    color: 'from-sky-500 to-sky-600',
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Building Cleaner Communities
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Smart Waste Management for a{' '}
              <span className="text-primary">Greener Tomorrow</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Digitize waste complaint management, reduce manual processes, and promote 
              proper waste disposal practices in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/user/login">
                  Report an Issue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive waste management system streamlines the entire process 
              from complaint submission to resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Access Your Portal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your role to access the appropriate dashboard and features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${role.color}`} />
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-6">{role.description}</CardDescription>
                  <Button asChild className="w-full">
                    <Link to={role.path}>
                      Access Portal
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of citizens in keeping our community clean. Report waste issues 
            and help us create a better environment for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/user/login">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/faqs">View FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to report and resolve waste management issues.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Submit Complaint', desc: 'Report waste issues with location and photos' },
                { step: '02', title: 'Admin Assignment', desc: 'Admin reviews and assigns to nearby driver' },
                { step: '03', title: 'Issue Resolved', desc: 'Driver cleans the area and updates status' },
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                      <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
