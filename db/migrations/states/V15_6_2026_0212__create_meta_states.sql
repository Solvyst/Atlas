create table if not exists meta.states (
  id bigint primary key,
  name varchar(255) not null,
  country_id bigint not null,
  country_code char(2) not null,
  parent_id bigint,
  constraint states_country_id_fkey foreign key (country_id) references meta.countries(id)
);

create index if not exists states_country_id_idx on meta.states using btree (country_id);
create index if not exists states_parent_id_idx on meta.states using btree (parent_id);
