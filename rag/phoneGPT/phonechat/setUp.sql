-- Enable required extensions
create extension if not exists vector with schema public;
create extension if not exists pgcrypto with schema public;

-- Table for chunks
CREATE TABLE IF NOT EXISTS public.chunks (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	content text,
	vector vector(1536),
	url text,
	date_updated timestamp without time zone DEFAULT now(),
	CONSTRAINT chunks_pkey PRIMARY KEY (id)
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_chunks_vector ON public.chunks USING ivfflat (vector vector_l2_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_chunks_url ON public.chunks (url);

-- RPC for similarity search (as used in code)
CREATE OR REPLACE FUNCTION public.get_relevant_chunks(
	query_embedding vector(1536),
	match_threshold float,
	match_count int
)
RETURNS TABLE (
	id uuid,
	content text,
	url text,
	date_updated timestamp without time zone,
	similarity float
) AS $$
	SELECT
		c.id,
		c.content,
		c.url,
		c.date_updated,
		1 - (c.vector <-> query_embedding) AS similarity
	FROM public.chunks c
	WHERE (1 - (c.vector <-> query_embedding)) >= match_threshold
	ORDER BY c.vector <-> query_embedding
	LIMIT match_count;
$$ LANGUAGE sql STABLE;
