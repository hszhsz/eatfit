import Foundation

@MainActor
final class TodayViewModel: ObservableObject {
    @Published private(set) var plan: DailyPlan?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    func load(using store: AppStore) async {
        guard let profile = store.profile else {
            errorMessage = "尚未创建档案。"
            plan = nil
            return
        }

        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let payload = UserProfilePayload(from: profile)
            plan = try await store.makeClient().getDailyPlan(profile: payload)
        } catch {
            plan = nil
            errorMessage = error.localizedDescription
        }
    }
}
