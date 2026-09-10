import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', ...props }) => {
  // @ts-ignore
  const LucideIcon = Icons[name] || Icons.HelpCircle;
  return <LucideIcon size={size} className={className} {...props} />;
};
