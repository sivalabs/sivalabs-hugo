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
If you face the **vt-x is disabled in the bios** error while trying to run Android emulator, here is the solution that worked for me.

#### Step 1: Enable Virtualization Technology in BIOS

Go to BIOS Setup and enable &#8220;Virtualization Technology&#8221; option.

**On my Lenovo laptop this option was already enabled, but still getting this error. I have disabled it and re-enabled it, then it is working.**

#### Step 2: Install HAXM Installer from Android SDK Manager

Start the Android SDK Manager, select **Extras -> Intel x86 Emulator Accelerator (HAXM Installer)** and install it.

![HAXM](/images/HAXM.webp)

#### Step 3: Install Intel's HAXM

Install Intel's HAXM by running the following installer.

**%SDK_LOCATION%\extras\intel\Hardware_Accelerated_Execution_Manager\intelhaxm-android.exe**

That's it. Now restart the system and hopefully you should be able to run the Android Emulator.
