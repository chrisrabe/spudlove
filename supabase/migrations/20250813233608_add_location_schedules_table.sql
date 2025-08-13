CREATE TABLE locations (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   lat DECIMAL(9,6) NOT NULL,
   lng DECIMAL(9,6) NOT NULL
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read locations" ON public.locations FOR SELECT USING(true);

CREATE TABLE schedules (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   location_ref UUID NOT NULL references locations (id),
   start_time TIMESTAMP NOT NULL,
   end_time TIMESTAMP NOT NULL
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read schedules" ON public.schedules FOR SELECT USING(true);