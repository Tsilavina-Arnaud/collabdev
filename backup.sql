--
-- PostgreSQL database dump
--

\restrict RhnMn17DuNeeOikttbq6tUmjbPavkThcbfbsw8c0qgzKy5xX3w0TcnZLbU44vDP

-- Dumped from database version 18.4 (Debian 18.4-1+b1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1+b1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: FollowUpStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FollowUpStatus" AS ENUM (
    'A_FAIRE',
    'EN_COURS',
    'TERMINE'
);


--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'EN_ATTENTE',
    'PAYEE',
    'ANNULEE'
);


--
-- Name: InvoiceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceType" AS ENUM (
    'PROFORMA',
    'FACTURE'
);


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CARTE_BANCAIRE',
    'VIREMENT',
    'ESPECES'
);


--
-- Name: PaymentPlan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentPlan" AS ENUM (
    'PAIEMENT_COMPLET',
    'PAIEMENT_2_FOIS',
    'PAIEMENT_3_FOIS'
);


--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'NOUVEAU',
    'EN_COURS',
    'TRAITE',
    'CONVERTI',
    'REFUSE'
);


--
-- Name: RequestType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequestType" AS ENUM (
    'CONTACT',
    'DEVIS',
    'RENDEZ_VOUS'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'DEVELOPER',
    'DESIGNER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Client" (
    id integer NOT NULL,
    name text NOT NULL,
    company text,
    email text,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Client_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Client_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Client_id_seq" OWNED BY public."Client".id;


--
-- Name: CompanyInfo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CompanyInfo" (
    id integer NOT NULL,
    name text DEFAULT 'collab·dev'::text NOT NULL,
    "legalName" text DEFAULT 'Collectif collab·dev'::text NOT NULL,
    address text,
    phone text,
    email text,
    website text,
    "taxId" text,
    currency text DEFAULT 'EUR'::text NOT NULL,
    representative text DEFAULT ''::text NOT NULL,
    "representativeRole" text DEFAULT ''::text NOT NULL,
    "legalStatus" text,
    iban text,
    bic text
);


--
-- Name: CompanyInfo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CompanyInfo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CompanyInfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CompanyInfo_id_seq" OWNED BY public."CompanyInfo".id;


--
-- Name: FollowUp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FollowUp" (
    id integer NOT NULL,
    "requestId" integer,
    "clientId" integer,
    note text NOT NULL,
    "nextAction" text,
    status public."FollowUpStatus" DEFAULT 'A_FAIRE'::public."FollowUpStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FollowUp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."FollowUp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: FollowUp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."FollowUp_id_seq" OWNED BY public."FollowUp".id;


--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Invoice" (
    id integer NOT NULL,
    reference text NOT NULL,
    type public."InvoiceType" DEFAULT 'FACTURE'::public."InvoiceType" NOT NULL,
    status public."InvoiceStatus" DEFAULT 'EN_ATTENTE'::public."InvoiceStatus" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "clientId" integer NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "downloadToken" text
);


--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InvoiceItem" (
    id integer NOT NULL,
    "invoiceId" integer NOT NULL,
    "serviceId" integer,
    label text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    free boolean DEFAULT false NOT NULL
);


--
-- Name: InvoiceItem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."InvoiceItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: InvoiceItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."InvoiceItem_id_seq" OWNED BY public."InvoiceItem".id;


--
-- Name: Invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Invoice_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Invoice_id_seq" OWNED BY public."Invoice".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "invoiceId" integer NOT NULL,
    method public."PaymentMethod" DEFAULT 'CARTE_BANCAIRE'::public."PaymentMethod" NOT NULL,
    plan public."PaymentPlan" DEFAULT 'PAIEMENT_COMPLET'::public."PaymentPlan" NOT NULL,
    "currentNumber" integer DEFAULT 1 NOT NULL,
    "totalInstallments" integer DEFAULT 1 NOT NULL,
    "amountPaid" numeric(10,2) NOT NULL,
    remaining numeric(10,2) NOT NULL,
    "paymentDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Request" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    type public."RequestType" DEFAULT 'CONTACT'::public."RequestType" NOT NULL,
    message text,
    status public."RequestStatus" DEFAULT 'NOUVEAU'::public."RequestStatus" NOT NULL,
    "serviceId" integer,
    "clientId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Request_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Request_id_seq" OWNED BY public."Request".id;


--
-- Name: Service; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Service" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category text NOT NULL,
    "isPack" boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text NOT NULL,
    details text[] DEFAULT ARRAY[]::text[] NOT NULL,
    duration text
);


