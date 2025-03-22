# 03-17 HI1025 Begrepp Föreläsning 1

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HI1025 #begrepp

---

## Begrepp

Bare metal (Definition):: Ett system där ett operativsystem körs direkt på hårdvaran, *utan* ett underliggande operativsystem eller hypervisor. (Tänk: *Ren metall, direkt kontakt*).
<!--SR:!2000-01-01,1,250!2025-03-21,3,250-->

Batch Job (Definition):: En sekvens av programkommandon som exekveras *utan* användarinteraktion. (Tänk: *En bunt uppgifter i kö*).

Command Line Interface (CLI) (Definition):: Ett textbaserat gränssnitt för att interagera med ett operativsystem eller ett program, genom att skriva kommandon. (Tänk: *kommando tolk*)

Kernel (Definition):: Operativsystemets *centrala del*, som hanterar grundläggande systemresurser (CPU, minne, I/O). (Tänk: *Hjärtat i systemet*).

Limited Direct Execution (Definition):: En teknik där processer får köra *direkt på CPU:n* under större delen av tiden, men med *begränsningar* för att förhindra att de stör operativsystemet eller andra processer.

Supervisor/User mode (Definition) (2)
??
Två distinkta *driftlägen* för CPU:n
- Fullständig åtkomst till *alla* hårdvaruresurser och instruktioner. Används av kärnan.
- *Begränsad* åtkomst, förhindrar direkt åtkomst till känsliga resurser. Används av applikationer.

System Call (Systemanrop) (Definition):: En *mekanism* för en användarprocess att *begära tjänster* från operativsystemets kärna (t.ex. läsa en fil, allokera minne). (Tänk: *Ett samtal till chefen (kärnan)*).

Trap (Avbrottsfälla) (Definition):: En *speciell typ av systemanrop*, ofta utlöst av ett fel (t.ex. division med noll) eller en specifik instruktion. (Tänk: *En larmklocka*).

Virtualization (Definition):: En teknik för att skapa en *virtuell version* av något, t.ex. hårdvara, operativsystem, lagring. (Tänk: *En illusion av hårdvara*).

Mechanisms & Policies (Definition) (2)
??
- De *lågnivåfunktioner* som tillhandahåller en viss förmåga. (Tänk: "Hur" något görs).
- De *regler* som bestämmer *när och på vilket sätt* lågnivåfunktionera ska användas. (Tänk: "När" och "varför" något görs).

Concurrency (Samtidighet) (Definition):: Förmågan hos ett system att hantera *flera uppgifter "samtidigt"*, antingen genom verklig parallell exekvering (på flerkärniga system) eller genom snabb växling mellan uppgifter. (Tänk: *Jonglera med flera bollar*).

Persistency (Beständighet) (Definition):: Förmågan hos data att *överleva* efter att processen som skapade den har avslutats (t.ex. genom att spara data på disk). (Tänk: *Data som inte försvinner*).

Time Sharing/Multiprogramming (Definition):: Tekniker för att låta *flera processer dela på CPU-tiden*, vilket ger illusionen av att de körs samtidigt. (Tänk: *Dela upp tiden i skivor*).

Text, Data, Stack & Heap (Definition) (3)
||
Minnessegment i en process:
- Text: Innehåller programmets *körbara kod*.
- Data: Innehåller *globala och statiska variabler*.
- Stack: Används för *lokala variabler* och *funktionsanrop*. Växer och krymper dynamiskt.
- Heap: Används för *dynamisk minnesallokering* (t.ex. med `malloc` i C). Växer och krymper dynamiskt.

Stack Frame (Definition):: Ett minnesområde på stacken som skapas vid varje *funktionsanrop*. Innehåller *lokala variabler*, *argument*, och *återhoppsadressen*. (Tänk: *En anteckningsbok för varje funktion*).

Reentrant (Återinträdande) (Definition):: Kod som kan *köras säkert av flera processer samtidigt*, utan att de stör varandras data. (Tänk: *Kod som tål att delas*). Viktigt för delade bibliotek.

