import Foundation

@MainActor
final class GroceryViewModel: ObservableObject {
    @Published private(set) var groceryList: GroceryList?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    func load(using store: AppStore) async {
        guard let profileId = store.profileId else {
            errorMessage = "尚未创建档案。"
            groceryList = nil
            return
        }

        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            groceryList = try await store.makeClient().getGroceryList(profileId: profileId)
        } catch {
            groceryList = nil
            errorMessage = error.localizedDescription
        }
    }
}
