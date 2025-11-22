+++
title = "توسعه برنامه برای گنو/لینوکس با استفاده از سی‌شارپ"
description = "پناه بر خدا! یعنی چطوری؟"
date=1404-09-02
category = "سی‌شارپ"
[taxonomies]
tags = ["سی‌شارپ", "جی‌تی‌کی"]

[extra]
author="سهراب بهدانی"
+++


توی این مقاله می‌خوام توضیح بدم که چطور با زبان‌هایی مثل سی‌شارپ میشه برای گنو/لینوکس برنامه بومی نوشت و از این رو سراغ یکی از کتاب‌خانه‌های مطرح گرافیکی برای این‌کار میریم.

<!-- more -->

## GirCore چیست؟

GirCore یک پروژه آزاد است که اتصال‌های سی‌شارپ رو برای کتابخانه‌های مبتنی بر GObject فراهم می‌کنه. این کتابخانه از پرونده‌های GIR استفاده می‌کنه تا به صورت خودکار پوشش‌های سی‌شارپ برای کتابخانه‌های گنوم مثل GTK4، Libadwaita، GLib و دیگر کتابخانه‌های محبوب تولید کنه.

با GirCore می‌تونید برنامه‌های گرافیکی مدرن با GTK4 بسازید، از Libadwaita برای طراحی واسط کاربری زیبا و مطابق با راهنماهای گنوم استفاده کنید و به تمام توانایی‌های بوم‌سازگان گنوم دسترسی داشته باشید، همه این‌ها با کد سی‌شارپ تمیز و خوانا.

## نصب و راه‌اندازی

### نصب دات‌نت SDK

اول از همه باید دات‌نت SDK و محیط اجرایی رو روی سیستم لینوکس خودتون نصب کنید. اگه از آرچ لینوکس یا مشتقات اون مثل پارچ استفاده می‌کنید، کافیه این دستور رو بزنید:

```bash
sudo pacman -S dotnet-runtime-8.0 dotnet-sdk-8.0 dotnet-targeting-pack-8.0
```

اگه از توزیع دیگه‌ای استفاده می‌کنید، می‌تونید از راهنماهای رسمی مایکروسافت کمک بگیرید.

> **توجه! توجه! توجه!**: آخرین نگارشی که از کتابخانه Gir.Core موجوده متاسفانه فقط با دات‌نت ۸ سازگاره و از این رو ما این نسخه رو استفاده می‌کنیم.

### ساخت پروژه جدید

حالا وقتشه که یک پروژه کنسول جدید بسازیم:

```bash
dotnet new console --framework net8.0
```

این دستور یک پروژه ساده کنسول با چارچوب دات‌نت ۸ براتون می‌سازه.

### اضافه کردن بسته‌های GirCore

حالا نوبت اضافه کردن بسته‌های مورد نیاز است. برای ساخت یک برنامه GTK4 با Libadwaita، باید چند بسته رو نصب کنیم:

```bash
dotnet add package GirCore.Gtk-4.0
dotnet add package GirCore.Adw-1
dotnet add package GirCore.Gio-2.0
dotnet add package GirCore.GObject-2.0
```

هر کدوم از این بسته‌ها اتصال‌های سی‌شارپ برای یکی از کتابخانه‌های گنوم رو فراهم می‌کنن. `Gtk-4.0` برای ساخت واسط کاربری، `Adw-1` برای استفاده از اجزای مدرن Libadwaita، `Gio` برای کار با سامانه پرونده و عملیات ورودی/خروجی، و `GObject` برای سامانه شی‌گرا پایه گنوم است.

## ساخت یک ماشین حساب ساده

بیایید با هم یک برنامه ماشین حساب کامل بسازیم تا ببینیم GirCore چطور کار می‌کنه. این ماشین حساب شامل تاریخچه محاسبات، واسط کاربری زیبا و تمام عملیات پایه ریاضی است.

### ساختار کلی برنامه

اول از همه باید کتابخانه‌های مورد نیاز رو وارد کنیم:

```csharp
using Gtk;
using Adw;
using GLib;
using Gio;
using System;
using System.Collections.Generic;
```

بعدش یک برنامه جدید از نوع Adwaita می‌سازیم. این برنامه همون نقطه شروع برنامه ماست:

```csharp
var app = Adw.Application.New("ir.sohrabbehdani.calculator", Gio.ApplicationFlags.FlagsNone);
```

این خط یک برنامه گنوم استاندارد با شناسه یگانه `ir.sohrabbehdani.calculator` می‌سازه. این شناسه به صورت معکوس نام دامنه نوشته میشه، دقیقاً مثل برنامه‌های اندروید.

### ساخت پنجره اصلی

