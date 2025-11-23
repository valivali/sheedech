import { useState, useReducer } from 'react';
import { PetFormData } from '@/validations/onboarding';
import { match } from 'ts-pattern';

const INITIAL_PET_STATE = {
  name: '',
  kind: '',
};

type PetAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_KIND'; payload: string }
  | { type: 'RESET' };

const petReducer = (state: typeof INITIAL_PET_STATE, action: PetAction) => {
  return match(action.type)
    .with('SET_NAME', (action: string) => {
        return { ...state, name: action };
    })
    .with('SET_KIND', (action: string) => {
        return { ...state, kind: action };
    })
    .with('RESET', () => {
        return INITIAL_PET_STATE;
    })
    .exhaustive();
};

export const usePets = (
  initialPets: PetFormData[] = [],
  onChange?: (pets: PetFormData[]) => void
) => {
  const [pets, setPets] = useState<PetFormData[]>(initialPets);
  const [currentPet, dispatchPet] = useReducer(petReducer, INITIAL_PET_STATE);
  const [petError, setPetError] = useState('');

  const addPet = () => {
    setPetError('');
    if (!currentPet.name || currentPet.name.length < 2) {
      setPetError('Name must be at least 2 characters');
      return false;
    }
    if (/\d/.test(currentPet.name)) {
      setPetError('Name cannot contain numbers');
      return false;
    }

    const newPet: PetFormData = {
      name: currentPet.name,
      kind: currentPet.kind || null,
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    dispatchPet({ type: 'RESET' });
    onChange?.(updatedPets);
    return true;
  };

  const removePet = (index: number) => {
    const updatedPets = pets.filter((_, i) => i !== index);
    setPets(updatedPets);
    onChange?.(updatedPets);
  };

  const updatePets = (newPets: PetFormData[]) => {
    setPets(newPets);
    onChange?.(newPets);
  };

  return {
    pets,
    currentPet,
    petError,
    addPet,
    removePet,
    updatePets,
    setPetName: (name: string) => dispatchPet({ type: 'SET_NAME', payload: name }),
    setPetKind: (kind: string) => dispatchPet({ type: 'SET_KIND', payload: kind }),
  };
};
