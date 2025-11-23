import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import { Button } from '@/components/UI/Button';
import { Chip } from '@/components/UI/Chip';
import { Title } from '@/components/UI/Text';
import { usePets } from '@/hooks';
import { PetFormData } from '@/validations/onboarding';
import styles from './PersonalInfoStep.module.scss';

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

interface PetFormProps {
  initialPets?: PetFormData[];
  onPetsChange?: (pets: PetFormData[]) => void;
}

export const PetForm = ({ initialPets = [], onPetsChange }: PetFormProps) => {
  const {
    pets,
    currentPet,
    petError,
    addPet,
    removePet,
    setPetName,
    setPetKind,
  } = usePets(initialPets, onPetsChange);

  const handleAddPet = () => {
    addPet();
  };

  const handleRemovePet = (index: number) => {
    removePet(index);
  };

  return (
    <div className={styles.section}>
      <Title level={3}>Pets</Title>

      <div className={styles.addSection}>
        <Input
          label="Pet Name *"
          value={currentPet.name}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Pet name"
          error={petError}
        />

        <Select
          options={PET_KIND_OPTIONS}
          value={currentPet.kind}
          onChange={setPetKind}
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
  );
};
