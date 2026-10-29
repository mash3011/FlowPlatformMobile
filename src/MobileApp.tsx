import React, { useEffect } from 'react';
import { MobileInvoicePrototype } from './components/mobile/MobileInvoicePrototype';
import { Toaster } from 'sonner';

export const MobileApp: React.FC = () => {
  // Strictly enforce Light Mode for the Mobile App
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
      <Toaster position="top-right" richColors />
      <MobileInvoicePrototype onBackToDesktop={() => window.open('http://127.0.0.1:3000', '_blank')} />
    </div>
  );
};
