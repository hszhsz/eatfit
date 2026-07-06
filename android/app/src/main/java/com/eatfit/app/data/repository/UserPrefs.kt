package com.eatfit.app.data.repository

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/** Persists the locally created profile id and backend URL so the user is remembered. */
@Singleton
class UserPrefs @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    private val keyProfileId = intPreferencesKey("profile_id")
    private val keyBaseUrl = stringPreferencesKey("base_url")

    val profileId: Flow<Int?> = dataStore.data.map { prefs ->
        prefs[keyProfileId]
    }

    val baseUrl: Flow<String?> = dataStore.data.map { prefs ->
        prefs[keyBaseUrl]
    }

    suspend fun setProfileId(id: Int) {
        dataStore.edit { it[keyProfileId] = id }
    }

    suspend fun setBaseUrl(url: String) {
        dataStore.edit { it[keyBaseUrl] = url }
    }

    suspend fun clear() {
        dataStore.edit {
            it.remove(keyProfileId)
            it.remove(keyBaseUrl)
        }
    }
}
