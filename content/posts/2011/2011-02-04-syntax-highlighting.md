---
title: Syntax Highlighting
author: Siva
type: post
date: 2011-02-04T00:38:00+00:00
url: /2011/02/syntax-highlighting/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/02/syntax-highlighting.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/4291597417050798322
post_views_count:
  - 2
categories:
  - Misc
tags:
  - Miscellaneous

---
To enable syntax highlighting on blogspot follow the below steps.

Go to Design &#8211;> EditHTML&#8211;>Edit Template section

Add the following just before </head>

<pre>&lt;!-- Add-in CSS for syntax highlighting --&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shCore.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCpp.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCSharp.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCss.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushDelphi.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushJava.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushJScript.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushPhp.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushPython.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushRuby.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushSql.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushVb.js' type='text/javascript'/&gt;
<br />&lt;script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushXml.js' type='text/javascript'/&gt;
<br /></pre>

Add the following just before </body>

<pre>&lt;!-- Add-in Script for syntax highlighting --&gt;
<br />&lt;script language='javascript'&gt;
<br />dp.SyntaxHighlighter.BloggerMode();
<br />dp.SyntaxHighlighter.HighlightAll('code');
<br />&lt;/script&gt;
<br /></pre>

Add the <pre> tag surrounding the code snippets.

<pre>&lt;pre class="xml" name="code"&gt;
<br />Your XML goes here
<br />&lt;/pre&gt;
<br />
<br />
<br />&lt;pre class="java" name="code"&gt;
<br />Your Java code goes here
<br />&lt;/pre&gt;
<br /></pre>