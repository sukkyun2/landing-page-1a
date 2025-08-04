// app/layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: '시점',
  description: '시점: 세상을 보는 가장 빠른 시점',
  generator: 'RedStone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 폰트 변수 및 기본 스타일 */}
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>

        {/* Beusable RUM 로더: 가능한 한 빨리 실행 */}
        <Script
          id="beusable-rum-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w, d, a){
  w.__beusablerumclient__ = {
      load : function(src){
          var b = d.createElement("script");
          b.src = src; b.async=true; b.type = "text/javascript";
          d.getElementsByTagName("head")[0].appendChild(b);
      }
  };w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL));
})(window, document, "//rum.beusable.net/load/b250618e175014u887");`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
