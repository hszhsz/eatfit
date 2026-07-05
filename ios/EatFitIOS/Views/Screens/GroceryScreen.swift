import SwiftUI

struct GroceryScreen: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var viewModel = GroceryViewModel()

    private var sortedGroups: [(String, [GroceryItem])] {
        viewModel.groceryList?.grouped
            .map { ($0.key, $0.value.sorted { $0.name < $1.name }) }
            .sorted { $0.0 < $1.0 } ?? []
    }

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.groceryList == nil {
                ProgressView("正在汇总买菜清单...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let errorMessage = viewModel.errorMessage, viewModel.groceryList == nil {
                ErrorStateView(message: errorMessage) {
                    Task { await viewModel.load(using: store) }
                }
            } else if let groceryList = viewModel.groceryList {
                List {
                    Section {
                        Text("共 \(groceryList.items.count) 项 · \(groceryList.date)")
                            .foregroundStyle(.secondary)
                    }

                    ForEach(sortedGroups, id: \.0) { category, items in
                        Section(category) {
                            ForEach(items) { item in
                                HStack {
                                    Text(item.name)
                                    Spacer()
                                    Text(item.totalAmountG.gramText)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                    }
                }
                .listStyle(.insetGrouped)
                .refreshable {
                    await viewModel.load(using: store)
                }
            }
        }
        .navigationTitle("买菜清单")
        .task {
            if viewModel.groceryList == nil {
                await viewModel.load(using: store)
            }
        }
    }
}
