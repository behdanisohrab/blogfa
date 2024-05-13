 +++
title = "آموزش نصب و راه اندازی برنامه oblivion روی لینوکس"
description = "برای اینترنتی آزاد....."
date=2024-05-13
category = "پروکسی"
tags = ["پروکسی"]

[extra]
author="سهراب بهدانی"
+++

# برنامه Oblivion چی هستش؟

برنامه Oblivion دسترسی به اینترنت ایمن و بهینه را از طریق یک برنامه کاربرپسند Windows/Mac/Linux با استفاده از فناوری cloudflare warp فراهم می کند.

## چطور باید روی پارچ/آرچ نصبش کنیم؟

اول از همه شما نیاز دارید تا مخزنش رو کلون کنید:

```bash
mkdir oblivion && cd oblivion

git clone https://github.com/bepass-org/oblivion-desktop.git

cd oblivion-desktop
```

بعد از وارد شدن به مسیر لازم هستش که یک فایلی رو ویرایش کنیم تا نسخه‌های deb و rpm رو برامون نسازه.

فایل package.json رو با ادیتورتون بازش کنید.

خط ۲۲۸ که مربوط به بیلد نسخه لینوکس هستش رو پیدا کنید و از این:

```json
        "linux": {
            "target": [
                "rpm",
                "tar.xz",
                {
                    "target": "deb",
                    "arch": [
                        "arm64",
                        "x64"
                    ]
                }
            ],
```
به این:
```json
        "linux": {
            "target": [
                {
                    "target": "tar.xz",
                    "arch": [
                        "arm64",
                        "x64"
                    ]
                }
            ],
```

تغییرش بدید.

حالا میتونیم فرایند بیلد رو شروع کنیم.

## فرایند بیلد

برای شروع بیلد کافیه اول پیش‌نیاز های این برنامه رو نصب کنیم:

```bash
sudo pacman -S npm nodejs libxcrypt-compat
```

و همینطور یک پیش‌نیاز از aur داره که باید اون رو با aur-helper خودتون نصب کنید:

```bash
paru -S warp-plus-bin # if you are using paru

yay -S warp-plus-bin # if you are using yay
```

بعدش در مسیر سورس کد این دستورات رو بزنید:

```bash
npm install
npm run postinstall
npm run build
npm exec electron-builder -- --publish always
```

**نکته**:از اونجایی که ممکنه توی دریافت ماژول های npm به مشکل بخورید، حتما یک dns یا proxy فعال داشته باشید.

بعد از اینکه فرایند بیلد تموم بشه، وارد این مسیر بشید:

oblivion-desktop/release/build

و فایل tar.xz رو بر اساس معماری خودتون بردارید.

اگر از **لینوکس موبایل** استفاده می‌کنید باینری arm64 رو بردارید.

بعد از اون، میتونید فایل فشرده رو استخراج کنید و برنامه رو اجرا کنید.


اگر باگی در استفاده از برنامه پیدا کردید حتما در مخزن اون برنامه یک ایشو باز کنید.

https://github.com/bepass-org/oblivion-desktop
