package com.eatfit.app.ui.screens.profile

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.ui.AppViewModel
import com.eatfit.app.ui.components.LoadingState
import com.eatfit.app.ui.screens.onboarding.OnboardingScreen

/**
 * The profile editing screen reuses the onboarding form, pre-filled with the
 * current profile. Saving updates the body metrics and re-derives the plan.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBack: () -> Unit,
    onSaved: () -> Unit,
    appViewModel: AppViewModel = hiltViewModel(),
) {
    val profileId by appViewModel.profileId.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("我的体测数据") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "返回")
                    }
                },
            )
        },
    ) { padding ->
        val id = profileId
        if (id == null) {
            LoadingState(Modifier.padding(padding))
        } else {
            // Reuse the onboarding form in edit mode.
            androidx.compose.foundation.layout.Box(Modifier.padding(padding)) {
                OnboardingScreen(
                    existingProfileId = id,
                    onDone = onSaved,
                )
            }
        }
    }
}
