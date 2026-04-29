import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { CATEGORY_OPTIONS, type CategoryOption, useListings } from '@/context/listings-context';
import { colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { typography } from '@/styles/typography';

type ListingDraft = {
  name: string;
  category: CategoryOption;
  shortDesc: string;
};

const INITIAL_DRAFT: ListingDraft = {
  name: '',
  category: 'Retail',
  shortDesc: '',
};

export default function CreateListingScreen() {
  const [listing, setListing] = useState<ListingDraft>(INITIAL_DRAFT);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [error, setError] = useState('');
  const { addListing } = useListings();
  const router = useRouter();

  const isDisabled = !listing.name.trim() || !listing.shortDesc.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Business Listing</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={listing.name}
          onChangeText={(value) => setListing((prev) => ({ ...prev, name: value }))}
          placeholder="Enter name"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.dropdownContainer}>
          {isCategoryOpen && (
            <Pressable style={styles.backdrop} onPress={() => setIsCategoryOpen(false)} />
          )}

          <Pressable onPress={() => setIsCategoryOpen((prev) => !prev)} style={styles.dropdownTrigger}>
            <Text style={styles.dropdownTriggerText}>{listing.category}</Text>
            <Text style={styles.dropdownArrow}>{isCategoryOpen ? '▲' : '▼'}</Text>
          </Pressable>

          {isCategoryOpen && (
            <View style={styles.dropdownMenu}>
              {CATEGORY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setListing((prev) => ({ ...prev, category: option }));
                    setIsCategoryOpen(false);
                  }}
                  style={[styles.dropdownItem, listing.category === option && styles.dropdownItemActive]}>
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={listing.shortDesc}
          onChangeText={(value) => setListing((prev) => ({ ...prev, shortDesc: value }))}
          placeholder="Enter short description"
          multiline
          numberOfLines={4}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          style={[styles.input, styles.multilineInput]}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          disabled={isDisabled}
          style={[styles.createButton, isDisabled && styles.createButtonDisabled]}
          onPress={() => {
            const name = listing.name.trim();
            const shortDesc = listing.shortDesc.trim();
            if (!name || !shortDesc) {
              setError('Please enter a business name and short description.');
              return;
            }

            setError('');
            addListing({
              name,
              category: listing.category,
              shortDesc,
            });
            setListing(INITIAL_DRAFT);
            setIsCategoryOpen(false);
            Keyboard.dismiss();
            router.push('/(tabs)/view-listings');
          }}>
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.screenTop,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginTop: spacing.sm,
  },
  input: {
    ...typography.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
    elevation: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    ...typography.input,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dropdownItemActive: {
    backgroundColor: colors.surfaceSelected,
  },
  dropdownItemText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  createButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.45,
  },
  createButtonText: {
    color: colors.buttonText,
    ...typography.button,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.sm,
  },
});