--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Service_id_seq" OWNED BY public."Service".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text,
    role public."UserRole" DEFAULT 'ADMIN'::public."UserRole" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Client id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Client" ALTER COLUMN id SET DEFAULT nextval('public."Client_id_seq"'::regclass);


--
-- Name: CompanyInfo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CompanyInfo" ALTER COLUMN id SET DEFAULT nextval('public."CompanyInfo_id_seq"'::regclass);


--
-- Name: FollowUp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUp" ALTER COLUMN id SET DEFAULT nextval('public."FollowUp_id_seq"'::regclass);


--
-- Name: Invoice id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice" ALTER COLUMN id SET DEFAULT nextval('public."Invoice_id_seq"'::regclass);


--
-- Name: InvoiceItem id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem" ALTER COLUMN id SET DEFAULT nextval('public."InvoiceItem_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Request id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Request" ALTER COLUMN id SET DEFAULT nextval('public."Request_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Service" ALTER COLUMN id SET DEFAULT nextval('public."Service_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Client" (id, name, company, email, phone, address, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CompanyInfo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CompanyInfo" (id, name, "legalName", address, phone, email, website, "taxId", currency, representative, "representativeRole", "legalStatus", iban, bic) FROM stdin;
1	collab·dev	Collectif collab·dev	12 rue des Artisans, 75011 Paris		contact@collab-dev.fr	www.collabdev.fr		EUR	Camille Rousseau	Responsable administration & facturation	\N		
\.


--
-- Data for Name: FollowUp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FollowUp" (id, "requestId", "clientId", note, "nextAction", status, "dueDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Invoice" (id, reference, type, status, date, "dueDate", "clientId", "totalAmount", note, "createdAt", "updatedAt", "downloadToken") FROM stdin;
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InvoiceItem" (id, "invoiceId", "serviceId", label, quantity, "unitPrice", total, free) FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "invoiceId", method, plan, "currentNumber", "totalInstallments", "amountPaid", remaining, "paymentDate", "createdAt") FROM stdin;
\.


