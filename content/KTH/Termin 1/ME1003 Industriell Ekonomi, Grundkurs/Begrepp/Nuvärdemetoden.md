# Nuvärdemetoden

---
Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #ekonomi #ME1003 #begrepp #ME1003KS2

## Definition

Nuvärdemetoden är en ränteräkningsmetod som med hjälp av [[Kalkylränta]] räknar om de olika investeringsalternativens betalningar till en och samma tidpunkt, till början av det år då ==grundinvesteringen== görs.

Nuvärdemetodens beslutsregler säger att en [[Investering]] där nuvärdet av de framtida betalningarna är större än grundinvesteringen är lönsam. Differensen kallas ==nettonuvärde== eller kapitalvärde och ska vara större än noll. Investeringsalternativet med störst nettonuvärde har mest [[Lönsamhet]].

Alltså, med Nuvärdesmetoden kan vi exempelvis veta hur mycket avkastningen skulle varit om vi satte in pengarna i banken istället för att göra investeringen.

### Omräkningsfaktorer

#### Slutvärdefaktor

$$
{ Slutvärdefaktor = ( 1 + Kalkylränta )^{Ekonomisk \, Livslängd (Antal \, År)}}
$$

$$
{ SLV = ( 1 + r )^{n}}
$$

Om man vill få veta värdet av ett nutida belopp i framtiden ska man multiplicera det beloppet med ==slutvärdefaktorn==.

Exempel: $1000 * SLV = 1000 * (1+0.2)^{1}=1200$

Alltså om kalkylräntan är 20% är 1000 kr idag värda 1200 kr om 1 år.

==Räntetabell A==

#### Nuvärdefaktor

$$
{ Nuvärdefaktor =
\frac{1}{( 1 + Kalkylränta )^{Ekonomisk \, Livslängd (Antal \, År)}}}
$$

$$
{ NUV =
\frac{1}{( 1 + r )^{n}}}
$$

Om man vill få ett framtida belopp i nutidens värde ska man dela det beloppet med ==nuvärdefaktorn==.

Exempel: $1200*NUV=1200*\frac{1}{(1+0.2)^{1}}=1000$

Alltså om kalkylräntan är 20% är 1200 kr idag värda 1000 kr 1 år sen.

==Räntetabell B==

#### Nusummefaktor

$$
{ Nusummefaktor =
\frac{1 - ( 1 + Kalkylränta )^{-Ekonomisk \, Livslängd (Antal \, År)}}{Kalkylränta}}
$$

$$
{ NUS =
\frac{1 - ( 1 + r )^{-n}}{r}}
$$

Om man ska betala ett lika stort belopp varje år i flera år ska man använda ==nusummefaktorn==. Alltså summerar den nuvärdefaktorn.

==Räntetabell C==

### Formel för Nuvärdekalkyl (Nettonuvärde)

$$
{ Nettonuvärde = Grundinvestering + Inbetalningsöverskott * Nusummefaktor + Restvärde * Nuvärdefaktor }
$$

$$
{ NNV = G + a * NUS + R * NUV }
$$

### Nuvärdekvoten

När man vill veta hur olika investeringsalternativ kommer utnyttja det satsade kapitalet, grundinvesteringen, kan man beräkna ==nuvärdekvoten==. Ju högre kvoten är ju bättre.

$$
{ Nuvärdekvot=
\frac
{Netoonuvärd}{Grundinvestering}}
$$

$$
{ Nuvärdekvot=
\frac{NNV}{G}}
$$

## Kopplat till

- [[Investeringskalkylering]]

## Flashcards

Nuvärdemetoden (Definition):: En ränteräkningsmetod som med hjälp av [[Kalkylränta]] räknar om de olika investeringsalternativens betalningar till en och samma tidpunkt, till början av det år då ==grundinvesteringen== görs, hur mycket skulle avkastningen varit om vi satte in pengarna i banken istället för att göra investeringen
<!--SR:!2024-02-26,2,185-->

Omräkningsfaktorer (3) (Formel)
||
(Alla tre formler finns i formelsamlingen)
$$
{ Slutvärdefaktor = ( 1 + Kalkylränta )^{Ekonomisk \, Livslängd (Antal \, År)}}
$$
$$
{ SLV = ( 1 + r )^{n}}
$$
---
$$
{ Nuvärdefaktor =
\frac{1}{( 1 + Kalkylränta )^{Ekonomisk \, Livslängd (Antal \, År)}}}
$$
$$
{ NUV =
\frac{1}{SLV}}
$$
---
$$
{ Nusummefaktor =
\frac{1 - ( 1 + Kalkylränta )^{-Ekonomisk \, Livslängd (Antal \, År)}}{Kalkylränta}}
$$
$$
{ NUS =
\frac{1 - ( 1 + r )^{-n}}{r}}
$$
<!--SR:!2024-03-03,8,230-->

Nettonuvärde (Formel)
||
$$
{ Nettonuvärde = Grundinvestering + Inbetalningsöverskott * Nusummefaktor + Restvärde * Nuvärdefaktor }
$$
$$
{ NNV = G + a * NUS + R * NUV }
$$
<!--SR:!2024-02-25,6,250-->

Nuvärdekvot (Definition) (Formel)
||
$$
{ Nuvärdekvot=
\frac
{Netoonuvärd}{Grundinvestering}}
$$
$$
{ Nuvärdekvot=
\frac
{NNV}{G}}
$$
<!--SR:!2024-02-25,2,190-->
