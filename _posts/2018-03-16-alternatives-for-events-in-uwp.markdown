---
layout: post
title:  "Alternatives for events in UWP apps built with C++"
date:   2018-03-16 00:00:00 +0100
categories: windows uwp english cplusplus
lang: en
ref: alternativesforeventsinuwp
---
There are some alternatives when subscribing to an event in an UWP application being built with C++.

Let's say I want to navigate with a WebView and trigger an action when the navigation has completed or failed. This means I can subscribe to the NavigationCompleted event as following with C++/CX:

```c++
using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::UI::Xaml::Controls;

...

mWebView = ref new WebView();

mWebView->NavigationCompleted += ref new TypedEventHandler<WebView^, WebViewNavigationCompletedEventArgs^>(
	this, &WebViewWrapper::OnNavigationCompleted
	);

...

void WebViewWrapper::OnNavigationCompleted(WebView^ sender, WebViewNavigationCompletedEventArgs^ args) {
	// Do work here
}
```

The main downside to this approach is that the code has to be encapsulated in a ref class, and I've been recommended to not create own ref classes, instead just use the framework provided ones.  

One solution to not creating ref classes is that I could potentially skip the named function (OnNavigationCompleted) and go for a lambda instead. However, this is usually not recommeded due to the fact that you have to care to avoid circular references. Here is a the example above leveraging lambda instead:

```c++
...
mWebView->NavigationCompleted += ref new TypedEventHandler<WebView^, WebViewNavigationCompletedEventArgs^>(
	[&](WebView^ sender, WebViewNavigationCompletedEventArgs^ args) {
        // Do work here
    });
```

An approach that I have been recommended though is to use the following approach instead:

```c++
...
mWebView->NavigationCompleted += ref new TypedEventHandler<WebView^, WebViewNavigationCompletedEventArgs^>(
	std::bind(&WebViewWrapper::OnNavigationCompleted, this, std::placeholders::_1, std::placeholders::_2)
    );

...

void WebViewWrapper::OnNavigationCompleted(WebView^ sender, WebViewNavigationCompletedEventArgs^ args) {
	// Do work here
}
```

All of the approaches above does require us to use C++/CX though but in a near future (well honestly now) with the leverage of CppWinRT we can write this code instead.

``` c++
using namespace winrt::Windows::Foundation;
using namespace winrt::Windows::UI::Xaml::Controls;

...

mWebView.NavigationCompleted(TypedEventHandler<WebView, WebViewNavigationCompletedEventArgs>(
	this, &WebViewWrapper::OnNavigationCompleted
	);

...

void WebViewWrapper::OnNavigationCompleted(WebView const & sender, WebViewNavigationCompletedEventArgs const & args) {
	// Do work here
}
```

Or if we still would like to go with the lambda version.

```c++
...
mWebView.NavigationCompleted([&](WebView const & sender, WebViewNavigationCompletedEventArgs const & args) {
        // Do work here
    });
```