Program, Process & Machine State (Definition) (3)
||
- Program: En *statisk* uppsättning instruktioner. (Tänk: *Receptet*).
- Process: En *instans* av ett program som körs. (Tänk: *Att baka kakan*).
- Machine State: Det *aktuella tillståndet* för CPU:n och minnet (register, programräknare, etc.). (Tänk: *Ögonblicksbild av datorns hjärna*).

Process Control Block (PCB) (Definition):: En *datstruktur* som operativsystemet använder för att *hålla reda på all information om en process* (t.ex. process-ID, tillstånd, registerinnehåll, minnesmappningar). (Tänk: *Processens ID-kort*).

Context Switch (Kontextbyte) (Definition):: Processen att *spara tillståndet* för en körande process och *återställa tillståndet* för en annan process, så att den andra processen kan fortsätta köra. (Tänk: *Byta förare i en bil*).

Scheduler (Schemaläggare) (Definition):: Den del av operativsystemet som *bestämmer vilken process* som ska köras härnäst och *när*. (Tänk: *Trafikpolisen för processer*).

Cooperative vs. Preemptive (Multitasking) (Definition) (2)
??
Två olika strategier för schemaläggning:
- Processer måste *frivilligt ge upp CPU:n* (genom t.ex. systemanrop).
- Operativsystemet kan *avbryta* en process och ge CPU:n till en annan process. (Mer rättvist, men mer komplext).
<!--SR:!2025-03-19,1,230!2000-01-01,1,250-->

Virtual Machine (Virtuell Maskin) (Definition):: En *mjukvaruimplementation* av en dator, som kan köra ett eget operativsystem och applikationer. (Tänk: *En dator i en dator*).

Interpreting (Tolkning) (Definition):: En metod för att köra programkod genom att *läsa och exekvera instruktionerna en i taget*, utan att först kompilera dem till maskinkod. (Tänk: *Översätta och utföra direkt*).

Hypervisor (Definition) (2)
??
Ett program (eller hårdvarufunktion) som *skapar och hanterar virtuella maskiner*:
- Type 1 (Bare-metal): Körs *direkt på hårdvaran*.
- Type 2 (Hosted): Körs *ovanpå ett befintligt operativsystem*.

Boot (Uppstart) (Definition):: Processen att *starta en dator*. Involverar att ladda operativsystemets kärna från disk till minnet och initiera systemet. (Tänk: *Väcka datorn till liv*).

Context Switch (Definition):: En *lågnivåprocess* där OS *stoppar* en process och *startar* en annan. Oftast *schemaläggaren* som gör detta. Möjliggör *virtualisering av CPU:n*. Händer vid systemanrop och timeravbrott.

Trap-tabell (Definition):: En tabell som talar om för hårdvaran *vilken kod* som ska köras vid *exceptionella händelser* (avbrott, systemanrop).

Stegen vid en Boot-process (3)
??
1. Privilegier & Trap-tabell
2. Förbereda för programstart
3. Starta processen

Vad som händer *först* i boot-processen (4)
??
- Maskinen startar i *privilegierat läge* (kärnläge).
- Operativsystemet (OS) har *full kontroll* över hårdvaran.
- OS sätter upp en *trap-tabell*.
- OS kommer ihåg adresserna av dessa *hanterare*.

Vad kärnan gör *efter* att ha ställt in trap-tabellen, men *innan* ett användarprogram startas (5)
??
- Skapar en post i *processlistan*.
- Allokerar *minne* för programmet.
- Laddar in programmet i minnet.
- Ställer in *användarstacken*.
- Fyller i *kärnstacken* med register och programräknare (för återvändande från trap).

Hur en användarprocess *startas* efter att kärnan har förberett allt (3)
??
- Kärnan använder en *return-from-trap*-instruktion.
- Detta *startar exekveringen* av processen.
- CPU:n växlar till *användarläge*.

Stegen vid en Context Switch (3)
??
1. Spara
2. Återställ
3. *switch()* & *return-from-trap*

Första steget i en kontextväxling (3)
??
- OS *sparar kontexten* (tillståndet) för den *nuvarande* processen.
- Detta inkluderar att spara värdena i processorns *register* (generella register, programräknare, kärnstackpekare).
- Informationen sparas i processens *PCB* (Process Control Block) eller på dess *kärnstack*.

