import Foundation

struct ProfileDraft {
    var name = ""
    var gender: Gender = .male
    var age = "28"
    var heightCm = "175"
    var weightKg = "70"
    var bodyFatPct = ""
    var activityLevel: ActivityLevel = .light
    var goal: Goal = .loseFat
    var allergens: Set<String> = []
    var vegetarian = false

    static let commonAllergens = ["蛋", "奶", "麸质", "大豆", "虾", "鱼", "坚果"]

    init(profile: UserProfile? = nil) {
        guard let profile else { return }
        name = profile.name
        gender = profile.gender
        age = String(profile.age)
        heightCm = String(Int(profile.heightCm))
        weightKg = String(Int(profile.weightKg))
        bodyFatPct = profile.bodyFatPct.map { String(Int($0)) } ?? ""
        activityLevel = profile.activityLevel
        goal = profile.goal
        allergens = Set(profile.allergens)
        vegetarian = profile.dietPreference == "vegetarian"
    }

    var isValid: Bool {
        !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
            (Int(age) ?? 0) >= 10 &&
            (Double(heightCm) ?? 0) >= 100 &&
            (Double(weightKg) ?? 0) >= 30
    }

    func payload() -> UserProfilePayload? {
        guard
            let age = Int(age),
            let heightCm = Double(heightCm),
            let weightKg = Double(weightKg)
        else {
            return nil
        }

        return UserProfilePayload(
            name: name.trimmingCharacters(in: .whitespacesAndNewlines),
            gender: gender,
            age: age,
            heightCm: heightCm,
            weightKg: weightKg,
            bodyFatPct: Double(bodyFatPct),
            activityLevel: activityLevel,
            goal: goal,
            allergens: allergens.sorted(),
            dislikedTags: [],
            dietPreference: vegetarian ? "vegetarian" : "normal"
        )
    }
}

@MainActor
final class OnboardingViewModel: ObservableObject {
    @Published var draft = ProfileDraft()
    @Published var isSubmitting = false
    @Published var errorMessage: String?

    func submit(using store: AppStore) async -> Bool {
        guard draft.isValid, let payload = draft.payload() else {
            errorMessage = "请完整填写姓名、年龄、身高、体重。"
            return false
        }

        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            let profile = try await store.makeClient().createProfile(payload)
            store.handleProfileSaved(profile)
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
