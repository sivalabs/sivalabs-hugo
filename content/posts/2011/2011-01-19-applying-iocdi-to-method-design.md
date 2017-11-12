---
title: Applying IOC/DI to Method Design
author: Siva
type: post
date: 2011-01-19T10:21:00+00:00
url: /2011/01/applying-iocdi-to-method-design/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/01/applying-iocdi-to-method-design.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/7681387333813484057
post_views_count:
  - 5
categories:
  - Spring
tags:
  - Java
  - Spring

---
Eventhough IOC is a generic design pattern, with Spring framework IOC/DI pattern became more popular.  
We can find lot of definitions for IOC/DI over internet, but the underlying concept is same.  
&#8220;Instead of component is responsible for getting the required dependencies to perform a task, a container/factory should build the dependencies and inject the dependencies into the component. Then the component can perform the sole activity for which it is responsible. The component need not care about from where it got its dependencies. Then the components code will be much more cleaner and testable&#8221;.

Normally we use this principle to build and wire the services. We can also follow the same principle for method design which makes the methods testable.

Lets take a simple example of a DownloadServlet.  
Suppose there is a DownloadServlet which get the message as a request parameter and write it to a file and throw it to the user as an attachment.

<pre>public class FileDownloadServlet extends HttpServlet <br />{<br />&nbsp;&nbsp;&nbsp; public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException <br />&nbsp;&nbsp;&nbsp; {<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String message = request.getParameter("message");<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String filename = "message.txt";<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; FileWriter fw = new FileWriter();<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; fw.write(response, message, filename );&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <br />&nbsp;&nbsp;&nbsp; }<br />}<br /></pre>

<pre>public class FileWriter<br />{<br />&nbsp;&nbsp;&nbsp; public static void write(HttpServletResponse response, String message, String filename) throws IOException<br />&nbsp;&nbsp;&nbsp; {<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; response.setContentType("text/plain");<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; response.setHeader( "Content-Disposition", "attachment; filename="" + filename + """ );<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; ServletOutputStream outputStream = response.getOutputStream();<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; outputStream.write(message.getBytes());<br />&nbsp;&nbsp;&nbsp; }<br />}<br /></pre>

The above code works but it has some issues.  
a) The FileWriter is tied to ServletAPI and hence can&#8217;t be unit testable.  
b) FileWriter.write() method is doing additional tasks in addition to writing the content to output stream.  
&nbsp;&nbsp; If you look at FileWriter.write() method, it is supposed to write the text to the given output stream only.  
&nbsp;&nbsp; But here it is preparing the output stream, which is a dependency to the method, to perform its task.   
&nbsp;&nbsp; It seems same like creating DAO instance in Service class. But IOC says DAO instance should be injected into Service by some container/factory.  
&nbsp;&nbsp;   
Now let me refactor the FileDownloadServlet and FileWriter following IOC at method level.

<pre>public class FileDownloadServlet extends HttpServlet <br />{<br />&nbsp;&nbsp;&nbsp; public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException <br />&nbsp;&nbsp;&nbsp; {<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String message = request.getParameter("message");<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String filename = "message.txt";<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; FileWriter fw = new FileWriter();<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; response.setContentType("text/plain");<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; response.setHeader( "Content-Disposition", "attachment; filename="" + filename + """ );<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; OutputStream os = response.getOutputStream();<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; fw.write(os, message);&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <br />&nbsp;&nbsp;&nbsp; }<br /><br />}<br /></pre>

<pre>public class FileWriter<br />{<br />&nbsp;&nbsp;&nbsp; public static void write(OutputStream outputStream, String message) throws IOException<br />&nbsp;&nbsp;&nbsp; {<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; outputStream.write(message.getBytes());<br />&nbsp;&nbsp;&nbsp; }<br />}<br /></pre>

Here the OutputStream is injected to FileWriter.write() method by its caller(FileDownloadServlet). Now FileWriter.write() method need not bother about what type of file it is, what type of OutputStream it has to create. It will do its task only : writing content to output stream.

Now the FileWriter.write() method can be unit testable also.

<pre>public class FileWriterTest<br />{<br />&nbsp;&nbsp;&nbsp; public static void main(String[] args) throws Exception<br />&nbsp;&nbsp;&nbsp; {<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; OutputStream outputStream = new FileOutputStream(new File("c:/message.txt"));<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String message = "Hello World!!!!!!!!!!";&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; FileWriter.write(outputStream, message);<br />&nbsp;&nbsp;&nbsp; }<br />}<br /></pre>

So in addition to wire the services of a system, we can apply IOC/DI principle to design better unit testable API also.