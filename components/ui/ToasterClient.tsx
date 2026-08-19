'use client';

import dynamic from 'next/dynamic';

const ToasterClient = dynamic(() => import('./sonner').then(m => m.Toaster), {
  ssr: false,
});

export function ToasterWrapper() {
  return <ToasterClient richColors closeButton position="top-center" />;
}