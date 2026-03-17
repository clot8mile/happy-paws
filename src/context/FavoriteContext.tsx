import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { useUser } from "./UserContext";

interface Pet {
  id: string | number;
  name: string;
  breed: string;
  age: string;
  image: string;
  gender: "male" | "female" | string;
  distance?: string;
}

interface FavoriteContextType {
  favorites: Pet[];
  toggleFavorite: (pet: Pet) => void;
  isFavorite: (id: string | number) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

function mapPetFromApi(pet: any): Pet {
  const images = pet.images;
  let firstImage = '';
  if (Array.isArray(images) && images.length > 0) firstImage = images[0];
  else if (typeof images === 'string') {
    if (images.startsWith('{')) firstImage = images.replace(/[\{\}]/g, '').split(',')[0];
    else if (images.startsWith('http')) firstImage = images;
  }

  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    image: firstImage || pet.image || '',
    gender: pet.gender,
    distance: pet.distance || pet.distance_str,
  };
}

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  const [favorites, setFavorites] = useState<Pet[]>(() => {
    // 未登录时从 localStorage 读取
    const saved = localStorage.getItem("pet_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // 登录后从 API 加载收藏
  useEffect(() => {
    if (isLoggedIn) {
      api.get<any[]>('/favorites')
        .then(data => setFavorites(data.map(mapPetFromApi)))
        .catch(err => console.error('Failed to load favorites:', err));
    } else {
      // 未登录时使用 localStorage
      const saved = localStorage.getItem("pet_favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [isLoggedIn]);

  // 未登录时同步到 localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("pet_favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoggedIn]);

  const toggleFavorite = useCallback((pet: Pet) => {
    const petId = String(pet.id);
    const exists = favorites.some(p => String(p.id) === petId);

    if (isLoggedIn) {
      // 乐观更新 UI
      setFavorites(prev =>
        exists
          ? prev.filter(p => String(p.id) !== petId)
          : [...prev, pet]
      );
      // 发送 API 请求
      api.post<any>(`/favorites/${petId}`).catch(err => {
        console.error('Failed to toggle favorite:', err);
        // 回滚
        setFavorites(prev =>
          exists ? [...prev, pet] : prev.filter(p => String(p.id) !== petId)
        );
      });
    } else {
      setFavorites(prev =>
        exists
          ? prev.filter(p => String(p.id) !== petId)
          : [...prev, pet]
      );
    }
  }, [favorites, isLoggedIn]);

  const isFavorite = useCallback((id: string | number) => {
    return favorites.some(p => String(p.id) === String(id));
  }, [favorites]);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
}
