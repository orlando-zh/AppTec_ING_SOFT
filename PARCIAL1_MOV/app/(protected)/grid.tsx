import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePokedex } from '@/src/pokedex/viewmodels/use-pokedex';

const NUM_COLUMNS = 3;

export default function GridScreen() {
    const { pokemons, trainer, isLoading } = usePokedex();
    const [activeTab, setActiveTab] = useState<'grid' | 'profile'>('grid');

    const renderGridItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.gridItem} activeOpacity={0.8}>
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} resizeMode="cover" />
        </TouchableOpacity>
    );

    if (isLoading || !trainer) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#B91C1C" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 1. PERFIL */}
            <View style={styles.profileSection}>
                <View style={styles.profileRow}>
                    <Image source={trainer.avatarUrl} style={styles.avatar} />
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{trainer.stats.badges}</Text>
                            <Text style={styles.statLabel}>Badges</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{trainer.stats.pokemon}</Text>
                            <Text style={styles.statLabel}>Pokémon</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{trainer.stats.wins}</Text>
                            <Text style={styles.statLabel}>Wins</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.trainerName}>{trainer.name}</Text>
                <Text style={styles.trainerBio}>{trainer.bio}</Text>
            </View>

            {/* 2. TABS INTERNOS */}
            <View style={styles.tabsRow}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('grid')} activeOpacity={1}>
                    <Feather
                        name="grid"
                        size={22}
                        color={activeTab === 'grid' ? '#1E293B' : '#9CA3AF'}
                    />
                    {activeTab === 'grid' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('profile')} activeOpacity={1}>
                    <MaterialCommunityIcons name="account-box-outline" size={26} color={activeTab === 'profile' ? '#1E293B' : '#9CA3AF'} />
                    {activeTab === 'profile' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                renderItem={renderGridItem}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },

    // Profile
    profileSection: {
        paddingHorizontal: 16,
        paddingTop: 16
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },


    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFEFEF'
    },
    statsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 16
    },
    statItem: {
        alignItems: 'center'
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B'
    },
    statLabel: {
        fontSize: 12,
        color: '#8B5E3C',
        marginTop: 2,
        fontWeight: '600'
    },
    trainerName: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B'
    },
    trainerBio: {
        marginTop: 4,
        fontSize: 14,
        color: '#1E293B',
        lineHeight: 20
    },

    // Tabs
    tabsRow: {
        flexDirection: 'row',
        marginTop: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        position: 'relative'
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '100%',
        backgroundColor: '#1E293B'
    },


    gridContent: { paddingBottom: 8, paddingTop: 2 },
    gridRow: {
        justifyContent: 'flex-start',
    },
    gridItem: {
        flex: 1,
        maxWidth: '33.33%',
        aspectRatio: 1,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    gridImage: { width: '100%', height: '100%' }
});