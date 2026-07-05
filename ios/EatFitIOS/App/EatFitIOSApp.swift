import SwiftUI

@main
struct EatFitIOSApp: App {
    @StateObject private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .task {
                    await store.boot()
                }
        }
    }
}
