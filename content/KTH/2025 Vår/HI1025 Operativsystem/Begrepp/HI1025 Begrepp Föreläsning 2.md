# HI1025 Begrepp Föreläsning 2

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HI1025 #begrepp

---

## Begrepp

Throughput (Definition):: Mäter hur mycket arbete ett system utför under en viss tid. Antalet processer som slutförs per tidsenhet

Fairness (Definition):: Hur rättvist systemets resurser, framförallt CPU-tid, fördelas mellan de olika processerna som vill köra.
<!--SR:!2000-01-01,1,250!2025-03-25,3,250-->

Turnaround Time (Definition):: Den totala tiden det tar för en process att slutföras, från det att den anländer till systemet tills dess att den är helt klar. Inkluderar både väntetid i köer och exekveringstid på CPU:n. En kort turnaround time är önskvärd.

First Come, First Served (FCFS) (Definition):: En schemaläggningsalgoritm där processer exekveras i den ordning de anländer till systemet. Enkel att implementera, men kan leda till att korta processer får vänta länge om långa processer anländer först (konvojeffekten).

Shortest Job First (SJF) (Definition):: En schemaläggningsalgoritm som alltid väljer den process som har kortast beräknad total exekveringstid kvar. Detta minimerar den genomsnittliga väntetiden, men kräver att man vet exekveringstiden i förväg, vilket sällan är möjligt i praktiken.

Shortest time to completion first (STCF) (Definition):: En preemptiv version av SJF. Om en ny process anländer med kortare återstående exekveringstid än den process som för närvarande körs, så avbryts den körande processen och den nya processen börjar köra.

Response time (Definition):: Den tid det tar från det att en begäran skickas in tills det första svaret produceras. Det är avgörande för interaktiva system eftersom det påverkar användarens upplevda responsivitet

Round Robin (RR) (Definition):: En preemptiv schemaläggningsalgoritm där varje process får en fast tidsperiod (kvantum) att köra. Om processen inte slutförs inom kvantumet avbryts den och flyttas till slutet av den redo-kön.

Multi-level Feedback Queue (MLFQ) (Definition):: En avancerad schemaläggningsalgoritm som använder flera köer med olika prioriteter. Processer kan flyttas mellan köerna baserat på deras beteende. Till exempel, en process som använder mycket I/O kan flyttas till en kö med högre prioritet för att förbättra responstiden.

Proportional Share (Definition):: En schemaläggningsprincip där varje process tilldelas en viss andel av CPU-tiden. Till exempel kan en process få 20% av CPU-tiden, medan en annan får 80%. Syftar till att ge förutsägbar prestanda för varje process.

Stride Scheduling (Definition);; En deterministisk algoritm för proportional share-schemaläggning. Varje process har en stride, hur stor stride beror på hur stor andel av CPU-tiden den har. Ju större andel ju mindre stride. Processer med kort stride körs oftare än processer med stor stride.

Hard Real-Time System (Definition):: Ett system där det är absolut kritiskt att alla tidsgränser (deadlines) hålls. Misslyckande med att möta en deadline kan leda till katastrofala konsekvenser, till exempel i ett flygplans styrsystem.

Soft Real-Time System (Definition):: Ett system där det är önskvärt att hålla tidsgränser, men där ett missat deadline inte leder till katastrof. Exempelvis videouppspelning – ett litet hack är irriterande, men inte farligt.

Rate Monotonic Scheduling (RMS) (Definition):: En statisk schemaläggningsalgoritm för periodiska processer (processer som körs regelbundet med en viss frekvens). Processer prioriteras baserat på deras period (eller frekvens): kortare period (högre frekvens) = högre prioritet.

Earliest Deadline First (EDF) (Definition):: En dynamisk schemaläggningsalgoritm som alltid väljer den process som har närmast deadline. Kan hantera både periodiska och aperiodiska processer. Optimal i den meningen att om ett schema finns som kan möta alla deadlines, så kommer EDF att hitta det.

Idle Task (Definition):: En mycket lågprioriterad process som körs när det inte finns några andra processer redo att köra. Säkerställer att CPU:n alltid har något att göra, även om det bara är att vänta.
<!--SR:!2000-01-01,1,250!2025-03-25,3,250-->

register (C/C++) (Definition):: Ett nyckelord som ger ett förslag till kompilatorn att lagra en variabel i ett av CPU:ns register istället för i RAM-minnet. Registeråtkomst är mycket snabbare, men antalet register är begränsat. Modern kompilator optimerar bra, så register används sällan explicit.

volatile (C/C++) (Definition):: Ett nyckelord som talar om för kompilatorn att en variabel kan ändras av externa faktorer, till exempel av hårdvara eller en annan tråd. Förhindrar att kompilatorn gör vissa optimeringar som skulle kunna leda till felaktigt beteende.
<!--SR:!2000-01-01,1,250!2025-03-25,3,250-->

Bit-wise Operators (C/C++) (3)
||
- Operatörer som arbetar på individuella bitar i ett tal.
- Exempel: AND (&), OR (|), XOR (^), NOT (~).
- Används för lågnivåmanipulation av data.

Shift Operators (C/C++) (Definition):: Operatörer som flyttar bitarna i ett tal åt vänster (<<) eller höger (>>). Vänsterskift multiplicerar med 2, högerskift dividerar med 2 (för heltal).

struct (C/C++) (Definition):: En sammansatt datatyp som grupperar ihop flera variabler av olika datatyper under ett gemensamt namn.
<!--SR:!2000-01-01,1,250!2025-03-25,3,250-->

union (C/C++) (Definition):: En sammansatt datatyp där alla medlemmar delar på samma minnesutrymme. Endast en medlem kan vara aktiv åt gången. Används för att spara minne när man vet att endast en av flera variabler kommer att användas vid en given tidpunkt.
<!--SR:!2025-03-23,1,230!2000-01-01,1,250-->
