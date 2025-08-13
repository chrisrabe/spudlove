CREATE TABLE locations (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   lat DECIMAL(9,6) NOT NULL,
   lng DECIMAL(9,6) NOT NULL
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read locations" ON public.locations FOR SELECT USING(true);

CREATE TABLE schedules (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   locationRef UUID NOT NULL references locations (id),
   startTime TIMESTAMP NOT NULL,
   endTime TIMESTAMP NOT NULL
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read schedules" ON public.schedules FOR SELECT USING(true);