---
title: My Development Environment Setup on Linux
author: Siva
type: post
date: 2015-10-13T02:07:05+00:00
url: /my-development-environment-setup-on-linux/
categories:
  - Linux
tags:
  - Linux
  - VirtualBox

---
As I mentioned in my previous post 
[Thinking of moving from Windows to Linux?]({{< relref "2015-10-13-thinking-of-moving-from-windows-to-linux.md" >}})
I am moving from Windows to Linux. Setting up my development environment is a bit tedious because I have to hunt down the applications and execute various commands to setup. So I thought of make a note of them in a post so that it will be easier for me next time.

I am using **Ubuntu/LinuxMint** system so I am using **apt-get** to install, if you are using **Fedora/CentOS** you can use **yum/dnf**.

The very first thing I do after installing Linux is updating the system and in case I am working on VirtualBox VM installing VirtualBox Guest Additions.

```sudo apt-get update```

```sudo apt-get install virtualbox-guest-dkms virtualbox-guest-x11```

**Setting up Java Development Environment**

Some Linux distros come with OpenJDK by default. You may want to remove OpenJDK first and install Oracle JDK.

`sudo apt-get purge openjdk-*`

`sudo add-apt-repository ppa:webupd8team/java`

`sudo apt-get update`

To install Java 7 `sudo apt-get install oracle-java7-installer`
  
To install Java 8 `sudo apt-get install oracle-java8-installer`

If you want to set **JAVA_HOME** environment variable for a particular user then you can add JAVA_HOME in **~/.bash_profile** or if you want to setup for all the users globally then you can add it to **/etc/profile** file.

`> vi ~/.bash_profile` or `vi /etc/profile`

Append the following to the file:

`export JAVA_HOME=/usr/lib/jvm/java-8-oracle`
  
`export PATH=$PATH:$JAVA_HOME/bin`

Now run `source ~/.bash_profile` or `source /etc/profile`

After installing JDK you may want to download your favorite IDE from the following locations:


<a href="http://www.eclipse.org/downloads/" target="_blank">http://www.eclipse.org/downloads/</a>
  
<a href="https://spring.io/tools/sts/all" target="_blank">https://spring.io/tools/sts/all</a>
  
<a href="http://tools.jboss.org/downloads/devstudio/index.html" target="_blank">http://tools.jboss.org/downloads/devstudio/index.html</a>
  
<a href="https://netbeans.org/downloads/" target="_blank">https://netbeans.org/downloads/</a>
  
<a href="https://www.jetbrains.com/idea/download/" target="_blank">https://www.jetbrains.com/idea/download/</a>

Most of the times I work with either **Tomcat** or **JBoss/Wildfly** servers. 
You can download them from the following locations:

<a href="https://tomcat.apache.org/download-80.cgi" target="_blank">https://tomcat.apache.org/download-80.cgi</a>
  
<a href="http://wildfly.org/downloads/" target="_blank">http://wildfly.org/downloads/</a>

To install build tools like **Ant** or **Maven**
  
`> sudo apt-get install ant`

`> sudo apt-get install maven`

We can install various softwares like **Groovy**, **Grails**, **Gradle** etc you can use **SDKMan** (<a href="http://sdkman.io/" target="_blank">http://sdkman.io/</a>) which was previously known as **GVM**.

```bash
curl -s http://get.sdkman.io | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version
sdk install groovy
sdk install grails
sdk install gradle
```

**Install MySQL server**
  
You can install MySQL server and MySQL Workbench from Ubuntu Software Center.

But if you prefer commandline installation

`> sudo apt-get install mysql-server`

`> sudo apt-get install mysql-workbench`

**Installing NodeJS**
  
Installing NodeJS become a little bit complicated because it is going through some changes(nodejs, nodejs-legacy, io.js etc).
 
You can install latest NodeJS using following commands:

```bash
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install nodejs
```

For further details refer https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager

**Install yeoman and generators**
  
Yeoman (<a href="http://yeoman.io/" target="_blank">http://yeoman.io/</a>) makes it easy to develop front-end applications by automating various tasks using bower, grunt or gulp.

Install yeoman `sudo npm install -g yo bower grunt-cli gulp`
  
**Install various generators**

```bash  
sudo npm install -g generator-webapp
sudo npm install -g generator-angular
sudo npm install -g generator-jhipster
sudo npm install -g generator-meanjs
sudo npm install -g cordova ionic
```

**Installing Ruby and RubyOnRails**
  
You may be using **Ruby** or tools that depends on Ruby like **OpenShift** commandline tools, **Jekyll** etc.

You can find the very detailed instructions on how to install Ruby/RubyOnRails at <a href="https://gorails.com/setup/ubuntu/15.04" target="_blank">https://gorails.com/setup/ubuntu/15.04</a>

Just for the sake of quick reference I am repeating the steps here:

```bash
sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev`

cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash`

rbenv install 2.2.3
rbenv global 2.2.3
ruby -v

echo "gem: --no-ri --no-rdoc" > ~/.gemrc
gem install bundler`

gem install rails -v 4.2.4

```

**Installing Jekyll**
  
Jekyll (<a href="https://jekyllrb.com" target="_blank">https://jekyllrb.com</a>) is a static site generator which you can use to generate your site and host it on github.

`> gem install jekyll`

**Test drive Jekyll**
  
`> jekyll new myblog
> cd myblog
> jekyll serve`

Hope these installation instructions helps!!

_Note: All the images belong to their respective owners._
