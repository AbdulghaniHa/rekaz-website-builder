import { SectionComponent } from "./types";

export const SECTION_REGISTRY: SectionComponent[] = [
  {
    id: "header-simple",
    name: "Simple Header",
    category: "header",
    icon: "Layout",
    description: "A clean header with navigation menu",
    defaultProps: {
      title: "Your Website",
      menuItems: ["Home", "About", "Services", "Contact"],
    },
  },
  {
    id: "header-with-logo",
    name: "Header with Logo",
    category: "header",
    icon: "Crown",
    description: "Header with logo and navigation",
    defaultProps: {
      logo: "/logo.png",
      title: "Your Brand",
      menuItems: ["Home", "About", "Services", "Contact"],
    },
  },
  {
    id: "hero-simple",
    name: "Simple Hero",
    category: "hero",
    icon: "Star",
    description: "Hero section with title and subtitle",
    defaultProps: {
      title: "Welcome to Our Website",
      subtitle: "We create amazing experiences",
      buttonText: "Get Started",
    },
  },
  {
    id: "hero-with-image",
    name: "Hero with Image",
    category: "hero",
    icon: "Image",
    description: "Hero section with background image",
    defaultProps: {
      title: "Transform Your Business",
      subtitle: "Professional solutions for modern companies",
      buttonText: "Learn More",
      backgroundImage: "/hero-bg.jpg",
    },
  },
  {
    id: "content-text",
    name: "Text Content",
    category: "content",
    icon: "Type",
    description: "Simple text content section",
    defaultProps: {
      title: "About Us",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  },
  {
    id: "content-features",
    name: "Features Grid",
    category: "content",
    icon: "Grid3x3",
    description: "Grid layout for showcasing features",
    defaultProps: {
      title: "Our Features",
      features: [
        {
          icon: "Zap",
          title: "Fast Performance",
          description: "Lightning fast loading times",
        },
        {
          icon: "Shield",
          title: "Secure",
          description: "Enterprise-grade security",
        },
        {
          icon: "Users",
          title: "User Friendly",
          description: "Intuitive user interface",
        },
      ],
    },
  },
  {
    id: "footer-simple",
    name: "Simple Footer",
    category: "footer",
    icon: "Layout",
    description: "Clean footer with links",
    defaultProps: {
      company: "Your Company",
      links: ["Privacy Policy", "Terms of Service", "Contact"],
      copyright: "© 2024 Your Company. All rights reserved.",
    },
  },
  {
    id: "footer-detailed",
    name: "Detailed Footer",
    category: "footer",
    icon: "Columns3",
    description: "Footer with multiple sections",
    defaultProps: {
      company: "Your Company",
      sections: [
        {
          title: "Company",
          links: ["About", "Careers", "Press"],
        },
        {
          title: "Support",
          links: ["Help Center", "Contact", "FAQ"],
        },
      ],
    },
  },
];

export const SECTION_CATEGORIES = [
  { id: "header", name: "Headers", icon: "Layout" },
  { id: "hero", name: "Hero Sections", icon: "Star" },
  { id: "content", name: "Content", icon: "FileText" },
  { id: "footer", name: "Footers", icon: "Layout" },
  { id: "other", name: "Other", icon: "Package" },
] as const;
