---
Title: Welcome to my new blog
Description: "This is my welcome post to my new Hugo based blog"
Url: posts/welcome-to-my-new-blog
date: 2015-06-12
Section: posts
Slug: welcome-to-my-new-blog
tags: ["welcome","blog","hugo"]
categories: ["Development", "VIM"]

---


Hey
This is my new blog created using Hugo and hosted on GitHub Pages.

{{< highlight java >}}
public class HelloWorld
{
	public static void main(String[] args)
	{
		System.out.println("Hello World!!");
	}
}
{{< /highlight >}}


{{< highlight html >}}
<section id="main">
  <div>
    <h1 id="title">{{ .Title }}</h1>
    {{ range .Data.Pages }}
      {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
{{< /highlight >}}