Andra steget i en kontextväxling (3)
??
- OS *återställer kontexten* för den process som *ska börja köras*.
- De sparade registervärdena läses in från den nya processens PCB eller kärnstack till processorns register.
- *Kärnstackpekaren* byts till den nya processens kärnstack.

Viktiga funktioner som utförs *efter* att kontexten har bytts i en kontextväxling (2)
??
- En speciell rutin, ofta kallad *switch()*, utför det noggranna sparandet och återställandet av register.
- En *return-from-trap*-instruktion utförs. Exekveringen återupptas i den *nya* processen (inte den gamla). Processorn växlar till *användarläge* (om den nya processen ska köra i det läget).

Process State (Processtillstånd) (Definition) (3)
??
Det *aktuella läget* för en process. Vanliga tillstånd är:
- Ready: Processen är *redo att köra* men väntar på att få CPU-tid.
- Running: Processen *körs för närvarande* på CPU:n.
- Blocked (Väntande): Processen *väntar på en händelse* (t.ex. I/O-operation, signal).

De *tre grundläggande* processtillstånden (3)
??
1. **Running:** Processen *exekverar instruktioner* på CPU:n.
2. **Ready:** Processen är *redo att köra* men väntar på CPU:n (schemaläggaren).
3. **Blocked:** Processen *väntar på en händelse* (t.ex. I/O).

Processtillståndet *Running* i detalj (3)
??
- Processen har *kontroll över CPU:n*.
- Dess instruktioner *utförs aktivt*.
- Endast *en* process kan vara i detta tillstånd per CPU-kärna.

Processtillståndet *Ready* i detalj (3)
??
- Processen är *körbar* men väntar på sin tur.
- Finns i en *kö* (eller annan struktur) som hanteras av schemaläggaren.
- Kan finnas *många* processer i detta tillstånd.
<!--SR:!2000-01-01,1,250!2025-03-21,3,250-->

Processtillståndet *Blocked* i detalj (3)
??
- Processen kan *inte* köra förrän en *extern händelse* inträffar.
- Vanliga orsaker:
	- Väntar på *I/O* (disk, nätverk, tangentbord, etc.).
	- Väntar på en *signal* från en annan process.
	- Väntar på en *timer*.
- Processen *förbrukar ingen CPU-tid* medan den är blockerad.

De *två* vanligaste övergångarna *från* tillståndet *Running* (5)
||
1. **Running -> Ready:**
	- Processens *tidsperiod* tar slut (time-slicing).
	- Schemaläggaren väljer en annan process (preemption).
	- Processen ger *frivilligt* upp CPU:n (yield).
2. **Running -> Blocked:**
	- Processen begär en *I/O-operation*.
	- Processen väntar på en *signal* eller annan *synkroniseringsprimitiv*.

Vanliga övergångarna *till* Ready, och *från* Ready till Running (2)
||
1. **Blocked -> Ready:**
	- Den *händelse* processen väntade på har *inträffat* (t.ex. I/O klar).
2. **Ready -> Running:**
	- *Schemaläggaren* väljer processen att köra.

Initial State (Definition):: Ett tillstånd som en process kan befinna sig i *precis när den skapas*, innan den placeras i "Ready"-kön.

Final State (Definition):: Ett tillstånd som en process kan befinna sig i *efter att den har avslutats*, men innan dess resurser (minne, PCB, etc.) har *rensats upp* helt av operativsystemet. (Tänk: "Zombie"-process)

Suspended State (Definition) (3)
??
- Ett tillstånd där en process är *tillfälligt inaktiverad*, även om den inte väntar på en specifik händelse.
- Kan användas för att: Hantera resursbrist. Pausa en process för felsökning. Ge användaren kontroll (t.ex. Ctrl+Z i Unix/Linux).
- Implementering:
	- Kan vara ett *eget tillstånd*.
	- Kan simuleras genom att placera processen i "Blocked" eller "Ready" under en *lång tid*.
