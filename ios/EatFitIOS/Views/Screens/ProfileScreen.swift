import SwiftUI

struct ProfileScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                CardSection(title: "服务地址") {
                    TextField("http://127.0.0.1:8000", text: $store.baseURLString)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.URL)
                        .autocorrectionDisabled()
                    Text("真机需要将地址改成电脑局域网 IP，修改后立即生效。")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                if let profile = store.profile {
                    HStack(spacing: 12) {
                        MetricCard(title: "目标", value: profile.goal.label, tint: .orange)
                        MetricCard(title: "活动", value: profile.activityLevel.label, tint: .blue)
                    }
                }

                ProfileFormView(draft: $viewModel.draft)

                if let successMessage = viewModel.successMessage {
                    Text(successMessage)
                        .foregroundStyle(.green)
                }

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }

                Button {
                    store.updateBaseURL(store.baseURLString)
                    Task {
                        _ = await viewModel.save(using: store)
                    }
                } label: {
                    if viewModel.isSaving {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("保存档案")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)

                Button("重新建档") {
                    store.clearSession()
                }
                .buttonStyle(.bordered)
            }
            .padding()
        }
        .navigationTitle("个人资料")
        .task {
            await viewModel.load(from: store)
        }
    }
}
