import React from 'react';
import {
  Smartphone,
  TabletSmartphone,
  Laptop,
  Monitor,
  BookOpen,
  GraduationCap,
  Library,
  Zap,
  Flame,
  PlugZap,
  Building2,
  Home,
  KeyRound,
  Armchair,
  Sofa,
  Shirt,
  Watch,
  Scissors,
  Coffee,
  Utensils,
  UtensilsCrossed,
  Briefcase,
  Wrench,
  Printer,
  Tag,
  Package,
  LayoutGrid,
  Grid,
} from 'lucide-react';

interface CategoryIconProps {
  iconName?: string;
  iconImage?: string;
  className?: string;
  strokeWidth?: number;
  alt?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  iconImage,
  className = 'w-4 h-4',
  strokeWidth = 2,
  alt,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // If this category is Laptop or iconImage is specified, render the custom image
  const isLaptop = iconName === 'Laptop' || iconName === 'electronics';
  const trimmedImage = typeof iconImage === 'string' && iconImage.trim().length > 0 ? iconImage.trim() : null;
  const resolvedImage = trimmedImage || (isLaptop ? '/laptop.png' : null);

  if (resolvedImage && !imageError) {
    return (
      <img
        src={resolvedImage}
        alt={alt || (isLaptop ? 'Laptops' : iconName || 'Category')}
        className={`${className} object-contain shrink-0`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  switch (iconName) {
    case 'Smartphone':
    case 'Phone':
      return <Smartphone className={className} strokeWidth={strokeWidth} />;
    case 'TabletSmartphone':
    case 'Tablet':
      return <TabletSmartphone className={className} strokeWidth={strokeWidth} />;
    case 'Laptop':
      return <Laptop className={className} strokeWidth={strokeWidth} />;
    case 'Monitor':
    case 'Computer':
      return <Monitor className={className} strokeWidth={strokeWidth} />;
    case 'BookOpen':
    case 'Book':
      return <BookOpen className={className} strokeWidth={strokeWidth} />;
    case 'GraduationCap':
      return <GraduationCap className={className} strokeWidth={strokeWidth} />;
    case 'Library':
      return <Library className={className} strokeWidth={strokeWidth} />;
    case 'Zap':
      return <Zap className={className} strokeWidth={strokeWidth} />;
    case 'Flame':
      return <Flame className={className} strokeWidth={strokeWidth} />;
    case 'PlugZap':
    case 'Plug':
      return <PlugZap className={className} strokeWidth={strokeWidth} />;
    case 'Building2':
    case 'Building':
      return <Building2 className={className} strokeWidth={strokeWidth} />;
    case 'Home':
      return <Home className={className} strokeWidth={strokeWidth} />;
    case 'KeyRound':
      return <KeyRound className={className} strokeWidth={strokeWidth} />;
    case 'Armchair':
      return <Armchair className={className} strokeWidth={strokeWidth} />;
    case 'Sofa':
      return <Sofa className={className} strokeWidth={strokeWidth} />;
    case 'Shirt':
      return <Shirt className={className} strokeWidth={strokeWidth} />;
    case 'Watch':
      return <Watch className={className} strokeWidth={strokeWidth} />;
    case 'Scissors':
    case 'beauty':
    case 'Beauty':
    case 'Sparkles':
      return <Scissors className={className} strokeWidth={strokeWidth} />;
    case 'Coffee':
      return <Coffee className={className} strokeWidth={strokeWidth} />;
    case 'Utensils':
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} strokeWidth={strokeWidth} />;
    case 'Briefcase':
      return <Briefcase className={className} strokeWidth={strokeWidth} />;
    case 'Wrench':
      return <Wrench className={className} strokeWidth={strokeWidth} />;
    case 'Printer':
      return <Printer className={className} strokeWidth={strokeWidth} />;
    case 'Package':
      return <Package className={className} strokeWidth={strokeWidth} />;
    case 'LayoutGrid':
    case 'Grid':
      return <LayoutGrid className={className} strokeWidth={strokeWidth} />;
    case 'Tag':
    default:
      return <Tag className={className} strokeWidth={strokeWidth} />;
  }
};