حالا باید رویداد‌گیر برای زمانی که برنامه فعال میشه بنویسیم. داخل این رویداد‌گیر تمام واسط کاربری رو می‌سازیم:

```csharp
app.OnActivate += (sender, args) =>
{
    var window = Adw.ApplicationWindow.New((Adw.Application)sender);
    window.SetTitle("Calculator");
    window.SetDefaultSize(360, 600);
```

اینجا یک پنجره ApplicationWindow از Libadwaita می‌سازیم که به صورت خودکار سبک مدرن گنوم رو داره. عنوان پنجره رو "Calculator" و اندازه پیش‌گزیده رو ۳۶۰×۶۰۰ نقطه تنظیم کردیم.

### نوار سرصفحه و گزینگان

هر برنامه گنوم استاندارد یک نوار سرصفحه داره که شامل عنوان برنامه و دکمه‌های کنترلی است:

```csharp
var headerBar = Adw.HeaderBar.New();

var menuButton = MenuButton.New();
menuButton.SetIconName("open-menu-symbolic");
headerBar.PackEnd(menuButton);
```

یک دکمه گزینگان با نشانه استاندارد گنوم ساختیم و اون رو در سمت راست نوار سرصفحه قرار دادیم. حالا باید محتوای گزینگان رو بسازیم:

```csharp
var menu = Gio.Menu.New();
menu.Append("Clear History", "app.clear-history");
menu.Append("About Calculator", "app.about");
menuButton.SetMenuModel(menu);
```

این گزینگان دو گزینه داره: پاک کردن تاریخچه و درباره برنامه. هر گزینه به یک کنش مشخص وصله که بعداً تعریفش می‌کنیم.

### بخش تاریخچه محاسبات

یکی از ویژگی‌های جالب ماشین حساب ما نمایش تاریخچه محاسبات است. برای این کار از یک پنجره لغزشی استفاده می‌کنیم:

```csharp
var historyScroll = ScrolledWindow.New();
historyScroll.SetPolicy(PolicyType.Never, PolicyType.Automatic);
historyScroll.SetVexpand(true);
```

این پنجره لغزشی فقط به صورت عمودی لغزش داره و فضای عمودی موجود رو کاملاً پر می‌کنه. داخلش یک جعبه می‌سازیم که سبک کارت داره:

```csharp
var historyBox = Box.New(Orientation.Vertical, 0);
historyBox.AddCssClass("card");
```

رده CSS به نام "card" یک ظاهر کارت مانند با گوشه‌های گرد و سایه ملایم بهش می‌ده. بعد یک برچسب برای بخش تاریخچه اضافه می‌کنیم:

```csharp
var historyLabel = Label.New("History");
historyLabel.AddCssClass("title-4");
```

### نمایشگر ماشین حساب

نمایشگر ماشین حساب شامل دو بخش است: یک برچسب برای نمایش عملیات جاری و یک ورودی برای نمایش عدد فعلی:

```csharp
var operationLabel = Label.New("");
operationLabel.SetXalign(1);
operationLabel.AddCssClass("dim-label");
operationLabel.AddCssClass("title-3");

var display = Entry.New();
var buffer = display.GetBuffer();
buffer.SetText("0", 1);
display.SetAlignment(1f);
display.SetCanFocus(false);
display.AddCssClass("display-entry");
```

برچسب بالایی با سبک کم‌رنگ عملیات جاری رو نشون می‌ده، مثلاً "۵ +". ورودی پایینی که نمی‌شه روش کانون کرد، عدد فعلی رو نشون می‌ده. هر دو راست چین هستن تا مثل یک ماشین حساب واقعی باشن.

### مدیریت وضعیت

برای نگهداری وضعیت ماشین حساب، چند متغیر تعریف می‌کنیم:

```csharp
string current = "";
string previous = "";
string op = "";
bool resetDisplay = true;
var history = new List<string>();
```

`current` عدد فعلی رو نگه می‌داره، `previous` عدد قبلی رو، `op` عملگر فعلی (مثل + یا −) رو، `resetDisplay` مشخص می‌کنه آیا باید نمایشگر پاک بشه یا نه، و `history` فهرست تاریخچه محاسبات است.

### تابع‌های کمکی

چند تابع کمکی برای مدیریت نمایشگر و تاریخچه می‌نویسیم:

```csharp
void UpdateDisplay()
{
    var text = string.IsNullOrEmpty(current) ? "0" : current;
    buffer.SetText(text, text.Length);
}
```

این تابع محتوای نمایشگر رو با مقدار `current` یا "۰" اگه خالی باشه، به‌روز می‌کنه.

