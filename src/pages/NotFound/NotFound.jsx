import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdSearchOff } from 'react-icons/md';
import Button from '../../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center">
      <div className="relative mb-lg">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative z-10 w-24 h-24 rounded-full glass-panel flex items-center justify-center border border-primary-container/30">
          <MdSearchOff className="text-primary-container text-4xl" />
        </div>
      </div>
      <h1 className="font-display-lg text-display-lg text-primary-container mb-xs">404</h1>
      <h2 className="font-headline-md text-headline-md text-white mb-md">
        This page got a different cut
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-xl">
        We couldn't find the page you're looking for. It may have been moved, renamed, or never
        existed in the first place.
      </p>
      <Button icon={MdHome} onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </main>
  );
}
