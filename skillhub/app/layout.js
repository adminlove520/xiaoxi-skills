export const metadata = {
  title: 'xiaoxi-skills Hub',
  description: 'OpenClaw Skills 收藏库',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
