package com.eatfit.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.UserProfile
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

/** App-level state: exposes whether a profile already exists. */
@HiltViewModel
class AppViewModel @Inject constructor(
    repository: EatFitRepository,
) : ViewModel() {

    val profileId = repository.profileIdFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val profile = repository.profileFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)
}
