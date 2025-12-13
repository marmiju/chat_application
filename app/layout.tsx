
import { Montserrat } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./components/hooks/userContext/UserProvider";
import { SocketProvider } from "./components/hooks/userContext/SocketProvider";

const font = Montserrat({
  weight: '400'
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className}`}
      >
        <UserProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
