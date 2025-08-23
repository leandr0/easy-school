import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Easy School',
    default: 'Easy School',
  },
  description: 'The official Easy School.',
  metadataBase: new URL('https://ylisacademy.my.canva.site/'),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  }
};


export default function RootLayout(
  {
  children,
  }: 
  {
  children: React.ReactNode;
  }
) 
{
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}