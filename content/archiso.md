+++
title = "پچ کردن آرچ ایزو برای پارچ"
date=1403-10-02
category = "پارچ‌"

[taxonomies]
tags = ["پارچ"]

+++

خب قبل از اینکه شروع کنم یک توضیحی بدم و بگم که آرچ ایزو چی هستش.

آرچ ایزو اسکریپتی هستش که توزیع آرچ باهاش از یک پروفایل بیلد میشه، قابلیت بیلد آرچ رو در قالب یک ایزو، تارفایل و حتی ایمیج هم داره.
<!-- more -->

# مشکل ما چی بود؟

خب ما توی پارچ از این اسکریپت استفاده می‌کردیم، این اسکریپت بعد از بیلد یک فانکشنی داشت که به فایل os-release که برای نشون دادن رلیز توزیع و توضیحات توزیع هست دوتا خط تحت عنوان image_id و image_version رو اضافه می‌کرد که به شکل زیر بودن:

```
IMAGE_ID=Parchlinux Plasma
IMAGE_VERSION=2024.07.31
```

این عملش باعث می‌شد تا کاربر موقعی که توزیع رو آپدیت می‌کنه، یا حتی می‌خواد کرنل جدید نصب کنه همچین خطایی رو توی پایانه ببینه:

```
error: plasma command not found
```

این خطا همینطور باعث می‌شد تا پروسه نصب systemd-boot با خطا مواجه بشه و باعث بشه که پارچ رو با استفاده از سیستم‌دی بوت در محیط زنده نشه نصب کرد.

## مشکل یابی و رفع

بعد از اندکی جست و جو و سورس‌خوانی به این نتیجه رسیدم که کل این مشکل مبارک از این فانکشن توی اسکریپت آرچ ایزو میاد:

```bash
    _os_release="$(realpath -- "${pacstrap_dir}/etc/os-release")"
    if [[ ! -e "${pacstrap_dir}/etc/os-release" && -e "${pacstrap_dir}/usr/lib/os-release" ]]; then
        _os_release="$(realpath -- "${pacstrap_dir}/usr/lib/os-release")"
    fi
    if [[ "${_os_release}" != "${pacstrap_dir}"* ]]; then
        _msg_warning "os-release file '${_os_release}' is outside of valid path."
    else
        [[ ! -e "${_os_release}" ]] || sed -i '/^IMAGE_ID=/d;/^IMAGE_VERSION=/d' "${_os_release}"
        printf 'IMAGE_ID=%s\nIMAGE_VERSION=%s\n' "${iso_name}" "${iso_version}" >>"${_os_release}"
    fi
```


که مجبور شدم از آرچ ایزو یک فورک بگیرم و این فانکشن رو حذفش کنم.

می‌تونید ویدئو کاملش رو از یوتوب یا پیرتوبم ببینید.

- [تماشا از یوتوب](https://youtu.be/rpIBNX8MlQo)

- [تماشا از پیرتوب](https://tubedu.org/w/5RDF8asrAKKCKGHXaBk1g3)


<div>
<meta name="fediverse:creator" content="@sohrab@bsd.cafe">
</div>
