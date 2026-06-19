import "./globals.css";

export const metadata = {
  title: "AI Gym Coach",
  description: "Nền tảng tính calo, macro và plan tập luyện cá nhân hóa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
