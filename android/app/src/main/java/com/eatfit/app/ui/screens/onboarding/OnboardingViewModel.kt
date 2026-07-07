package com.eatfit.app.ui.screens.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.UserProfile
import com.eatfit.app.data.model.UserProfileCreate
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OnboardingState(
    val name: String = "",
    val gender: String = "male",
    val age: String = "28",
    val heightCm: String = "175",
    val weightKg: String = "70",
    val bodyFatPct: String = "",
    val activityLevel: String = "light",
    val goal: String = "lose_fat",
    val allergens: Set<String> = emptySet(),
    val vegetarian: Boolean = false,
    val submitting: Boolean = false,
    val error: String? = null,
) {
    val isValid: Boolean
        get() = name.isNotBlank() &&
            age.toIntOrNull()?.let { it in 10..100 } == true &&
            heightCm.toDoubleOrNull()?.let { it in 100.0..250.0 } == true &&
            weightKg.toDoubleOrNull()?.let { it in 30.0..250.0 } == true
}

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val repository: EatFitRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(OnboardingState())
    val state: StateFlow<OnboardingState> = _state.asStateFlow()

    fun update(transform: (OnboardingState) -> OnboardingState) {
        _state.update(transform)
    }

    fun toggleAllergen(tag: String) {
        _state.update {
            val next = it.allergens.toMutableSet()
            if (!next.add(tag)) next.remove(tag)
            it.copy(allergens = next)
        }
    }

    /** Loads an existing locally-stored profile into the form for editing. */
    fun loadExisting() {
        viewModelScope.launch {
            val stored = repository.profileFlow.first()
            if (stored != null) {
                _state.update {
                    it.copy(
                        name = stored.name,
                        gender = stored.gender,
                        age = stored.age.toString(),
                        heightCm = stored.heightCm.toInt().toString(),
                        weightKg = stored.weightKg.toInt().toString(),
                        bodyFatPct = stored.bodyFatPct?.toInt()?.toString() ?: "",
                        activityLevel = stored.activityLevel,
                        goal = stored.goal,
                        allergens = stored.allergens.toSet(),
                        vegetarian = stored.dietPreference == "vegetarian",
                    )
                }
            }
        }
    }

    fun submit(isEdit: Boolean, onDone: () -> Unit) {
        val s = _state.value
        if (!s.isValid) {
            _state.update { it.copy(error = "请完整填写姓名、年龄、身高、体重") }
            return
        }
        _state.update { it.copy(submitting = true, error = null) }
        viewModelScope.launch {
            val existingId = if (isEdit) repository.profileIdFlow.first() else null
            val profile = UserProfile(
                id = existingId ?: 0,
                name = s.name.trim(),
                gender = s.gender,
                age = s.age.toInt(),
                heightCm = s.heightCm.toDouble(),
                weightKg = s.weightKg.toDouble(),
                bodyFatPct = s.bodyFatPct.toDoubleOrNull(),
                activityLevel = s.activityLevel,
                goal = s.goal,
                allergens = s.allergens.toList(),
                dislikedTags = emptyList(),
                dietPreference = if (s.vegetarian) "vegetarian" else "normal",
            )
            runCatching {
                repository.saveProfile(profile)
            }
                .onSuccess {
                    _state.update { it.copy(submitting = false) }
                    onDone()
                }
                .onFailure { e ->
                    _state.update {
                        it.copy(
                            submitting = false,
                            error = "保存失败:${e.message ?: "未知错误"}",
                        )
                    }
                }
        }
    }
}
