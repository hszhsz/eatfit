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

                CardSection(title: "后端地址") {
                    TextField("http://127.0.0.1:8000", text: $store.baseURLString)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.URL)
                        .autocorrectionDisabled()
                    Text("iOS 模拟器默认可用 `127.0.0.1`；真机调试请改为电脑局域网 IP。")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                ProfileFormView(draft: $viewModel.draft)

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }

                Button {
                    store.updateBaseURL(store.baseURLString)
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
