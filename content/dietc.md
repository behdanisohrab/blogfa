+++
title = "کتابخانه diet c"
description = ""
date=1403-11-02
category = "معرفی"
[taxonomies]
tags = ["کتابخانه"]

[extra]
author="سهراب بهدانی"
+++

دیشب که بی‌خوابی به سرم زده بود توی اینترنت دنبال کتاب‌خانه‌های استاندارد C می‌گشتم، همونطور که شاید بدونید Glibc کتابخانه سی گنو و Musl libc کتابخانه ماسل هستند که بیشتر از همه اسمشونو شنیدید.

من دنبال یک راهی بودم تا یک باینری استاتیک (باینری که تمام وابستگی‌های مورد نیازش برای اجرا شدن در درون فایل اجرایی خودش قرار گرفته.) کم حجم درست کنم و با Diet Libc آشنا شدم.

از همین الان بگم که این پست طولانیه :)))

<!-- more -->

# کتابخانه Diet چی هستش؟

کتابخانه diet libc یک نسخه بهینه و کم‌حجم از کتابخانه استاندارد C (libc) است که هدف اصلی آن کاهش اندازه فایل‌های اجرایی و بهبود عملکرد در شرایط خاص است. این کتابخانه توسط Felix von Leitner طراحی شده و بیشتر برای محیط‌هایی که منابع محدود دارند، مانند سیستم‌های امبدد (Embedded Systems) یا دستگاه‌های کوچک، مناسب هستش.

## در مقایسه با کتابخانه گنو

خب بدون مقایسه که نمی‌شد واقعاً به سبک بودنش پی‌برد برای همین من چندتا برنامه ساده توی سی نوشتم که این رو با اون ها تست کنم.

### ماشین حساب

ساده ترین برنامه‌ای که میشه با یک زبان نوشت ماشین حساب هستش. ماشین حسابی که من در سی نوشتم با ۴ عمل اصلی هستش و کارایی خیلی ساده‌ای هم داره.
سورس کدش به این شکل هستش:
```c
#include <stdio.h>

int main() {
    char operator;
    double num1, num2, result;

    printf("Enter an operator (+, -, *, /): ");
    scanf("%c", &operator);

    printf("Enter two numbers: ");
    scanf("%lf %lf", &num1, &num2);

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 != 0) {
                result = num1 / num2;
            } else {
                printf("Error: Division by zero is not allowed.\n");
                return 1;
            }
            break;
        default:
            printf("Error: Invalid operator.\n");
            return 1;
    }

    printf("Result: %.2lf %c %.2lf = %.2lf\n", num1, operator, num2, result);

    return 0;
}
```


این ماشین حساب رو با gcc و diet gcc کامپایل کردم. فلگی که به gcc دادم به این شکل بود تا بهم یک باینری استاتیک بدون هیچ پیش نیازی بده:

```bash
gcc -static -o calculator calc.c
```
و با diet gcc هم به شکل ساده کامپایلش کردم:
```bash
diet gcc calc.c
```
که خروجی رو تحت عنوان a.out میده که بعداً می‌تونید تغییر نامش بدید یا همون اول از فلگ o- برای تنظیم خروجی استفاده کنید.

بعد با دستور ldd پیش‌نیاز هاشو برسی کردم تا ببینم به چه کتابخانه‌هایی نیاز داره که dietlibc به صورت کلی به شما باینری استاتیک رو فقط میده که خیلی خوبه.
```bash
 ~/test/diet/calc/# ldd calculator                                                                                                             
        not a dynamic executable

 ~/test/diet/calc/# ldd dietgcc                                                                                                              
 
        not a dynamic executable

```

از نظر حجمی هم که برسی کنیم کاملاً مشهوده که dietlibc حجم کمتری باینری خروجیش داره

```bash
 ~/test/diet/calc/# ls -la
 
total 924
drwxr-xr-x 2 sohi sohi   4096 Jan 21 11:41 .
drwxr-xr-x 5 sohi sohi   4096 Jan 21 11:41 ..
-rw-r--r-- 1 sohi sohi    895 Jan 21 00:48 calc.c
-rwxr-xr-x 1 sohi sohi 901736 Jan 21 00:47 calculator
-rwxr-xr-x 1 sohi sohi  25400 Jan 21 00:47 dietcalc
```
ماشین حسابی که با کتابخانه سی گنو بیلد شده بود حجمی حدود ۸۰۰ کیلوبایت و ماشین حسابی که با diet libc بیلد شده بود حجمی حدوداً ۳۰ کیلوبایت رو در بر داشت.

همینطور من این باینری هارو از نظر syscal با ابزار ``strace`` هم برسی کردم که خروجیش به این شکله:
این برای diet libc هستش
```bash
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
  0.00    0.000000           0         3           read
  0.00    0.000000           0         3           write
  0.00    0.000000           0         2           ioctl
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         1           arch_prctl
------ ----------- ----------- --------- --------- ----------------
100.00    0.000000           0        10           total
```

و این هم gnu libc
```bash
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 45.33    0.000034          17         2           read
 45.33    0.000034          11         3           write
  9.33    0.000007           7         1         1 lseek
  0.00    0.000000           0         2           fstat
  0.00    0.000000           0         1           mprotect
  0.00    0.000000           0         5           brk
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         1           arch_prctl
  0.00    0.000000           0         1           set_tid_address
  0.00    0.000000           0         1           readlinkat
  0.00    0.000000           0         1           set_robust_list
  0.00    0.000000           0         1           prlimit64
  0.00    0.000000           0         1           getrandom
  0.00    0.000000           0         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.000075           3        22         1 total
```

## آیا فقط ماشین حساب رو تست کردم؟
نه! من یک پوستهٔ (shell) و یک سرور http ساده هم نوشتم که اون‌ها رو هم برسی کنم با این کتابخانه، سورسشون رو داخل کدبرگ خودم از لینک زیر می‌تونید ببینید.

[مخزن کدبرگ](https://codeberg.org/sohrabbehdani/dietc-experiments)

<div>
<meta name="fediverse:creator" content="@sohrab@bsd.cafe">
</div>
