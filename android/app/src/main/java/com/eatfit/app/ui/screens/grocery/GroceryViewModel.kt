package com.eatfit.app.ui.screens.grocery

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.GroceryList
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class GroceryUiState(
    val loading: Boolean = true,
    val list: GroceryList? = null,
    val checked: Set<String> = emptySet(),
    val error: String? = null,
)

@HiltViewModel
class GroceryViewModel @Inject constructor(
    private val repository: EatFitRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(GroceryUiState())
    val state: StateFlow<GroceryUiState> = _state.asStateFlow()

    init { load() }

    fun load() {
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            val id = repository.profileIdFlow.first()
            if (id == null) {
                _state.update { it.copy(loading = false, error = "尚未创建档案") }
                return@launch
            }
            repository.getGroceryList(id)
                .onSuccess { l -> _state.update { it.copy(loading = false, list = l) } }
                .onFailure { e ->
                    _state.update { it.copy(loading = false, error = e.message ?: "加载失败") }
                }
        }
    }

    fun toggle(name: String) {
        _state.update {
            val next = it.checked.toMutableSet()
            if (!next.add(name)) next.remove(name)
            it.copy(checked = next)
        }
    }
}
