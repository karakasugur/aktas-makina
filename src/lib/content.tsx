// Author: UKARAKAS | Date: 09.11.2026 | Loads site content from the server once and shares it with all pages
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent, mergeWithDefaults, type SiteContent } from "./defaultContent";

interface ContentContextValue {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
}

const ContentContext = createContext<ContentContextValue>({ content: defaultContent, setContent: () => {} });

// Wait at most this long for the server before showing the default content
const MAX_WAIT_MS = 1500;

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), MAX_WAIT_MS);
    fetch("/api/content.php", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.content) setContent(mergeWithDefaults(data.content));
      })
      .catch(() => {
        // No PHP (local dev) or network error: keep the defaults
      })
      .finally(() => {
        window.clearTimeout(timer);
        setReady(true);
      });
    return () => window.clearTimeout(timer);
  }, []);

  // A short blank screen avoids flashing old default texts before saved content arrives
  if (!ready) return null;

  return <ContentContext.Provider value={{ content, setContent }}>{children}</ContentContext.Provider>;
};

export const useContent = (): SiteContent => useContext(ContentContext).content;
export const useSetContent = () => useContext(ContentContext).setContent;

/** Sets the browser tab title for a page. */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title
      ? `${title} | Aktaş Grup Makina & Klima`
      : "Aktaş Grup - Endüstriyel Makine ve Klima Bakım, Onarım & Satış";
  }, [title]);
};
