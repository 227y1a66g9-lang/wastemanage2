import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl">WMS</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Building cleaner communities through efficient waste management solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/faqs" className="hover:text-primary-foreground transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Portals</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/admin/login" className="hover:text-primary-foreground transition-colors">Admin Portal</Link></li>
              <li><Link to="/user/login" className="hover:text-primary-foreground transition-colors">User Portal</Link></li>
              <li><Link to="/driver/login" className="hover:text-primary-foreground transition-colors">Driver Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@wms.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Municipal Corporation Office</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Waste Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
