"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useReducer } from 'react';
import { match } from 'ts-pattern';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Title, Text } from '@/components/UI/Text';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { Select } from '@/components/UI/Select';
import { Chip } from '@/components/UI/Chip';
import { useSavePersonalInfo } from '@/api/frontend/onboarding';
import { personalInfoSchema, PersonalInfoFormData, FamilyMemberFormData, PetFormData } from '@/validations/onboarding';
import { PersonalInfo } from '@/types/onboarding';
import styles from './PersonalInfoStep.module.scss';

interface PersonalInfoStepProps {
  onNext: () => void;
  initialData?: PersonalInfo;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'husband', label: 'Husband' },
  { value: 'wife', label: 'Wife' },
  { value: 'partner', label: 'Partner' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'other', label: 'Other' },
];

const PET_KIND_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'parrot', label: 'Parrot' },
  { value: 'fish', label: 'Fish' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'other', label: 'Other' },
];

const INITIAL_FAMILY_STATE = {
  name: '',
  age: '',
  relationship: '',
};

const INITIAL_PET_STATE = {
  name: '',
  kind: '',
};

type FamilyAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_AGE'; payload: string }
  | { type: 'SET_RELATIONSHIP'; payload: string }
  | { type: 'RESET' };

type PetAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_KIND'; payload: string }
  | { type: 'RESET' };

const familyReducer = (state: typeof INITIAL_FAMILY_STATE, action: FamilyAction) =>
  match(action)
    .with({ type: 'SET_NAME' }, ({ payload }) => ({ ...state, name: payload }))
    .with({ type: 'SET_AGE' }, ({ payload }) => ({ ...state, age: payload }))
    .with({ type: 'SET_RELATIONSHIP' }, ({ payload }) => ({ ...state, relationship: payload }))
    .with({ type: 'RESET' }, () => INITIAL_FAMILY_STATE)
    .exhaustive();

const petReducer = (state: typeof INITIAL_PET_STATE, action: PetAction) =>
  match(action)
    .with({ type: 'SET_NAME' }, ({ payload }) => ({ ...state, name: payload }))
    .with({ type: 'SET_KIND' }, ({ payload }) => ({ ...state, kind: payload }))
    .with({ type: 'RESET' }, () => INITIAL_PET_STATE)
    .exhaustive();

