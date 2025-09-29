---
title: "Creating a Blog using Hugo, Asciidoc, and Netlify"
author: Siva
images: ["/preview-images/hugo-blog-1.webp"]
type: post
draft: false
date: 2023-07-20T04:59:17+05:30
url: /creating-blog-using-hugo-asciidoc-netlify
categories: ["Blogging"]
tags: [Blogging]
description: In this tutorial, you will learn setting up a blog using Hugo, writing content using Markdown/Asciidoctor, and deploy on Netlify.
toc: true
---

In this tutorial, I will explain the process for setting up a blog 
using the static site generator [Hugo](https://gohugo.io/), writing content using **Markdown** 
and [Asciidoctor](https://docs.asciidoctor.org/), 
and deploy on [Netlify](https://www.netlify.com/).

<!--more-->


## Why should you have a blog?
For a software developer, having a well-maintained blog opens up a lot of opportunities.
First of all, you can write down your learnings and keep it as a quick reference for yourself.
But, having a blog with quality content brings lots of opportunities, such as:

* While writing a post on a topic, you tend to explore more to write accurate content, 
  which immensely helps you get more clarity on the subject.
* Well-known book publishers usually approach good bloggers to write books with them.
  If you are looking to write a book with an established publisher, this is a gateway.
* Your blog helps to create a good social profile. During interviews, 
  interviewers tend to explore your social presence and having a blog with good content 
  may help to already have a positive impression on you. 
  To be a good developer, you don't need to have a blog though :wink:
* You can share your knowledge by writing it down once and simply share the link instead of repeating yourself.

## Choose a blogging platform
There are a wide range of blogging platforms to choose from such as **Blogger**, **WordPress**, 
**Medium**, **hashnode** etc.
And there are **Static Site Generators** (SSG) like [Hugo](https://gohugo.io/), 
[Jekyll](https://jekyllrb.com/), [Gatsby](https://www.gatsbyjs.com/), etc 
using which you can generate your blog as static content and host it on 
[GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/), 
[Vercel](https://vercel.com/) etc.

Some of the reasons I prefer SSG and **Hugo** are:

* I like writing content in Markdown/Asciidoc, push it to Git repo workflow than using WYSIWYG editors.
* I want to own my content and ability to switch the hosting platform if needed.
* Hugo's installation is very simple and build speed is just amazing.

If you are good with frontend development, then tools like **Gatsby**, **Nextjs**, **VuePress** etc are also good choices.
But, I just prefer a working solution with minimal effort, and Hugo fits the bill perfectly.

In this post, I will explain step-by-step instructions on how you can create a blog and deploy it on Netlify.

{{< box info >}}
**Blog Code Repository:**
https://github.com/sivaprasadreddy/hugo-asciidoc-blog
{{< /box >}}

## Create a new blog using Hugo
Hugo has excellent [documentation](https://gohugo.io/documentation/), 
and we can simply follow the instructions to create a blog.

You can install hugo following your [OS specific instructions](https://gohugo.io/installation/).
In my case, I am using MacOS and I installed hugo using **brew**.

You can follow [QuickStart](https://gohugo.io/getting-started/quick-start/) instructions to create a blog.

```shell
$ brew install hugo
$ hugo new site hugo-blog
$ cd hugo-blog
```

You can choose any of the available [themes](https://themes.gohugo.io/).
We can add a theme to our blog either adding as a git submodule 
or simply downloading the theme as a zip, extract it and put it under **themes** folder.

Because of my prior experience with git submodules, I prefer to go with downloading the zip and add it manually :wink:

Let's use [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) theme for our blog.
Download the repo as a Zip, extract and copy code into **hugo-blog/themes/ananke** folder.

{{< box info >}}
**config.toml vs hugo.toml**

As of now, when you create a new site, the configuration file is created with name as **config.toml**.
But going forward, the [preferred](https://gohugo.io/getting-started/configuration/#hugotoml-vs-configtoml) name is **hugo.toml**.
So rename **config.toml** in the root folder to **hugo.toml** if you are using version 0.110.0 or higher.
{{< /box >}}

Next, add **`theme = "ananke"`** to **config.toml** file. 
Remember the theme name should match with your theme folder name under **hugo-blog/themes/**.

Now we are ready to add content to our blog.

### Add content(posts) using Markdown
The default and most commonly used format for writing content is Markdown.
So, let's start with creating a post using Markdown.

```shell
hugo new posts/my-first-post.md
```

This will create the file in the **/content/posts** directory. 
Open the file with your editor and update the content as follows:

```markdown
---
title: "My First Post"
date: 2023-07-20T09:03:20-08:00
draft: false
url: /my-first-post
---

Your blog post introduction goes here.

## Heading 1
content

## Show me the code

{{</* highlight java */>}}
class Hello {
    String hello() {
        return "Hello"
    }
}
{{</* /highlight */>}}


## Summary
post summary here
```

**Run the blog:**

You can start the hugo blog locally as follows:

```shell
# -D for drafts, -F for future date posts
hugo server -D -F
```
This usually starts the blog on http://localhost:1313/. 

You should be able to see the blog 
and navigate to the first post and see the code snippet with syntax highlighting too.

## Deploy on Netlify
Deploying your Hugo based blog on Netlify is fairly simple.
Create your account on Netlify if you don't have one and setup a Team.

First, create **netlify.toml** file in the root folder with the following content.

```toml
[build]
    publish = "public"
    command = "hugo"

[build.environment]
    HUGO_VERSION = "0.110.0"

[context.production.environment]
    HUGO_ENV = "production"

[context.deploy-preview]
    command = "hugo -D -F -b $DEPLOY_PRIME_URL/"

[context.branch-deploy]
    command = "hugo -D -F -b $DEPLOY_PRIME_URL/"
```

Then you can follow the instructions below to deploy your blog on Netlify.

* Navigate to Sites -> Add new site -> Import an existing project -> Deploy with GitHub
* Configure the Netlify app on GitHub -> Select repository
* Deploy your_repo_name

This will deploy your site with a random generated name.

You can customize the name in **Site configuration** -> **Change site name**

Then your blog should be available on https://sitename.netlify.app

## Using Asciidoc instead of Markdown
Markdown is good enough for most cases. 
But if you need a more powerful format, or you just prefer Asciidoc over Markdown 
then you can use the [Asciidoc format also](https://gohugo.io/content-management/formats/#list-of-content-formats) for writing content.

You can install **asciidoctor** following your [OS-specific instructions](https://docs.asciidoctor.org/asciidoctor/latest/install/).
Once installed, you should be able to run the command **asciidoctor --version** and see the version. 

Once **asciidoctor** is installed on your system, you can simply write content using **.adoc** files using asciidoctor syntax.

Create **content/posts/my-second-post.adoc** file with the following content:

```shell
---
title: "This is my second post"
date: 2023-07-20T09:39:58+05:30
draft: false
categories:
  - Java
tags:
  - java
  - spring-boot
---
:source-highlighter: rouge
:rouge-css: style
:rouge-style: thankful_eyes

In this guide, you will learn how to write HelloWorld program in Java.

== Prerequisites
* Java 17+
* Your favorite IDE (Intellij IDEA, Eclipse, NetBeans, VS Code)

== Say Hello in Java

Here is how to write code snippet using Asciidoc format.

[source,java]
----
class Hello {
    String hello() {
        return "Hello";
    }
}
----

== Summary
To learn more interesting things, visit https://www.sivalabs.in
```

In order to enable the execution of asciidoctor by Hugo, you need to configure the following in **config.toml** file:

```toml
[security.exec]
    allow = ['^asciidoctor$']
```

Now if you start your blog locally, you should be able to see the second post with syntax highlighting working.

### Adding Admonitions support
I really like Asciidoctor [Admonitions](https://docs.asciidoctor.org/asciidoc/latest/blocks/admonitions/) support to highlight some content as **NOTE, TIP, IMPORTANT, CAUTION, WARNING**.
We can configure Asciidoctor to use [FontAwesome](https://fontawesome.com/) to show Admonition icons.

In order to do that, we need to:

* Add FontAwesome CSS
* Add admonition css

Asciidoctor by default uses a [default stylesheet](https://docs.asciidoctor.org/asciidoctor/latest/html-backend/default-stylesheet/) which contains CSS styling classes for admonitions.
We can extract admonition styles into **adoc.css** file as follows:

```css
.admonitionblock > table {
    border-collapse: separate;
    border: 0;
    background: none;
    width: 100%
}

.admonitionblock > table td.icon {
    text-align: center;
    width: 80px
}

.admonitionblock > table td.icon img {
    max-width: none
}

.admonitionblock > table td.icon .title {
    font-weight: bold;
    font-family: "Open Sans", "DejaVu Sans", sans-serif;
    text-transform: uppercase;
    font-size: 2.0em;
}

.admonitionblock > table td.content {
    padding-left: 1.125em;
    padding-right: 1.25em;
    border-left: 1px solid #dddddf;
    color: rgba(0, 0, 0, .6)
}

.admonitionblock > table td.content > :last-child > :last-child {
    margin-bottom: 0
}

.admonitionblock td.icon [class^="fa icon-"] {
    font-size: 2.5em;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, .5);
    cursor: default
}

.admonitionblock td.icon .icon-note::before {
    content: "\f05a";
    color: #0066a1
}

.admonitionblock td.icon .icon-tip::before {
    content: "\f0eb";
    text-shadow: 1px 1px 2px rgba(155, 155, 0, .8);
    color: #111
}

.admonitionblock td.icon .icon-warning::before {
    content: "\f071";
    color: #bf6900
}

.admonitionblock td.icon .icon-caution::before {
    content: "\f06d";
    color: #bf3400
}

.admonitionblock td.icon .icon-important::before {
    content: "\f06a";
    color: #bf0000
}
```

For adding FontAwesome CSS, we can use CDN reference.

How to add additional CSS files to your blog depends on your theme.
You can directly add the **<link ..>** in **&lt;head&gt;** section in your theme partial files.
If your theme supports adding additional CSS files via configuration, you can use that approach.

In our case, **Ananke** theme [supports adding additional CSS files](https://github.com/theNewDynamic/gohugo-theme-ananke#custom-css) via configuration.

Let's put **adoc.css** file in **/assets/ananke/css/** folder and add the following configuration in **config.toml** file:

```toml
[params]
    custom_css = ["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", "adoc.css"]
```

Now you can specify asciidoctor attribute **:icons: font** and use admonitions in **my-second-post.adoc** file as follows:

```shell
---
title: "This is my first post"
date: 2023-07-20T09:39:58+05:30
draft: false
---
:source-highlighter: rouge
:rouge-css: style
:rouge-style: thankful_eyes
:icons: font

[NOTE]
====
This is a NOTE
====

[CAUTION]
====
This is a CAUTION
====

[WARNING]
====
This is a WARNING
====

[TIP]
====
This is a TIP
====

[IMPORTANT]
====
This is IMPORTANT
====
```

Now you should be able to see the nice icons as follows:

{{< figure src="/images/asciidoc-admonitions.webp" alt="asciidoc-admonitions" >}}


Instead of repeating the asciidoctor attributes in every post, we can configure them in **config.toml** as follows:

```toml
[markup]
    [markup.asciidocExt]
        [markup.asciidocExt.attributes]
            allow-uri-read = ""
            source-highlighter = "rouge"
            rouge-css = "style"
            rouge-style = "thankful_eyes"
            imagesdir = "/images"
            icons = "font"
```

Now you can remove the following asciidoctor attributes from **my-second-post.adoc** file.

```shell
:source-highlighter: rouge
:rouge-css: style
:rouge-style: thankful_eyes
:icons: font
```

### Including code snippets from remote locations
In addition to including the code snippets using asciidoctor syntax, 
we can also include code from remote code repository.

To use this feature, we need to configure the following in **config.toml** file:

```toml
[security.http]
    methods = ['(?i)GET|POST']
    urls = ['.*']
```

You can limit the urls to allow only certain URL patterns for security reasons.

Now, we can include code snippet from a remote file as follows:

```shell
[source,java]
----
include::https://raw.githubusercontent.com/sivaprasadreddy/techbuzz/main/techbuzz/src/main/java/com/sivalabs/techbuzz/TechBuzzApplication.java[]
----
```

You should be able to see the code snippet from remote repository.

## Configure Asciidoc support on Netlify
In order to support asciidoctor on Netlify, we need to create **Gemfile** to 
install **asciidoctor** and **rouge** gems as follows:

```ruby
source "https://rubygems.org"

gem 'asciidoctor', '~> 2.0', '>= 2.0.18'
gem "rouge"
```

Now run the following commands to create **Gemfile.lock** file.

```shell
$ gem install bundler
$ bundle install
```
This will help in using same versions in both local and on Netlify.

Now commit and push all the changes to GitHub and Netlify will automatically rebuild your site and deploy the changes.

{{< box info >}}
**Resources:**

**Blog Code Repository:**
https://github.com/sivaprasadreddy/hugo-asciidoc-blog

**Live Site:**  https://hugo-asciidoc-blog.netlify.app/
{{< /box >}}

## Summary
We have learned how to set up a blog using Hugo, Markdown/Asciidoctor and deploy it on Netlify.
We also explored a few asciidoctor configurations that will help in writing rich content.

I hope this helps. Happy blogging :smile: