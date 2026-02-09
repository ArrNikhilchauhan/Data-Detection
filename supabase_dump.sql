--
-- PostgreSQL database dump
--

\restrict v9n7WJCEdVa5flICXQLNIdezBt1WtuymMNmzM3PodZMPDktWzGYJ6UhbV3LwZcL

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: health_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.health_status AS ENUM (
    'Healthy',
    'Warning',
    'Unhealthy',
    'Critical'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: health_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_report (
    id uuid NOT NULL,
    dataset_name text,
    health_score integer,
    status public.health_status,
    drift_count integer,
    issue_count integer,
    previous_score integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: operational; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operational (
    id uuid NOT NULL,
    dataset_name text,
    health_score integer,
    status public.health_status,
    trend text,
    issues integer,
    recommend_action text
);


--
-- Data for Name: health_report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.health_report (id, dataset_name, health_score, status, drift_count, issue_count, previous_score, created_at) FROM stdin;
7b496450-8f3c-4391-a6e1-a8bd9161129a	test	20	Critical	4	8	\N	2026-02-08 10:19:19.341039+05:30
ba436bbf-e2ad-422c-b9a9-620c806ac9f7	ndsjkskdkj	20	Critical	4	8	\N	2026-02-08 11:26:00.695816+05:30
eaf4c364-730b-4fa9-95d2-0da33d5bbead	test	20	Critical	4	8	20	2026-02-08 11:26:38.291587+05:30
96b0dcab-0316-4b14-ac78-c3299e022697	test	20	Critical	4	8	20	2026-02-08 11:36:21.462615+05:30
62113cb2-758b-44e4-9762-8a03f269bcb5	test	20	Critical	4	8	20	2026-02-08 11:52:22.278117+05:30
ee2e122b-3905-43d4-a40f-f3a4d6361e8b	test	20	Critical	4	8	20	2026-02-08 11:53:01.867541+05:30
83d5ab52-8d15-4614-bd25-b94af1173423	test	20	Critical	4	8	20	2026-02-08 11:53:08.985081+05:30
0a314f1a-892c-4e3e-80a5-8bcf0566bbc4	test	20	Critical	4	8	20	2026-02-08 11:54:24.223679+05:30
e82275f2-d506-4de0-a7f5-f6a1fdcbc507	test	20	Critical	4	8	20	2026-02-08 11:54:52.784837+05:30
04cae1b4-76cb-4bd6-a925-677c9733b43e	test	20	Critical	4	8	20	2026-02-08 11:55:51.176933+05:30
8dec04e6-ee6b-49b3-922a-086e9c64f8ad	testt	20	Critical	4	8	\N	2026-02-08 11:56:21.053851+05:30
38fb86e8-f7bd-4ba9-806d-25c0e1c1f8e7	testt	20	Critical	4	8	20	2026-02-08 11:56:34.621023+05:30
62b9669a-8174-4242-9f9e-c828276dfa7e	hink	20	Critical	4	8	\N	2026-02-08 20:57:06.639245+05:30
68ebbd69-d203-4a73-b0e2-e93e4e1713d9	hink	20	Critical	4	8	20	2026-02-08 20:57:57.829416+05:30
e93181e4-1407-4af3-906c-3fd22e0f4bb6	New	20	Critical	4	8	\N	2026-02-08 20:59:46.445737+05:30
f64a41f3-1f2f-4cf9-9d4e-eca227bbd0a2	New	20	Critical	4	8	20	2026-02-08 21:01:31.977623+05:30
\.


--
-- Data for Name: operational; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.operational (id, dataset_name, health_score, status, trend, issues, recommend_action) FROM stdin;
65c3d34d-d6d3-4dac-a396-e99e61c74767	test	20	Critical	stable	8	BLOCK_PIPELINE
ee242a77-ef66-49f5-8ad0-b4f2e85f2cf7	testt	20	Critical	unknown	8	BLOCK_PIPELINE
00b50e0f-8957-47bb-ac25-44ceecf99672	testt	20	Critical	stable	8	BLOCK_PIPELINE
c82314b0-4fcb-4dfe-b79d-8b2439d2d63b	hink	20	Critical	unknown	8	BLOCK_PIPELINE
3c57a287-8086-458f-8192-32cab20a40e4	hink	20	Critical	stable	8	BLOCK_PIPELINE
b5e3bc1e-781c-4c85-8151-db2bd40cbf85	New	20	Critical	unknown	8	BLOCK_PIPELINE
23ff13aa-88c5-4306-a08a-676cbb1c12e7	New	20	Critical	stable	8	BLOCK_PIPELINE
\.


--
-- Name: health_report health_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_report
    ADD CONSTRAINT health_report_pkey PRIMARY KEY (id);


--
-- Name: operational operational_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operational
    ADD CONSTRAINT operational_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict v9n7WJCEdVa5flICXQLNIdezBt1WtuymMNmzM3PodZMPDktWzGYJ6UhbV3LwZcL

