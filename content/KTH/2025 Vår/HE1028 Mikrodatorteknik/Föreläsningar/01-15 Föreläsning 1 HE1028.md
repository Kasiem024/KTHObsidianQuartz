# 01-15 Föreläsning 1 HE1028

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HE1028 #föreläsning

---

3 design dimensioner:

- Kapacitet
- Komplexitet
- Kostnad

ISA- Instruction Set Architecture

RISC-V är en öppen standard satsning för att skapa en öppen ISA. I själva verket är det en skalbar ISA där implementatören kan välja att plocka med olika delar för att kunna erbjuda kostnadseffektiva lösningar för allt från superdatorer till tandborstar.

Det finns varianter av RISC-V. De har olika namn men namnet är baserat på en standard. Kan ex. heta RV32IMAC.

RVXY:
- RV = RISC-V
- X = Adressbredd (32, 64, 128)
- Y = Stöd för

32 bitars adressrymd betyder 4 GB minne.

32 interna resgister. Register sitter väldigt nära processorn, alltså går det väldigt snabbt att använda de.

Finns några temporära register som man kan göra vad man vill med. Register noll är tomt och kan ex. användas för att radera saker.

Använder mnemonics för att skriva i assembly.

Exempel på mnemonics:

- *addi* - **A**dd **I**mmediate
- *op* - **OP**eration
- *rd* - **R**ead **D**estination
- *rs1* - **R**egister **S**ource 1

För att tilldela ett register ett värde kan man skriva:
addi, t0, zero, 7

I princip står det:
Add Immediate, till t0 (ett temporärt regsiter), från register 0, en 7:a.

Alltså lägger man till talet 7 till t0 genom att plussa en nolla från registret 0.

Man kan också använda *li* (Load Immediate).

Ibland behöver en MCU-processor vänta en kort stund (typ en nano sekund). Därför finns en operator för att slösa tid, *nop* (No OPeration).

Ett inbyggt system program kan inte riktigt avslutas. De är oändliga. Men kan avslutas med att skriva:

- *1: j 1b*

Alltså jump till etiketten 1 som ligger bakom i koden. Detta är en oändlig loop. Detta måste man göra för att inbyggda system inte har ett slut.

*xor* kan användas för att invertera.

Man kan radera bitar genom att göra *and*
