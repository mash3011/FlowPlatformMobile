import React from 'react';
import { MobileImpactSavingsView } from './MobileImpactSavingsView';

interface MobileLandingPageProps {
  onOpenSidebar: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

export const MobileLandingPage: React.FC<MobileLandingPageProps> = ({
  onOpenSidebar,
  activeNavTab = 'home',
  onSelectNavTab,
}) => {
  return (
    <MobileImpactSavingsView
      onOpenSidebar={onOpenSidebar}
      activeNavTab={activeNavTab}
      onSelectNavTab={onSelectNavTab}
    />
  );
};