```csharp
void UpdateOperation()
{
    if (!string.IsNullOrEmpty(op) && !string.IsNullOrEmpty(previous))
    {
        operationLabel.SetText($"{previous} {op}");
    }
    else
    {
        operationLabel.SetText("");
    }
}
```

این تابع برچسب بالایی رو با عملیات جاری به‌روز می‌کنه.

```csharp
void AddHistory(string operation, string result)
{
    history.Add($"{operation} = {result}");
    
    var historyItem = Label.New($"{operation} = {result}");
    historyItem.SetXalign(0);
    historyContent.Append(historyItem);
    
    if (history.Count > 20)
    {
        history.RemoveAt(0);
    }
}
```

این تابع یک مورد جدید به تاریخچه اضافه می‌کنه و اگه تاریخچه بیشتر از ۲۰ مورد بشه، قدیمی‌ترین رو حذف می‌کنه.

### منطق ماشین حساب

حالا به قسمت اصلی می‌رسیم: منطق محاسبات.

```csharp
void NumberClicked(string digit)
{
    if (resetDisplay)
    {
        current = "";
        resetDisplay = false;
    }
    if (current.Length < 15)
    {
        current += digit;
        UpdateDisplay();
    }
}
```

وقتی کاربر روی یک عدد کلیک می‌کنه، اگه نمایشگر باید بازنشانی بشه، اول خالیش می‌کنیم. بعد اگه طول عدد کمتر از ۱۵ رقم باشه، رقم جدید رو اضافه می‌کنیم.

```csharp
void OperationClicked(string operation)
{
    if (!string.IsNullOrEmpty(current))
        previous = current;
    current = "";
    op = operation;
    resetDisplay = true;
    UpdateOperation();
}
```

وقتی کاربر روی یک عملگر کلیک می‌کنه، عدد فعلی رو به `previous` منتقل می‌کنیم و آماده می‌شیم عدد بعدی رو بگیریم.

```csharp
void EqualClicked()
{
    if (string.IsNullOrEmpty(previous) || string.IsNullOrEmpty(current)) return;
    
    if (!double.TryParse(previous, out double a) || !double.TryParse(current, out double b)) return;
    
    double result = op switch
    {
        "+" => a + b,
        "−" => a - b,
        "×" => a * b,
        "÷" => b != 0 ? a / b : double.NaN,
        _ => 0
    };
    
    var resultStr = result.ToString("G15");
    var operationStr = $"{previous} {op} {current}";
    
    AddHistory(operationStr, resultStr);
    
    current = resultStr;
    op = "";
    previous = "";
    resetDisplay = true;
    UpdateDisplay();
    UpdateOperation();
}
```

این تابع محاسبه اصلی رو انجام می‌ده. اول بررسی می‌کنه که هر دو عدد موجود باشن، بعد با استفاده از تطبیق الگو توی switch، عملیات مناسب رو انجام می‌ده. در آخر نتیجه رو به تاریخچه اضافه می‌کنه و وضعیت رو بازنشانی می‌کنه.

### ساخت صفحه کلید

حالا باید دکمه‌های ماشین حساب رو بسازیم. از یک جدول استفاده می‌کنیم که دکمه‌ها رو به صورت منظم چیده:

```csharp
var grid = Grid.New();
grid.SetRowSpacing(6);
grid.SetColumnSpacing(6);
grid.SetRowHomogeneous(true);
grid.SetColumnHomogeneous(true);
```

بعد یک آرایه از چندتایی‌ها می‌سازیم که اطلاعات هر دکمه رو داره:

```csharp
var buttons = new (string label, System.Action action, string style)[]
{
    ("C",  () => ClearClicked(),       "destructive-action"),
    ("⌫",  () => BackspaceClicked(),   ""),
    ("%",  () => { if (!string.IsNullOrEmpty(current)) current = (double.Parse(current) / 100).ToString("G15"); UpdateDisplay(); }, ""),
    ("÷",  () => OperationClicked("÷"), ""),
    // ... بقیه دکمه‌ها
    ("=",  () => EqualClicked(),       "suggested-action")
};
```

هر چندتایی شامل متن دکمه، تابعی که باید اجرا بشه، و رده CSS دلخواه است. دکمه "C" با سبک قرمز و دکمه "=" با سبک آبی نمایش داده میشن.

حالا دکمه‌ها رو می‌سازیم و به جدول اضافه می‌کنیم:

```csharp
int row = 0, col = 0;
for (int i = 0; i < buttons.Length; i++)
{
    var (label, action, style) = buttons[i];
    var btn = Button.NewWithLabel(label);
    btn.SetSizeRequest(-1, 56);
    
    if (!string.IsNullOrEmpty(style))
    {
        btn.AddCssClass(style);
    }
    else
    {
        btn.AddCssClass("flat");
    }
    
    btn.OnClicked += (s, e) => action();
    grid.Attach(btn, col, row, 1, 1);
    
    col++;
    if (col >= 4) { col = 0; row++; }
}
```

