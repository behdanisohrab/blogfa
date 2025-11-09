+++
title = "فقط برای سرگرمی!"
date=1404-08-11

category = "فان"
[taxonomies]
tags = ["فان"]

[extra]
author="سهراب بهدانی"
+++

قرار بود امروز درمورد ساختار توزیع های گنو/لینوکسی و سیستم‌عامل گنو توی دانشگاه صحبت کنم. 

متاسفانه وقت نشد و ارائه من افتاد برای هفته بعدی... توی این پست از بلاگم می‌خوام صحبت کنم که چطور میشه یک توزیع مینیمال رو با ترکیب کرنل و بیزی‌باکس بیلد کرد.

<!-- more -->

## شروع به کار

خب برای شروع باید یک مشت پیش‌نیاز رو نصب کنیم.
روی دبیان بیسا باید این ها رو نصب کنید:
```bash
sudo apt install -y build-essential libncurses-dev libelf-dev libssl-dev qemu-system-x86
```

و روی آرچ بیسا باید اینارو نصب کنید:
```bash
sudo pacman -S bc base-devel git ncurses qemu-system-x86
```

و الان باید بریم برای دریافت سورس‌ها و شروع به کار.

## دریافت سورس‌ها
برای دریافت سورس کرنل می‌تونید از وبگاه [kernel.org](https://kernel.org) استفاده کنید. من اینجا از نسخه 6.17.7 استفاده کردم:

```bash
wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.17.7.tar.xz
tar -xvf linux-6.17.7.tar.xz
```

و برای بیزی‌باکس:

```bash
wget https://github.com/mirror/busybox/archive/refs/tags/1_36_0.tar.gz
tar -xvzf 1_36_0.tar.gz
```

## کامپایل کرنل

```bash
cd linux-6.17.7
make defconfig
make menuconfig
```

توی menuconfig باید چندتا چیز رو فعال کنید:
- General setup → Initial RAM filesystem support
- مطمئن بشید 64-bit kernel فعاله
- Device Drivers → Generic Driver Options → devtmpfs و Automount devtmpfs at /dev

بعدش کامپایل می‌کنیم:

```bash
make -j$(nproc) bzImage
cp arch/x86_64/boot/bzImage ../
cd ..
```

## کامپایل بیزی‌باکس

```bash
cd busybox-1_36_0
make menuconfig
```

توی Settings باید "Build static binary" رو فعال کنید.

```bash
make -j$(nproc)
make install
cd ..
```

> **نکته!**
> اگر در کامپایل و نصب بیزی‌باکس با خطای نتورک مواجه شدید کافیه برید و کلاً تیک تمامی بخش های مربوط به نتورک رو بردارید.


## ساخت Initramfs

```bash
mkdir initramfs
mkdir -p initramfs/{bin,sbin,etc,proc,sys,dev,usr/bin,usr/sbin}
cp -a busybox-1_36_0/_install/* ./initramfs/
```

حالا باید اسکریپت init رو بنویسیم:

```bash
cat > initramfs/init << 'EOF'
#!/bin/sh
mount -t devtmpfs devtmpfs /dev
mount -t proc none /proc
mount -t sysfs none /sys
cat <<!
Welcome to Micro Linux!
Boot took $(cut -d' ' -f1 /proc/uptime) seconds
!
exec /bin/sh
EOF
chmod +x initramfs/init
```

و در آخر آرشیو رو می‌سازیم:

```bash
cd initramfs
find . -print0 | cpio --null -ov --format=newc | gzip -9 > ../initramfs.cpio.gz
cd ..
```

## اجرا

```bash
qemu-system-x86_64 -kernel bzImage -initrd initramfs.cpio.gz -nographic -append "console=ttyS0"
```

برای خروج: Ctrl+A و بعد X

## جمع‌بندی

خب همین. یک لینوکس مینیمال با کرنل + بیزی‌باکس که توی چند ثانیه بوت میشه و کمتر از 10 مگ حجم داره. 

امیدوارم واسه ارائه هفته بعد وقت بشه و بتونم درمورد جزئیات بیشتری صحبت کنم.

<div>
<meta name="fediverse:creator" content="@sohrab@bsd.cafe">
</div>

{{ comments(id="115518749520668800") }}
