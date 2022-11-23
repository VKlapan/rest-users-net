CREATE TABLE public.users (
    id SERIAL PRIMARY KEY NOT NULL,
	first_name varchar NOT NULL,
	gender varchar NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE TABLE public.relations (
id integer NOT NULL,
subscriptions integer[] NULL
);

CREATE FUNCTION get_friends(int) RETURNS table (user_name varchar) AS $$
DECLARE
  x int;

BEGIN
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $1)]
  loop
	  return query (select first_name from users where id = x);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION is_friend(user_id int, friend_id int) RETURNS bool AS $$
DECLARE
  friend bool = false;
DECLARE
  x int;

BEGIN
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $2)]
  LOOP
if x = $1 then friend = true;
end if;
  END LOOP;
 
 return friend;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION get_subscriptions(int) RETURNS setof users AS $$
DECLARE
  x int;

begin
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $1)]
  loop
	return query (select *  from users where id = x and true = is_friend($1, x));
  END LOOP;
END;
$$ LANGUAGE plpgsql;