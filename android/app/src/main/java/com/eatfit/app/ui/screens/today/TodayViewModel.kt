package com.eatfit.app.ui.screens.today

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.DailyPlan
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TodayState(
    val loading: Boolean = true,
    val plan: DailyPlan? = null,
    val error: String? = null,
)

@HiltViewModel
class TodayViewModel @Inject constructor(
    private val repository: EatFitRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(TodayState())
    val state: StateFlow<TodayState> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            val id = repository.profileIdFlow.first()
            if (id == null) {
                _state.update { it.copy(loading = false, error = "尚未创建档案") }
                return@launch
            }
            repository.getDailyPlan(id)
                .onSuccess { plan -> _state.update { it.copy(loading = false, plan = plan) } }
                .onFailure { e ->
                    _state.update {
                        it.copy(
                            loading = false,
                            error = "加载失败:${e.message ?: "请确认后端已启动"}",
                        )
                    }
                }
        }
    }
}
