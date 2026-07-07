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
            errorMessage = "尚未创建档案。"
            return
        }
        draft = ProfileDraft(profile: cached)
    }

    func save(using store: AppStore) async -> Bool {
        guard store.profile != nil else {
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

        // Save profile locally — no network call needed
        let existing = store.profile
        let profile = UserProfile(
            id: existing?.id ?? 0,
            name: payload.name,
            gender: payload.gender,
            age: payload.age,
            heightCm: payload.heightCm,
            weightKg: payload.weightKg,
            bodyFatPct: payload.bodyFatPct,
            activityLevel: payload.activityLevel,
            goal: payload.goal,
            allergens: payload.allergens,
            dislikedTags: payload.dislikedTags,
            dietPreference: payload.dietPreference,
            createdAt: existing?.createdAt
        )
        store.handleProfileSaved(profile)
        draft = ProfileDraft(profile: profile)
        successMessage = "档案已更新。"
        return true
    }
}
