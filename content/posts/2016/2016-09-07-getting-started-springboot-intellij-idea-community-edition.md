---
title: Getting Started with SpringBoot in Intellij IDEA Community Edition
author: Siva
type: post
date: 2016-09-07T09:53:35+00:00
url: /getting-started-springboot-intellij-idea-community-edition/
categories:
  - IDE
  - Spring
tags:
  - IDE
  - SpringBoot

---
We can use **Intellij IDEA Community Edition** for working with **SpringBoot** applications as we don't need support for configuring servers like Tomcat, Wildlfy etc and can simply run the applications by running **main()** method.

However, there is no provision in Intellij IDEA Community Edition to create SpringBoot application directly, the way it supports in Ultimate Edition.

<!--more-->


We can go to http://start.spring.io/ and generate the project and then import into our IDE. But it would be nice to be able to create the SpringBoot project from IDE itself.

One simple alternative I found to circumvent this problem is by using **Project Template support in IntellijIDEA**.

For the first time you can create the SpringBoot project from http://start.spring.io/ and import it into Intellij IDE.
  
If you wish you can add any other starters that you commonly use, configure properties like JDBC parameters etc.

Now click on menu **Tools** -> **Save Project as Template**. Enter **Name** and **Description** for the template.

{{< figure src="/images/SBTemplate.webp" >}}

Once the template is created we can use that template while creating new projects.

Select **File** -> **New** -> **Project**.

{{< figure src="/images/NewProjDlg.webp" >}}

In the **New Project** Dialog, you can see **User-defined** section and when you click on **User-defined** you can see all the project templates we created.
  
Select the **SpringBootBasic** template we created earlier and provide the **project name** and click **Finish**.

Well, we won't get any fancy Spring support features like Ultimate Edition provides, but it will help us to get started quickly without requiring us to manually create Maven/Gradle project, configure <parent> etc etc.
  
Of course, it is not specific to SpringBoot only, we can create templates for any of our favorite tech stacks.

Happy coding 🙂
