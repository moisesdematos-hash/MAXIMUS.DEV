
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export class SEOService {
  private static instance: SEOService;

  private constructor() {}

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  /**
   * Updates page meta tags dynamically based on the project strategy.
   */
  public updateMetadata(metadata: SEOMetadata) {
    console.log("🚀 SEO Service: Updating meta tags...", metadata);

    // Update Title
    document.title = `${metadata.title} | MAXIMUS.DEV`;

    // Update Description
    this.updateOrCreateMetaTag('description', metadata.description);

    // Update Keywords
    if (metadata.keywords) {
      this.updateOrCreateMetaTag('keywords', metadata.keywords);
    }

    // OpenGraph
    this.updateOrCreateMetaProperty('og:title', metadata.ogTitle || metadata.title);
    this.updateOrCreateMetaProperty('og:description', metadata.ogDescription || metadata.description);
    if (metadata.ogImage) {
      this.updateOrCreateMetaProperty('og:image', metadata.ogImage);
    }

    // Twitter
    this.updateOrCreateMetaTag('twitter:card', metadata.twitterCard || 'summary_large_image');
    this.updateOrCreateMetaTag('twitter:title', metadata.ogTitle || metadata.title);
    this.updateOrCreateMetaTag('twitter:description', metadata.ogDescription || metadata.description);
  }

  private updateOrCreateMetaTag(name: string, content: string) {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  private updateOrCreateMetaProperty(property: string, content: string) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
}

export const seoService = SEOService.getInstance();
