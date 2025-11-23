import { Controller, Control } from 'react-hook-form';
import { RadioCardGroup, RadioCardItem } from '@/components/UI/RadioCard';
import { HostPreferencesFormData } from '@/validations/onboarding';

interface PetsSectionProps {
  control: Control<HostPreferencesFormData>;
  hasPets: boolean | undefined;
}

export const PetsSection = ({ control, hasPets }: PetsSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Pets at Home</h3>

      <Controller
        name="hasPets"
        control={control}
        render={({ field: { value, onChange } }) => (
          <RadioCardGroup label="Cats, dogs, or others present" labelClassName="questionLabel">
            <RadioCardItem
              value="yes"
              checked={value === true}
              onChange={() => onChange(true)}
            >
              Yes
            </RadioCardItem>
            <RadioCardItem
              value="no"
              checked={value === false}
              onChange={() => onChange(false)}
            >
              No
            </RadioCardItem>
          </RadioCardGroup>
        )}
      />

      {hasPets && (
        <>
          <Controller
            name="hypoallergenicPet"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioCardGroup label="Hypoallergenic pet" labelClassName="questionLabel">
                <RadioCardItem
                  value="yes"
                  checked={value === true}
                  onChange={() => onChange(true)}
                >
                  Yes
                </RadioCardItem>
                <RadioCardItem
                  value="no"
                  checked={value === false}
                  onChange={() => onChange(false)}
                >
                  No
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />

          <Controller
            name="petsFreeRoam"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioCardGroup label="Are pets free to roam during events?" labelClassName="questionLabel">
                <RadioCardItem
                  value="yes"
                  checked={value === true}
                  onChange={() => onChange(true)}
                >
                  Yes
                </RadioCardItem>
                <RadioCardItem
                  value="no"
                  checked={value === false}
                  onChange={() => onChange(false)}
                >
                  No
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />
        </>
      )}
    </div>
  );
};
