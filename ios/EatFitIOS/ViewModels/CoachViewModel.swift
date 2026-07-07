import Foundation

@MainActor
final class CoachViewModel: ObservableObject {
    @Published var input = ""
    @Published var selectedFocus: CoachFocus = .dailyReview
    @Published private(set) var response: CoachResponse?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    func load(using store: AppStore, force: Bool = false) async {
        if response != nil && !force { return }
        await requestAdvice(using: store)
    }

    func requestAdvice(using store: AppStore) async {
        guard let profile = store.profile else {
            errorMessage = "尚未创建档案。"
            response = nil
            return
        }

        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let payload = UserProfilePayload(from: profile)
            response = try await store.makeClient().getCoachAdvice(
                profile: payload,
                request: CoachRequest(
                    message: input.trimmingCharacters(in: .whitespacesAndNewlines).nilIfEmpty,
                    focus: selectedFocus
                )
            )
        } catch {
            response = nil
            errorMessage = error.localizedDescription
        }
    }
}

private extension String {
    var nilIfEmpty: String? {
        isEmpty ? nil : self
    }
}
