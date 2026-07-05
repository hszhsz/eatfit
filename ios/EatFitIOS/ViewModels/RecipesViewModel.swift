import Foundation

@MainActor
final class RecipesViewModel: ObservableObject {
    @Published private(set) var recipes: [Recipe] = []
    @Published var selectedMealType: MealType?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    func load(using store: AppStore) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            recipes = try await store.makeClient().listRecipes(mealType: selectedMealType)
        } catch {
            recipes = []
            errorMessage = error.localizedDescription
        }
    }
}
