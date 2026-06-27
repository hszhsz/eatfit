package com.eatfit.app.ui.screens.recipe

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.data.repository.EatFitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class RecipeDetailState(
    val loading: Boolean = true,
    val recipe: Recipe? = null,
    val error: String? = null,
)

@HiltViewModel
class RecipeDetailViewModel @Inject constructor(
    private val repository: EatFitRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(RecipeDetailState())
    val state: StateFlow<RecipeDetailState> = _state.asStateFlow()

    fun load(id: Int) {
        _state.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            repository.getRecipe(id)
                .onSuccess { r -> _state.update { it.copy(loading = false, recipe = r) } }
                .onFailure { e ->
                    _state.update { it.copy(loading = false, error = e.message ?: "加载失败") }
                }
        }
    }
}
