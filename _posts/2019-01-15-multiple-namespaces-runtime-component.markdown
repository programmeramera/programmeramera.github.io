---
layout: post
title: "Multiple namespaces in Windows Runtime Component with C++/WinRT"
date: 2019-01-15 07:00:00 +0100
categories: programming cppwinrt uwp c++
lang: en
ref: multiplenamespaceswindowsruntimecomponentcppwinrt
---
When creating Windows Runtime Components with [C++/WinRT] I stumbled upon an interesting issue related to namespaces. The problem was that if the .DLL contains components defined in different namespaces, the compiler will generate multiple .winmd files. But when referencing the runtime component from a client project only the topmost (default) namespace is exposed meaning that we have to somehow merge the multiple .winmd files into a single one. 

There's naturally a tool for that included in the Windows 10 SDK but I failed to fix this properly, instead I turned to some of my contacts within Microsoft and especially the original creator of the C++/WinRT language projection of the Windows Runtime, [Kenny Kerr]. He in turn directed me to his colleague [Scott Jones] that provided the following excellent answer: 

This is by design since a lot of projects requires separate namespace winmds, but we can opt-in to have Visual Studio merge these files to a single one by adding the following line to the "Globals" property group in the runtime components .vcxproj file. 

```xml
<CppWinRTNamespaceMergeDepth>1</CppWinRTNamespaceMergeDepth>
```

By leveraging that, and rebuilding the project, everything works as expected and the separate namespaces are available in the client. 

[Kenny Kerr]: https://kennykerr.ca/
[Scott Jones]: https://github.com/Scottj1s
[C++/WinRT]: https://github.com/Microsoft/cppwinrt
