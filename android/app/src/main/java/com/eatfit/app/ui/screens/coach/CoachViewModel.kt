package com.eatfit.app.ui.screens.coach

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.CoachRequest
import com.eatfit.app.data.model.CoachResponse
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

data class CoachUiState(
    val input: String = "",
    val selectedFocus: String = "daily_review",
    val loading: Boolean = true,
    val response: CoachResponse? = null,
    val error: String? = null,
)

@HiltViewModel
class CoachViewModel @Inject constructor(
    private val repository: EatFitRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(CoachUiState())
    val state: StateFlow<CoachUiState> = _state.asStateFlow()

    init {
        requestAdvice()
    }

    fun updateInput(value: String) {
        _state.update { it.copy(input = value) }
    }

    fun updateFocus(value: String) {
        _state.update { it.copy(selectedFocus = value) }
    }

    fun requestAdvice() {
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            val profile = repository.profileFlow.first()
            if (profile == null) {
                _state.update { it.copy(loading = false, error = "尚未创建档案") }
                return@launch
            }
            val createBody = with(profile) {
                UserProfileCreate(
                    name = name,
                    gender = gender,
                    age = age,
                    heightCm = heightCm,
                    weightKg = weightKg,
                    bodyFatPct = bodyFatPct,
                    activityLevel = activityLevel,
                    goal = goal,
                    allergens = allergens,
                    dislikedTags = dislikedTags,
                    dietPreference = dietPreference,
                )
            }
            val snapshot = _state.value
            repository.getCoachAdvice(
                profile = createBody,
                request = CoachRequest(
                    message = snapshot.input.takeIf { it.isNotBlank() },
                    focus = snapshot.selectedFocus,
                ),
            )
                .onSuccess { response ->
                    _state.update { it.copy(loading = false, response = response, error = null) }
                }
                .onFailure { error ->
                    _state.update {
                        it.copy(
                            loading = false,
                            error = "AI 建议生成失败：${error.message ?: "请检查后端服务与模型配置"}",
                        )
                    }
                }
        }
    }
}
