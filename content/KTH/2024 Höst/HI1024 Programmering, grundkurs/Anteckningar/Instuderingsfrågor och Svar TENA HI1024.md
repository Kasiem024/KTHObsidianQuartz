# Instuderingsfrågor och Svar TENA HI1024

## OBS

Tags: #nograph

**Detta är instuderingsfrågor tagna från Canvas. Det finns inget facit för frågorna utan svaren är mina egna. Vissa frågor är inte med.**

---
1. Beskriv vad datalogi handlar om.

**Datalogi** är studiet av information och beräkningar. Det handlar om att utveckla algoritmer och program för att lösa problem, samt att förstå hur datorer fungerar på både hårdvaru- och mjukvarunivå. Genom att använda abstraktion och problemlösningsförmåga kan dataloger skapa innovativa lösningar inom en mängd olika områden.

---
2. Inom datalogi skiljer man på data och information. Beskriv de två begreppen.

**Data** är råa fakta, som siffror eller ord, utan någon inbyggd mening. Det är som byggstenarna i ett hus. **Information** är data som har organiserats och fått en mening. Det är som ett hus byggt av dessa byggstenar.

---
4. Vad är cacheminne? Ge exempel på hur vi som programmerare kan minska risken för cache missar.

**Cacheminne** är ett litet, snabbt minne som används för att lagra kopior av data som ofta används. När en processor behöver data, kollar den först i cache-minnet. Om datan finns där, kan den hämtas mycket snabbare än om processorn skulle behöva hämta den från det långsammare huvudminnet.

När en processor söker efter data i cache-minnet och inte hittar den kallas det för en **cache-miss**. Cache-missar kan sakta ner ett program.

---
5. Vad är ett operativsystem? Vilka uppgifter har det?

Ett **operativsystem**, ofta förkortat OS, är som datorns dirigent. Det är den mjukvara som hanterar och samordnar all hårdvara i datorn, från processor och minne till tangentbord och skärm. Tänk på det som en mellanhand mellan dig och datorns mer tekniska delar.

- **Resursfördelning:** Operativsystemet bestämmer hur datorns resurser, som processortid och minne, ska fördelas mellan de olika program som körs samtidigt.
- **Filhantering:** Det skapar, läser, skriver och raderar filer på dina lagringsenheter.
- **Processhantering:** Operativsystemet startar, pausar och avslutar program, och ser till att de inte stör varandra.
- **Enhetshantering:** Det kommunicerar med alla enheter som är anslutna till datorn, som skrivare, skannrar och nätverkskort.
- **Användargränssnitt:** Operativsystemet ger dig ett användarvänligt sätt att interagera med datorn, till exempel genom ett grafiskt användargränssnitt (GUI) med ikoner och fönster.
- **Säkerhet:** Operativsystemet skyddar datorn mot obehörig åtkomst och virusattacker.

---
6. Vad händer när man slår på datorn?

- **Strömförsörjning:** När du trycker på strömknappen skickas ström till datorns komponenter.
- **BIOS/UEFI:** Den första mjukvaran som aktiveras är BIOS (Basic Input/Output System) eller UEFI (Unified Extensible Firmware Interface). Den testar datorns grundläggande komponenter, som minne och processor, för att se om allt fungerar som det ska.
- **Bootloader:** Efter BIOS/UEFI startar bootloadern, som är en liten programvara som laddar operativsystemet in i datorns minne.
- **Operativsystemet startar:** Operativsystemet (t.ex. Windows, macOS eller Linux) börjar ladda in och initiera alla sina tjänster och processer.
- **Drivrutiner laddas:** Operativsystemet laddar drivrutiner för alla anslutna enheter, som tangentbord, mus, grafikkort och hårddiskar.
- **Användargränssnittet visas:** När operativsystemet är fullt startat visas det grafiska användargränssnittet (GUI) som du känner igen, och du kan börja använda datorn.

---
7. Vad är maskinkod och vad är ett assemblerspråk?

**Maskinkod** är det mest grundläggande språk som en dator förstår. Det består av långa sekvenser av nollor och ettor (binära tal) som direkt styr datorns processor. Varje kommando, eller instruktion, i maskinkoden motsvarar en specifik operation som processorn kan utföra, till exempel att lägga till två tal, flytta data eller jämföra värden.

**Assemblerspråk** är ett steg närmare människan än maskinkoden. Det är ett lågnivåspråk där varje instruktion motsvarar en enda maskinkodinstruktion, men istället för att skrivas som binära tal används mnemonics (minnesord). Mnemonics är korta, lättlästa namn som representerar olika operationer, vilket gör koden mer läsbar för programmerare.

