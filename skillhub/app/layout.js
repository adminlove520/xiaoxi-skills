import { I18nProvider } from './i18n/I18nContext';

export const metadata = {
  title: 'xiaoxi-skills Hub',
  description: 'OpenClaw Skills 收藏库',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