--
-- Data for Name: Request; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Request" (id, name, email, phone, type, message, status, "serviceId", "clientId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Service" (id, name, description, price, category, "isPack", active, "createdAt", slug, details, duration) FROM stdin;
3	Site vitrine One Page	Un site sur une seule page pour présenter l'activité, ses services et ses coordonnées.	750.00	Sites web	f	t	2026-08-17 16:42:12.23	site-vitrine-one-page	{}	\N
4	Site vitrine Multi-pages	Un site complet : accueil, l'activité, services, réalisations, blog, contact.	1500.00	Sites web	f	t	2026-08-17 16:42:12.245	site-vitrine-multi-pages	{}	\N
5	Refonte de site vitrine	Modernisation d'un site existant : design, structure, expérience utilisateur.	1500.00	Sites web	f	t	2026-08-17 16:42:12.251	refonte-de-site-vitrine	{}	\N
6	Site e-commerce	Boutique en ligne avec produits, commandes, paiements et parcours d'achat.	5000.00	Sites web	f	t	2026-08-17 16:42:12.259	site-e-commerce	{}	\N
7	CRM sur mesure	Centralisation des clients, prospects, historiques et suivis commerciaux.	20000.00	Applications	f	t	2026-08-17 16:42:12.265	crm-sur-mesure	{}	\N
8	ERP sur mesure	Plateforme réunissant ventes, stocks, facturation, ressources et reporting.	30000.00	Applications	f	t	2026-08-17 16:42:12.273	erp-sur-mesure	{}	\N
9	Application Web sur mesure	Logiciel métier accessible depuis un navigateur pour un processus précis.	15000.00	Applications	f	t	2026-08-17 16:42:12.279	application-web-sur-mesure	{}	\N
10	Application Mobile Android/iOS	Application mobile avec compte client, commandes, notifications et suivi.	20000.00	Applications	f	t	2026-08-17 16:42:12.284	application-mobile-android-ios	{}	\N
11	Assistant IA	Assistant utilisant l'IA pour répondre, rechercher des informations ou guider.	2500.00	IA & Automatisation	f	t	2026-08-17 16:42:12.291	assistant-ia	{}	\N
12	Chatbot IA	Agent conversationnel capable de dialoguer avec les visiteurs.	3000.00	IA & Automatisation	f	t	2026-08-17 16:42:12.298	chatbot-ia	{}	\N
13	Chatbot classique	Chatbot basé sur des scénarios et réponses prédéfinis.	900.00	IA & Automatisation	f	t	2026-08-17 16:42:12.306	chatbot-classique	{}	\N
14	Automatisation	Automatisation de tâches répétitives : e-mails, devis, factures, notifications.	2500.00	IA & Automatisation	f	t	2026-08-17 16:42:12.311	automatisation	{}	\N
15	Automatisation avancée avec IA	Automatisations complexes combinant règles métier et intelligence artificielle.	5000.00	IA & Automatisation	f	t	2026-08-17 16:42:12.316	automatisation-avancee-avec-ia	{}	\N
16	Optimisation SEO	Amélioration de la visibilité sur les moteurs de recherche.	250.00	Design & Marketing	f	t	2026-08-17 16:42:12.323	optimisation-seo	{}	\N
17	Carte de visite basique	Carte de visite professionnelle avec les informations essentielles.	100.00	Design & Marketing	f	t	2026-08-17 16:42:12.33	carte-de-visite-basique	{}	\N
18	Carte de visite premium	Version travaillée avec direction graphique poussée et identité forte.	250.00	Design & Marketing	f	t	2026-08-17 16:42:12.336	carte-de-visite-premium	{}	\N
19	Logo professionnel	Logo adapté à l'activité, reconnaissable sur tous les supports.	800.00	Design & Marketing	f	t	2026-08-17 16:42:12.343	logo-professionnel	{}	\N
20	Identité visuelle complète	Univers graphique de la marque : logo, couleurs, typographies, règles.	2000.00	Design & Marketing	f	t	2026-08-17 16:42:12.35	identite-visuelle-complete	{}	\N
21	Pack Start	Site One Page, SEO, domaine + e-mail pro, hébergement et maintenance 12 mois.	1000.00	Packs	t	t	2026-08-17 16:42:12.358	pack-start	{}	\N
22	Pack Business	Site Multi-pages, SEO, blog + galerie, domaine + e-mail pro, hébergement et maintenance 12 mois.	2500.00	Packs	t	t	2026-08-17 16:42:12.364	pack-business	{}	\N
23	Pack E-commerce	Boutique en ligne, paiement sécurisé, gestion des commandes, SEO, hébergement et maintenance 12 mois.	6000.00	Packs	t	t	2026-08-17 16:42:12.372	pack-e-commerce	{}	\N
24	Pack IA	Site, assistant IA, chatbot IA, SEO, domaine + e-mail pro, hébergement et maintenance 12 mois.	5000.00	Packs	t	t	2026-08-17 16:42:12.378	pack-ia	{}	\N
25	Pack Automatisation	Site, IA + automatisations métier, domaine + e-mail pro, hébergement et maintenance 12 mois.	8000.00	Packs	t	t	2026-08-17 16:42:12.387	pack-automatisation	{}	\N
26	Pack CRM	Solution CRM sur mesure.	20000.00	Packs	t	t	2026-08-17 16:42:12.393	pack-crm	{}	\N
27	Pack ERP	Solution ERP sur mesure.	30000.00	Packs	t	t	2026-08-17 16:42:12.402	pack-erp	{}	\N
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
cmsxgq8wb0000hohx3nk6s7k5	4a8d39f61a38dbc55a44e5d16ee7b0569f096b9e4abde2e166e5cadf76b1c780	1	2026-09-16 16:43:17.741	2026-08-17 16:43:17.772
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, name, "createdAt", password, role, "updatedAt") FROM stdin;
1	collab-dev@outlook.com	Administrateur	2026-08-17 16:42:12.481	691438f250c01f707f141f1e4ab6fc92:7d4883455ff926acd5d37978f66c73624d80d29c3e7d933d113c91ed7a93266c53852d72dc619e58454b5b15c71f068e50cb34888f882271b791d1107850a695	ADMIN	2026-08-17 16:42:12.481
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3e3298c6-defb-4190-999d-b01018cca6de	74321ef4af21dd277012df04272490dac49483b673162e05f491e8db020c4494	2026-08-17 18:36:27.599323+02	20260812194733_init	\N	\N	2026-08-17 18:36:27.584934+02	1
3cea747f-e400-4b3c-a4dc-21136c616610	3eb398cdc4b97deaf43d6a419f821efcf3b3420b3c0d8dd21846c68b930e4523	2026-08-17 18:36:27.732358+02	20260812200328_collabdev_full_schema	\N	\N	2026-08-17 18:36:27.601569+02	1
b77b8c12-8f11-4a09-bc5b-81f22a441018	d509d24151d055b2552bc003ca2a6c05385f0d24c335a055edad558b6ea8f7a0	2026-08-17 18:36:27.756069+02	20260812200349_add_sessions	\N	\N	2026-08-17 18:36:27.734119+02	1
a04714d8-1a56-4b00-9d90-c038c70b536f	fd7d037a57516e4421b2d08280e7c2bce197d83ac0a0e4c8a8ccf2e87d5a0d4b	2026-08-17 18:36:27.765724+02	20260812230530_service_name_unique	\N	\N	2026-08-17 18:36:27.758549+02	1
2e1b66dd-3f46-4b6d-9ddd-58f70607fa29	804f3cacf496e343e19b285e1fe876fe79654e6bf782e5da81c9c509e4dc589b	2026-08-17 18:36:27.787888+02	20260815120000_add_invoice_download_and_issuer_fields	\N	\N	2026-08-17 18:36:27.767735+02	1
af9c95ec-56e5-4eb7-8266-8ef10b683a69	a7783aaa3fcbfe93f7b0c5f56f961d5afdbbfbb8a55510d3380749938a6d2eb8	2026-08-17 18:36:27.798137+02	20260815130000_add_service_details_duration	\N	\N	2026-08-17 18:36:27.790127+02	1
8c2478eb-908c-4b81-835a-bf77d6b64be2	56feb74b59edb7267a777c2b5ce2127e733d6ecd697149c43c792e8fd2ef128a	2026-08-17 18:36:27.808983+02	20260815140000_align_defaults	\N	\N	2026-08-17 18:36:27.800232+02	1
2aedf0e6-40ad-4f18-a0dc-3fc794d119dd	ac53351ecda046a3b85c5081a767fdd00113129e7d865304eb94c3ee0954a441	2026-08-17 18:42:02.34249+02	20260817164202_add_default_service_details	\N	\N	2026-08-17 18:42:02.33146+02	1
\.


