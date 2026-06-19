import "./globals.css";

export const metadata = {
  title: "AI Gym Coach",
  description: "Adaptive AI fitness coaching platform",
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
