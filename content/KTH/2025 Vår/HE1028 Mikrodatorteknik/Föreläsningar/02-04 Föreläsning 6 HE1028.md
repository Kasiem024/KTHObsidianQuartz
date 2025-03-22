# 02-04 Föreläsning 6 HE1028

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HE1028 #föreläsning

---

För att skriva om från RISC-V assembler till C kan man börja om från början och följa en C-api.

Ett annat sätt att skriva om assemblerkod till C är att göra den synlig för C

Man kan skapa sin egna .h-fil för att göra sin riktiga .c fil snyggare.

Viktigt att skilja på:
- && : Logisk AND
- & : Bitwise AND

Om man skriver .global i .S filen blir den label synlig i .c filen. Alltså kan man i en .c fil kalla på funktioner som ligger i .S filen. Man kan skicka in och få tillbaka värden från dessa funktioner.

*char* är per definition i C 8 bitar, används vanligen för ord.

Kan använda lookup table för att översätta tangentbordet till en C array.

 På andra labben ska man använda variabel effekt.

Konstant periodtid och Variabel pulsvidd.

Kan använda timers för att kontrollera effekt.

Man kan se det som att lampan inte är på hela tiden och genom det kan vi kontrollera hur starkt de lyser. Om lampan är på 50% av tiden är det samma sak som att den lyser 50% av sin styrka hela tiden.

Finns flera olika sätt att kontrollera effekt, det finns några variabler man kan ändra på:

- PSC
- CHx
- CNT
- CAR

Genom att justera på dessa variabler finns det flera olika sätt att komma fram till 50%.

Det är bättre att ha en kort periodtid, enklare och billigare.
