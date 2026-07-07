import SwiftUI

struct OnboardingScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = OnboardingViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("EatFit")
                        .font(.largeTitle.weight(.bold))
                    Text("录入你的身体数据后，系统会生成今日食谱、买菜清单和 AI 饮食建议。")
                        .foregroundStyle(.secondary)
                }

                ProfileFormView(draft: $viewModel.draft)

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }

                Button {
                    Task {
                        _ = await viewModel.submit(using: store)
                    }
                } label: {
                    if viewModel.isSubmitting {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("开始使用")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(viewModel.isSubmitting)
            }
            .padding()
        }
        .navigationBarBackButtonHidden(true)
    }
}
