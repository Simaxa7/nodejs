create extension if not exists 'uuid-ossp';

create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    login text,
    password text,
    age integer,
    is_Deleted boolean
)

insert into public.users (login, password, age, is_Deleted) values
    ('login1','password1', 31, false),
    ('login2','password2', 32, false),
    ('login9','password9', 39, false),
    ('login7','password7', 37, false),
    ('login0','password0', 30, false)


INSERT INTO public.users(
	login, password, age, is_deleted)
	VALUES ('login1', 'pass1', 31, false);
