import * as cheerio from "cheerio";

/* 
    simple cheerio web scrapper to get every single user link icon
*/
export async function icoScrapper(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const href = $('link[rel*="icon"]')
      .map((_, el) => ({
        href: $(el).attr("href") ?? "",
        size: parseInt($(el).attr("sizes")?.split("x")[0] ?? "0") || 0,
      }))
      .get()
      .filter((icon) => icon.href && !icon.href.startsWith("data:"))
      .sort((a, b) => b.size - a.size)[0]?.href;

    if (href) {
      return new URL(href, url).href;
    }

    const fallback = new URL("/favicon.ico", url).href;
    const fallbackRes = await fetch(fallback, { method: "HEAD" });
    return fallbackRes.ok ? fallback : undefined;
  } catch (error) {
    console.error(`icoScrapper failed for ${url}:`, error);
    return undefined;
  }
}
