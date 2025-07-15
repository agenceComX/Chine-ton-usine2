import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TranslationDebug: React.FC = () => {
    const { t, currentLanguage } = useLanguage();

    const testKeys = [
        'homepage.recommendations.discover',
        'homepage.recommendations.title',
        'homepage.recommendations.subtitle',
        'homepage.recommendations.viewAll',
        'homepage.recommendations.badge'
    ];

    return (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
            <h3 className="font-bold mb-2">Translation Debug - Current Language: {currentLanguage}</h3>
            {testKeys.map(key => {
                const value = t(key);
                return (
                    <div key={key} className="mb-1">
                        <span className="font-mono text-sm">{key}:</span>
                        <span className="ml-2">{String(value)} (type: {typeof value})</span>
                    </div>
                );
            })}
        </div>
    );
};

export default TranslationDebug;
