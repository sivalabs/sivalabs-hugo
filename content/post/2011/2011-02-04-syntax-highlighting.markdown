---
author: siva
comments: true
date: 2011-02-04 06:08:00+00:00
layout: post
slug: syntax-highlighting
title: Syntax Highlighting
wordpress_id: 281
categories:
- Miscellaneous
tags:
- Miscellaneous
---

To enable syntax highlighting on blogspot follow the below steps.  
  
  
Go to Design --> EditHTML-->Edit Template section  
  
Add the following just before </head>  

    
    <!-- Add-in CSS for syntax highlighting -->
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shCore.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCpp.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCSharp.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushCss.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushDelphi.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushJava.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushJScript.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushPhp.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushPython.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushRuby.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushSql.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushVb.js' type='text/javascript'/>
    <br></br><script src='http://syntaxhighlighter.googlecode.com/svn/trunk/Scripts/shBrushXml.js' type='text/javascript'/>
    <br></br>

  
Add the following just before </body>  

    
    <!-- Add-in Script for syntax highlighting -->
    <br></br><script language='javascript'>
    <br></br>dp.SyntaxHighlighter.BloggerMode();
    <br></br>dp.SyntaxHighlighter.HighlightAll('code');
    <br></br></script>
    <br></br>

Add the <pre> tag surrounding the code snippets.  

    
    <pre class="xml" name="code">
    <br></br>Your XML goes here
    <br></br></pre>
    <br></br>
    <br></br>
    <br></br><pre class="java" name="code">
    <br></br>Your Java code goes here
    <br></br></pre>
    <br></br>