--
-- Name: Client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Client_id_seq"', 1, false);


--
-- Name: CompanyInfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CompanyInfo_id_seq"', 1, true);


--
-- Name: FollowUp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."FollowUp_id_seq"', 1, false);


--
-- Name: InvoiceItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."InvoiceItem_id_seq"', 1, false);


--
-- Name: Invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Invoice_id_seq"', 1, false);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- Name: Request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Request_id_seq"', 1, false);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Service_id_seq"', 27, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: CompanyInfo CompanyInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CompanyInfo"
    ADD CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY (id);


--
-- Name: FollowUp FollowUp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUp"
    ADD CONSTRAINT "FollowUp_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Request Request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Client_company_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Client_company_idx" ON public."Client" USING btree (company);


--
-- Name: FollowUp_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FollowUp_dueDate_idx" ON public."FollowUp" USING btree ("dueDate");


--
-- Name: FollowUp_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FollowUp_status_idx" ON public."FollowUp" USING btree (status);


--
-- Name: Invoice_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_date_idx" ON public."Invoice" USING btree (date);


--
-- Name: Invoice_downloadToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Invoice_downloadToken_key" ON public."Invoice" USING btree ("downloadToken");


--
-- Name: Invoice_reference_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Invoice_reference_key" ON public."Invoice" USING btree (reference);


--
-- Name: Invoice_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_status_idx" ON public."Invoice" USING btree (status);


--
-- Name: Invoice_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_type_idx" ON public."Invoice" USING btree (type);


--
-- Name: Request_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Request_createdAt_idx" ON public."Request" USING btree ("createdAt");


--
-- Name: Request_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Request_status_idx" ON public."Request" USING btree (status);


--
-- Name: Service_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Service_active_idx" ON public."Service" USING btree (active);


--
-- Name: Service_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Service_category_idx" ON public."Service" USING btree (category);


--
-- Name: Service_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Service_name_key" ON public."Service" USING btree (name);


--
-- Name: Service_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Service_slug_key" ON public."Service" USING btree (slug);


--
-- Name: Session_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_token_idx" ON public."Session" USING btree (token);


--
-- Name: Session_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: FollowUp FollowUp_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUp"
    ADD CONSTRAINT "FollowUp_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FollowUp FollowUp_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUp"
    ADD CONSTRAINT "FollowUp_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public."Request"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Request Request_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Request Request_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict RhnMn17DuNeeOikttbq6tUmjbPavkThcbfbsw8c0qgzKy5xX3w0TcnZLbU44vDP