این حلقه تمام دکمه‌ها رو می‌سازه و به صورت ۴ ستونی چیدمانشون می‌کنه. هر دکمه ارتفاع ۵۶ نقطه داره و رویداد‌گیر مناسب بهش وصله.

### کنش‌های گزینگان

برای گزینه‌های گزینگان باید کنش‌هایی تعریف کنیم:

```csharp
clearHistoryAction.OnActivate += (s, e) => ClearHistory();

aboutAction.OnActivate += (s, e) =>
{
    var aboutWindow = Adw.AboutWindow.New();
    aboutWindow.SetTransientFor(window);
    aboutWindow.SetApplicationName("Calculator");
    aboutWindow.SetApplicationIcon("ir.sohrabbehdani.calculator");
    aboutWindow.SetVersion("1.0.0");
    aboutWindow.SetDeveloperName("Sohrab Behdani");
    aboutWindow.SetCopyright("© 2024 Sohrab Behdani");
    aboutWindow.SetLicenseType(License.Gpl30);
    aboutWindow.Present();
};
```

کنش اول تاریخچه رو پاک می‌کنه و کنش دوم پنجره درباره استاندارد گنوم رو نمایش می‌ده که شامل اطلاعات برنامه، نسخه، سازنده و پروانه است.

### سبک‌دهی با CSS

برای بهتر شدن ظاهر برنامه، یک CSS سفارشی اضافه می‌کنیم:

```csharp
var css = CssProvider.New();
var cssData = @"
    .display-entry {
        font-size: 36px;
        font-weight: 600;
        padding: 18px;
        min-height: 72px;
    }
    button {
        font-size: 18px;
        font-weight: 500;
        min-height: 56px;
    }
";
css.LoadFromData(cssData, cssData.Length);

var displayContext = display.GetDisplay();
if (displayContext != null)
{
    StyleContext.AddProviderForDisplay(displayContext, css, 800);
}
```

این CSS باعث میشه نمایشگر با قلم بزرگ‌تر و ضخیم‌تر نمایش داده بشه و دکمه‌ها هم اندازه و قلم مناسبی داشته باشن.

### جمع‌بندی و اجرا

در آخر همه چیز رو به هم وصل می‌کنیم و پنجره رو نمایش می‌دیم:

```csharp
var contentBox = Box.New(Orientation.Vertical, 0);
contentBox.Append(headerBar);
contentBox.Append(historyScroll);
contentBox.Append(displayBox);
contentBox.Append(buttonBox);

window.SetContent(contentBox);
window.Present();
```

و برنامه رو اجرا می‌کنیم:

```csharp
return app.RunWithSynchronizationContext(null);
```

### تصویری از برنامه‌ای که ایجاد کردیم:

[![Screenshot-20251123-003852.png](https://i.postimg.cc/Vv0LRYr8/Screenshot-20251123-003852.png)](https://postimg.cc/sGyrfC46)

## نکات مهم

یک نکته مهم در کار با GirCore اینه که باید دقت کنید فضاهای نام و نام رده‌ها دقیقاً مطابق با اسامی GTK هستن، فقط به سبک سی‌شارپ نوشته شدن. مثلاً `ApplicationWindow` در GTK میشه `Adw.ApplicationWindow` در GirCore.

یک نکته دیگه اینه که GirCore از سامانه اتصال خودکار استفاده می‌کنه، پس تمام واسط‌های برنامه‌نویسی GTK به صورت تقریباً یک‌به‌یک در سی‌شارپ موجوده. اگه بلد باشید با GTK کار کنید، یادگیری GirCore خیلی راحته.

## راهنماها و منابع بیشتر

برای یادگیری بیشتر و آشنایی کامل با GirCore، می‌تونید به راهنماهای رسمی GirCore در گیت‌هاب مراجعه کنید که شامل راهنماهای شروع سریع، نمونه‌های کامل و توضیحات واسط‌های برنامه‌نویسی است. نشانی انبار اصلی پروژه:

[https://github.com/gircore/gir.core](https://github.com/gircore/gir.core)

همچنین راهنماهای GTK و Libadwaita هم خیلی مفیده چون تقریباً تمام مفاهیم به همون شکل در GirCore پیاده‌سازی شدن. امیدوارم این نوشته براتون مفید بوده باشه و بتونید شروع به ساخت برنامه‌های گنو/لینوکسی با سی‌شارپ کنید.



<div>
<meta name="fediverse:creator" content="@sohrab@bsd.cafe">
</div>

