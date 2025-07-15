import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page non trouvée</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;