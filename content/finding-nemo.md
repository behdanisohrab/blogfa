+++
title = "در جستجوی نمو..."
description = "واقعا لینوکس موبایل کار ارزشمندیه؟"
date=2024-02-24
category = "لینوکس موبایل"
tags = ["لینوکس موبایل"]

[extra]
author="سهراب بهدانی"
+++

# لینوکس موبایل

یک ارائه داخل مشهدلاگ در همین رابطه داشتم که متاسفانه ضبط نشد و با خودم گفتم که بیام و همینو به صورت یک پست بلاگ دربیارم که بدرد همه بخوره و همیشه در دسترس باشه :)

## لینوکس موبایل یعنی چی اصلاً؟ مگه اندروید لینوکس نبود؟
میشه گفت اندروید یک سیستم عاملیه که از هسته لینوکس بهره می بره، فرقی هم که با یک توزیع گنو/لینوکسی عادی داره بیشتر توی کتابخونه c استفاده شده درش هستش. اندروید برخلاف یک توزیع گنو/لینوکسی عادی که از Gnu libc استفاده می‌کنه، از Bionic libc استفاده می‌کنه که همین باعث میشه که باینری هاش با باینری های یک توزیع لینوکسی معمولی ناسازگار باشه. اندروید، کاملاً آزاد نیست و قابلیت شخصی سازی چندانی رو نمیده و پشتیبانی کوتاه مدتی هم شما از oem دستگاهتون (شرکت سازنده) می‌گیرید.

## لینوکس موبایل چیه حالا؟

لینوکس موبایل ، در اصل یعنی امکان اجرای یک توزیع لینوکسی بر روی یک تلفن همراه اندرویدی با روش های مختلف که بهش می‌پردازیم.

### روش اول، (Middleware) میان افزار ها. (هالیوم و لیب هیبریس)

این دوتا چی هستن؟ هالیوم و لیب‌هیبریس دو Middleware هستن که میان و ارتباط بین توزیع لینوکسی و کرنل اندروید و سخت افزار رو فراهم می‌کنن. اکثر توزیع هایی که با این روش ساخته میشن پشتیبانی بالایی از سخت افزار دستگاه دارن که همین باعث میشه به گزینه معقولی تبدیل بشن ولی با یک ایراد. اون هم اینکه از **کرنل قدیمی اندروید** استفاده می‌کنن.
برای مثال: توزیع های اوبونتو تاچ، درویدیان و sailfish os

#### روش کار چطوریه؟

هالیوم روی کرنل نصب و کامپایل میشه و لیب هیبریس روی توزیع. زمانی که شما توی توزیع مثلاً چراغ قوه دستگاه رو روشن می‌کنید، درخواست با استفاده از libhybris به halium ارسال میشه و syscal کتابخونه Gnu Libc رو به Bionic Libc ترجمه می‌کنه که باعث میشه چراغ قوه دستگاهتون روشن بشه. جالب نیست ؟ :)

#### چرا میگم خوب نیست این روش؟

این روش اون آزادی عملی که شما توی یک توزیع لینوکسی انتظار دارین رو بهتون نمیده، کرنل قدیمیه و پشتیبانیش تموم شده و ممکنه به مشکلاتی بعدا از قبیل ناسازگاری ها بر بخورید.

(نمیشه یک فرانکشتاین ساخت و انتظار داشت درست کارکنه که 🤕)

### روش دوم، مینلاین کردن دستگاه (mainline)

#### این روش نحوه کارش چطوریه؟

این یکی روش برخلاف روش قبلی ، میاد و یک کرنل رو برای یک نوع پردازنده خاص مثلاً sdm845 که روی Xiaomi Pocophone F1 و Oneplus 6 استفاده شده رو با کتابخونه Gnu Libc آماده می‌کنه. این کرنلی که آماده میشه، کرنل قدیمی اندروید نیست و بهش کرنل mainline یا close to mainline میگن. الان که این پست داره نوشته میشه جدید ترین سری کرنل لینوکس 6x هستش و کرنل این دستگاه ها در نسخه 6.6.3 قرار داره.
این نوع روش دیگه مسخره بازیای روش قبلی رو نداره و حس و حال یک توزیع لینوکسی کاملاً واقعی رو بهتون میده :)

توزیع های موبیان، پست‌مارکت و کوپفر (در آینده هم پارچ) توزیع هایی هستن که به صورت مینلاین ساخته شدن.

#### مشکلاتش چیان؟

کرنل مینلاین از اونجایی که با هدف اوپن سورس بودن و آزاد بودن ساخته و پچ میشه، ممکنه کاملاً با سخت افزار شما سازگاری نداشته باشه. به عنوان مثال هنوز درایور دوربینی برای پوکوفون و وان پلاس ساخته نشده که بتونه قابل استفاده باشه.

پشتیبانی به شدت محدودتری داره نسبت به هالیوم و لیب‌هیبریس و فقط چند پردازنده خاص تونستن مینلاین بشن که اکثرشون هم snapdragon هستن.



## چرا به لینوکس موبایل نیاز داریم اصلاً؟

اندروید در چندسال اخیر با سیاست های گوگل تبدیل به یک سیستم عامل انحصاری شده، به طوری که سورس خام اندروید و برنامه هاش به صورت عادی غیرقابل استفاده هستن و رها شدن. اکثر شرکت های تولید کننده موبایل هم با سیاست هایی که دارن شمارو مجاب به این می کنن تا با عرضه یک نسخه جدید تر از دستگاهشون و پایان پشتیبانی از این دستگاهی که دارید اون دستگاه جدید تر رو بخرید و این چرخه ادامه دار تکرار میشه.

شرکت ها، پشتیبانی کوتاه مدتی رو از دستگاه ارائه میدن و حتی دیده شده که بعضی از شرکت ها از قصد، با یک آپدیت باعث میشن تا دستگاه شما کند بشه و شما یک دستگاه جدید تر بخرید. (برای اطلاعات بیشتر apple slowes iphones with each update رو جستجو کنید.)

لینوکس موبایل به صورتی هستش که ریش و قیچی دست خودتونه. خودتون تصمیم می‌گیرید که این سیستم عامل چه چیز هایی داشته باشه، چطور عمل کنه و چه کارهایی انجام بده. برخلاف اندروید و مشتقاتش که شرکت ها برای شما تصمیم می‌گیرن. در لینوکس موبایل هم حریم خصوصی شما بیشتر از اندروید حفظ میشه. (میدونم حرف کلیشه ای زیاد زدم ولی خب.. 🫣)



> در انتها هم باید ازتون تشکر کنم که وقت گذاشتید و بلاگ من رو خوندین :) سعی میکنم از این نوع محتوا ها بیشتر بنویسم .


*راستی تا یادم نرفته ، توی محتوای بلاگ از ایموجی استفاده کردم که یکم از خشکی دربیاد. امیدوارم جالب شده باشه توی خروجی.*
