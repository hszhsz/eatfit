import Foundation

@MainActor
final class TodayViewModel: ObservableObject {
    @Published private(set) var plan: DailyPlan?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    func load(using store: AppStore) async {
        guard let profileId = store.profileId else {
            errorMessage = "尚未创建档案。"
            plan = nil
            return
        }

        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            plan = try await store.makeClient().getDailyPlan(profileId: profileId)
        } catch {
            plan = nil
            errorMessage = error.localizedDescription
        }
    }
}
