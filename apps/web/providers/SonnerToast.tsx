'use client';
import { useTheme } from 'next-themes';
import { Toaster, ToasterProps } from 'sonner';

const SonnerToast = () => {
  const { theme } = useTheme();
  return <Toaster theme={theme as ToasterProps['theme']} />;
};

export default SonnerToast;
