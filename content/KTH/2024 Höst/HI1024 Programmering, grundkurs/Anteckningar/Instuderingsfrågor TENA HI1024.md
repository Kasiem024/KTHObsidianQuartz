# Instuderingsfrågor TENA HI1024

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #ekonomi #HI1024 #övning #HI1024/TenA

---

1. Beskriv vad datalogi handlar om.

Datalogi är studiet av information och beräkningar. Det handlar om att utveckla algoritmer och program för att lösa problem, samt att förstå hur datorer fungerar på både hårdvaru- och mjukvarunivå. Genom att använda abstraktion och problemlösningsförmåga kan dataloger skapa innovativa lösningar inom en mängd olika områden.

Vad datalogi handlar om (Definition):: Studiet av information och beräkningar, handlar om att utveckla algoritmer och program för att lösa problem, samt att förstå hur datorer fungerar på både hårdvaru- och mjukvarunivå

2. Inom datalogi skiljer man på data och information. Beskriv de två begreppen.

Data är råa fakta, som siffror eller ord, utan någon inbyggd mening. Det är som byggstenarna i ett hus. Information är data som har organiserats och fått en mening. Det är som ett hus byggt av dessa byggstenar.

Skillnaden mellan Data och Information (Definition);; Data är råa fakta, som siffror eller ord, utan någon inbyggd mening. Det är som byggstenarna i ett hus. Information är data som har organiserats och fått en mening. Det är som ett hus byggt av dessa byggstenar.

3. Förklara hur tal 53 skulle skrivas med basen 2, 8 och 16.

- Bas 2 (Binärt): 110101
- Bas 8 (Oktalt): 65
- Bas 16 (Hexadecimalt): 35

Hur tal 53 skulle skrivas med basen 2, 8 och 16 (3)||
- Bas 2 (Binärt): 110101
- Bas 8 (Oktalt): 65
- Bas 16 (Hexadecimalt): 35

4. Vad är cacheminne? Ge exempel på hur vi som programmerare kan minska risken för cache missar.

Det är ett litet, snabbt minne som används för att lagra kopior av data som ofta används. När en processor behöver data, kollar den först i cache-minnet. Om datan finns där, kan den hämtas mycket snabbare än om processorn skulle behöva hämta den från det långsammare huvudminnet.

När en processor söker efter data i cache-minnet och inte hittar den kallas det för en cache-miss. Cache-missar kan sakta ner ett program.

Cache minne (Definition):: Ett litet snabbt minne som används för att lagra kopior av data som ofta används, snabbare för datorn att kolla om datan finns här än att kolla i huvudminnet

Hur man minskar risken för cache missar (Definition):: När en processor söker efter data i cache-minnet och inte hittar det, risken för detta minskar o

5. Vad är ett operativsystem? Vilka uppgifter har det?

Ett operativsystem, ofta förkortat OS, är som datorns dirigent. Det är den mjukvara som hanterar och samordnar all hårdvara i datorn, från processor och minne till tangentbord och skärm. Tänk på det som en mellanhand mellan dig och datorns mer tekniska delar.

- **Resursfördelning:** Operativsystemet bestämmer hur datorns resurser, som processortid och minne, ska fördelas mellan de olika program som körs samtidigt.
- **Filhantering:** Det skapar, läser, skriver och raderar filer på dina lagringsenheter.
- **Processhantering:** Operativsystemet startar, pausar och avslutar program, och ser till att de inte stör varandra.
- **Enhetshantering:** Det kommunicerar med alla enheter som är anslutna till datorn, som skrivare, skannrar och nätverkskort.
- **Användargränssnitt:** Operativsystemet ger dig ett användarvänligt sätt att interagera med datorn, till exempel genom ett grafiskt användargränssnitt (GUI) med ikoner och fönster.
- **Säkerhet:** Operativsystemet skyddar datorn mot obehörig åtkomst och virusattacker.

Operativsystem (Definition):: Datorns dirigent, den mjukvara som hanterar och samordnar all hårdvara i datorn, från processor och minne till tangentbord och skärm

