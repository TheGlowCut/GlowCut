import { createContext, useState, useCallback } from 'react';

export const UserContext = createContext(null);

const defaultProfile = {
  name: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  phone: '+92 300 1234567',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBNJaH3ty0k1DIfjl-VY4GvzwGr_vgAtyMLzIeZDNTb6eri4mpdrE3GSEe4yldLBIDruIrIIdkmSfhUPTtuVmhEQCg43SibgJixBbedYgRgNuJ0KOXRqIvm3nElmEqdkKhZ_s3vrFzu2upHF3inkzMx5fkoOQIqpRgwwmfoPHbRbAOnL2pFo2yHzD_hULivANKwoMFErEenyvS-c4CitLoCU7GLQNWmU83HVIh33EiIZntF1MLMj98hOyEW7s2e-vAsSALdZZFNRiw',
  glowPoints: 1240,
  tier: 'Gold',
  isGoldMember: true,
};

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: true,
  });

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleNotification = useCallback((key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const addGlowPoints = useCallback((amount) => {
    setProfile((prev) => ({ ...prev, glowPoints: prev.glowPoints + amount }));
  }, []);

  const value = {
    profile,
    updateProfile,
    notifications,
    toggleNotification,
    addGlowPoints,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
