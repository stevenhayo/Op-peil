# Op Peil

Wat er in de Tweede Kamer gebeurt, voor jou vertaald. Zonder kant te kiezen.

Testversie (v0.1):

- **Home**: overzicht van de afgelopen twee weken en de wet van de week.
- **Voor jou**: besluiten gefilterd op jouw "petten" (student, huurder, ondernemer, ...).
- **De Kamer**: alle stemmingen, met hoe elke partij stemde.
- **Profiel**: "Wat is jouw politieke profiel?" in 14 dilemma's plus je top 3 om te fixen. Antwoorden blijven op het apparaat.

Data komt live uit het [Open Data Portaal van de Tweede Kamer](https://opendata.tweedekamer.nl) (CC-0) en wordt elk uur ververst. Er zijn geen API-sleutels nodig.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Online zetten met Vercel

1. Log in op vercel.com en kies **Add New → Project**.
2. Importeer de GitHub-repository `Op-peil`.
3. Laat alle instellingen staan en klik **Deploy**.

## Supabase (accounts)

1. Koppel Supabase via Vercel (Storage of Integrations → Supabase), regio Frankfurt.
2. Plak de inhoud van `supabase/schema.sql` in Supabase → SQL Editor → Run.
3. Zet in Supabase → Authentication → URL Configuration de Site URL op je Vercel-adres.

Zonder Supabase werkt de app gewoon; profielen blijven dan alleen op het apparaat.

## Volgende stappen

- Uitleg in gewone taal per besluit (Claude API), met redactionele controle.
- Accounts en opgeslagen profielen (Supabase).
- Wet van de week, casus van de week en "vuurwerk ontleed".
