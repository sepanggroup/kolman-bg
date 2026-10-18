export const ROBOT_CATEGORY = {
  id: 'robotics',
  name: 'Роботи за полагане на плочки',
  desc: 'Автоматизирани системи за нанасяне на лепило/разтвор, захващане, позициониране и прецизно полагане на подови плочки.'
};

export const ROBOT_PRODUCTS = [
  {
    id: 'partner-p900', category: 'robotics', name: 'Partner Robotics P900 — Floor Tile Paving Robot', model: 'P900',
    eyebrow: 'PARTNER ROBOTICS · FLOOR TILE PAVING',
    blurb: 'Професионален робот за автоматизирано полагане на подови плочки с автономно движение, прецизно позициониране и управление от таблет.',
    description: 'P900 е индустриална система за автоматизирано полагане на подови плочки при големи и повтаряеми строителни площи. Роботът използва самоходно шаси, роботизирана ръка и система за позициониране, за да взема, подава и поставя плочките с контролиран работен цикъл. Подходящ е за професионални обекти, при които постоянството, скоростта и намаляването на физическото натоварване на екипа са важни.',
    priceKnown: true, price: 98000, priceCurrency: 'EUR', priceType: 'market-reference',
    priceNote: 'Продажна цена: 98 000 €; финалната оферта и условията за доставка се потвърждават преди поръчка.', priceSource: 'SEPANG GROUP',
    referenceUrl: 'https://www.partnerrobotics.com/pages/floor-tile-paving-robot',
    imageUrl: 'https://sourcing-media.hktdc.com/original-file/914112943bb541e3ab2ac4cbbbe1c9ea?bucket=PUBLIC_ACCESS_MEDIA_BUCKET_550',
    imageSource: 'HKTDC public product image',
    specs: ['Размери: 1300×800×1950 mm', 'Тегло: 640 kg', 'Payload: 30 kg', 'Автономност: над 6 часа', 'Производителност: до 18 m²/h', 'AC220V', 'Плочки: 300×300 до 600×1200 mm']
  },
  {
    id: 'fangshi-ceramic-tile-robot', category: 'robotics', name: 'Fangshi Ceramic Floor Tile Laying Robot', model: 'Ceramic Floor Tile Laying Robot',
    eyebrow: 'FANGSHI ROBOTICS · CERAMIC TILE',
    blurb: 'Самоходна роботизирана система за тънкослойно полагане на керамични плочки с автоматизирано подаване на лепило и позициониране.',
    description: 'Fangshi Ceramic Floor Tile Laying Robot е разработен за големи повтаряеми площи с керамични и порцеланови плочки. Системата комбинира роботизирана ръка, самоходно шаси, автоматично позициониране и управление на лепилото в един работен процес. Производителят посочва приложение при обществени и търговски сгради, промишлени обекти, транспортна инфраструктура и големи интериорни пространства.',
    priceKnown: false, price: null, priceCurrency: 'USD', priceType: 'quote',
    priceNote: 'Цена при запитване; конкретната конфигурация и условията се потвърждават преди офериране.', priceSource: 'Fangshi Robotics',
    referenceUrl: 'https://en.fangshitech.com/page/82/18.html', officialUrl: 'https://en.fangshitech.com/page/17/18.html',
    imageUrl: 'https://en.fangshitech.com/upload/image/20260522/2195f5ee047701b4e5bd15f4abe55677.png', imageSource: 'Fangshi official product image',
    specs: ['Тегло: 750 kg', 'Плочки: 800×800 / 600×1200 / 750×1500 mm', 'Точност на фугата: ±0,5 mm', 'Разлика във височината: ±0,5 mm', 'Производителност: до 120 m²/ден', 'Захранване: 48 VDC', 'Автономност: 6 h']
  },
  {
    id: 'fangshi-stone-tile-robot', category: 'robotics', name: 'Fangshi Stone Tile Laying Robot', model: 'Stone Tile Laying Robot',
    eyebrow: 'FANGSHI ROBOTICS · NATURAL STONE',
    blurb: 'Тежкотоварна система за мрамор, гранит и други каменни плочи с автоматично разстилане на сух разтвор, back-coating и прецизно полагане.',
    description: 'Stone Tile Laying Robot е предназначен за естествен камък и голям формат, когато теглото на плочата и сложността на монтажния процес изискват механизирано решение. Роботът автоматизира разстилането на сух разтвор, нанасянето на циментова суспензия или лепило върху гърба на плочата и последващото позициониране. Подходящ е за летища, гари, обществени пространства, болници, хотели и големи търговски обекти.',
    priceKnown: false, price: null, priceCurrency: 'USD', priceType: 'quote',
    priceNote: 'Цена при запитване; необходима е проверка на конкретната конфигурация.', priceSource: 'Fangshi Robotics',
    referenceUrl: 'https://www.fsarchirobot.com/products/stone-tile-laying-robot.html',
    imageUrl: 'https://en.fangshitech.com/upload/image/20260522/a9e5e36fc56df335f1905eebc7354f05.png', imageSource: 'Fangshi official product image',
    specs: ['Тегло: 745 kg', 'Номинална мощност: 8,9 kW', 'Макс. тегло на плоча: 120 kg', 'Резервоар: 56 L', 'Работно време: 6 h', 'Височина на строителство: 4,5 m', '7-DOF роботизирана ръка']
  },
  {
    id: 'zhuling-tlr', category: 'robotics', name: 'Zhuling TLR — Tile Laying Robot', model: 'TLR',
    eyebrow: 'ZHULING TECHNOLOGY · TLR',
    blurb: 'Интелигентен робот за площи над 30 m², който интегрира нанасяне на лепило, позициониране и полагане на плочки.',
    description: 'Zhuling TLR съчетава лазерна SLAM навигация, омнидирекционно шаси, система за глобално нивелиране и визуално измерване на фугата. Роботът автоматизира нанасянето на лепилото и полагането на плочките и използва разпределена вибрация за подобряване на контакта с основата. Предназначен е за хотели, търговски и обществени сгради, транспортни възли, училища и болници.',
    priceKnown: false, price: null, priceCurrency: 'USD', priceType: 'quote',
    priceNote: 'Цена при запитване; производителят публикува технически параметри, но не и фиксирана публична цена.', priceSource: 'Nanjing Zhuling Technology',
    referenceUrl: 'https://www.coboticz.com/en/col.jsp?id=118',
    imageUrl: 'https://32786180.s21i.faiusr.com/4/ABUIABAEGAAg3OCRuQYowuvHxAMwtgM4pgM.png', imageSource: 'Zhuling public product image',
    specs: ['Тегло: 600 kg', 'Работно време: до 10 h', 'Ефективност: ≥100 m²/8 h', 'Плочки: 600×600 / 800×800 / 600×1200 mm', 'Материален капацитет: 80 L', 'Точност на позициониране: ≤2 cm', 'Фуга: ≤0,5 mm', '5G / Wi‑Fi']
  },
  {
    id: 'bright-dream-r19', category: 'robotics', name: 'Bright Dream Robotics R-19 — Floor Tile Paving Robot', model: 'R-19',
    eyebrow: 'BRIGHT DREAM ROBOTICS · R-19',
    blurb: 'Компактна безжична платформа с всепосочно движение, визуално позициониране и роботизирана вакуумна ръка за голям формат.',
    description: 'R-19 е напълно автоматизирана система за полагане на голям формат, разработена от Bright Dream Robotics. Четирикамерната система измерва и позиционира плочката, роботизираната ръка я захваща с вакуум, обръща я и я подава към работната зона, след което системата нанася циментовия материал върху основата и поставя плочката върху свежия слой. Концепцията е отличена с Red Dot Design Award.',
    priceKnown: true, price: 115000, priceCurrency: 'EUR', priceType: 'market-reference',
    priceNote: 'Продажна цена: 115 000 €; финалната оферта и условията за доставка се потвърждават преди поръчка.', priceSource: 'SEPANG GROUP',
    referenceUrl: 'https://www.red-dot.org/project/floor-tile-paving-robot-r-19-58278',
    imageUrl: 'https://www.red-dot.org/fileadmin/_processed_/d/5/csm_35-06495-2022PD-02_CO_EV_fa64447f31.jpg', imageSource: 'Red Dot public product image',
    specs: ['Пълна автоматизация на основния цикъл', 'Омнидирекционно шаси', '4-камерно визуално позициониране', 'Вакуумно захващане', 'Голям формат плочки', 'Механизирано нанасяне на цимент/лепило']
  },
  {
    id: 'smartbuild-thinset-robot', category: 'robotics', name: 'Smart Build Robotics — Automatic Floor Tile Laying Robot', model: 'Thin-Set Installation',
    eyebrow: 'SMART BUILD ROBOTICS · THIN-SET',
    blurb: 'Роботизирано решение за тънкослойно полагане с лепилна помпа, склад за плочки, роботизирана ръка и омнидирекционно шаси.',
    description: 'Този тип робот е проектиран за цялостна автоматизация на основната последователност при тънкослойно полагане: подаване на плочката, дозиране на лепилото, позициониране и поставяне. Системата използва високотоварни и леки роботизирани ръце, омнидирекционно шаси, помпа за лепило, отворен склад за плочки и активни и пасивни системи за безопасност. Публикуваните данни посочват плочки с тегло до 47,5 kg; конкретната конфигурация трябва да се потвърди при офериране.',
    priceKnown: false, price: null, priceCurrency: 'USD', priceType: 'quote',
    priceNote: 'Цена при запитване; конкретната конфигурация и транспортните условия се уточняват с производителя.', priceSource: 'Smart Build Robotics',
    referenceUrl: 'https://www.smartbuildrobotics.com/product/automatic-floor-tile-laying-robot-thin-set-installation/',
    imageUrl: 'https://s.alicdn.com/%40sc04/kf/H06cc4adfc42946918eb7c270df9593e6w/Automatic-Tile-Installation-Robot-Labor-saving-Floor-Tile-Laying-Machine-Smart-Construction-Robot-for-Tile-Paving.jpg',
    imageSource: 'Public automatic tile-laying configuration image; exact Smart Build asset should be confirmed with supplier',
    specs: ['Макс. тегло на плочка: 47,5 kg', 'Тънкослойна технология', 'Помпа за лепило', 'Омнидирекционно шаси', 'Високотоварна роботизирана ръка', 'Склад за плочки', 'Активни и пасивни системи за безопасност']
  },
  {
    id: 'derutu-tile-laying-robot', category: 'robotics', name: 'Derutu Tile Laying Robot', model: 'Tile Laying Robot',
    eyebrow: 'DERUTU · TILE INSTALLATION',
    blurb: 'Мобилна роботизирана платформа за автоматизирано полагане на плочки в интериорна строителна среда.',
    description: 'Derutu развива роботизирани решения за автоматизиране на строителни и довършителни операции. Тази конфигурация е насочена към автоматично подаване и полагане на плочки в интериорни пространства, където повторяемостта на операциите позволява използването на самоходна роботизирана платформа. Подходяща е за предварителна оценка на автоматизацията при жилищни и търговски обекти.',
    priceKnown: false, price: null, priceCurrency: 'USD', priceType: 'quote',
    priceNote: 'Цена при запитване; точната конфигурация се уточнява според проекта.', priceSource: 'Derutu',
    referenceUrl: 'https://www.derutu.com.cn/chanpinjijiejuefangan/180.html',
    imageUrl: 'https://www.derutu.com.cn/uploads/allimg/20240727/1-240HG03625a5.jpg', imageSource: 'Derutu public product image',
    specs: ['Мобилна роботизирана платформа', 'Автоматизирано полагане на плочки', 'Приложение: интериорни строителни обекти', 'Конфигурация според проекта']
  },
  {
    id: 'yanling-tile-robot', category: 'robotics', name: 'Yanling Articulated Tile-Laying Robot', model: 'Yanling Tile-Laying Robot',
    eyebrow: 'YANLING · ARTICULATED ARM',
    blurb: 'Самоходна роботизирана база с многоосна ръка и вакуумен захват за прецизно позициониране на плочки.',
    description: 'Yanling използва мобилна база и многоосна роботизирана ръка с вакуумен захват за повдигане и позициониране на плочки. Подходът е ориентиран към търговски и висок клас жилищни обекти, където повторяемото движение и точността при поставянето са по-важни от ръчната манипулация на всяка плочка. Конкретната производителност и максимално натоварване следва да се потвърдят за избраната конфигурация.',
    priceKnown: true, price: 120000, priceCurrency: 'USD', priceType: 'market-listing',
    priceNote: 'Публична ориентировъчна цена от Alibaba; конфигурацията и търговските условия се потвърждават преди покупка.', priceSource: 'Alibaba / Yanling listing',
    referenceUrl: 'https://www.alibaba.com/countrysearch/CN/tile-laying-robot.html',
    imageUrl: 'https://s.alicdn.com/%40sc04/kf/Haf5de4b95e4b43f99976ef313dd62789t.jpg', imageSource: 'Alibaba listing image',
    specs: ['Публикувана цена: $120,000', 'Многоосна роботизирана ръка', 'Вакуумен захват', 'Мобилна база', 'Прецизно позициониране', 'Конфигурация според проекта']
  },
  {
    id: 'kaifeng-yucheng-automatic-tile-robot', category: 'robotics', name: 'Automatic Tile Laying Robot — Kaifeng Yucheng', model: 'Automatic Tile Laying Robot',
    eyebrow: 'KAIFENG YUCHENG · AUTOMATION',
    blurb: 'Автоматизирана конфигурация за полагане на подови плочки с публикувана фабрична офертна цена.',
    description: 'Kaifeng Yucheng предлага автоматизиран робот за полагане на подови плочки, позициониран като решение за намаляване на ръчния труд при повтаряеми монтажни операции. Публичната обява е търговска, затова конкретната роботизирана ръка, захват, работен диапазон, производителност и комплектовка трябва да бъдат потвърдени писмено преди поръчка и плащане.',
    priceKnown: true, price: 80000, priceCurrency: 'USD', priceType: 'market-listing',
    priceNote: 'Публикувана Alibaba оферта; транспорт, мита, ДДС, конфигурация и CE/ЕС документация се проверяват отделно.', priceSource: 'Alibaba · Kaifeng Yucheng Precision Machinery Co., Ltd.',
    referenceUrl: 'https://www.alibaba.com/showroom/automatic-tile-laying-robot.html',
    imageUrl: 'https://s.alicdn.com/%40sc04/kf/H06cc4adfc42946918eb7c270df9593e6w/Automatic-Tile-Installation-Robot-Labor-saving-Floor-Tile-Laying-Machine-Smart-Construction-Robot-for-Tile-Paving.jpg', imageSource: 'Alibaba public listing image',
    specs: ['Цена: $80,000', 'MOQ: 1 машина', 'Автоматизирано полагане', 'Производител: Kaifeng Yucheng Precision Machinery Co., Ltd.', 'Фабричната конфигурация се потвърждава преди поръчка']
  },
  {
    id: 'bossgoo-intelligent-tile-robot', category: 'robotics', name: 'Intelligent Tile Laying Robot for Constructions', model: 'Bossgoo 68275621',
    eyebrow: 'BOSSGOO · SMART CONSTRUCTION ROBOT',
    blurb: 'Интегрирана система за нанасяне на лепило и автоматично полагане на подови плочки с лазерна SLAM навигация.',
    description: 'Този робот е от типа системи, при които нанасянето на лепилото и полагането на плочката са част от една автоматизирана последователност. Публичната обява посочва поддръжка на 600×600, 800×800 и 600×1200 mm, лазерна SLAM навигация, визуално позициониране, прецизно дозиране на лепилото и разпределена вибрация. Крайната конфигурация и реалната производителност следва да бъдат потвърдени от доставчика.',
    priceKnown: true, priceMin: 95000, priceMax: 165000, priceCurrency: 'USD', priceType: 'market-listing-range',
    priceNote: 'Публикуван диапазон от Bossgoo; крайната конфигурация, доставка и документи се потвърждават преди покупка.', priceSource: 'Bossgoo',
    referenceUrl: 'https://www.bossgoo.com/product-detail/intelligent-tile-laying-robot-for-constructions-68275621.html',
    imageUrl: 'https://s.alicdn.com/%40sc04/kf/H2d24226b3e6446c5bf54b466f8c5bdc6j/Tile-Automatic-Laying-Robot-High-Precision-Tile-Installation-Robot-High-Efficiency-for-Commercial-Buildings.jpg', imageSource: 'Public Bossgoo/Alibaba listing image',
    specs: ['Цена: $95,000–$165,000', 'Плочки: 600×600 / 800×800 / 600×1200 mm', 'Laser SLAM', 'Нанасяне на лепило + полагане', 'Визуално позициониране', 'Разпределена вибрация']
  },
  {
    id: 'bossgoo-palletizer-tile-robot', category: 'robotics', name: 'Palletizer Stacking Machine Robot Tile Laying Robot', model: 'Bossgoo 68275606',
    eyebrow: 'BOSSGOO · AUTOMATIC TILE PAVING',
    blurb: 'Автоматизирана конфигурация за полагане на плочки с интегрирано нанасяне на лепило и визуално позициониране.',
    description: 'Индустриалната конфигурация комбинира подаване на плочка, нанасяне на лепило и автоматизирано позициониране в един работен поток. Публичната обява описва работа с 600×600, 800×800 и 600×1200 mm, лазерна SLAM навигация и измерване на фугата. Точните компоненти, производителност и принадлежности се потвърждават за конкретната оферта.',
    priceKnown: true, priceMin: 85000, priceMax: 155000, priceCurrency: 'USD', priceType: 'market-listing-range',
    priceNote: 'Публикуван диапазон от Bossgoo; транспортът, вносните разходи и конфигурацията се уточняват отделно.', priceSource: 'Bossgoo',
    referenceUrl: 'https://www.bossgoo.com/product-detail/palletizer-stacking-machine-robot-tile-laying-68275606.html',
    imageUrl: 'https://s.alicdn.com/%40sc04/kf/H55b621068c58427ba48bfa9c7adb842ag.png_640x640.png', imageSource: 'Bossgoo product listing image',
    specs: ['Цена: $85,000–$155,000', 'Плочки: 600×600 / 800×800 / 600×1200 mm', 'Laser SLAM', 'Нанасяне на лепило + полагане', 'Визуално измерване на фугата']
  }
];
