package com.eatfit.app.data.repository

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/** Persists the locally created profile id so the user is remembered. */
@Singleton
class UserPrefs @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    private val keyProfileId = intPreferencesKey("profile_id")

    val profileId: Flow<Int?> = dataStore.data.map { prefs ->
        prefs[keyProfileId]
    }

    suspend fun setProfileId(id: Int) {
        dataStore.edit { it[keyProfileId] = id }
    }

    suspend fun clear() {
        dataStore.edit { it.remove(keyProfileId) }
    }
}
