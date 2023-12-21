import SwiftUI
import WebKit
import Foundation

struct WallpaperRenderer: NSViewRepresentable {
    typealias NSViewType = WKWebView;
    
    
    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
    
    func makeNSView(context: Context) -> WKWebView {
        let webConfiguration = WKWebViewConfiguration()
        let webview = WKWebView(frame: .zero, configuration: webConfiguration)
        webview.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs");
        
        webview.isInspectable = true
        
        webview.navigationDelegate = context.coordinator
        
        Timer.scheduledTimer(withTimeInterval: 60, repeats: true, block: { _ in
            webview.reload()
        })
        
        return webview
    }
    
    func updateNSView(_ nsView: WKWebView, context: Context) {
        let urlpath = Bundle.main.path(forResource: "index", ofType: "html");
        
        if let urlstr = urlpath{
            let requesturl = URL(fileURLWithPath: urlstr)
            nsView.loadFileURL(requesturl, allowingReadAccessTo: requesturl)
        }
    }
    
    class Coordinator: NSObject, WKNavigationDelegate , WKDownloadDelegate{
        let parent: WallpaperRenderer
        
        init(parent: WallpaperRenderer) {
            self.parent = parent
        }
        
        
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, preferences: WKWebpagePreferences, decisionHandler: @escaping (WKNavigationActionPolicy, WKWebpagePreferences) -> Void) {
            if navigationAction.shouldPerformDownload {
                decisionHandler(.download, preferences)
            } else {
                decisionHandler(.allow, preferences)
            }
        }
        
        
        func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
            if navigationResponse.canShowMIMEType {
                decisionHandler(.allow)
            } else {
                decisionHandler(.download)
            }
        }
        
        
        func download(_ download: WKDownload, decideDestinationUsing
                      response: URLResponse, suggestedFilename: String,
                      completionHandler: @escaping (URL?) -> Void) {
            
            if let wallpaperURL = generateNewImageURL(){
                completionHandler(wallpaperURL)
            }
        }
        
        func downloadDidFinish(_ download: WKDownload) {
            applyWallpaper()
        }
        
        func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
            download.delegate = self
        }
        
    }
    
    
}

struct HTMLView_Previews: PreviewProvider {
    static var previews: some View {
        WallpaperRenderer()
    }
}
