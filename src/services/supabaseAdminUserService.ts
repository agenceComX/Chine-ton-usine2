// Note: Utilisons Supabase pour la gestion des utilisateurs au lieu de Firebase
// Ce service remplace adminUserService.ts qui utilisait Firebase

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'supplier' | 'customer' | 'sourcer';
    isActive?: boolean;
}

export interface SupabaseAdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
}

class SupabaseAdminUserService {
    /**
     * Créer un nouvel utilisateur directement dans la table users
     * Note: En production, il faudrait utiliser Supabase Auth avec les bonnes permissions
     */
    async createUser(userFormData: CreateUserData): Promise<{ success: boolean; user?: SupabaseAdminUser; error?: string }> {
        try {
            console.log('🔥 Création d\'un nouvel utilisateur:', userFormData.email);

            // Pour l'instant, créons directement dans la table users
            // En production, il faudrait d'abord créer dans Supabase Auth
            const { data, error } = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userFormData)
            }).then(res => res.json());

            if (error) {
                console.error('❌ Erreur lors de la création:', error);
                return {
                    success: false,
                    error: this.getErrorMessage(error)
                };
            }

            console.log('✅ Utilisateur créé avec succès:', userFormData.email);
            return {
                success: true,
                user: data as SupabaseAdminUser
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }

    /**
     * Récupérer tous les utilisateurs
     */
    async getAllUsers(): Promise<SupabaseAdminUser[]> {
        try {
            console.log('🔍 Récupération de tous les utilisateurs...');

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
                return [];
            }

            console.log(`✅ ${data.length} utilisateurs récupérés`);
            return data as SupabaseAdminUser[];

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    async updateUser(userId: string, updateData: Partial<CreateUserData>): Promise<{ success: boolean; user?: SupabaseAdminUser; error?: string }> {
        try {
            console.log('🔄 Mise à jour de l\'utilisateur:', userId);

            const { data, error } = await supabase
                .from('users')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('❌ Erreur lors de la mise à jour:', error);
                return {
                    success: false,
                    error: 'Erreur lors de la mise à jour de l\'utilisateur'
                };
            }

            console.log('✅ Utilisateur mis à jour avec succès');
            return {
                success: true,
                user: data as SupabaseAdminUser
            };

        } catch (error: any) {
            console.error('❌ Erreur lors de la mise à jour:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('🗑️ Suppression de l\'utilisateur:', userId);

            // Supprimer d'abord de la table users
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (deleteError) {
                console.error('❌ Erreur lors de la suppression du profil:', deleteError);
                return {
                    success: false,
                    error: 'Erreur lors de la suppression du profil utilisateur'
                };
            }

            // Ensuite supprimer de Supabase Auth
            const { error: authError } = await supabase.auth.admin.deleteUser(userId);

            if (authError) {
                console.error('❌ Erreur lors de la suppression auth:', authError);
                return {
                    success: false,
                    error: 'Erreur lors de la suppression de l\'authentification'
                };
            }

            console.log('✅ Utilisateur supprimé avec succès');
            return { success: true };

        } catch (error: any) {
            console.error('❌ Erreur lors de la suppression:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur
     */
    async resetPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('🔑 Réinitialisation du mot de passe pour:', userId);

            const { error } = await supabase.auth.admin.updateUserById(userId, {
                password: newPassword
            });

            if (error) {
                console.error('❌ Erreur lors de la réinitialisation:', error);
                return {
                    success: false,
                    error: 'Erreur lors de la réinitialisation du mot de passe'
                };
            }

            console.log('✅ Mot de passe réinitialisé avec succès');
            return { success: true };

        } catch (error: any) {
            console.error('❌ Erreur lors de la réinitialisation:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }

    /**
     * Créer des utilisateurs de test pour le développement
     */
    async createTestUsers(): Promise<{ success: boolean; count: number; error?: string }> {
        try {
            console.log('🧪 Création d\'utilisateurs de test...');

            const testUsers = [
                {
                    email: 'admin@chinetousine.com',
                    password: 'admin123456',
                    name: 'Admin Principal',
                    role: 'admin' as const
                },
                {
                    email: 'supplier1@example.com',
                    password: 'supplier123456',
                    name: 'Shanghai Electronics Co.',
                    role: 'supplier' as const
                },
                {
                    email: 'client1@example.com',
                    password: 'client123456',
                    name: 'Marie Dubois',
                    role: 'customer' as const
                }
            ];

            let createdCount = 0;
            for (const user of testUsers) {
                try {
                    const result = await this.createUser(user);
                    if (result.success) {
                        createdCount++;
                        console.log(`✅ Utilisateur de test créé: ${user.email}`);
                    } else {
                        console.error(`❌ Erreur lors de la création de ${user.email}:`, result.error);
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors de la création de ${user.email}:`, error);
                }
            }

            console.log(`✅ ${createdCount} utilisateurs de test créés`);
            return { success: true, count: createdCount };

        } catch (error: any) {
            console.error('❌ Erreur lors de la création des utilisateurs de test:', error);
            return {
                success: false,
                count: 0,
                error: 'Erreur lors de la création des utilisateurs de test'
            };
        }
    }

    /**
     * Convertir les messages d'erreur en français
     */
    private getErrorMessage(errorMessage: string): string {
        const errorMap: Record<string, string> = {
            'User already registered': 'Cet email est déjà utilisé',
            'Invalid email': 'Format d\'email invalide',
            'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
            'Email not confirmed': 'Email non confirmé',
            'Invalid credentials': 'Identifiants invalides',
            'User not found': 'Utilisateur introuvable',
            'Email already exists': 'Cet email est déjà utilisé'
        };

        return errorMap[errorMessage] || 'Une erreur s\'est produite lors de l\'opération';
    }
}

export const supabaseAdminUserService = new SupabaseAdminUserService();
