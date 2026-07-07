import Foundation

enum Gender: String, CaseIterable, Codable, Identifiable {
    case male
    case female

    var id: String { rawValue }
    var label: String { self == .male ? "男" : "女" }
}

enum Goal: String, CaseIterable, Codable, Identifiable {
    case loseFat = "lose_fat"
    case maintain
    case gainMuscle = "gain_muscle"

    var id: String { rawValue }
    var label: String {
        switch self {
        case .loseFat: return "减脂"
        case .maintain: return "保持"
        case .gainMuscle: return "增肌"
        }
    }
}

enum ActivityLevel: String, CaseIterable, Codable, Identifiable {
    case sedentary
    case light
    case moderate
    case active
    case veryActive = "very_active"

    var id: String { rawValue }
    var label: String {
        switch self {
        case .sedentary: return "久坐"
        case .light: return "轻度"
        case .moderate: return "中度"
        case .active: return "高度"
        case .veryActive: return "极高"
        }
    }
}

enum MealType: String, CaseIterable, Codable, Hashable, Identifiable {
    case breakfast
    case lunch
    case dinner
    case snack

    var id: String { rawValue }
    var label: String {
        switch self {
        case .breakfast: return "早餐"
        case .lunch: return "午餐"
        case .dinner: return "晚餐"
        case .snack: return "加餐"
        }
    }
}

enum CoachFocus: String, CaseIterable, Codable, Identifiable {
    case dailyReview = "daily_review"
    case mealStrategy = "meal_strategy"
    case eatingOut = "eating_out"
    case cravings

    var id: String { rawValue }
    var label: String {
        switch self {
        case .dailyReview: return "今日复盘"
        case .mealStrategy: return "下一餐策略"
        case .eatingOut: return "外食选择"
        case .cravings: return "嘴馋管理"
        }
    }
}

struct UserProfile: Codable, Identifiable {
    let id: Int
    let name: String
    let gender: Gender
    let age: Int
    let heightCm: Double
    let weightKg: Double
    let bodyFatPct: Double?
    let activityLevel: ActivityLevel
    let goal: Goal
    let allergens: [String]
    let dislikedTags: [String]
    let dietPreference: String?
    let createdAt: String?
}

struct UserProfilePayload: Codable {
    var name: String
    var gender: Gender
    var age: Int
    var heightCm: Double
    var weightKg: Double
    var bodyFatPct: Double?
    var activityLevel: ActivityLevel
    var goal: Goal
    var allergens: [String]
    var dislikedTags: [String]
    var dietPreference: String?
}

struct NutritionTarget: Codable {
    let bmr: Double
    let tdee: Double
    let targetCalories: Double
    let proteinG: Double
    let carbsG: Double
    let fatG: Double
    let explanation: String
}

struct IngredientItem: Codable, Hashable {
    let name: String
    let amountG: Double
    let category: String
}

struct Recipe: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let mealType: MealType
    let calories: Double
    let proteinG: Double
    let carbsG: Double
    let fatG: Double
    let tags: [String]
    let allergens: [String]
    let cookMinutes: Int
    let ingredients: [IngredientItem]
    let steps: [String]
    let imageEmoji: String
}

struct MealItem: Codable, Hashable, Identifiable {
    var id: String { "\(mealType.rawValue)-\(recipe.id)" }
    let mealType: MealType
    let recipe: Recipe
}

struct DailyPlan: Codable {
    let date: String
    let profileId: Int
    let target: NutritionTarget
    let meals: [MealItem]
    let totalCalories: Double
    let totalProteinG: Double
    let totalCarbsG: Double
    let totalFatG: Double
}

struct GroceryItem: Codable, Hashable, Identifiable {
    var id: String { "\(category)-\(name)" }
    let name: String
    let totalAmountG: Double
    let category: String
}

struct GroceryList: Codable {
    let date: String
    let profileId: Int
    let items: [GroceryItem]
    let grouped: [String: [GroceryItem]]
}

struct CoachRequest: Codable {
    let message: String?
    let focus: CoachFocus
}

struct CoachResponse: Codable {
    let focus: CoachFocus
    let headline: String
    let summary: String
    let score: Int
    let riskAlerts: [String]
    let nutritionInsights: [String]
    let nextActions: [String]
    let mealStrategy: [String]
    let disclaimer: String
}

// MARK: - Web Request Bodies

struct WebTargetRequest: Codable {
    let profile: UserProfilePayload
}

struct WebPlanRequest: Codable {
    let profile: UserProfilePayload
    let date: String?
}

struct WebCoachAdviceRequest: Codable {
    let profile: UserProfilePayload
    let date: String?
    let request: CoachRequest
}

// MARK: - UserProfilePayload convenience

extension UserProfilePayload {
    init(from profile: UserProfile) {
        self.init(
            name: profile.name,
            gender: profile.gender,
            age: profile.age,
            heightCm: profile.heightCm,
            weightKg: profile.weightKg,
            bodyFatPct: profile.bodyFatPct,
            activityLevel: profile.activityLevel,
            goal: profile.goal,
            allergens: profile.allergens,
            dislikedTags: profile.dislikedTags,
            dietPreference: profile.dietPreference
        )
    }
}
