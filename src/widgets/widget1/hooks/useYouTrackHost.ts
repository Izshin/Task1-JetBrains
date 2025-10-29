import { useState, useEffect } from 'react';
import type { HostAPI } from '../../../../@types/globals';

export const useYouTrackHost = () => {
  const [host, setHost] = useState<HostAPI | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const registerHost = async () => {
      try {
        const registeredHost = await YTApp.register();
        if (mounted) {
          setHost(registeredHost);
          setHostError(null);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to register YTApp host:', error);
        if (mounted) {
          setHostError('Failed to initialize host');
        }
      }
    };

    registerHost();

    return () => {
      mounted = false;
    };
  }, []);

  return { host, hostError };
};