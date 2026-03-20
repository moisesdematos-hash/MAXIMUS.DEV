export interface UserDnaProfile {
  preferredLibraries: string[];
  designPatterns: 'functional' | 'object-oriented';
  stylingPreference: 'tailwind' | 'css-modules' | 'styled-components';
  namingConvention: 'camelCase' | 'snake_case';
  safetyLevel: 'relaxed' | 'strict';
}

export class UserDna {
  private static instance: UserDna;
  private profile: UserDnaProfile = {
    preferredLibraries: ['react', 'lucide-react', 'zod'],
    designPatterns: 'functional',
    stylingPreference: 'tailwind',
    namingConvention: 'camelCase',
    safetyLevel: 'strict'
  };

  private constructor() {}

  public static getInstance(): UserDna {
    if (!UserDna.instance) {
      UserDna.instance = new UserDna();
    }
    return UserDna.instance;
  }

  public getProfile(): UserDnaProfile {
    return this.profile;
  }

  public updateProfile(newProfile: Partial<UserDnaProfile>) {
    this.profile = { ...this.profile, ...newProfile };
    console.log('🧬 User DNA: Perfil técnico atualizado.');
  }

  public getDnaAsPrompt(): string {
    return `User Tech Preferences (DNA):\n- Libraries: ${this.profile.preferredLibraries.join(', ')}\n- Patterns: ${this.profile.designPatterns}\n- Styling: ${this.profile.stylingPreference}\n- Naming: ${this.profile.namingConvention}\n- Safety: ${this.profile.safetyLevel}`;
  }
}
