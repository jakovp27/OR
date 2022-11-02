--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

-- Started on 2022-11-02 03:00:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 17166)
-- Name: Igrac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Igrac" (
    ime character varying NOT NULL,
    prezime character varying NOT NULL,
    id integer NOT NULL,
    pozicija character varying,
    placa integer,
    datum_rodenja date,
    visina integer,
    tezina integer,
    draft_pick integer,
    draft_godina integer,
    tim character varying
);


ALTER TABLE public."Igrac" OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 17150)
-- Name: Roditelj; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roditelj" (
    ime character varying NOT NULL,
    prezime character varying NOT NULL,
    d_id integer
);


ALTER TABLE public."Roditelj" OWNER TO postgres;

--
-- TOC entry 2989 (class 0 OID 17166)
-- Dependencies: 201
-- Data for Name: Igrac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Igrac" (ime, prezime, id, pozicija, placa, datum_rodenja, visina, tezina, draft_pick, draft_godina, tim) FROM stdin;
Kawhi	Leonard	1	nisko krilo	39400000	1991-06-29	201	102	15	2011	Los Angeles Clippers
Lebron	James	2	nisko krilo	44470000	1984-12-30	206	113	1	2003	Los Angeles Lakers
Anthony	Davis	3	krilni centar	32740000	1993-03-11	208	115	1	2012	Los Angeles Lakers
Stephen	Curry	4	organizator igre	45780000	1988-03-14	188	84	7	2009	Golden State Warriors
Klay	Thompson	5	bek šuter	32740000	1990-02-08	198	98	11	2011	Golden State Warriors
Nikola	Jokić	6	centar	46550000	1995-02-19	211	129	41	2014	Denver Nuggets
Bojan	Bogdanović	7	nisko krilo	19550000	1989-04-18	203	98	31	2011	Detroit Pistons
Luka	Dončić	8	organizator igre	37096500	1999-02-28	201	103	3	2018	Dallas Mavericks
Jayson	Tatum	9	nisko krilo	30351780	1998-03-03	208	95	3	2017	Boston Celtics
Ja	Morant	10	organizator igre	12119440	1998-10-08	191	79	2	2019	Memphis Grizzlies
\.


--
-- TOC entry 2988 (class 0 OID 17150)
-- Dependencies: 200
-- Data for Name: Roditelj; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roditelj" (ime, prezime, d_id) FROM stdin;
Mark	Leonard	1
Kim	Leonard	1
\.


--
-- TOC entry 2857 (class 2606 OID 17173)
-- Name: Igrac Igrac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Igrac"
    ADD CONSTRAINT "Igrac_pkey" PRIMARY KEY (id);


--
-- TOC entry 2855 (class 2606 OID 17157)
-- Name: Roditelj Roditelj_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roditelj"
    ADD CONSTRAINT "Roditelj_pkey" PRIMARY KEY (ime, prezime);


-- Completed on 2022-11-02 03:00:21

--
-- PostgreSQL database dump complete
--

