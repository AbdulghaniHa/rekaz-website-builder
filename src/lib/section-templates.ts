import { SectionTemplate } from "@/types/builder";
import { HeroSection } from "@/components/sections/hero-section";
import { HeaderSection } from "@/components/sections/header-section";
import { FooterSection } from "@/components/sections/footer-section";
import { ContentSection } from "@/components/sections/content-section";
import { Zap, Menu, FileText, Anchor } from "lucide-react";

export const sectionTemplates: SectionTemplate[] = [
  {
    id: "hero",
    name: "Hero Section",
    description: "Eye-catching hero section with title, subtitle, and CTA",
    icon: Zap,
    category: "layout",
    component: HeroSection,
    defaultProps: {
      title: "Welcome to Our Amazing Website",
      subtitle: "Discover the power of our innovative solutions",
      buttonText: "Get Started",
    },
    propertyLabels: {
      title: "Title",
      subtitle: "Subtitle",
      buttonText: "Button Text",
      backgroundImage: "Background Image",
    },
  },
  {
    id: "header",
    name: "Header",
    description: "Navigation header with logo and menu items",
    icon: Menu,
    category: "navigation",
    component: HeaderSection,
    defaultProps: {
      brandName: "Brand",
      menuItems: ["Home", "About", "Services", "Contact"],
      showCTA: true,
      ctaText: "Get Started",
    },
    propertyLabels: {
      logo: "Logo URL",
      brandName: "Brand Name",
      menuItems: "Menu Items",
      showCTA: "Show CTA Button",
      ctaText: "CTA Text",
    },
  },
  {
    id: "content",
    name: "Content Section",
    description: "Flexible content section with text and optional image",
    icon: FileText,
    category: "content",
    component: ContentSection,
    defaultProps: {
      title: "About Our Service",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "",
      layout: "left",
      showButton: true,
      buttonText: "Learn More",
    },
    propertyLabels: {
      title: "Title",
      content: "Content",
      image: "Image URL",
      layout: "Layout",
      showButton: "Show Button",
      buttonText: "Button Text",
    },
  },
  {
    id: "footer",
    name: "Footer",
    description: "Complete footer with links and social media",
    icon: Anchor,
    category: "layout",
    component: FooterSection,
    defaultProps: {
      companyName: "Your Company",
      copyright: "2024",
    },
    propertyLabels: {
      companyName: "Company Name",
      copyright: "Copyright Year",
      links: "Quick Links",
      socialLinks: "Social Links",
    },
  },
];

export const getSectionTemplate = (id: string): SectionTemplate | undefined => {
  return sectionTemplates.find((template) => template.id === id);
};

export const getSectionsByCategory = (
  category: SectionTemplate["category"]
): SectionTemplate[] => {
  return sectionTemplates.filter((template) => template.category === category);
};
