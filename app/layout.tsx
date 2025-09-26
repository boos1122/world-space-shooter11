export const metadata = {
  title: 'World Space Shooter',
  description: 'Phaser + Next.js mini app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body style={{margin:0,background:'#000',color:'#fff',minHeight:'100vh'}}>
        {children}
      </body>
    </html>
  );
}
