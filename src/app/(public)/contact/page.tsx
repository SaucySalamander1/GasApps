import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { ContactForm } from '@/components/sections/ContactForm';

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
];

const businessHours = [
  { day: 'Sunday \u2013 Thursday', hours: '9:00 AM \u2013 6:00 PM' },
  { day: 'Friday \u2013 Saturday', hours: 'Closed' },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Talk to our team about your project, a quote, or general questions."
      />

      <section className="py-[var(--space-section-y)]">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold">Send Us a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-72 w-full overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1200&auto=format&fit=crop&q=80"
                alt="GasApps engineering team at work"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            <div className="border-border bg-surface mt-6 rounded-lg border p-6">
              <p className="font-display text-lg font-semibold">Quick Response Guaranteed</p>
              <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                Our team typically responds to inquiries within one business day. For urgent
                matters, call us directly at the number listed below.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-display text-xl font-semibold">Visit Us</h2>
              <ul className="mt-4 flex flex-col gap-4">
                <li className="text-text-secondary flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </li>
                <li className="text-text-secondary flex items-center gap-3 text-sm">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span>+880 000 000 000</span>
                </li>
                <li className="text-text-secondary flex items-center gap-3 text-sm">
                  <Mail size={18} className="text-accent shrink-0" />
                  <span>info@gasapps.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display flex items-center gap-2 text-base font-semibold">
                <Clock size={16} className="text-accent" />
                Business Hours
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {businessHours.map((entry) => (
                  <li
                    key={entry.day}
                    className="text-text-secondary flex items-center justify-between text-sm"
                  >
                    <span>{entry.day}</span>
                    <span className="text-text-primary font-medium">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold">Follow Us</h3>
              <div className="mt-3 flex gap-3">
                {socialLinks.map((social) => (
                  
                  <a  key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="border-border text-text-secondary hover:border-accent hover:text-accent rounded-md border px-3 py-1.5 text-sm transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-border h-full min-h-80 overflow-hidden rounded-lg border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.0!2d90.4125!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GasApps Office Location"
            />
          </div>
        </Container>
      </section>
    </>
  );
}