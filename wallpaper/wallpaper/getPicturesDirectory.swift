import Foundation
func getPicturesDirectoryURL() -> URL? {
    return FileManager.default.urls(for: .picturesDirectory, in: .userDomainMask).first
}
