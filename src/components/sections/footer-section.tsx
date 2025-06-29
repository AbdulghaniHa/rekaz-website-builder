import React from "react";

interface FooterSectionProps {
  companyName?: string;
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: string; href: string }>;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  companyName = "Your Company",
  copyright = "2024",
  links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
  socialLinks = [
    { platform: "Twitter", href: "#" },
    { platform: "LinkedIn", href: "#" },
    { platform: "GitHub", href: "#" },
  ],
}) => {
  console.log("FooterSection rendered with props:", { companyName, copyright });

  return (
    <footer className="bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {companyName}
            </h3>
            <p className="text-gray-600 mb-4">
              Building amazing websites with our innovative website builder.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-900">
              Follow Us
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8">
          <p className="text-center text-gray-500">
            © {copyright} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