export const PersonalInfoStep = ({ onNext, initialData }: PersonalInfoStepProps) => {
  const { mutate: savePersonalInfo, isPending } = useSavePersonalInfo();

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFormData[]>(initialData?.familyMembers || []);
  const [currentFamily, dispatchFamily] = useReducer(familyReducer, INITIAL_FAMILY_STATE);
  const [familyError, setFamilyError] = useState('');

  const [pets, setPets] = useState<PetFormData[]>(initialData?.pets || []);
  const [currentPet, dispatchPet] = useReducer(petReducer, INITIAL_PET_STATE);
  const [petError, setPetError] = useState('');

  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      familyMembers: [],
      pets: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        address: initialData.address,
        phoneNumber: initialData.phoneNumber,
        familyMembers: initialData.familyMembers || [],
        pets: initialData.pets || [],
      });
      setFamilyMembers(initialData.familyMembers || []);
      setPets(initialData.pets || []);
    }
  }, [initialData, reset]);

  const handleAddFamilyMember = () => {
    setFamilyError('');
    if (!currentFamily.name || currentFamily.name.length < 2) {
      setFamilyError('Name must be at least 2 characters');
      return;
    }
    if (/\d/.test(currentFamily.name)) {
      setFamilyError('Name cannot contain numbers');
      return;
    }

    const newMember: FamilyMemberFormData = {
      name: currentFamily.name,
      age: currentFamily.age ? parseInt(currentFamily.age) : null,
      relationship: currentFamily.relationship || null,
    };

    setFamilyMembers([...familyMembers, newMember]);
    dispatchFamily({ type: 'RESET' });
  };

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleAddPet = () => {
    setPetError('');
    if (!currentPet.name || currentPet.name.length < 2) {
      setPetError('Name must be at least 2 characters');
      return;
    }
    if (/\d/.test(currentPet.name)) {
      setPetError('Name cannot contain numbers');
      return;
    }

    const newPet: PetFormData = {
      name: currentPet.name,
      kind: currentPet.kind || null,
    };

    setPets([...pets, newPet]);
    dispatchPet({ type: 'RESET' });
  };

  const handleRemovePet = (index: number) => {
    setPets(pets.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PersonalInfoFormData) => {
    const formData = {
      ...data,
      familyMembers,
      pets,
    };

    savePersonalInfo(formData, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error('Failed to save:', error);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Personal Information</Title>
      <Text className={styles.subtitle}>
        Help us get to know you better by sharing some basic information.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formRow}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="First Name *"
                error={errors.firstName?.message}
                placeholder="John"
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Last Name *"
                error={errors.lastName?.message}
                placeholder="Doe"
              />
            )}
          />
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Address *"
              error={errors.address?.message}
              helperText="We will show estimated address to users until there is a match"
              placeholder="123 Main St, City, State"
            />
          )}
        />

        <div className={styles.phoneInputWrapper}>
          <label className={styles.phoneInputLabel}>
            Phone Number *
          </label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country={'ca'}
                value={value}
                onChange={(phone) => onChange(phone)}
                inputProps={{
                  name: 'phoneNumber',
                }}
                containerClass={styles.phoneInputContainer}
                enableSearch={true}
                disableSearchIcon={false}
                disableCountryGuess= {true}
              />
            )}
          />
          {errors.phoneNumber && (
            <span className={styles.phoneInputErrorText}>{errors.phoneNumber.message}</span>
          )}
          <span className={styles.phoneInputHelperText}>
            We will not expose phone number until there is a match
          </span>
        </div>

        <div className={styles.section}>
          <Title level={3}>Family Members</Title>

          <div className={styles.addSection}>
            <div className={styles.formRow}>
              <Input
                label="Name *"
                value={currentFamily.name}
                onChange={(e) => dispatchFamily({ type: 'SET_NAME', payload: e.target.value })}
                placeholder="Family member name"
                error={familyError}
              />
              <Input
                label="Age"
                type="number"
                value={currentFamily.age}
                onChange={(e) => dispatchFamily({ type: 'SET_AGE', payload: e.target.value })}
                placeholder="Age"
              />
            </div>

            <Select
              options={RELATIONSHIP_OPTIONS}
              value={currentFamily.relationship}
              onChange={(value: string) => dispatchFamily({ type: 'SET_RELATIONSHIP', payload: value })}
              placeholder="Select relationship"
              searchable
            />

            <Button
              type="button"
              onClick={handleAddFamilyMember}
              variant="secondary"
              size="sm"
              className={styles.addButton}
            >
              Add Family Member
            </Button>
          </div>

          {familyMembers.length > 0 && (
            <div className={styles.chips}>
              {familyMembers.map((member, index) => (
                <Chip
                  key={index}
                  label={`${member.name}${member.age ? ` (${member.age})` : ''}${member.relationship ? ` - ${member.relationship}` : ''}`}
                  onRemove={() => handleRemoveFamilyMember(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <Title level={3}>Pets</Title>

          <div className={styles.addSection}>
            <Input
              label="Pet Name *"
              value={currentPet.name}
              onChange={(e) => dispatchPet({ type: 'SET_NAME', payload: e.target.value })}
              placeholder="Pet name"
              error={petError}
            />

            <Select
              options={PET_KIND_OPTIONS}
              value={currentPet.kind}
              onChange={(value) => dispatchPet({ type: 'SET_KIND', payload: value })}
              placeholder="Select pet kind"
              searchable
            />

            <Button
              type="button"
              onClick={handleAddPet}
              variant="secondary"
              size="sm"
              className={styles.addButton}
            >
              Add Pet
            </Button>
          </div>

          {pets.length > 0 && (
            <div className={styles.chips}>
              {pets.map((pet, index) => (
                <Chip
                  key={index}
                  label={`${pet.name}${pet.kind ? ` (${pet.kind})` : ''}`}
                  onRemove={() => handleRemovePet(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={!isValid || isPending}
            size="md"
          >
            {isPending ? 'Saving...' : 'Next Step'}
          </Button>
        </div>
      </form>
    </div>
  );
};

