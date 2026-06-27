package com.eatfit.app.ui.screens.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.UserProfileCreate
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
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

    /** Loads an existing profile into the form for editing. */
    fun loadExisting(id: Int) {
        viewModelScope.launch {
            repository.getProfile(id).onSuccess { p ->
                _state.update {
                    it.copy(
                        name = p.name,
                        gender = p.gender,
                        age = p.age.toString(),
                        heightCm = p.heightCm.toInt().toString(),
                        weightKg = p.weightKg.toInt().toString(),
                        bodyFatPct = p.bodyFatPct?.toInt()?.toString() ?: "",
                        activityLevel = p.activityLevel,
                        goal = p.goal,
                        allergens = p.allergens.toSet(),
                        vegetarian = p.dietPreference == "vegetarian",
                    )
                }
            }
        }
    }

    fun submit(existingId: Int?, onDone: () -> Unit) {
        val s = _state.value
        if (!s.isValid) {
            _state.update { it.copy(error = "请完整填写姓名、年龄、身高、体重") }
            return
        }
        _state.update { it.copy(submitting = true, error = null) }
        val body = UserProfileCreate(
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
        viewModelScope.launch {
            val result = if (existingId != null) {
                repository.updateProfile(existingId, body)
            } else {
                repository.createProfile(body)
            }
            result
                .onSuccess {
                    _state.update { it.copy(submitting = false) }
                    onDone()
                }
                .onFailure { e ->
                    _state.update {
                        it.copy(
                            submitting = false,
                            error = "保存失败:${e.message ?: "请检查后端是否已启动"}",
                        )
                    }
                }
        }
    }
}
