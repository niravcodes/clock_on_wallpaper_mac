import Foundation
import SwiftUI

var imageURL:URL? = nil;

extension String {
    static func shuffeld(length: Int, alphabet:String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") -> String {
        guard
            alphabet.count > 0
                && length > 0
        else { return "random" }
        return alphabet.shuffled().prefix(length).map {String($0)}.joined()
    }
}

func generateNewImageURL() -> URL?{
    if let imageURLa = imageURL {
        // Check if file exists
        if FileManager.default.fileExists(atPath: String(describing:imageURLa.path)) {
            do{
                try FileManager.default.removeItem(atPath:  String(describing:imageURLa.path) )
            }catch{print(error)}
        }
        else{print("no such file exists man")}
    }
    
    imageURL = getPicturesDirectoryURL()?.appendingPathComponent("\(String.shuffeld(length: 15)).png")
    return imageURL
}

func getImageURL() -> URL?{
    return imageURL;
}


func registerWallpaperApplier(){
    let mainQueue = OperationQueue.main
    NSWorkspace.shared.notificationCenter.addObserver(
        forName: NSWorkspace.activeSpaceDidChangeNotification,
        object: nil,
        queue: mainQueue
    ){(note) in
        applyWallpaper()
    }
}

func applyWallpaper(){
    if let imageURL = getImageURL() {
        do {
            for screen in NSScreen.screens {
                try NSWorkspace.shared.setDesktopImageURL(imageURL, for: screen, options: [:])
            }
        } catch {
            print("Caught an unexpected error: \(error)")
        }
    }
    
}