---
8. Man säger att ett programmeringsspråk har en syntax och en semantik. Beskriv de två begreppen.

Tänk dig att ett programmeringsspråk är ett språk som används för att ge instruktioner till en dator. **Syntaxen** är som grammatiken i språket, som talar om hur man formar meningarna. **Semantiken** är som betydelsen av meningarna, vad de faktiskt betyder.

---
9. Ett språk kan vara kompilerande eller interpreterande. Beskriv skillnaden.

**Kompilerande språk** översätts helt till maskinkod innan programmet körs, vilket ger hög prestanda men längre utvecklingstid. **Interpreterande språk** översätts och körs rad för rad vid körning, vilket ger snabbare utveckling men lägre prestanda.

---
10. Vad är en algoritm?

En **algoritm** är som ett recept för en dator. Det är en uppsättning tydliga instruktioner som beskriver hur en uppgift ska lösas, steg för steg.

---
11. När man skriver ett program i C och producerar ett körbart program så skapas det körbara programmet i de tre stegen. Beskriv dessa tre steg och vad de innebär.

- **Förkompileringsfasen:** Förbereder koden genom att inkludera header-filer och utföra makroexpansion.
- **Kompileringsfasen:** Översätter koden till assemblerkod.
- **Länkningsfasen:** Kopplar ihop olika objektfiler och skapar ett körbart program.

---
12. Ge exempel på en deklaration av en variabel och beskriv vad den betyder. Beskriv också initialisering och hur det skiljer sig från tilldelning.

- **Deklaration**, när man skapar en variabel men inte ger den ett värde, **exempel**: *int number;*
- **Initialisering**, när man skapar en variabel och direkt ger den ett värde, **exempel**: *int number = 1;*
- **Tilldelning**, när man ändrar värdet på en tidigare deklarerad variabel, **exempel**: *number = 1;*

---
13. Varför ska man indentera kod?

Indentering gör att koden blir mer läsbar och lättare att förstå.

---
14. Hur påverkar indentering den kompilerade koden?

Indentering påverkar inte direkt den kompilerade koden. Kompilatorn bryr sig inte om hur du formaterar din kod med indenteringar eller tomma rader.

---
15. Varför måste man använda adressoperatorn (&) när man använder standardfunktionen scanf för att läsa in ett tal?

När du skriver *&variabel*, ber du egentligen kompilatorn att ge dig minnesadressen där variabeln är lagrad, det berättar exakt var variabeln finns i datorns minne.

---
16. För att tilldela en variabel ett värde använder vi tilldelningsoperatorn =. Vad betyder det att den är en operator i C och att en tilldelning inte bara är en sats?

Tilldelningsoperatorn (=) är en speciell operator i C som både utför en operation (kopiering av ett värde) och returnerar ett värde. Detta gör att tilldelning kan användas både som en enkel sats för att ändra värdet på en variabel och som en del av mer komplexa uttryck.

---
17. Vad gör operationen *n +=2* ?

Operationen *n += 2* är en förkortning för *n = n + 2*

---
18. Vad är skillnaden på *n++* och *++n*?

*n++*: Värdet används först, sedan ökas: När du skriver *n++*, används det *nuvarande* värdet på `n` i uttrycket först, och *sedan* ökas värdet på `n` med 1.

*++n*: Värdet ökas först, sedan används: När du skriver *++n*, ökas det *nuvarande* värdet på `n` i uttrycket med 1 först, och *sedan* används värdet på `n`.

---
20. Hur bör olikheten 3 < x ≤ 7 skrivas som villkor i C?

```c
3 < x && x <= 7
```

---
21. I en switch-sats har vi flera cases. I slutet på varje case bör man avsluta med ... . Vad ska man avsluta med? Vad händer om man glömmer detta?

I slutet av varje case i en switch-sats bör man avsluta med *break;*. Om man glömmer *break;* i ett case, kommer programmet att "falla igenom" till nästa case och utföra koden där också, även om det inte matchar det ursprungliga värdet.

---
22. Varför ska man inte använda *goto*?

*goto* är en satsbyggnad i C som tillåter ovillkorlig hoppning till en annan punkt i koden. I de flesta fall kommer koden att bli mer läsbar, underhållbar och mindre buggbenägen om man undviker *goto*.

---
23. När vi har flera nästlade loopar skulle *goto* kunna vara ett enkelt sätt att hoppa ur alla loopar medan *break* bara hoppar ur den innersta loopen. Man kan naturligtvis sätta alla loopvillkor så att de testas falskt för att hoppa ur men ibland känns det omständigt. Hur kan du enkelt hoppa ur flera nästlade loopar utan att använda *goto* eller *break*?

