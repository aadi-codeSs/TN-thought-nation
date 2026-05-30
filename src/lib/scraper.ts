import { ContentType } from "../generated/prisma/enums";

interface ScrapedMetadata {
  title: string;
  description?: string;
  thumbnail?: string;
  type: ContentType;
  siteName?: string;
}

export async function scrapeUrl(targetUrl: string): Promise<ScrapedMetadata> {
  try {
    const urlObj = new URL(targetUrl);
    let type: ContentType = ContentType.LINK;

    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      type = ContentType.YOUTUBE;
    } else if (
      urlObj.hostname.includes("twitter.com") ||
      urlObj.hostname.includes("x.com")
    ) {
      type = ContentType.TWITTER;
    } else if (
      urlObj.pathname.endsWith(".pdf") ||
      urlObj.hostname.includes("docs.google")
    ) {
      type = ContentType.DOC;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ThoughtNationBot/1.0)",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) return { title: urlObj.hostname, type };

    const html = await response.text();

    const titleMatch =
      html.match(
        /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
      ) || html.match(/<title>([^<]+)<\/title>/i);
    const descMatch =
      html.match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
      );
    const imgMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    );
    const siteMatch = html.match(
      /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i,
    );

    return {
      title: titleMatch ? titleMatch[1].trim() : urlObj.hostname,
      description: descMatch ? descMatch[1].trim() : undefined,
      thumbnail: imgMatch ? imgMatch[1] : undefined,
      siteName: siteMatch ? siteMatch[1] : undefined,
      type,
    };
  } catch (e) {
    return { title: targetUrl, type: ContentType.LINK };
  }
}
