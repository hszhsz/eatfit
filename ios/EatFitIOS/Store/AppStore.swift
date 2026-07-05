import Foundation

@MainActor
final class AppStore: ObservableObject {
    @Published private(set) var profileId: Int?
    @Published private(set) var profile: UserProfile?
    @Published var baseURLString: String
    @Published private(set) var isBootstrapping = true

    private let profileIdKey = "eatfit.profile_id"
    private let baseURLKey = "eatfit.base_url"

    init() {
        baseURLString = UserDefaults.standard.string(forKey: baseURLKey) ?? "http://127.0.0.1:8000"
        profileId = UserDefaults.standard.object(forKey: profileIdKey) as? Int
    }

    func boot() async {
        defer { isBootstrapping = false }
        guard profileId != nil else { return }
        do {
            try await refreshProfile()
        } catch {
            profile = nil
        }
    }

    func makeClient() -> APIClient {
        APIClient(baseURLString: baseURLString.trimmingCharacters(in: .whitespacesAndNewlines))
    }

    func updateBaseURL(_ value: String) {
        let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
        baseURLString = trimmed
        UserDefaults.standard.set(trimmed, forKey: baseURLKey)
    }

    func handleProfileSaved(_ profile: UserProfile) {
        profileId = profile.id
        self.profile = profile
        UserDefaults.standard.set(profile.id, forKey: profileIdKey)
    }

    func refreshProfile() async throws {
        guard let profileId else { return }
        profile = try await makeClient().getProfile(id: profileId)
    }

    func clearSession() {
        profileId = nil
        profile = nil
        UserDefaults.standard.removeObject(forKey: profileIdKey)
    }
}
