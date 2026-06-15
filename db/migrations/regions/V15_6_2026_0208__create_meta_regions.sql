create table if not exists meta.regions (
  id bigint primary key,
  name varchar(100) not null,
  translations jsonb,
  created_at timestamp,
  updated_at timestamp not null default current_timestamp,
  flag smallint not null default 1,
  wiki_data_id varchar(255)
);

comment on column meta.regions.wiki_data_id is 'Rapid API GeoDB Cities';