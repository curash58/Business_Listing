import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextLayoutEvent,
} from 'react-native';

import { CATEGORY_STYLES, useListings, type Listing } from '@/context/listings-context';
import { colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { typography } from '@/styles/typography';

export default function ViewListingsScreen() {
  const [searchText, setSearchText] = useState('');
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});
  const [truncatableById, setTruncatableById] = useState<Record<string, boolean>>({});
  const { listings, isHydrated } = useListings();

  const filteredListings = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return listings;

    return listings.filter((item) => item.name.toLowerCase().includes(query));
  }, [searchText, listings]);

  const renderEmpty = () => {
    if (!isHydrated) return <Text style={styles.emptyState}>Loading listings...</Text>;
    if (listings.length === 0)
      return <Text style={styles.emptyState}>No listings yet. Create your first business listing.</Text>;
    if (filteredListings.length === 0)
      return <Text style={styles.emptyState}>No listings found for your search.</Text>;
    return null;
  };

  const renderItem = ({ item: listing }: { item: Listing }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{listing.name}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_STYLES[listing.category].bg }]}>
          <Text style={[styles.categoryText, { color: CATEGORY_STYLES[listing.category].text }]}>
            {listing.category}
          </Text>
        </View>
      </View>

      <View>
        {/* if the description is longer than 3 lines, it's hidden and the user can click to show more */}
        <Text style={styles.description} numberOfLines={expandedById[listing.id] ? undefined : 3}>
          {listing.shortDesc}
        </Text>
        <Text
          style={styles.measureText}
          onTextLayout={(event: TextLayoutEvent) => {
            const shouldShowMore = event.nativeEvent.lines.length > 3;
            if (truncatableById[listing.id] !== shouldShowMore) {
              setTruncatableById((prev) => ({ ...prev, [listing.id]: shouldShowMore }));
            }
          }}>
          {listing.shortDesc}
        </Text>
        {!expandedById[listing.id] && truncatableById[listing.id] ? (
          <Pressable
            onPress={() => setExpandedById((prev) => ({ ...prev, [listing.id]: true }))}
            style={({ pressed }) => [styles.pressableTextWrapper, pressed && styles.pressed]}>
            <Text style={styles.expandText}>more</Text>
          </Pressable>
        ) : expandedById[listing.id] ? (
          <Pressable
            onPress={() => setExpandedById((prev) => ({ ...prev, [listing.id]: false }))}
            style={({ pressed }) => [styles.pressableTextWrapper, pressed && styles.pressed]}>
            <Text style={styles.collapseText}>show less</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <FlatList
      data={isHydrated ? filteredListings : []}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>All Listings</Text>
          <View style={styles.searchContainer}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by business name..."
              style={styles.searchInput}
            />
            {searchText ? (
              <Pressable
                onPress={() => setSearchText('')}
                style={({ pressed }) => [styles.clearSearchButton, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Clear search">
                <Text style={styles.clearSearchText}>×</Text>
              </Pressable>
            ) : null}
          </View>
        </>
      }
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.screenTop,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    ...typography.input,
    flex: 1,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.md,
  },
  clearSearchButton: {
    width: 32,
    height: 32,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  clearSearchText: {
    color: colors.textMuted,
    fontSize: 22,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
    flex: 1,
  },
  categoryBadge: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    ...typography.body,
    lineHeight: 21,
  },
  measureText: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    left: 0,
    right: 0,
    lineHeight: 21,
    ...typography.body,
    color: 'transparent',
  },
  expandText: {
    ...typography.label,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  collapseText: {
    ...typography.label,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: spacing.sm,
  },
  pressableTextWrapper: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.5,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
