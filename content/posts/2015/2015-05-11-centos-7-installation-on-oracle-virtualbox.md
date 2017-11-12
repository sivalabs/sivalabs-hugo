---
title: CentOS 7 Installation on Oracle Virtualbox
author: Siva
type: post
date: 2015-05-11T07:36:00+00:00
url: /2015/05/centos-7-installation-on-oracle-virtualbox/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2015/05/centos-7-installation-on-oracle.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/309953020154386722
post_views_count:
  - 7
categories:
  - Linux
tags:
  - Linux

---
I wanted to explore CentOS 7 Linux, so I installed it on my Oracle VirtualBox. Installation went smoothly ,but I had a hard time to install Virtualbox Guest Additions to get full screen. I thought of sharing the steps I performed so that it may be helpful for others.

After installing CentOS 7, before installing Virtualbox Guest Additions first thing we need to do is update system.  
 <span style="white-space: pre;"></span>**sudo yum update**

When I run this command I got the error &#8220;<span style="color: red;"><b>cannot find a valid baseurl for repo</b></span>&#8220;

After googling for sometime I figured that **the network card is <span style="color: red;">not </span>enabled by default** and I need to enable the baseUrl in some configuration file.

1) Edit **_/etc/sysconfig/network-scripts/ifcfg-eth0_** file and change **ONBOOT=no** to **ONBOOT=yes**  
Instead of **eth0** you may have a different file name. To know the right one, run the command &#8220;**ifconfig -a**&#8220;

2) Edited the file **_/etc/yum.repos.d/CentOS-Base.repo_** and uncomment **baseurl**.

[base]  
name=CentOS-$releasever &#8211; Base  
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os  
**_baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/_**  
gpgcheck=1  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

Source: <http://unix.stackexchange.com/questions/22924/how-can-i-fix-cannot-find-a-valid-baseurl-for-repo-errors-on-centos>

3) Install VirtualBox Guest Additions

 <span style="white-space: pre;"></span>sudo yum update  
 <span style="white-space: pre;"></span>sudo yum groupinstall &#8220;Development Tools&#8221;  
 <span style="white-space: pre;"></span>sudo yum install kernel-devel  
 <span style="white-space: pre;"></span>  
In Oracle Virtual Box menu, Devices -> Insert Guest Additions CD Image -> Run  
 <span style="white-space: pre;"></span>  
Source: <http://itekblog.com/centos-7-virtualbox-guest-additions-installation-centos-minimal/>