- Boolean flag
- Return-sats

---
26. Heltalsvariabler kan vara ”unsigned”, vad innebär det? Vad är skillnaden mellan en unsigned int och en int? Antag att variabeln a är deklarerad som en unsigned int. Ange vad som händer (principiellt) om man gör tilldelningen a = –1;

När en heltalsvariabel deklareras som "unsigned" betyder det att den endast kan lagra positiva heltal (inklusive noll). Variabeln kommer inte att ha någon bit reserverad för att representera tecknet (positiv eller negativ).

Om du försöker tilldela värdet -1 till en variabel som är deklarerad som *unsigned int* kommer kompilatorn att utföra en implicit typkonvertering. Det negativa värdet kommer att omtolkas som ett stort positivt tal.

---
27. I C lagrar vi bokstäver i typen char men char är en heltalstyp. Hur hänger detta ihop?

Varje tecken har en unik numerisk kod (ASCII-kod). När man tilldelar ett tecken till en char-variabel konverteras tecknet automatiskt till dess ASCII-kod.

---
28. Nämn ett exempel då man kan behöva göra en explicit konvertering i C?

En explicit konvertering, även kallad typecasting, görs när man vill tvinga en variabel av en viss datatyp att behandlas som en annan datatyp. Användbart när man vill ändra datatyp för att utföra en beräkning.

---
30. Hur gör man för att kopiera en array? Förklara och visa med ett exempel.

Genom att skapa en ny array och en loop som kopierar över värdena från den gamla till den nya.

---
31. Vad gör man för att initiera en array med nollor?

```c
int array[5] = {0};
```

---
33. Hur initierar man en 2-dimensionell array. Ge ett exempel där man initierar en array till: $\begin{bmatrix}  1 & 4\\  2 & 1  \end{bmatrix}$

```c
int array[2][2] = {{1, 4}, {2, 1}}
```

---
34. Vad är en funktionsdeklaration och vad kan man använda den till?

```c
int adder(int a, int b);
```

En funktionsdeklaration i C fungerar som en "förhandsvisning" av en funktion. Den berättar för kompilatorn vad funktionen heter, vilken datatyp den returnerar (om någon) och vilka typer av argument den tar emot. Det är som att introducera en ny funktion innan dess faktiska implementering. De bidrar till en bättre struktur, ökar läsbarheten och möjliggör modularisering av kod.

---
35. Var gäller en deklaration av en lokal variabel?

En deklaration av en lokal variabel gäller endast inom den funktion där den deklarerats.

---
36. Varför ska man normalt inte använda globala variabler?

Globala variabler, det vill säga variabler som kan nås från vilken del som helst av ett program, gör koden svårare att förstå, underhålla och felsöka.

---
37. Vad är en pekar-variabel?

En pekarvariabel, eller helt enkelt en pekare, är en speciell typ av variabel som istället för att lagra ett värde direkt, lagrar minnesadressen till där värdet finns.

---
39. Vad är top-down-programmering? Vad är fördelarna med denna metodik?

**Top-down-programmering** är en metod för att strukturera och utveckla programvara där man börjar med en hög abstraktionsnivå och sedan bryter ner problemet i mindre och mindre delar. Det är en effektiv metod för att utveckla stora och komplexa program. Genom att bryta ner problemet i mindre delar blir det lättare att hantera, förstå och underhålla koden.

---
40. Hur programmerar man bottom-up?

**Bottom-up-programmering** är när man börjar med de minsta, mest grundläggande komponenterna och bygger sedan upp programmet från dessa.

---
43. Hur representerar C strängar (textsträngar)?

I C representeras strängar inte som en egen datatyp, utan som **arrayer av tecken** (char). Varje tecken i strängen lagras i en enskild element i arrayen.

---
44. Hur initierar man bekvämt (med ett statement) en textsträng med variabelnamn text om man vill att den ska ha defaultvärdet ”Lennart” och ha plats för 30 tecken?

```c
char text[30] = "Lennart";
```

---
45. Hur kopierar man en struct?

- **Ytlig kopia:** Själva structen kopieras, men inte de pekare som den kan innehålla. Om structen innehåller pekare kommer båda kopiorna att peka på samma minne.
- **Djup kopia:** Både structen och alla pekare som den innehåller kopieras. Det innebär att det skapas nya kopior av alla dynamiskt allokerade data som structen refererar till.

---
47. Förklara skillnaden mellan en binärfil och en textfil.

- **Textfiler** är utformade för att vara läsbara för människor och är ofta enklare att arbeta med.
- **Binärfiler** är optimerade för maskinläsning och kan lagra alla typer av data.
