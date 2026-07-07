import SwiftUI

struct RootView: View {
    @EnvironmentObject private var store: AppStore

    var body: some View {
        Group {
            if store.isBootstrapping {
                ProgressView("正在加载 EatFit")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if store.profile == nil {
                NavigationStack {
                    OnboardingScreen()
                }
            } else {
                MainTabView()
            }
        }
    }
}

private struct MainTabView: View {
    var body: some View {
        TabView {
            NavigationStack {
                TodayScreen()
            }
            .tabItem {
                Label("今日", systemImage: "sun.max")
            }

            NavigationStack {
                RecipesScreen()
            }
            .tabItem {
                Label("食谱", systemImage: "fork.knife")
            }

            NavigationStack {
                GroceryScreen()
            }
            .tabItem {
                Label("买菜", systemImage: "cart")
            }

            NavigationStack {
                CoachScreen()
            }
            .tabItem {
                Label("AI顾问", systemImage: "sparkles")
            }

            NavigationStack {
                ProfileScreen()
            }
            .tabItem {
                Label("我的", systemImage: "person.circle")
            }
        }
    }
}
