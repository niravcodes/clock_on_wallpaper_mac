import SwiftUI
import ServiceManagement

@main
struct wallpaperApp: App {
    init(){
        registerWallpaperApplier()
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            NSApp.hide(nil)
        }

    }
    var body: some Scene {
        WindowGroup {
            ContentView().frame(width:200, height:100)
        }
        .windowResizability(.contentSize)
        
        MenuBarExtra("wallpaperAppSettings", systemImage: "photo") {
            AppMenu()
        }
    }
    
}



struct AppMenu: View {
    @State var startAtLogin = SMAppService.mainApp.status == .enabled
    
    var body: some View {
        Toggle("Start on Login", isOn: $startAtLogin).onChange(of:startAtLogin){
            value in
            if value {
                do{
                    try SMAppService.mainApp.register()
                }
                catch{
                    print(error)
                }
            }
            else{
                do{
                    try SMAppService.mainApp.unregister()
                }catch{
                    print(error)
                }
            }
        }
        
        Button("Hide window") {
            NSApp.hide(nil)
        }
        Button("Show window") {
            NSApp.unhide(nil)
            NSApp.activate(ignoringOtherApps: true)
            NSApp.windows.first?.orderFrontRegardless()
        }
        
        Divider()
        
        Button("Quit") {
            NSApplication.shared.terminate(nil)
        }
        
    }
}