Uppgifterna av ett operativsystem (6)||
- **Resursfördelning:** Operativsystemet bestämmer hur datorns resurser, som processortid och minne, ska fördelas mellan de olika program som körs samtidigt.
- **Filhantering:** Det skapar, läser, skriver och raderar filer på dina lagringsenheter.
- **Processhantering:** Operativsystemet startar, pausar och avslutar program, och ser till att de inte stör varandra.
- **Enhetshantering:** Det kommunicerar med alla enheter som är anslutna till datorn, som skrivare, skannrar och nätverkskort.
- **Användargränssnitt:** Operativsystemet ger dig ett användarvänligt sätt att interagera med datorn, till exempel genom ett grafiskt användargränssnitt (GUI) med ikoner och fönster.
- **Säkerhet:** Operativsystemet skyddar datorn mot obehörig åtkomst och virusattacker.

6. Vad händer när man slår på datorn?

- **Strömförsörjning:** När du trycker på strömknappen skickas ström till datorns komponenter.
- **BIOS/UEFI:** Den första mjukvaran som aktiveras är BIOS (Basic Input/Output System) eller UEFI (Unified Extensible Firmware Interface). Den testar datorns grundläggande komponenter, som minne och processor, för att se om allt fungerar som det ska.
- **Bootloader:** Efter BIOS/UEFI startar bootloadern, som är en liten programvara som laddar operativsystemet in i datorns minne.
- **Operativsystemet startar:** Operativsystemet (t.ex. Windows, macOS eller Linux) börjar ladda in och initiera alla sina tjänster och processer.
- **Drivrutiner laddas:** Operativsystemet laddar drivrutiner för alla anslutna enheter, som tangentbord, mus, grafikkort och hårddiskar.
- **Användargränssnittet visas:** När operativsystemet är fullt startat visas det grafiska användargränssnittet (GUI) som du känner igen, och du kan börja använda datorn.

Vad som händer när man slår på en dator (6)||
- **Strömförsörjning:** När du trycker på strömknappen skickas ström till datorns komponenter.
- **BIOS/UEFI:** Den första mjukvaran som aktiveras är BIOS (Basic Input/Output System) eller UEFI (Unified Extensible Firmware Interface). Den testar datorns grundläggande komponenter, som minne och processor, för att se om allt fungerar som det ska.
- **Bootloader:** Efter BIOS/UEFI startar bootloadern, som är en liten programvara som laddar operativsystemet in i datorns minne.
- **Operativsystemet startar:** Operativsystemet (t.ex. Windows, macOS eller Linux) börjar ladda in och initiera alla sina tjänster och processer.
- **Drivrutiner laddas:** Operativsystemet laddar drivrutiner för alla anslutna enheter, som tangentbord, mus, grafikkort och hårddiskar.
- **Användargränssnittet visas:** När operativsystemet är fullt startat visas det grafiska användargränssnittet (GUI) som du känner igen, och du kan börja använda datorn.

7. Vad är maskinkod och vad är ett assemblerspråk?

**Maskinkod** är det mest grundläggande språk som en dator förstår. Det består av långa sekvenser av nollor och ettor (binära tal) som direkt styr datorns processor. Varje kommando, eller instruktion, i maskinkoden motsvarar en specifik operation som processorn kan utföra, till exempel att lägga till två tal, flytta data eller jämföra värden.

**Assemblerspråk** är ett steg närmare människan än maskinkoden. Det är ett lågnivåspråk där varje instruktion motsvarar en enda maskinkodinstruktion, men istället för att skrivas som binära tal används mnemonics (minnesord). Mnemonics är korta, lättlästa namn som representerar olika operationer, vilket gör koden mer läsbar för programmerare.

Maskinkod och assemblerspråk (Definition)::

8. Man säger att ett programmeringsspråk har en syntax och en semantik. Beskriv de två begreppen.

Tänk dig att ett programmeringsspråk är ett språk som används för att ge instruktioner till en dator. Syntaxen är som grammatiken i språket, som talar om hur man formar meningarna. Semantiken är som betydelsen av meningarna, vad de faktiskt betyder.

