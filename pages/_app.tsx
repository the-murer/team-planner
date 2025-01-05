import "@/styles/globals.css";

import type { AppProps } from "next/app";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/system";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

import { fontMono, fontSans } from "@/config/fonts";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <Component {...pageProps} />
      </NextThemesProvider>
      <ToastContainer />
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
