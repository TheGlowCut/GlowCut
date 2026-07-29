import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdLogin, MdPersonAdd } from 'react-icons/md';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * GuestBlock
 * Beautiful overlay shown whenever a guest tries a booking action.
 * `isOpen` is controlled by parent state; `onClose` dismisses it.
 */
export default function GuestBlock({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose>
      <div className="flex flex-col items-center text-center gap-md py-sm">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary-container/30 flex items-center justify-center shadow-warm-sm">
          <MdLock className="text-primary-container text-4xl" />
        </div>

        <div>
          <h3 className="font-headline-md text-headline-md text-white mb-xs">
            Login Required
          </h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            You are browsing as a <span className="text-secondary font-bold">Guest</span>.
            Please Login or Register to book a token and access all features!
          </p>
        </div>

        <div className="flex flex-col gap-sm w-full pt-sm">
          <Button
            variant="primary"
            size="full"
            icon={MdLogin}
            onClick={() => { onClose(); navigate('/auth/login'); }}
          >
            Login to My Account
          </Button>
          <Button
            variant="outline"
            size="full"
            icon={MdPersonAdd}
            onClick={() => { onClose(); navigate('/auth/signup'); }}
          >
            Create Free Account
          </Button>
        </div>

        <button
          onClick={onClose}
          className="text-on-surface-variant text-caption hover:text-white transition-colors"
        >
          Continue browsing as guest
        </button>
      </div>
    </Modal>
  );
}
