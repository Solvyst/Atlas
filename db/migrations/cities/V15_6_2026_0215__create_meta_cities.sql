create table if not exists meta.cities (
  id bigint primary key,
  name varchar(255) not null,
  state_id bigint not null,
  state_code varchar(255) not null,
  state_name varchar(255) not null,
  country_id bigint not null,
  country_code char(2) not null,
  country_name varchar(255) not null,
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  native varchar(255),
  timezone varchar(255),
  wiki_data_id varchar(255),
  constraint cities_country_id_fkey foreign key (country_id) references meta.countries(id)
);

comment on column meta.cities.timezone is 'IANA timezone identifier (e.g., America/New_York)';
comment on column meta.cities.wiki_data_id is 'Rapid API GeoDB Cities';

create index if not exists cities_state_id_idx on meta.cities using btree (state_id);
create index if not exists cities_country_id_idx on meta.cities using btree (country_id);
