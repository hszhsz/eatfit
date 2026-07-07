import Foundation

/// App-level configuration constants.
enum EatFitConfig {
    /// Production backend URL. Users no longer need to configure this manually.
    static let defaultBaseURL = "https://backend-auushsk3z-jackhes-projects-5ded530b.vercel.app"
}

@MainActor
final class AppStore: ObservableObject {
    @Published private(set) var profileId: Int?
    @Published private(set) var profile: UserProfile?
    @Published var baseURLString: String
    @Published private(set) var isBootstrapping = true

    private let profileIdKey = "eatfit.profile_id"
    private let profileJsonKey = "eatfit.profile_json"
    private let baseURLKey = "eatfit.base_url"

    init() {
        baseURLString = UserDefaults.standard.string(forKey: baseURLKey) ?? EatFitConfig.defaultBaseURL
        profileId = UserDefaults.standard.object(forKey: profileIdKey) as? Int
        loadStoredProfile()
    }

    func boot() async {
        defer { isBootstrapping = false }
        // Profile is loaded locally; no network fetch needed.
        // If there's no stored profile, the UI will show onboarding.
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
        saveProfileToUserDefaults(profile)
    }

    func clearSession() {
        profileId = nil
        profile = nil
        UserDefaults.standard.removeObject(forKey: profileIdKey)
        UserDefaults.standard.removeObject(forKey: profileJsonKey)
    }

    // MARK: - Local profile persistence

    private func loadStoredProfile() {
        guard let data = UserDefaults.standard.data(forKey: profileJsonKey) else { return }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        if let stored = try? decoder.decode(UserProfile.self, from: data) {
            profile = stored
        }
    }

    private func saveProfileToUserDefaults(_ profile: UserProfile) {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        if let data = try? encoder.encode(profile) {
            UserDefaults.standard.set(data, forKey: profileJsonKey)
        }
    }
}
