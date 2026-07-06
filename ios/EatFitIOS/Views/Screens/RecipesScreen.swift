import SwiftUI

private enum RecipeFilter: String, CaseIterable, Identifiable {
    case all
    case breakfast
    case lunch
    case dinner
    case snack

    var id: String { rawValue }

    var title: String {
        switch self {
        case .all: return "全部"
        case .breakfast: return "早餐"
        case .lunch: return "午餐"
        case .dinner: return "晚餐"
        case .snack: return "加餐"
        }
    }

    var mealType: MealType? {
        switch self {
        case .all: return nil
        case .breakfast: return .breakfast
        case .lunch: return .lunch
        case .dinner: return .dinner
        case .snack: return .snack
        }
    }
}

struct RecipesScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = RecipesViewModel()
    @State private var filter: RecipeFilter = .all

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.recipes.isEmpty {
                ProgressView("正在加载食谱库...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let errorMessage = viewModel.errorMessage, viewModel.recipes.isEmpty {
                ErrorStateView(message: errorMessage) {
                    Task { await viewModel.load(using: store) }
                }
            } else {
                List(viewModel.recipes) { recipe in
                    NavigationLink {
                        RecipeDetailScreen(recipeID: recipe.id, initialRecipe: recipe)
                    } label: {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("\(recipe.imageEmoji) \(recipe.name)")
                                    .font(.headline)
                                Spacer()
                                Text(recipe.mealType.label)
                                    .font(.caption)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.accentColor.opacity(0.12))
                                    .clipShape(Capsule())
                            }
                            Text("\(recipe.calories.kcalText) · 蛋白 \(recipe.proteinG.gramText) · \(recipe.cookMinutes) 分钟")
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 6)
                    }
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle("食谱库")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Picker("餐别", selection: $filter) {
                        ForEach(RecipeFilter.allCases) { option in
                            Text(option.title).tag(option)
                        }
                    }
                } label: {
                    Label(filter.title, systemImage: "line.3.horizontal.decrease.circle")
                }
            }
        }
        .onChange(of: filter) { _, newValue in
            viewModel.selectedMealType = newValue.mealType
            Task { await viewModel.load(using: store) }
        }
        .task {
            if viewModel.recipes.isEmpty {
                viewModel.selectedMealType = filter.mealType
                await viewModel.load(using: store)
            }
        }
    }
}

// Extracted as separate view to help Swift type-checker
private struct RecipeStepsSection: View {
    let steps: [String]

    var body: some View {
        ForEach(steps.indices, id: \.self) { index in
            HStack(alignment: .top, spacing: 12) {
                Text("\(index + 1)")
                    .font(.headline)
                    .foregroundStyle(Color.accentColor)
                Text(steps[index])
            }
            .padding(.vertical, 4)
        }
    }
}

struct RecipeDetailScreen: View {
    @EnvironmentObject private var store: AppStore
    let recipeID: Int
    let initialRecipe: Recipe?

    @State private var recipe: Recipe?
    @State private var isLoading = false
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if isLoading && recipe == nil {
                ProgressView("正在加载食谱详情...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let errorMessage, recipe == nil {
                ErrorStateView(message: errorMessage) {
                    Task { await load() }
                }
            } else if let recipe {
                RecipeDetailContent(recipe: recipe)
            }
        }
        .navigationTitle("食谱详情")
        .task {
            if recipe == nil {
                recipe = initialRecipe
                await load()
            }
        }
    }

    @MainActor
    private func load() async {
        if recipe != nil { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            recipe = try await store.makeClient().getRecipe(id: recipeID)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

// Extracted as separate view to help Swift type-checker
private struct RecipeDetailContent: View {
    let recipe: Recipe

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 10) {
                    Text("\(recipe.imageEmoji) \(recipe.name)")
                        .font(.title2.weight(.semibold))
                    Text("\(recipe.mealType.label) · \(recipe.calories.kcalText) · \(recipe.cookMinutes) 分钟")
                        .foregroundStyle(.secondary)
                    HStack(spacing: 12) {
                        MetricCard(title: "蛋白", value: recipe.proteinG.gramText, tint: .blue)
                        MetricCard(title: "碳水", value: recipe.carbsG.gramText, tint: .purple)
                        MetricCard(title: "脂肪", value: recipe.fatG.gramText, tint: .pink)
                    }
                }
                .listRowInsets(EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16))
            }

            Section("食材") {
                ForEach(recipe.ingredients, id: \.self) { ingredient in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(ingredient.name)
                        Text("\(ingredient.amountG.gramText) · \(ingredient.category)")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Section("步骤") {
                RecipeStepsSection(steps: recipe.steps)
            }
        }
        .listStyle(.insetGrouped)
    }
}
