create table if not exists meta.countries (
  id bigint primary key,
  name varchar(100) not null,
  iso3 char(3),
  numeric_code char(3),
  iso2 char(2),
  phonecode varchar(255),
  capital varchar(255),
  currency varchar(255),
  currency_name varchar(255),
  currency_symbol varchar(255),
  tld varchar(255),
  native varchar(255),
  population bigint,
  gdp bigint,
  region varchar(255),
  region_id bigint,
  subregion varchar(255),
  subregion_id bigint,
  nationality varchar(255),
  area_sq_km double precision,
  postal_code_format varchar(255),
  postal_code_regex varchar(255),
  timezones jsonb,
  translations jsonb,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  emoji varchar(191),
  emoji_u varchar(191),
  created_at timestamp,
  updated_at timestamp not null default current_timestamp,
  flag smallint not null default 1,
  wiki_data_id varchar(255)
);

comment on column meta.countries.wiki_data_id is 'Rapid API GeoDB Cities';

create index if not exists countries_region_id_idx on meta.countries using btree (region_id);
create index if not exists countries_subregion_id_idx on meta.countries using btree (subregion_id);
