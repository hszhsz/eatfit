package com.eatfit.app.ui.screens.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.repository.UserPrefs
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val userPrefs: UserPrefs,
) : ViewModel() {

    val savedBaseUrl = userPrefs.baseUrl
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun saveBaseUrl(url: String, onDone: () -> Unit) {
        viewModelScope.launch {
            userPrefs.setBaseUrl(url)
            onDone()
        }
    }
}
