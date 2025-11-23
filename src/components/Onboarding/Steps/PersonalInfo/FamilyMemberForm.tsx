import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import { Button } from '@/components/UI/Button';
import { Chip } from '@/components/UI/Chip';
import { Title } from '@/components/UI/Text';
import { useFamilyMembers } from '@/hooks';
import { FamilyMemberFormData } from '@/validations/onboarding';
import styles from './PersonalInfoStep.module.scss';

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

interface FamilyMemberFormProps {
  initialMembers?: FamilyMemberFormData[];
  onMembersChange?: (members: FamilyMemberFormData[]) => void;
}

export const FamilyMemberForm = ({ initialMembers = [], onMembersChange }: FamilyMemberFormProps) => {
  const {
    familyMembers,
    currentFamily,
    familyError,
    addFamilyMember,
    removeFamilyMember,
    setFamilyName,
    setFamilyAge,
    setFamilyRelationship,
  } = useFamilyMembers(initialMembers, onMembersChange);

  const handleAddMember = () => {
    addFamilyMember();
  };

  const handleRemoveMember = (index: number) => {
    removeFamilyMember(index);
  };

  return (
    <div className={styles.section}>
      <Title level={3}>Family Members</Title>

      <div className={styles.addSection}>
        <div className={styles.formRow}>
          <Input
            label="Name *"
            value={currentFamily.name}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family member name"
            error={familyError}
          />
          <Input
            label="Age"
            type="number"
            value={currentFamily.age}
            onChange={(e) => setFamilyAge(e.target.value)}
            placeholder="Age"
          />
        </div>

        <Select
          options={RELATIONSHIP_OPTIONS}
          value={currentFamily.relationship}
          onChange={setFamilyRelationship}
          placeholder="Select relationship"
          searchable
        />

        <Button
          type="button"
          onClick={handleAddMember}
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
              onRemove={() => handleRemoveMember(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
