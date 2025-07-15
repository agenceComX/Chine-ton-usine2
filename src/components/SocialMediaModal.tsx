import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export type SocialNetwork = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'twitch';

export interface SocialMediaLink {
  network: SocialNetwork;
  url: string;
}

interface SocialMediaModalProps {
  isOpen: boolean;
  selectedNetworks: SocialNetwork[];
  existingLinks: SocialMediaLink[];
  onClose: () => void;
  onSave: (links: SocialMediaLink[]) => void;
}

const socialNetworkData: Record<SocialNetwork, { 
  name: string; 
  placeholder: string; 
  icon: React.ReactNode;
  color: string;
}> = {
  instagram: {
    name: 'Instagram',
    placeholder: 'https://instagram.com/votre-profil',
    color: '#E4405F',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  tiktok: {
    name: 'TikTok',
    placeholder: 'https://tiktok.com/@votre-profil',
    color: '#FF0050',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  },
  youtube: {
    name: 'YouTube',
    placeholder: 'https://youtube.com/@votre-chaine',
    color: '#FF0000',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  twitter: {
    name: 'X (Twitter)',
    placeholder: 'https://x.com/votre-profil',
    color: '#1DA1F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  linkedin: {
    name: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/votre-profil',
    color: '#0077B5',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  facebook: {
    name: 'Facebook',
    placeholder: 'https://facebook.com/votre-profil',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  twitch: {
    name: 'Twitch',
    placeholder: 'https://twitch.tv/votre-profil',
    color: '#9146FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
      </svg>
    )
  }
};

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({
  isOpen,
  selectedNetworks,
  existingLinks,
  onClose,
  onSave
}) => {
  const { t } = useLanguage();
  const [links, setLinks] = useState<SocialMediaLink[]>([]);
  const [errors, setErrors] = useState<Record<SocialNetwork, string>>({} as Record<SocialNetwork, string>);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialiser les liens avec les valeurs existantes
  useEffect(() => {
    if (isOpen) {
      const initialLinks: SocialMediaLink[] = selectedNetworks.map(network => {
        const existingLink = existingLinks.find(link => link.network === network);
        return {
          network,
          url: existingLink?.url || ''
        };
      });
      setLinks(initialLinks);
      setErrors({} as Record<SocialNetwork, string>);
      
      // Focus sur le premier champ après l'animation
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, selectedNetworks, existingLinks]);

  // Gestion de l'accessibilité clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  const validateUrl = (url: string, network: SocialNetwork): string => {
    if (!url.trim()) {
      return t('socialMediaModal.urlRequired');
    }
    
    // Validation basique d'URL
    try {
      new URL(url);
    } catch {
      return t('socialMediaModal.urlInvalid');
    }
    
    // Validation spécifique selon le réseau
    const domain = socialNetworkData[network].placeholder.split('/')[2];
    if (!url.includes(domain)) {
      return t('socialMediaModal.urlInvalidDomain');
    }
    
    return '';
  };

  const handleUrlChange = (network: SocialNetwork, url: string) => {
    setLinks(prev => 
      prev.map(link => 
        link.network === network ? { ...link, url } : link
      )
    );
    
    // Effacer l'erreur si l'utilisateur tape
    if (errors[network]) {
      setErrors(prev => ({ ...prev, [network]: '' }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<SocialNetwork, string> = {} as Record<SocialNetwork, string>;
    let hasErrors = false;

    links.forEach(link => {
      const error = validateUrl(link.url, link.network);
      if (error) {
        newErrors[link.network] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSave(links);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="social-media-modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-modal-title"
    >
      <div className="social-media-modal">
        <div className="social-media-modal-header">
          <h3 id="social-modal-title" className="social-media-modal-title">
            {t('socialMediaModal.title')}
          </h3>
          <button 
            type="button"
            className="social-media-modal-close"
            onClick={onClose}
            aria-label={t('socialMediaModal.close')}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="social-media-modal-content">
          <p className="social-media-modal-description">
            {t('socialMediaModal.description')}
          </p>

          <div className="social-media-modal-fields">
            {links.map((link, index) => {
              const networkData = socialNetworkData[link.network];
              return (
                <div key={link.network} className="social-media-field">
                  <label className="social-media-label">
                    <div className="social-media-label-content">
                      <span 
                        className="social-media-icon" 
                        style={{ color: networkData.color }}
                      >
                        {networkData.icon}
                      </span>
                      <span className="social-media-name">
                        {t('socialMediaModal.linkFor')} {networkData.name}
                      </span>
                    </div>
                  </label>
                  <input
                    ref={index === 0 ? firstInputRef : undefined}
                    type="url"
                    className={`social-media-input ${errors[link.network] ? 'error' : ''}`}
                    placeholder={networkData.placeholder}
                    value={link.url}
                    onChange={(e) => handleUrlChange(link.network, e.target.value)}
                    aria-describedby={errors[link.network] ? `error-${link.network}` : undefined}
                  />
                  {errors[link.network] && (
                    <div id={`error-${link.network}`} className="social-media-error">
                      {errors[link.network]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="social-media-modal-footer">
          <button 
            type="button"
            className="social-media-modal-cancel"
            onClick={onClose}
          >
            {t('socialMediaModal.cancel')}
          </button>
          <button 
            type="button"
            className="social-media-modal-save"
            onClick={handleSave}
          >
            {t('socialMediaModal.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
