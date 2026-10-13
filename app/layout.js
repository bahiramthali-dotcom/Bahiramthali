import "./globals.css";

export const metadata = {
  title: "Bahiram Thali · Varhadi food in Wakad, Pune",
  description: "Slow-cooked Varhadi food by night. A quiet AC studio every morning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
