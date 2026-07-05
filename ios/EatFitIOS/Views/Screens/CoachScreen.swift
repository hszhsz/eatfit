import SwiftUI

struct CoachScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = CoachViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                CardSection(title: "提问上下文") {
                    Picker("关注点", selection: $viewModel.selectedFocus) {
                        ForEach(CoachFocus.allCases) { focus in
                            Text(focus.label).tag(focus)
                        }
                    }

                    TextEditor(text: $viewModel.input)
                        .frame(minHeight: 120)
                        .padding(8)
                        .background(Color(.tertiarySystemFill))
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    Button {
                        Task { await viewModel.requestAdvice(using: store) }
                    } label: {
                        if viewModel.isLoading {
                            ProgressView()
                                .frame(maxWidth: .infinity)
                        } else {
                            Text("生成 AI 建议")
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }

                if let response = viewModel.response {
                    HStack(spacing: 12) {
                        MetricCard(title: "执行评分", value: "\(response.score) / 100", tint: .green)
                        MetricCard(title: "建议类型", value: response.focus.label, tint: .orange)
                    }

                    CardSection(title: response.headline) {
                        Text(response.summary)
                    }

                    if !response.riskAlerts.isEmpty {
                        CardSection(title: "风险提醒") {
                            BulletList(items: response.riskAlerts)
                        }
                    }

                    if !response.nutritionInsights.isEmpty {
                        CardSection(title: "营养洞察") {
                            BulletList(items: response.nutritionInsights)
                        }
                    }

                    if !response.nextActions.isEmpty {
                        CardSection(title: "下一步行动") {
                            BulletList(items: response.nextActions)
                        }
                    }

                    if !response.mealStrategy.isEmpty {
                        CardSection(title: "下一餐策略") {
                            BulletList(items: response.mealStrategy)
                        }
                    }

                    Text(response.disclaimer)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
        .navigationTitle("AI 营养顾问")
        .task {
            await viewModel.load(using: store)
        }
    }
}
