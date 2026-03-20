export class CreditManager {
  private static instance: CreditManager;
  private currentCredits: number = 1000;
  private isSelfCorrectionMode: boolean = false;
  private totalSavedInSelfCorrection: number = 0;
  private globalSavings: number = 2450; 

  private constructor() {}

  public static getInstance(): CreditManager {
    if (!CreditManager.instance) {
      CreditManager.instance = new CreditManager();
    }
    return CreditManager.instance;
  }

  public setSelfCorrectionMode(active: boolean) {
    this.isSelfCorrectionMode = active;
    if (active) {
      console.log('🛡️ CreditManager: Modo de Auto-Correção Ativado. Créditos protegidos!');
    }
  }

  public recordEfficiencySavings(baseCost: number, actualCost: number) {
    const saved = baseCost - actualCost;
    if (saved > 0) {
      this.globalSavings += saved;
      console.log(`✨ CreditManager: Economia de Performance detectada! +${saved} créditos salvos.`);
    }
    return saved;
  }

  public consumeCredits(amount: number): boolean {
    if (this.isSelfCorrectionMode) {
      this.totalSavedInSelfCorrection += amount;
      console.log(`💎 CreditManager: Bloqueado gasto de ${amount} créditos durante auto-correção. (Total economizado: ${this.totalSavedInSelfCorrection})`);
      return true;
    }

    if (this.currentCredits >= amount) {
      this.currentCredits -= amount;
      return true;
    }

    return false;
  }

  public getStatus() {
    return {
      balance: this.currentCredits,
      isProtected: this.isSelfCorrectionMode,
      savings: this.totalSavedInSelfCorrection,
      globalSavings: this.globalSavings
    };
  }
}