Syntax och Semantik (Definition)::

9. Ett språk kan vara kompilerande eller interpreterande. Beskriv skillnaden.

Skillnaden mellan kompilerande och interpreterande språk (Definition)::

10. Vad är en algoritm?

Algoritm (Definition)::

11. När man skriver ett program i C och producerar ett körbart program så skapas det körbara programmet i de tre stegen. Beskriv dessa tre steg och vad de innebär.

3 steg när man producerar ett körbart program (3)::

12. Ge exempel på en deklaration av en variabel och beskriv vad den betyder. Beskriv också initialisering och hur det skiljer sig från tilldelning.

Exempel på deklaration av an variabel (Definition)::

Skillnaden mellan initialisering och tilldelning

13. Varför ska man indentera kod?

14. Hur påverkar indentering den kompilerade koden?

15. Varför måste man använda adressoperatorn (&) när man använder standardfunktionen scanf för att läsa in ett tal?

16. För att tilldela en variabel ett värde använder vi tilldelningsoperatorn =. Vad betyder det att den är en operator i C och att en tilldelning inte bara är en sats?

17. Vad gör operationen n +=2 ?

18. Vad är skillnaden på n++ och ++n?

19. Förutsatt att a och b är korrekt deklarerade och initierade vad är problematiskt med följande sats: if (a == 0 && b++>10) {...}.

20. Hur bör olikheten 3 < x ≤ 7 skrivas som villkor i C?

21. I en switch-sats har vi flera cases. I slutet på varje case bör man avsluta med ... . Vad ska man avsluta med? Vad händer om man glömmer detta?

22. Varför ska man inte använda goto?

23. När vi har flera nästlade loopar skulle goto kunna vara ett enkelt sätt att hoppa ur alla loopar medan break bara hoppar ur den innersta loopen. Man kan naturligtvis sätta alla loopvillkor så att de testas falskt för att hoppa ur men ibland känns det omständigt. Hur kan du enkelt hoppa ur flera nästlade loopar utan att använda goto eller break?

24. Heltalsvariabler kan vara ”unsigned”, vad innebär det? Vad är skillnaden mellan en unsigned int och en int? Antag att variabeln a är deklarerad som en unsigned int. Ange vad som händer (principiellt) om man gör tilldelningen a = –1;

25. I C lagrar vi bokstäver i typen char men char är en heltalstyp. Hur hänger detta ihop?

26. Nämn ett exempel då man kan behöva göra en explicit konvertering i C?

27. Hur gör man för att kopiera en array? Förklara och visa med ett exempel.

28. Vad gör man för att initiera en array med nollor?

29. Om a är en array kan sizeof(a)/sizeof(a[0]) ge oss längden. Varför fungerar detta inte i en funktion där a är en in-parameter?

30. Hur initierar man en 2-dimensionell array. Ge ett exempel där man initierar en array till:
1 4 2 1

31. Vad är en funktionsdeklaration och vad kan man använda den till?

32. Var gäller en deklaration av en lokal variabel?

33. Varför ska man normalt inte använda globala variabler?

34. Vad är en pekar-variabel?

35. Vad är top-down-programmering? Vad är fördelarna med denna metodik?

36. Hur programmerar man bottom-up?

37. Vad gör värdeoperatorn? Ge exempel på kod där den används.

38. Vad gör adressoperatorn? Ge exempel på kod där den används.

39. Hur representerar C strängar (textsträngar)?

40. Hur initierar man bekvämt (med ett statement) en textsträng med variabelnamn text om man vill att den ska ha defaultvärdet ”Lennart” och ha plats för 30 tecken?

41. Hur kopierar man en struct?

42. Vad händer om man kopierar en struct som innehåller en array?

43. Förklara skillnaden mellan en binärfil och en textfil.

44. Förklara skillnaden mellan en .h-fil och en .c-fil. Ange också hur man sätter samman ett program med main()-funktion i en .c-fil som använder sig av ett separat-kompilerat bibliotek som består av en en .h-fil och en .c-fil (förutom den .c fil som innehåller funktionen main()).
