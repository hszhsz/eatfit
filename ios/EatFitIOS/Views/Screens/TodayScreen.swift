import SwiftUI

struct TodayScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = TodayViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.plan == nil {
                ProgressView("正在生成今日饮食方案...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let errorMessage = viewModel.errorMessage, viewModel.plan == nil {
                ErrorStateView(message: errorMessage) {
                    Task { await viewModel.load(using: store) }
                }
            } else if let plan = viewModel.plan {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("今日计划")
                                .font(.largeTitle.weight(.bold))
                            Text("\(store.profile?.name ?? "你") · \(plan.date)")
                                .foregroundStyle(.secondary)
                        }

                        HStack(spacing: 12) {
                            MetricCard(title: "目标热量", value: plan.target.targetCalories.kcalText, tint: .orange)
                            MetricCard(title: "实际计划", value: plan.totalCalories.kcalText, tint: .green)
                        }

                        HStack(spacing: 12) {
                            MetricCard(title: "蛋白质", value: plan.totalProteinG.gramText, tint: .blue)
                            MetricCard(title: "碳水", value: plan.totalCarbsG.gramText, tint: .purple)
                            MetricCard(title: "脂肪", value: plan.totalFatG.gramText, tint: .pink)
                        }

                        CardSection(title: "营养解释") {
                            Text(plan.target.explanation)
                                .foregroundStyle(.secondary)
                        }

                        CardSection(title: "今日餐单") {
                            VStack(spacing: 14) {
                                ForEach(plan.meals) { meal in
                                    NavigationLink {
                                        RecipeDetailScreen(recipeID: meal.recipe.id, initialRecipe: meal.recipe)
                                    } label: {
                                        VStack(alignment: .leading, spacing: 8) {
                                            HStack {
                                                Text(meal.mealType.label)
                                                    .font(.headline)
                                                Spacer()
                                                Text("\(meal.recipe.imageEmoji) \(meal.recipe.name)")
                                                    .foregroundStyle(.primary)
                                            }
                                            Text("\(meal.recipe.calories.kcalText) · 蛋白 \(meal.recipe.proteinG.gramText) · \(meal.recipe.cookMinutes) 分钟")
                                                .font(.subheadline)
                                                .foregroundStyle(.secondary)
                                        }
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .padding()
                                        .background(Color(.tertiarySystemFill))
                                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                    }
                    .padding()
                }
                .refreshable {
                    await viewModel.load(using: store)
                }
            }
        }
        .navigationTitle("今日")
        .task {
            if viewModel.plan == nil {
                await viewModel.load(using: store)
            }
        }
    }
}
