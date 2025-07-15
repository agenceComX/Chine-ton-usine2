import { Container, ContainerItem, ContainerStatus } from '../../types';
import { containers as mockContainers, containerItems as mockContainerItems } from '../../data/containers';

// Cette map simule un stockage en mémoire qui serait une base de données en réalité.
// Elle permet de modifier l'état des conteneurs sans recharger la page.
const currentContainers = new Map<string, Container>(mockContainers.map(c => [c.id, { ...c }]));
const currentContainerItems = new Map<string, ContainerItem>(mockContainerItems.map(ci => [ci.id, { ...ci }]));

export const containerService = {
  /**
   * Récupère la liste de tous les conteneurs.
   * Dans une application réelle, cela ferait un appel API à un backend.
   */
  getContainers(): Promise<Container[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from(currentContainers.values()));
      }, 500); // Simule un délai réseau
    });
  },

  /**
   * Récupère les articles pour un conteneur donné.
   * @param containerId L'ID du conteneur.
   */
  getContainerItems(containerId: string): Promise<ContainerItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = Array.from(currentContainerItems.values()).filter(item => item.containerId === containerId);
        resolve(items);
      }, 300); // Simule un délai réseau
    });
  },

  /**
   * Met à jour la capacité utilisée d'un conteneur et potentiellement son statut.
   * Dans une application réelle, cela ferait un appel API pour mettre à jour la base de données.
   * @param containerId L'ID du conteneur à mettre à jour.
   * @param newUsedCapacity La nouvelle capacité utilisée.
   */
  updateContainerCapacity(containerId: string, newUsedCapacity: number): Promise<Container> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const container = currentContainers.get(containerId);
        if (!container) {
          return reject(new Error('Conteneur non trouvé'));
        }

        let newStatus: ContainerStatus = container.status;
        if (newUsedCapacity >= container.totalCapacity) {
          newUsedCapacity = container.totalCapacity; // S'assure que usedCapacity ne dépasse pas totalCapacity
          newStatus = 'closed';
        }

        const updatedContainer = {
          ...container,
          usedCapacity: newUsedCapacity,
          status: newStatus,
        };

        currentContainers.set(containerId, updatedContainer);
        resolve(updatedContainer);
      }, 300); // Simule un délai réseau
    });
  },

  /**
   * Ajoute un article à un conteneur.
   * @param containerId L'ID du conteneur.
   * @param productId L'ID du produit à ajouter.
   * @param quantity La quantité du produit à ajouter.
   * @param userId L'ID de l'utilisateur qui ajoute l'article.
   */
  addContainerItem(
    containerId: string,
    productId: string,
    quantity: number,
    userId: string
  ): Promise<ContainerItem> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const container = currentContainers.get(containerId);
        if (!container || container.status === 'closed') {
          return reject(new Error('Conteneur non disponible ou clôturé'));
        }

        // Simuler l'ajout de l'article
        const newItem: ContainerItem = {
          id: `item${Date.now()}`,
          containerId,
          productId,
          quantity,
          userId,
        };
        currentContainerItems.set(newItem.id, newItem);        // Mettre à jour la capacité du conteneur
        const updatedUsedCapacity = container.usedCapacity + quantity;
        try {
          await this.updateContainerCapacity(containerId, updatedUsedCapacity);
          resolve(newItem);
        } catch (error) {
          reject(error);
        }
      }, 300); // Simule un délai réseau
    });
  },
}; 