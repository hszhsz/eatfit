import Foundation

@MainActor
final class ProfileViewModel: ObservableObject {
    @Published var draft = ProfileDraft()
    @Published private(set) var isLoading = false
    @Published private(set) var isSaving = false
    @Published var errorMessage: String?
    @Published var successMessage: String?

    func load(from store: AppStore) async {
        guard let cached = store.profile else {
            do {
                try await store.refreshProfile()
                if let profile = store.profile {
                    draft = ProfileDraft(profile: profile)
                }
            } catch {
                errorMessage = error.localizedDescription
            }
            return
        }
        draft = ProfileDraft(profile: cached)
    }

    func save(using store: AppStore) async -> Bool {
        guard let profileId = store.profileId else {
            errorMessage = "尚未创建档案。"
            return false
        }
        guard draft.isValid, let payload = draft.payload() else {
            errorMessage = "档案信息不完整。"
            return false
        }

        isSaving = true
        errorMessage = nil
        successMessage = nil
        defer { isSaving = false }

        do {
            let profile = try await store.makeClient().updateProfile(id: profileId, payload: payload)
            store.handleProfileSaved(profile)
            draft = ProfileDraft(profile: profile)
            successMessage = "档案已更新。"
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
