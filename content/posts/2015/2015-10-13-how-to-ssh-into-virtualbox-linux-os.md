---
title: How to SSH into VirtualBox Linux OS?
author: Siva
type: post
date: 2015-10-13T02:05:05+00:00
url: /2015/10/how-to-ssh-into-virtualbox-linux-os/
post_views_count:
  - 5
categories:
  - Linux
tags:
  - Linux
  - VirtualBox

---
While learning some of the Linux commands we may want to use SSH commands to login into a remote Linux system and we may not have a dedicated Linux system to play with.
  
In this post I will explain how I am using my Linux OS installed on VirtualBox to SSH from Windows OS.

[<img class="alignnone size-medium wp-image-135" src="https://i0.wp.com/sivalabs.in/wp-content/uploads/2015/10/virtualbox-300x149.jpg?resize=300%2C149" alt="virtualbox" data-recalc-dims="1" />][1][   <img class="alignnone  wp-image-128" src="https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/10/prompt.jpg?resize=148%2C148" alt="prompt" data-recalc-dims="1" />][2]

**1.** Install **openssh-server** on Linux OS in VirtualBox
  
`sudo apt-get install openssh-server`

On some Linux distros (ex: Fedora) the openssh server won&#8217;t start automatically.

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
  
`eth1 Link encap:Ethernet HWaddr 08:00:27:7e:ea:89<br />
inet addr:<strong><span style="color: #ff0000;">192.168.56.101</span></strong> Bcast:192.168.56.255 Mask:255.255.255.0<br />
inet6 addr: fe80::a00:27ff:fe7e:ea89/64 Scope:Link`

Now from you Windows OS you can use Putty to connect to your Linux OS usinng SSH as follows:

`ssh username@192.168.56.101`

Enjoy 🙂

 [1]: https://i1.wp.com/sivalabs.in/wp-content/uploads/2015/10/virtualbox.jpg
 [2]: http://sivalabs.in/wp-content/uploads/2015/10/prompt.jpg