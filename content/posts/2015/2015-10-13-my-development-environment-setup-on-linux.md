---
title: My Development Environment Setup on Linux
author: Siva
type: post
date: 2015-10-13T02:07:05+00:00
url: /2015/10/my-development-environment-setup-on-linux/
post_views_count:
  - 14
categories:
  - Linux
tags:
  - Linux
  - VirtualBox

---
As I mentioned in my previous post <a href="http://sivalabs.in/thinking-of-moving-from-windows-to-linux/" target="_blank">Thinking of moving from Windows to Linux?</a> I am moving from Windows to Linux. Setting up my development environment is a bit tedious because I have to hunt down the applications and execute various commands to setup. So I thought of make a note of them in a post so that it will be easier for me next time.

I am using **Ubuntu/LinuxMint** system so I am using **apt-get** to install, if you are using **Fedora/CentOS** you can use **yum/dnf**.

The very first thing I do after installing Linux is updating the system and in case I am working on VirtualBox VM installing VirtualBox Guest Additions.

`sudo apt-get update<br />
sudo apt-get install virtualbox-guest-dkms virtualbox-guest-x11`

**Setting up Java Development Environment**

[
  
<img class="size-full wp-image-558 aligncenter" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/java.jpg?resize=120%2C90" alt="java" data-recalc-dims="1" />][1]

Some Linux distros come with OpenJDK by default. You may want to remove OpenJDK first and install Oracle JDK.

`sudo apt-get purge openjdk-*`

`sudo add-apt-repository ppa:webupd8team/java<br />
sudo apt-get update`

To install Java 7 `sudo apt-get install oracle-java7-installer`
  
To install Java 8 `sudo apt-get install oracle-java8-installer`

If you want to set **JAVA_HOME** environment variable for a particular user then you can add JAVA_HOME in **~/.bash_profile** or if you want to setup for all the users globally then you can add it to **/etc/profile** file.

`> vi ~/.bash_profile` or `vi /etc/profile`

Append the following to the file:

> export JAVA_HOME=/usr/lib/jvm/java-8-oracle
  
> export PATH=$PATH:$JAVA_HOME/bin

`> source ~/.bash_profile` or `source /etc/profile`

After installing JDK you may want to download your favorite IDE from the following locations:

&nbsp;

 <img class="alignnone size-full wp-image-561" src="https://i0.wp.com/sivalabs.in/wp-content/uploads/2015/12/netbeans0.png?resize=106%2C95" alt="netbeans0" data-recalc-dims="1" /> <img class="alignnone size-full wp-image-557" src="https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/12/intellijidea.png?resize=241%2C78" alt="intellijidea" data-recalc-dims="1" /> <img class="alignnone size-full wp-image-566" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/STS.png?resize=100%2C100" alt="STS" data-recalc-dims="1" /><img class="alignnone size-full wp-image-556" src="https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/12/eclipse-800x188.png?resize=207%2C49" alt="eclipse-800x188" data-recalc-dims="1" />

<a href="http://www.eclipse.org/downloads/" target="_blank">http://www.eclipse.org/downloads/</a>
  
<a href="https://spring.io/tools/sts/all" target="_blank">https://spring.io/tools/sts/all</a>
  
<a href="http://tools.jboss.org/downloads/devstudio/index.html" target="_blank">http://tools.jboss.org/downloads/devstudio/index.html</a>
  
<a href="https://netbeans.org/downloads/" target="_blank">https://netbeans.org/downloads/</a>
  
<a href="https://www.jetbrains.com/idea/download/" target="_blank">https://www.jetbrains.com/idea/download/</a>

Most of the times I work with either **Tomcat** or **JBoss/Wildfly** servers. You cand ownload them from the following locations:

[ <img class="alignnone size-medium wp-image-569" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/Wildfly_logo.png?resize=300%2C93" alt="Wildfly_logo" data-recalc-dims="1" /><img class="alignnone size-full wp-image-567" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/Tomcat-logo.png?resize=165%2C110" alt="Tomcat-logo" data-recalc-dims="1" />][2]

<a href="https://tomcat.apache.org/download-80.cgi" target="_blank">https://tomcat.apache.org/download-80.cgi</a>
  
<a href="http://wildfly.org/downloads/" target="_blank">http://wildfly.org/downloads/</a>

To install build tools like **Ant** or **Maven**
  
`> sudo apt-get install ant<br />
> sudo apt-get install maven`

We can install various softwares like **Groovy**, **Grails**, **Gradle** etc you can use **SDKMan** (<a href="http://sdkman.io/" target="_blank">http://sdkman.io/</a>) which was previously known as **GVM**.

[
  
<img class="size-full wp-image-565 aligncenter" src="https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/12/sdkman.png?resize=192%2C112" alt="sdkman" data-recalc-dims="1" />][3]

`> curl -s http://get.sdkman.io | bash<br />
> source "$HOME/.sdkman/bin/sdkman-init.sh"<br />
> sdk version<br />
> sdk install groovy<br />
> sdk install grails<br />
> sdk install gradle`

**Install MySQL server**
  
You can install MySQL server and MySQL Workbench from Ubuntu Software Center.

[
  
<img class="size-full wp-image-560 aligncenter" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/mysql.jpg?resize=262%2C96" alt="mysql" data-recalc-dims="1" />][4]

But if you prefer commandline installation

`> sudo apt-get install mysql-server<br />
> sudo apt-get install mysql-workbench`

**Installing NodeJS**
  
Installing NodeJS become a little bit complicated because it is going through some changes(nodejs, nodejs-legacy, io.js etc).

[
  
<img class="size-medium wp-image-562 aligncenter" src="https://i0.wp.com/sivalabs.in/wp-content/uploads/2015/12/nodejs-dark1.jpg?resize=300%2C128" alt="Basic RGB" data-recalc-dims="1" />][5]
  
You can install latest NodeJS using following commands:

`> sudo apt-get install curl<br />
> curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -<br />
> sudo apt-get install nodejs`

For further details refer `https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager`

**Install yeoman and generators**
  
Yeoman (<a href="http://yeoman.io/" target="_blank">http://yeoman.io/</a>) makes it easy to develop front-end applications by automating various tasks using bower, grunt or gulp.

[
  
<img class="size-full wp-image-570 aligncenter" src="https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/12/yeoman-logo.png?resize=182%2C158" alt="yeoman-logo" data-recalc-dims="1" />][6]

Install yeoman `sudo npm install -g yo bower grunt-cli gulp`
  
**Install various generators**
  
`> sudo npm install -g generator-webapp<br />
> sudo npm install -g generator-angular<br />
> sudo npm install -g generator-jhipster<br />
> sudo npm install -g generator-meanjs<br />
> sudo npm install -g cordova ionic`

**Installing Ruby and RubyOnRails**
  
You may be using **Ruby** or tools that depends on Ruby like **OpenShift** commandline tools, **Jekyll** etc.

[
  
<img class="size-full wp-image-564 aligncenter" src="https://i0.wp.com/sivalabs.in/wp-content/uploads/2015/12/ruby-on-rails.jpg?resize=149%2C149" alt="ruby-on-rails" data-recalc-dims="1" />][7]

You can find the very detailed instructions on how to install Ruby/RubyOnRails at <a href="https://gorails.com/setup/ubuntu/15.04" target="_blank">https://gorails.com/setup/ubuntu/15.04</a>

Just for the sake of quick reference I am repeating the steps here:

`> sudo apt-get update<br />
> sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev`

`> cd<br />
> git clone git://github.com/sstephenson/rbenv.git .rbenv<br />
> echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc<br />
> echo 'eval "$(rbenv init -)"' >> ~/.bashrc<br />
> exec $SHELL`

`> git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build<br />
> echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc<br />
> exec $SHELL`

`> git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash`

`> rbenv install 2.2.3<br />
> rbenv global 2.2.3<br />
> ruby -v`

`> echo "gem: --no-ri --no-rdoc" > ~/.gemrc<br />
> gem install bundler`

`> gem install rails -v 4.2.4`

**Installing Jekyll**
  
Jekyll (<a href="https://jekyllrb.com" target="_blank">https://jekyllrb.com</a>) is a static site generator which you can use to generate your site and host it on github.

[
  
<img class="size-medium wp-image-559 aligncenter" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jekyll.jpg?resize=300%2C169" alt="jekyll" data-recalc-dims="1" />][8]

`> gem install jekyll`

**Test drive Jekyll**
  
`> jekyll new myblog<br />
> cd myblog<br />
> jekyll serve`

Hope these installation instructions helps!!

_Note: All the images belong to their respective owners._

 [1]: http://sivalabs.in/wp-content/uploads/2015/10/java.jpg
 [2]: https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/10/Wildfly_logo.png
 [3]: http://sivalabs.in/wp-content/uploads/2015/10/sdkman.png
 [4]: http://sivalabs.in/wp-content/uploads/2015/10/mysql.jpg
 [5]: http://sivalabs.in/wp-content/uploads/2015/10/nodejs-dark1.jpg
 [6]: http://sivalabs.in/wp-content/uploads/2015/10/yeoman-logo.png
 [7]: http://sivalabs.in/wp-content/uploads/2015/10/ruby-on-rails.jpg
 [8]: http://sivalabs.in/wp-content/uploads/2015/10/jekyll.jpg