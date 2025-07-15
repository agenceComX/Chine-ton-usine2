import React, { useState, useEffect } from 'react';
import { X, Check, Heart, ShoppingCart } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    icon?: 'heart' | 'cart' | 'check';
    duration?: number;
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    icon,
    duration = 3000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const getIcon = () => {
        switch (icon) {
            case 'heart':
                return <Heart size={20} fill="currentColor" />;
            case 'cart':
                return <ShoppingCart size={20} />;
            default:
                return <Check size={20} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className={`${getColors()} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
                {getIcon()}
                <span className="flex-1 font-medium">{message}</span>
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info', icon?: 'heart' | 'cart' | 'check') => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info'; icon?: 'heart' | 'cart' | 'check' }>>([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', icon?: 'heart' | 'cart' | 'check') => {
        const id = nextId;
        setNextId(prev => prev + 1);
        setToasts(prev => [...prev, { id, message, type, icon }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ top: `${16 + index * 80}px` }}>
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        icon={toast.icon}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </ToastContext.Provider>
    );
};
