---
title: Setting up Jenkins/SonarQube
author: Siva
type: post
date: 2015-12-16T14:42:29+00:00
url: /2015/12/setting-up-jenkinssonarqube/
post_views_count:
  - 29
categories:
  - Java
tags:
  - jcart

---
In this post we will setup **SonarQube** and **Jenkins** to perform code quality check and continuous integration.

&nbsp;

<img class="alignnone size-medium wp-image-624 aligncenter" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jenkins_logo.png?resize=300%2C96" alt="jenkins_logo" srcset="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jenkins_logo.png?resize=300%2C96 300w, https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jenkins_logo.png?w=398 398w" sizes="(max-width: 300px) 100vw, 300px" data-recalc-dims="1" /><img class="alignnone size-full wp-image-625 aligncenter" src="https://i0.wp.com/sivalabs.in/wp-content/uploads/2015/12/sonar.png?resize=150%2C36" alt="sonar" data-recalc-dims="1" />

### Install and configure SonarQube

There are many code quality checking tools like **PMD**, **Firebug** but **SonarQube** brings them all under one roof and gives better view of code quality.

Let us install and configure SonarQube for our JCart application.

Download SonarQube from <a href="http://www.sonarqube.org/downloads/" target="_blank">http://www.sonarqube.org/downloads/</a>.
  
Extract it run **sonarqube-5.2/bin/windows-x86-64/StartSonar.bat**.

By default SonarQube uses in-memory **H2** database to store all the metrics.
  
If we want to use MySQL we can configure **MySQL** jdbc parameters in **sonarqube-5.2/conf/sonar.properties**

sonar.jdbc.url=jdbc:mysql://localhost:3306/sonar
  
sonar.jdbc.username=root
  
sonar.jdbc.password=admin

### Configure SonarQube Maven Plugin

Let us configure sonarqube maven plugin in **jcart/pom.xml**

<pre class="brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;
	&lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
	&lt;groupId&gt;com.sivalabs&lt;/groupId&gt;
	&lt;artifactId&gt;jcart&lt;/artifactId&gt;
	&lt;version&gt;1.0&lt;/version&gt;
	&lt;packaging&gt;pom&lt;/packaging&gt;
	
	&lt;properties&gt;
		&lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
		&lt;maven.compiler.source&gt;1.8&lt;/maven.compiler.source&gt;
		&lt;maven.compiler.target&gt;1.8&lt;/maven.compiler.target&gt;		
		&lt;sonar.jdbc.url&gt;jdbc:mysql://localhost:3306/sonar&lt;/sonar.jdbc.url&gt;
      		&lt;sonar.jdbc.username&gt;root&lt;/sonar.jdbc.username&gt;
      		&lt;sonar.jdbc.password&gt;admin&lt;/sonar.jdbc.password&gt;
	&lt;/properties&gt;
	
	...
	...
	
	&lt;build&gt;
		&lt;plugins&gt;
			&lt;plugin&gt;
		       &lt;groupId&gt;org.codehaus.mojo&lt;/groupId&gt;
		       &lt;artifactId&gt;sonar-maven-plugin&lt;/artifactId&gt;
		       &lt;version&gt;2.7&lt;/version&gt;
		     &lt;/plugin&gt;
		&lt;/plugins&gt;
	&lt;/build&gt;
	
&lt;/project&gt;
</pre>

Now you can run maven goal **mvn sonar:sonar** which performs all the code quality checks and insert metrics into database.
  
Now go to http://localhost:9000/ and click on jcart project. From there you can explore lot of metrics like coding issues, duplicate code etc. You can see code quality issue details and fix the problem.

There are lot of things we can configure like tweaking the Quality Profiles to meet our project needs.
  
But we are not covering all that in this post now. May be a future post!

### Install and configure Jenkins

We will use Jenkins as continuous integration server for JCart.
  
Download Jenkins war from <a href="https://jenkins-ci.org/" target="_blank">https://jenkins-ci.org/</a> and run Jenkins as follows:

**java -jar jenkins.war**

Now you can go to http://localhost:8080/ and click on Manage Plugins.
  
Click on **Available** tab and search for **Git** in filter box then select &#8220;**Git plugin**&#8221; and &#8220;**Github plugin**&#8220;.
  
Click on **Install without restart**.

Once the installation is completed, go back to **Dashboard** and click on **Manage Jenkins** and go to **Configure System**.
  
In Configure System screen, configure **JDK**, **Maven** and **Git** path variables and click on **Save**.

Now let us configure a maven project build to build our JCart application.

First click on **New Item** menu, give **jcart** as Item name and select **Maven project** radio button.

Select **Git** for **Source Code Management** and give **https://github.com/sivaprasadreddy/jcart.git** for **Repository URL**

In **Build Triggers** section, select **Poll SCM** with **schedule** _H/15 \* \* \* \*_ (every fifteen minutes)

In **Build** section, enter **pom.xml** for **Root POM** and &#8220;**clean install**&#8221; for **Goals** **and options.**

We can configure Jenkins to perform Sonar code quality checks if the build is successful.
  
In **Post Steps** section, click on **Add post-build step** -> **Invoke top-level Maven targets**.
  
Select **Run only if build succeeds** and **sonar:sonar** as **Goals**.

Now click on **Save** to save our Jcart project build configuration. To test drive our build configuration click on **Build Now** and see the **console output**.

If we are hosting our code on **Github** we can configure Jenkins to trigger build whenever code change is pushed to repository instead of polling SCM periodically.

In jcart project build configuration screen, select **Github project** checkbox and enter **https://github.com/sivaprasadreddy/jcart.git/** as **Project url**.
  
In **Build Triggers** section, select **Build when a change is pushed to GitHub** checkbox.

In order to trigger Jenkins build when code is pushed to Github repository we need to configure Webhook.
  
Go to GitHub repository **Settings** tab, click on **Webhooks & services** -> **Add service** -> **Choose &#8220;Jenkins (GitHub plugin)**&#8220;.
  
Then fill in the Jenkins hook url with your jenkins url like this: **http://your\_jenkins\_url/github-webhook/**

<span style="color: #ff0000;">But giving jenkins url like http://localhost:8080/github-webhook/ won&#8217;t work (obviously!!) as it tries to resolve &#8220;localhost&#8221; from Github server.</span>

See <a href="http://stackoverflow.com/questions/30576881/jenkins-build-when-a-change-is-pushed-to-github-option-is-not-working?answertab=active#tab-top" target="_blank">http://stackoverflow.com/questions/30576881/jenkins-build-when-a-change-is-pushed-to-github-option-is-not-working?answertab=active#tab-top</a> for more details.

To simulate the behaviour of automatically triggering the build when code is pushed to Github, access the URL <a href="http://localhost:8080/git/notifyCommit?url=https://github.com/sivaprasadreddy/jcart.git" target="_blank">http://localhost:8080/git/notifyCommit?url=https://github.com/sivaprasadreddy/jcart.git</a> from your browser. It should trigger the build process in Jenkins.

> You can run Jenkins on OpenShift to fully automate the build process so that you can give OpneShift Jenkins URL in Github webhooks which GitHub can resolve.

Now that we have completed **Iteration-1**. Let&#8217;s get ready for **Iteration-2** 🙂