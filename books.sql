PGDMP     )    '                }            books    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            	           1262    57344    books    DATABASE     x   CREATE DATABASE books WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE books;
                postgres    false            �            1259    65684 
   books_read    TABLE     �   CREATE TABLE public.books_read (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    cover_url character varying(255),
    read_date date
);
    DROP TABLE public.books_read;
       public         heap    postgres    false            �            1259    65683    books_read_id_seq    SEQUENCE     �   CREATE SEQUENCE public.books_read_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.books_read_id_seq;
       public          postgres    false    215            
           0    0    books_read_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.books_read_id_seq OWNED BY public.books_read.id;
          public          postgres    false    214            �            1259    65693    reviews    TABLE     �   CREATE TABLE public.reviews (
    id integer NOT NULL,
    books_id integer NOT NULL,
    review text NOT NULL,
    rating integer,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    65692    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          postgres    false    217                       0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          postgres    false    216            j           2604    65687    books_read id    DEFAULT     n   ALTER TABLE ONLY public.books_read ALTER COLUMN id SET DEFAULT nextval('public.books_read_id_seq'::regclass);
 <   ALTER TABLE public.books_read ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            k           2604    65696 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217                      0    65684 
   books_read 
   TABLE DATA           M   COPY public.books_read (id, title, author, cover_url, read_date) FROM stdin;
    public          postgres    false    215                    0    65693    reviews 
   TABLE DATA           ?   COPY public.reviews (id, books_id, review, rating) FROM stdin;
    public          postgres    false    217                     0    0    books_read_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.books_read_id_seq', 21, true);
          public          postgres    false    214                       0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 24, true);
          public          postgres    false    216            n           2606    65691    books_read books_read_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.books_read
    ADD CONSTRAINT books_read_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.books_read DROP CONSTRAINT books_read_pkey;
       public            postgres    false    215            p           2606    65701    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            postgres    false    217            q           2606    65702    reviews reviews_books_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_books_id_fkey FOREIGN KEY (books_id) REFERENCES public.books_read(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_books_id_fkey;
       public          postgres    false    3182    217    215               �  x�ŕ�n�@��������6��*Y�c[I�8>� U��������	y��F��*����ѵ]��E*�X* ������(�8�q�4��H��9J8F$������'�LUC!���H�/j�H5��Z���qs�=�w�撧Z�ߺ��_,Pn�$lѭ{!s� Ė��xK�L��
=u��8�ӨP�Bm�!to�Az(d�p*s���<A7����m�ex����U'��'�i�1���t�0������>D��<W�_�ַ���t��V��W@��3�G��/��/�o������4������j���KJ���#9d)��)�oy8E�s�W���.�v��-�L/ɴ1w�X(1�P�S0�� ��#�<6�(ϙt����2���.q�H�}�q��|	*h��dy�˛�S��@R��K�@8�.�4m�Ɓ������D����)>��U�6�m��ą�2�\!�te�I�0v�8��"m&c�J���~d�)U�St���/�f�^e�:������=}y|z| �t��<��HHR�	Q�RQY=Uo���R��7X�L��0uNDc�(ɀ�Lr�_���^����їu�M�6�S��_s8�^���L��audN�V<�f='󺹌K;��"�i�\C�IɈ`�x�|A��v1���ΰ�vy�D۶��e��U���*Q��ۖc�-K���훖C�{��?��ө�(x�89��8�X�,�']�H         M  x�e�MN�0���)|F̟�܁%Ӻ�!��ĝ2��.�X5���>?�1<A��5�A#*�GIR�����V¤0Фg��.��S8��TL�Õ�.�@�!���M�
l'�Dxy߅cwg�V�)QkPe����e.�>X�'ɕ`��`�\
�	y�bϘ���Ҕ���R�n��jt�K��g��0��d�ۅS���VJ	�ʪ�M�J�L*�`�����DQ�)�]�r�w'K�ɦB�-��O��L��O�@u\�W������}.�>���������mXo���r��"�{�D��nz_{䔜o�*���CnM�0�o\W�캮�����     