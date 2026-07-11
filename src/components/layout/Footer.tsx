import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Container } from '@/components/layout/Container';

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Projects', href: '/projects' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
];
const resourceLinks = [
  { label: 'Downloads', href: '/downloads' },
  { label: 'Resources', href: '/resources' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38 3.85 3.9 2.31 7.15 2.16 8.42 2.1 8.8 2.16 12 2.16M12 0C8.74 0 8.33 0 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C0 8.33 0 8.74 0 12s0 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 24 8.74 24 12 24s3.67 0 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67 0 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84m0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4m6.4-10.85a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44" />
    </svg>
  );
}

const socialLinks = [
  { label: 'Facebook', href: '#', icon: FacebookIcon },
  { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { label: 'Instagram', href: '#', icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="border-border bg-surface border-t">
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
        <div className="flex flex-col gap-4 md:col-span-1">
          <Logo />
          <p className="text-text-secondary text-sm">
            Premium gas fittings, instrumentation, and engineering services built on precision and
            trust.
          </p>
          <div className="mt-2 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="border-border text-text-secondary hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display mb-4 text-sm font-semibold">Company</h3>
          <ul className="flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display mb-4 text-sm font-semibold">Resources</h3>
          <ul className="flex flex-col gap-2.5">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display mb-4 text-sm font-semibold">Get in Touch</h3>
          <ul className="flex flex-col gap-3">
            <li className="text-text-secondary flex items-start gap-2.5 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="text-text-secondary flex items-center gap-2.5 text-sm">
              <Phone size={16} className="shrink-0" />
              <span>+880 000 000 000</span>
            </li>
            <li className="text-text-secondary flex items-center gap-2.5 text-sm">
              <Mail size={16} className="shrink-0" />
              <span>info@gasapps.com</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-border border-t">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-sm md:flex-row">
          <p className="text-text-secondary">
            © {new Date().getFullYear()} GasApps. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}