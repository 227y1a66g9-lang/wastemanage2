import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Leaf,
  Recycle,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  XCircle,
  Info,
  TreeDeciduous,
} from 'lucide-react';

const bucketTypes = [
  {
    color: 'Green',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
    lightBg: 'bg-green-50',
    icon: Leaf,
    title: 'Green Bucket - Wet/Organic Waste',
    wasteType: 'Biodegradable Waste',
    description: 'For all biodegradable organic matter that can decompose naturally.',
    items: [
      'Food scraps and leftover food',
      'Vegetable and fruit peels',
      'Eggshells',
      'Tea leaves and coffee grounds',
      'Cooked food waste',
      'Flower and plant waste',
      'Garden trimmings and leaves',
      'Meat and fish waste',
    ],
    tips: [
      'Keep the waste covered to avoid flies',
      'Drain excess liquids before disposal',
      'Can be composted at home',
      'Do not mix with plastic bags',
    ],
    environmental: 'Properly composted wet waste reduces methane emissions from landfills and creates nutrient-rich soil.',
  },
  {
    color: 'Blue',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    lightBg: 'bg-blue-50',
    icon: Recycle,
    title: 'Blue Bucket - Dry/Recyclable Waste',
    wasteType: 'Recyclable Waste',
    description: 'For all dry waste that can be recycled and reused.',
    items: [
      'Paper and cardboard',
      'Plastic bottles and containers',
      'Glass bottles and jars',
      'Metal cans and tins',
      'Newspapers and magazines',
      'Tetra packs (cleaned)',
      'Aluminum foil (cleaned)',
      'Plastic bags (cleaned & dried)',
    ],
    tips: [
      'Rinse containers before disposal',
      'Flatten cardboard boxes to save space',
      'Remove caps from bottles',
      'Keep recyclables dry and clean',
    ],
    environmental: 'Recycling reduces the need for raw materials, saves energy, and keeps waste out of landfills.',
  },
  {
    color: 'Red',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    lightBg: 'bg-red-50',
    icon: AlertTriangle,
    title: 'Red Bucket - Hazardous/Biomedical Waste',
    wasteType: 'Hazardous Waste',
    description: 'For dangerous waste that requires special handling and disposal.',
    items: [
      'Medicines and expired drugs',
      'Syringes and needles',
      'Used bandages and cotton',
      'Batteries (all types)',
      'Paint and paint cans',
      'Pesticides and chemicals',
      'CFL and fluorescent bulbs',
      'Electronic waste (e-waste)',
    ],
    tips: [
      'Never mix with other waste types',
      'Keep away from children',
      'Store in original containers when possible',
      'Contact local authorities for collection',
    ],
    environmental: 'Improper disposal of hazardous waste can contaminate soil and groundwater, harming ecosystems and human health.',
  },
  {
    color: 'Black',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-800',
    textColor: 'text-gray-700',
    lightBg: 'bg-gray-100',
    icon: Trash2,
    title: 'Black Bucket - Reject/Non-Recyclable Waste',
    wasteType: 'Non-Recyclable Waste',
    description: 'For waste that cannot be recycled or composted and goes to landfill.',
    items: [
      'Sanitary napkins and diapers',
      'Soiled or wet paper',
      'Multi-layered packaging',
      'Thermocol (Styrofoam)',
      'Broken ceramics and pottery',
      'Leather items',
      'Rubber items',
      'Cigarette butts',
    ],
    tips: [
      'Minimize this waste as much as possible',
      'Consider reusable alternatives',
      'Do not put recyclables in this bin',
      'Ensure items are truly non-recyclable',
    ],
    environmental: 'Reducing reject waste is crucial as these items end up in landfills and take decades to centuries to decompose.',
  },
];

const generalTips = [
  {
    title: 'Reduce',
    description: 'Buy only what you need. Choose products with minimal packaging. Use reusable bags, bottles, and containers.',
    icon: CheckCircle2,
  },
  {
    title: 'Reuse',
    description: 'Repair items instead of throwing them away. Donate clothes and items you no longer need. Use containers for storage.',
    icon: Recycle,
  },
  {
    title: 'Recycle',
    description: 'Separate recyclables from other waste. Clean items before recycling. Follow local recycling guidelines.',
    icon: Leaf,
  },
  {
    title: 'Composting at Home',
    description: 'Start a compost bin for kitchen waste. Use it to create nutrient-rich soil for gardens. Reduces methane emissions.',
    icon: TreeDeciduous,
  },
];

export default function UserManual() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-background to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Waste Disposal Guide
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Learn how to properly segregate and dispose of waste to protect our environment.
            </p>
            <p className="text-sm text-muted-foreground">
              Proper waste segregation at source is mandatory and helps in efficient recycling and waste management.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Why Waste Segregation Matters</h2>
                    <p className="text-muted-foreground">
                      Waste segregation is the process of separating different types of waste at the point of generation. 
                      This practice is essential for efficient recycling, reducing landfill usage, and protecting our 
                      environment. When we mix all waste together, recyclable materials become contaminated and end up 
                      in landfills, causing pollution and wasting valuable resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bucket Types */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Waste Bucket Classification</h2>
            <p className="text-center text-muted-foreground mb-12">
              Each colored bin is designated for specific types of waste. Follow this guide for proper segregation.
            </p>

            <div className="space-y-8">
              {bucketTypes.map((bucket, index) => (
                <Card key={index} className={`overflow-hidden border-2 ${bucket.borderColor}`}>
                  <CardHeader className={bucket.lightBg}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${bucket.bgColor} rounded-xl flex items-center justify-center`}>
                        <bucket.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className={bucket.textColor}>{bucket.title}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className={bucket.textColor}>
                            {bucket.wasteType}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6">{bucket.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          What to Put Here
                        </h4>
                        <ul className="space-y-2">
                          {bucket.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className={`w-2 h-2 ${bucket.bgColor} rounded-full mt-1.5 flex-shrink-0`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          Disposal Tips
                        </h4>
                        <ul className="space-y-2">
                          {bucket.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                        <TreeDeciduous className="w-5 h-5" />
                        Environmental Impact
                      </h4>
                      <p className="text-sm text-green-700">{bucket.environmental}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Do's and Don'ts</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-6 h-6" />
                    Do's
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {[
                      'Segregate waste at source before disposal',
                      'Use separate bins for different waste types',
                      'Rinse recyclables before putting in blue bin',
                      'Compost kitchen waste at home if possible',
                      'Flatten boxes and cartons to save space',
                      'Store hazardous waste safely until collection',
                      'Teach children about waste segregation',
                      'Report overflowing bins to authorities',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-6 h-6" />
                    Don'ts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {[
                      'Never mix wet and dry waste together',
                      'Do not throw hazardous waste in regular bins',
                      'Avoid burning waste - it causes air pollution',
                      'Do not dispose waste in open areas or drains',
                      'Never throw electronic waste with regular garbage',
                      'Do not put dirty or soiled items in recycling',
                      'Avoid single-use plastics when possible',
                      'Do not ignore waste collection schedules',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3R Principle */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">The 3R Principle</h2>
            <p className="text-center text-muted-foreground mb-12">
              Follow these principles to minimize waste and protect the environment.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generalTips.map((tip, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <tip.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have questions about waste disposal or want to report an issue, contact us or file a complaint.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/user/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              File a Complaint
            </a>
            <a
              href="mailto:support@wms.gov"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
