---
layout: post
title: "Preventing secrets in repositories"
date: 2025-02-08 01:00:00 +0100
categories: programming security git
lang: sv
ref: preventingsecretsinrepositories
---
Working with application security is a never ending learning experience. I constantly learn from my peers and try to stay updated on recommended practices and behaviors. Naturally I also try to pay these lessons forward as well including speaking at conferences, user-groups and in client assignments.

One of the practices that I often talk about is to leverage technology to prevent bad human behaviors, and in that context the use of a password manager is something highly encouraged. I use a totally different password manager in my personal toolchain than in my professional, meaning I don't exposed each context to each other. The current password manager for personal use is [1password] which also has a [CLI] which is what I want to leverage and describe in this post.

Using the 1password CLI includes the possibility to inject secrets from the password manager into scripts or configuration files. And here is a cool trick which I leverage as often as possible.

When I need to use a credential in a script, such as a personal access token or similar, I add this credential to the password manager and make a note of the logical path to this secret. In 1password there's a notion of vaults which is an organizational collection of secrets, entries which is instances of secrets which in turn has one or several of properties.

When I then want to leverage this secrets property in a script I can use the CLI syntax to inject it, automatically authenticating against the password manager through the user interface. Here's a sample shell-script:

``` bash
param (
    [string]$repo = "http://github.com/"
)
$env:GITHUB_AUTH_TOKEN=op read op://private/GitHubPAT/token
./scorecard --repo=$repo
```

The actual line which does the magic should not come as a surprise, but it's this code:

``` bash
...
$env:GITHUB_AUTH_TOKEN=op read op://private/GitHubPAT/token
...
```

It tells the 1password CLI to authenticate me and read the property 'token' from the entry 'GitHubPAT' in the vault 'private'.

This code is even safe to commit to a source code repository since there's no actual secret included, and since I use 1password on several devices, synchronized, this means I also have access to this secret across devices, as long as I have all the requirements for the toolchain installed.

For me this is both more secure and easier to manage than manually moving the secret across devices. And since it's safe to commit to code, it could even be shared across teams if we would have had a shared vault which we individually authenticated against to get access to this secret.

[1password]: https://1password.com/
[CLI]: https://1password.com/downloads/command-line
