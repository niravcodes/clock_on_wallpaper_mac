import SwiftUI
import WebKit
import Foundation


struct ContentView: View {
    var body: some View {
        Button("hide"){
            NSApp.hide(nil)
        }
        WallpaperRenderer()
    }
}

#Preview {
    ContentView()
}
