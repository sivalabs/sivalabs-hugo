---
title: How to fix “vt-x is disabled in the bios” error?
author: Siva
type: post
date: 2016-07-21T01:54:29+00:00
url: /2016/07/fix-vt-x-disabled-bios-error/
post_views_count:
  - 11
categories:
  - Tips
tags:
  - Android

---
If you face the <span style="color: #ff0000;"><strong>&#8220;vt-x is disabled in the bios&#8221;</strong></span> error while trying to run Android emulator, here is the solution that worked for me.

#### Step 1: Enable Virtualization Technology in BIOS

Go to BIOS Setup and enable &#8220;Virtualization Technology&#8221; option.

<span style="color: #993366;"><strong>On my Lenovo laptop this option was already enabled, but still getting this error. I have disabled it and re-enabled it, then it is working.</strong></span>

#### Step 2: Install HAXM Installer from Android SDK Manager

Start the Android SDK Manager, select **<span style="color: #993366;">Extras -> Intel x86 Emulator Accelerator (HAXM Installer)</span>** and install it.

<img class="alignnone size-medium" src="/images/HAXM.png" alt="HAXM"  />

#### Step 3: Install Intel&#8217;s HAXM

Install Intel&#8217;s HAXM by running the following installer.

<span style="color: #993366;">%SDK_LOCATION%\extras\intel\Hardware_Accelerated_Execution_Manager\intelhaxm-android.exe</span>

That&#8217;s it. Now restart the system and hopefully you should be able to run the Android Emulator.
