import type { Metadata } from "next";
import MobilePortfolio from "./components/mobile/mobile-portfolio";
import Providers from "./providers";
import Desktop from "./components/desktop/desktop";
import Dock from "./components/dock/dock";
import Menubar from "./components/menubar/menubar";
import WindowManager from "./components/window/window-manager";
import Wallpaper from "./components/system/wallpaper";
import Spotlight from "./components/spotlight/spotlight";
import Notifications from "./components/system/notifications";
import BrightnessOverlay from "./components/system/brightness-overlay";
import PowerScreen from "./components/system/power-screen";
import Launcher from "./components/launcher/launcher";
import JsonLd from "./components/site/json-ld";
import { personJsonLd } from "./lib/content/seo";
import { loadContent } from "./lib/content/server";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const content = await loadContent();

  return (
    <>
      {/* Outside the provider so structured data remains static and crawlable. */}
      <JsonLd data={personJsonLd(content)} />

      <Providers>
        <main className="desktop-shell relative h-dvh w-screen overflow-hidden">
          <div className="desktop-wallpaper">
            <Wallpaper />
          </div>
          <div className="desktop-only">
            <Desktop />
          </div>
          <MobilePortfolio profile={content.profile} />
          <div className="macos-system">
            <WindowManager />
            <Spotlight />
            <Notifications />
            <BrightnessOverlay />
            <PowerScreen />
          </div>
          <div className="desktop-only absolute bottom-2 z-dock w-full flex justify-center pointer-events-none [&>*]:pointer-events-auto">
            <Dock />
          </div>
          <div className="desktop-only">
            <Launcher />
          </div>
          <div className="desktop-only absolute top-0 inset-x-0 z-menubar pointer-events-none [&>*]:pointer-events-auto">
            <Menubar />
          </div>
        </main>
      </Providers>
    </>
  );
}
