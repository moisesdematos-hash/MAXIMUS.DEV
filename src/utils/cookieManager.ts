// Placeholder CookieManager to satisfy imports
class CookieManager {
  private static instance: CookieManager;

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  canUse(type: string): boolean {
    // Always return true since cookies are disabled
    return true;
  }

  trackFeatureUsed(feature: string): void {
    // No-op since cookies are disabled
    console.log(`Feature used: ${feature}`);
  }

  trackEvent(event: string, data?: any): void {
    // No-op since cookies are disabled
    console.log(`Event tracked: ${event}`, data);
  }

  trackDeployment(projectId: string, url: string): void {
    // No-op since cookies are disabled
    console.log(`Deployment tracked: ${projectId} -> ${url}`);
  }
}

export default CookieManager;