# Google Search Console setup

The BOUND website is prepared for Google crawling and indexing, but Google Search Console actions require the site owner’s verified Google account. An agent cannot force Google to index a page.

## Add and verify the property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add the URL-prefix property `https://bound-method.github.io/`.
3. Complete one of Google’s ownership-verification methods.

## Submit the sitemap

After verification, open **Sitemaps** for the property and submit:

`https://bound-method.github.io/sitemap.xml`

The public sitemap is also referenced by [robots.txt](https://bound-method.github.io/robots.txt).

## Request indexing

Use **URL Inspection** and request indexing for:

- `https://bound-method.github.io/`

The BOUND DOI, IFEM publication, and author website are external properties and should be crawled from their own public URLs; they do not need to be added to this sitemap.

## Current public SEO endpoints

| Endpoint | URL |
|---|---|
| Canonical homepage | `https://bound-method.github.io/` |
| Robots | `https://bound-method.github.io/robots.txt` |
| Sitemap | `https://bound-method.github.io/sitemap.xml` |
| Direct PDF | `https://zenodo.org/api/records/22257583/files/BOUND_Method_v3_Zenodo_Article.pdf/content` |
