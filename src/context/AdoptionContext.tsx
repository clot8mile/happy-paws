import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useUser } from './UserContext';

export interface AdoptionApplication {
  id: string;
  petName: string;
  petInfo: string;
  status: string;
  statusDesc: string;
  date: string;
  image: string;
  isActive: boolean;
}

interface AdoptionContextType {
  applications: AdoptionApplication[];
  isLoading: boolean;
  addApplication: (app: {
    petId?: string;
    petName: string;
    petInfo: string;
    image: string;
    applicantName?: string;
    applicantPhone?: string;
    livingCity?: string;
    housingType?: string;
    hasExperience?: boolean;
    adoptionReason?: string;
  }) => Promise<string>;
  refreshApplications: () => Promise<void>;
}

const AdoptionContext = createContext<AdoptionContextType | undefined>(undefined);

function mapAppFromApi(app: any): AdoptionApplication {
  return {
    id: app.id,
    petName: app.pet_name,
    petInfo: app.pet_info || '',
    status: app.status,
    statusDesc: app.status_desc || '',
    date: app.date || app.created_at?.split('T')[0] || '',
    image: app.image || '',
    isActive: app.is_active,
  };
}

export function AdoptionProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshApplications = useCallback(async () => {
    if (!isLoggedIn) {
      setApplications([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.get<any[]>('/adoptions');
      setApplications(data.map(mapAppFromApi));
    } catch (err) {
      console.error('Failed to load adoptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const addApplication = useCallback(async (appData: any): Promise<string> => {
    const data = await api.post<any>('/adoptions', {
      petId: appData.petId,
      petName: appData.petName,
      petInfo: appData.petInfo,
      image: appData.image,
      applicantName: appData.applicantName,
      applicantPhone: appData.applicantPhone,
      livingCity: appData.livingCity,
      housingType: appData.housingType,
      hasExperience: appData.hasExperience,
      adoptionReason: appData.adoptionReason,
    });
    const newApp = mapAppFromApi(data);
    setApplications(prev => [newApp, ...prev]);
    return newApp.id;
  }, []);

  return (
    <AdoptionContext.Provider value={{ applications, isLoading, addApplication, refreshApplications }}>
      {children}
    </AdoptionContext.Provider>
  );
}

export function useAdoptions() {
  const context = useContext(AdoptionContext);
  if (context === undefined) {
    throw new Error('useAdoptions must be used within an AdoptionProvider');
  }
  return context;
}
