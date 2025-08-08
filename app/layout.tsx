// app/layout.tsx or app/RootLayout.tsx

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: '시점',
  description: '시점: 세상을 보는 가장 빠른 시점',
  generator: 'RedStone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Facebook Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1021764120037115');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Font configuration for Tailwind */}
                  <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
                  `}</style>

          {/* Beusable RUM Script */}
          <Script id="beusable-rum" strategy="afterInteractive">
              {`
            (function(w, d, a){
              w.__beusablerumclient__ = {
                load: function(src){
                  var b = d.createElement("script");
                  b.src = src;
                  b.async = true;
                  b.type = "text/javascript";
                  d.getElementsByTagName("head")[0].appendChild(b);
                }
              };
              w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL));
            })(window, document, "//rum.beusable.net/load/b250618e175014u887");
          `}
          </Script>
      </head>
      <body>
        {children}
        {/* Facebook NoScript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1021764120037115&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  )
}
