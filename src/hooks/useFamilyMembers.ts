import { useState, useReducer } from 'react';
import { FamilyMemberFormData } from '@/validations/onboarding';
import { match } from 'ts-pattern';

const INITIAL_FAMILY_STATE = {
  name: '',
  age: '',
  relationship: '',
};

type FamilyAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_AGE'; payload: string }
  | { type: 'SET_RELATIONSHIP'; payload: string }
  | { type: 'RESET' };

const familyReducer = (state: typeof INITIAL_FAMILY_STATE, action: FamilyAction) => {
  return match(action)
    .with({ type: 'SET_NAME' }, (action) => {
        return { ...state, name: action.payload };
    })
    .with({ type: 'SET_AGE' }, (action) => {
        return { ...state, age: action.payload };
    })
    .with({ type: 'SET_RELATIONSHIP' }, (action) => {
        return { ...state, relationship: action.payload };
    })
    .with({ type: 'RESET' }, () => {
        return INITIAL_FAMILY_STATE;
    })
    .exhaustive();
};

export const useFamilyMembers = (
  initialMembers: FamilyMemberFormData[] = [],
  onChange?: (members: FamilyMemberFormData[]) => void
) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFormData[]>(initialMembers);
  const [currentFamily, dispatchFamily] = useReducer(familyReducer, INITIAL_FAMILY_STATE);
  const [familyError, setFamilyError] = useState('');

  const addFamilyMember = () => {
    setFamilyError('');
    if (!currentFamily.name || currentFamily.name.length < 2) {
      setFamilyError('Name must be at least 2 characters');
      return false;
    }
    if (/\d/.test(currentFamily.name)) {
      setFamilyError('Name cannot contain numbers');
      return false;
    }

    const newMember: FamilyMemberFormData = {
      name: currentFamily.name,
      age: currentFamily.age ? parseInt(currentFamily.age) : null,
      relationship: currentFamily.relationship || null,
    };

    const updatedMembers = [...familyMembers, newMember];
    setFamilyMembers(updatedMembers);
    dispatchFamily({ type: 'RESET' });
    onChange?.(updatedMembers);
    return true;
  };

  const removeFamilyMember = (index: number) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
    onChange?.(updatedMembers);
  };

  const updateFamilyMembers = (members: FamilyMemberFormData[]) => {
    setFamilyMembers(members);
    onChange?.(members);
  };

  return {
    familyMembers,
    currentFamily,
    familyError,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMembers,
    setFamilyName: (name: string) => dispatchFamily({ type: 'SET_NAME', payload: name }),
    setFamilyAge: (age: string) => dispatchFamily({ type: 'SET_AGE', payload: age }),
    setFamilyRelationship: (relationship: string) => dispatchFamily({ type: 'SET_RELATIONSHIP', payload: relationship }),
  };
};
