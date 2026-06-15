create table if not exists meta.timezones (
  id bigserial primary key,
  country_id bigint not null references meta.countries (id) on delete cascade,
  zone_name varchar(255) not null,
  gmt_offset integer,
  gmt_offset_name varchar(255),
  abbreviation varchar(255),
  tz_name varchar(255),
  unique (country_id, zone_name)
);

create index if not exists timezones_country_id_idx on meta.timezones using btree (country_id);
create index if not exists timezones_zone_name_idx on meta.timezones using btree (zone_name);
