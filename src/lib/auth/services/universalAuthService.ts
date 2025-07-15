import { UserRole } from '../../../types';

/**
 * Service pour gérer l'authentification universelle
 * Simplifie le processus en attribuant automatiquement les rôles
 */
export class UniversalAuthService {
  // Rôle par défaut pour tous les nouveaux utilisateurs
  private static readonly DEFAULT_ROLE: UserRole = 'customer';

  // Emails d'administrateurs prédéfinis
  private static readonly ADMIN_EMAILS = [
    'admin@example.com',
    'admin@chinetonusine.com',
    'administrator@chinetonusine.com'
  ];

  /**
   * Détermine le rôle d'un utilisateur basé sur son email
   * @param email - L'email de l'utilisateur
   * @returns Le rôle déterminé
   */
  static determineUserRole(email: string): UserRole {
    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si c'est un email d'administrateur
    if (this.ADMIN_EMAILS.includes(normalizedEmail)) {
      return 'admin';
    }

    // Sinon, attribuer le rôle par défaut
    return this.DEFAULT_ROLE;
  }

  /**
   * Vérifie si un email correspond à un administrateur
   * @param email - L'email à vérifier
   * @returns true si l'email est celui d'un admin
   */
  static isAdminEmail(email: string): boolean {
    return this.ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  /**
   * Obtient la route de redirection appropriée après connexion
   * @param role - Le rôle de l'utilisateur
   * @returns La route de redirection
   */
  static getRedirectRoute(role: UserRole): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'sourcer':
      case 'influencer':
        return '/sourcer/dashboard';
      case 'customer':
      default:
        return '/dashboard';
    }
  }
  /**
   * Crée un utilisateur démo pour les tests
   * @param email - L'email de l'utilisateur
   * @param role - Le rôle de l'utilisateur
   * @param name - Le nom de l'utilisateur (optionnel)
   * @returns L'objet utilisateur démo
   */
  static createDemoUser(email: string, role: UserRole, name?: string) {
    return {
      id: `demo_${role}_${Date.now()}`,
      email: email.trim(),
      name: name?.trim() || `Utilisateur ${role}`,
      role: role,
      favorites: [],
      browsingHistory: [],
      messages: [],
      subscription: 'free' as const,
      language: 'fr' as const,
      currency: 'EUR' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Valide les données de connexion
   * @param data - L'objet contenant email et password
   * @returns Un objet contenant la validité et les messages d'erreur
   */
  static validateLoginData(data: { email: string; password: string }): { isValid: boolean; error?: string } {
    if (!data.email.trim()) {
      return { isValid: false, error: 'L\'email est requis' };
    }

    if (!data.password.trim()) {
      return { isValid: false, error: 'Le mot de passe est requis' };
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { isValid: false, error: 'Format d\'email invalide' };
    }

    return { isValid: true };
  }

  /**
   * Valide les données d'inscription
   * @param data - L'objet contenant name, email, password, confirmPassword
   * @returns Un objet contenant la validité et les messages d'erreur
   */
  static validateRegisterData(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): { isValid: boolean; error?: string } {
    if (!data.name.trim()) {
      return { isValid: false, error: 'Le nom est requis' };
    }

    if (!data.email.trim()) {
      return { isValid: false, error: 'L\'email est requis' };
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { isValid: false, error: 'Format d\'email invalide' };
    }

    if (!data.password.trim()) {
      return { isValid: false, error: 'Le mot de passe est requis' };
    }

    if (data.password.length < 6) {
      return { isValid: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    if (data.password !== data.confirmPassword) {
      return { isValid: false, error: 'Les mots de passe ne correspondent pas' };
    }

    return { isValid: true };
  }

  /**
   * Obtient le rôle par défaut du système
   * @returns Le rôle par défaut
   */
  static getDefaultRole(): UserRole {
    return this.DEFAULT_ROLE;
  }

  /**
   * Obtient la liste des emails d'administrateurs
   * @returns La liste des emails d'admin
   */
  static getAdminEmails(): string[] {
    return [...this.ADMIN_EMAILS];
  }
}
