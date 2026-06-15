insert into meta.regions
  (id, name, translations, created_at, updated_at, flag, wiki_data_id)
values
  (
    1,
    'Africa',
    '{"br": "Afrika", "ko": "아프리카", "pt-BR": "África", "pt": "África", "nl": "Afrika", "hr": "Afrika", "fa": "آفریقا", "de": "Afrika", "es": "África", "fr": "Afrique", "ja": "アフリカ", "it": "Africa", "zh-CN": "非洲", "tr": "Afrika", "ru": "Африка", "uk": "Африка", "pl": "Afryka"}'::jsonb,
    '2023-08-14 21:41:03',
    '2023-08-14 21:41:03',
    1,
    'Q15'
  ),
  (
    2,
    'Americas',
    '{"br": "Amerika", "ko": "아메리카", "pt-BR": "América", "pt": "América", "nl": "Amerika", "hr": "Amerika", "fa": "قاره آمریکا", "de": "Amerika", "es": "América", "fr": "Amérique", "ja": "アメリカ州", "it": "America", "zh-CN": "美洲", "tr": "Amerika", "ru": "Америка", "uk": "Америка", "pl": "Ameryka"}'::jsonb,
    '2023-08-14 21:41:03',
    '2024-06-16 15:09:55',
    1,
    'Q828'
  ),
  (
    3,
    'Asia',
    '{"br": "Azia", "ko": "아시아", "pt-BR": "Ásia", "pt": "Ásia", "nl": "Azië", "hr": "Ázsia", "fa": "آسیا", "de": "Asien", "es": "Asia", "fr": "Asie", "ja": "アジア", "it": "Asia", "zh-CN": "亚洲", "tr": "Asya", "ru": "Азия", "uk": "Азія", "pl": "Azja"}'::jsonb,
    '2023-08-14 21:41:03',
    '2023-08-14 21:41:03',
    1,
    'Q48'
  ),
  (
    4,
    'Europe',
    '{"br": "Europa", "ko": "유럽", "pt-BR": "Europa", "pt": "Europa", "nl": "Europa", "hr": "Európa", "fa": "اروپا", "de": "Europa", "es": "Europa", "fr": "Europe", "ja": "ヨーロッパ", "it": "Europa", "zh-CN": "欧洲", "tr": "Avrupa", "ru": "Европа", "uk": "Європа", "pl": "Europa"}'::jsonb,
    '2023-08-14 21:41:03',
    '2023-08-14 21:41:03',
    1,
    'Q46'
  ),
  (
    5,
    'Oceania',
    '{"br": "Okeania", "ko": "오세아니아", "pt-BR": "Oceania", "pt": "Oceania", "nl": "Oceanië en Australië", "hr": "Óceánia és Ausztrália", "fa": "اقیانوسیه", "de": "Ozeanien und Australien", "es": "Oceanía", "fr": "Océanie", "ja": "オセアニア", "it": "Oceania", "zh-CN": "大洋洲", "tr": "Okyanusya", "ru": "Океания", "uk": "Океанія", "pl": "Oceania"}'::jsonb,
    '2023-08-14 21:41:03',
    '2023-08-14 21:41:03',
    1,
    'Q55643'
  ),
  (
    6,
    'Polar',
    '{"br": "Antartika", "ko": "남극", "pt-BR": "Antártida", "pt": "Antártida", "nl": "Antarctica", "hr": "Antarktika", "fa": "جنوبگان", "de": "Antarktika", "es": "Antártida", "fr": "Antarctique", "ja": "南極大陸", "it": "Antartide", "zh-CN": "南極洲", "tr": "Antarktika", "ru": "Антарктика", "uk": "Антарктика", "pl": "Antarktyka"}'::jsonb,
    '2023-08-14 21:41:03',
    '2024-06-16 15:20:26',
    1,
    'Q51'
  )
on conflict (id) do update set
  name = excluded.name,
  translations = excluded.translations,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at,
  flag = excluded.flag,
  wiki_data_id = excluded.wiki_data_id;