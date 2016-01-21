---
author: siva
comments: true
date: 2015-10-13 02:05:05+00:00
layout: post
slug: how-to-ssh-into-virtualbox-linux-os
title: How to SSH into VirtualBox Linux OS?
wordpress_id: 139
categories:
- Linux
tags:
- Linux
- VirtualBox
---

While learning some of the Linux commands we may want to use SSH commands to login into a remote Linux system and we may not have a dedicated Linux system to play with.
In this post I will explain how I am using my Linux OS installed on VirtualBox to SSH from Windows OS.

[![virtualbox](http://sivalabs.in/wp-content/uploads/2015/10/virtualbox-300x149.jpg)](http://sivalabs.in/wp-content/uploads/2015/10/virtualbox.jpg)[   ![prompt](http://sivalabs.in/wp-content/uploads/2015/10/prompt.jpg)](http://sivalabs.in/wp-content/uploads/2015/10/prompt.jpg)

**1.** Install **openssh-server** on Linux OS in VirtualBox
`sudo apt-get install openssh-server`

On some Linux distros (ex: Fedora) the openssh server won't start automatically.

You can enable it to start automatically using the following command:

`systemctl enable sshd.service`

Now you can restart the VM or start the service in the current session itself using

`systemctl start sshd.service`

2. Shutdown your Linux VM if it is already running.
Select Linux VM in Virtualbox and go to **Settings** -> **Network**.
In **Adapter 1** tab **Enable Network Adapter** is selected.
Go to **Adapter 2** tab and check **Enable Network Adapter**.
For **Attached To** option select **Host-only Adapter** and click OK.

3. Start your VirtualBox Linux VM
Open Terminal and run **ifconfig** command
`eth1 Link encap:Ethernet HWaddr 08:00:27:7e:ea:89
inet addr:**192.168.56.101** Bcast:192.168.56.255 Mask:255.255.255.0
inet6 addr: fe80::a00:27ff:fe7e:ea89/64 Scope:Link`

Now from you Windows OS you can use Putty to connect to your Linux OS usinng SSH as follows:

`ssh username@192.168.56.101`

Enjoy :-)
