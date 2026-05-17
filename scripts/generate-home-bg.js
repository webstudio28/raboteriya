const fs = require("fs");
const path = require("path");

const en = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/_data/home.json"), "utf8"));
const bg = JSON.parse(JSON.stringify(en));

bg.hero = {
  headline:
    "Уютно коворкинг пространство в Пловдив за фрийлансъри и хора на дистанционна работа",
  ctaPrimary: { label: "10% отстъпка за първия месец", openDiscountModal: true },
  ctaSecondary: { label: "Разгледай пространството", url: "#about" },
  image: en.hero.image,
};
bg.about = {
  headingLine1: "Raboteriya е мястото,",
  headingLine2: 'където „работата от вкъщи“',
  headingLine3: "отново започва да се усеща добре.",
  paragraphs: [
    "Идвате с лаптопа, привлечени от добрите ни цени, но оставате, защото нещо в пространството просто ви пасва.",
    "Топло е. Спокойно е. Усеща се като хора, не само като бюра.",
    "Бърз Wi-Fi, уютни ъгълчета и общностно ориентирано коворкинг пространство в сърцето на Пловдив.",
  ],
  image: en.about.image,
  imageMobile: en.about.imageMobile,
  cta: { label: "Виж опциите и цените", url: "#memberships" },
};
bg.whyRaboteriya = {
  headingLine1: "Защо хората на дистанционна работа ни избират",
  headingLine2: "пред дома или кафенетата",
  features: [
    {
      icon: en.whyRaboteriya.features[0].icon,
      title: "БЪРЗ WI-FI",
      description: "Работете без прекъсвания с надежден, високоскоростен Coool box интернет.",
    },
    {
      icon: en.whyRaboteriya.features[1].icon,
      title: "НАПИТКИ И СНАКСОВЕ",
      description: "Кафе, чай, снаксове и напълно оборудвана кухненска зона.",
    },
    {
      icon: en.whyRaboteriya.features[2].icon,
      title: "ГЪВКАВИ ПРОСТРАНСТВА",
      description: "Удобно на просторни бюра или в уютен ъгъл.",
    },
    {
      icon: en.whyRaboteriya.features[3].icon,
      title: "ДОСТЪПНИ ЧЛЕНСТВА",
      description: "Едни от най-достъпните членства в града.",
    },
    {
      icon: en.whyRaboteriya.features[4].icon,
      title: "ОБЩНОСТ",
      description: "Работете сред приятелски хора вместо да седите сами вкъщи.",
    },
    {
      icon: en.whyRaboteriya.features[5].icon,
      title: "ДОСТЪП 24/7",
      description: "Идеално за професионалисти извън 9–17 рутината.",
    },
  ],
};
bg.theSpace = {
  headingLine1: "Разгледай отвътре",
  headingLine2: "новото си любимо работно място",
  cards: en.theSpace.cards.map((c, i) => ({
    ...c,
    title: ["ОБЩНО\nПРОСТРАНСТВО", "ТИХА\nСТАЯ", "ТЕЛЕФОННА\nКАБИНА", "ГРАДИНАТА"][i],
    description: [
      "Пространство с атмосфера, в което работата до други хора е мотивираща, не разсейваща.",
      "Отделна стая за моменти, когато ви трябва абсолютна тишина и дълбок фокус.",
      "Частна телефонна кабина за Zoom срещи и обаждания извън споделеното бюро.",
      "Малко, но обичано място за BBQ, почивки и глътка свеж въздух.",
    ][i],
  })),
};
bg.memberships = {
  heading: "Не вярваме в скрити такси",
  paragraph:
    "Всичко необходимо за по-добра работа е включено в дневния ви абонамент или членство.",
  cards: [
    {
      title: "Flex членство",
      price: "€79",
      period: "/месец",
      inclusions: [
        "Достъп 24/7",
        "Работа от всяко свободно бюро",
        "Тиха стая и телефонна кабина",
        "Безплатно кафе, чай и снаксове",
        "Пълен достъп до удобства и събития",
      ],
    },
    {
      title: "Resident членство",
      price: "€119",
      period: "/месец",
      inclusions: [
        "Собствено определено бюро",
        "Оставяте си настройката както ви харесва",
        "Допълнителен екран",
        "Приоритет за кабина и тиха стая",
        "Възможност за пауза на членството",
      ],
    },
    {
      title: "СЕДМИЧЕН ПРОПУСК",
      price: "€40",
      period: "/седмица",
      inclusions: [
        "Седем последователни дни",
        "Всички предимства включени",
        "Всички удобства включени",
        "Достъп 24/7",
      ],
    },
    {
      title: "ДНЕВЕН ПРОПУСК",
      price: "€11",
      period: "/ден",
      inclusions: [
        "Собствено бюро",
        "Всички предимства включени",
        "Всички удобства включени",
        "Достъп от 08:00 до 20:00",
      ],
    },
  ],
};
const extraTitles = [
  "Допълнителни екрани",
  "Тапи за фокус",
  "Принтер включен",
  "Контакти навсякъде",
  "Канцеларски материали",
  "Допълнителни екрани",
  "Тапи за фокус",
  "Принтер включен",
  "Контакти навсякъде",
  "Допълнителни екрани",
  "Тапи за фокус",
  "Принтер включен",
  "Контакти навсякъде",
];
bg.extras = {
  heading: "Не вярваме в скрити такси",
  paragraph:
    "Всичко необходимо за по-добра работа е включено в дневния ви абонамент или членство.",
  items: en.extras.items.map((item, i) => ({
    ...item,
    title: extraTitles[i] || item.title,
  })),
  cta: { label: "Виж най-добрите предимства", url: "#thank-you" },
};
bg.testimonials = { heading: "Няколко думи от нашите членове", items: en.testimonials.items };
bg.thankYou = {
  heading: "Присъединете се към общност, не само към бюро",
  paragraphs: [
    "Всеки месец организираме събития за членове – от тематични партита и BBQ в градината до спокойни вечери с игри.",
    "Вярваме, че споделените положителни преживявания водят до щастие и продуктивност. Raboteriya не е просто коворкинг – място за връзки, приятелства и принадлежност.",
  ],
  galleryImages: en.thankYou.galleryImages,
};
bg.contact = {
  heading: "Готови ли сте да се присъедините?",
  description: "Обадете ни се или попълнете формата.\nЩе ви отговорим възможно най-скоро.",
  note: "Моля, запазвайте посещението си поне един ден предварително, за да сме сигурни, че има място за вас.",
  email: en.contact.email,
  phone: en.contact.phone,
  address: en.contact.address,
  formPlaceholder: "Кажете ни кога искате да дойдете или оставете телефон и ще ви се обадим",
  submitLabel: "Изпрати съобщението",
  socialsHeading: "Виж какво се случва в Raboteriya",
  socials: en.contact.socials,
};
bg.location = {
  heading: "Локация",
  address: en.location.address,
  directions: "Намираме се до магазин „Porta Nova“ или срещу Burger Chef.",
  mapEmbedUrl: en.location.mapEmbedUrl,
  mapTitle: "Raboteriya Coworking Space Plovdiv в Google Maps",
};
bg.faq = {
  subheading:
    "Знаем, че изборът на коворкинг води до въпроси. Ето отговорите на най-често задаваните.",
  items: [
    { question: "Трябва ли да резервирам предварително?", answer: "Временен отговор." },
    { question: "Какво е положението с паркирането?", answer: "Временен отговор." },
    { question: "Има ли места за хранене наблизо?", answer: "Временен отговор." },
    { question: "Как става влизането в пространството?", answer: "Временен отговор." },
    { question: "Мога ли да посетя пространството преди да реша?", answer: "Временен отговор." },
    { question: "Има ли договори при членствата?", answer: "Временен отговор." },
  ],
};

fs.writeFileSync(path.join(__dirname, "../src/_data/home.bg.json"), JSON.stringify(bg, null, 2));
console.log("home.bg.json written");
