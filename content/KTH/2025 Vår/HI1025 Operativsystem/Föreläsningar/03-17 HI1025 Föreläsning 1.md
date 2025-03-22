# 03-17 HI1025 Föreläsning 1

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HI1025 #föreläsning

---

Windows och MacOS är inte operativsystem. Bara GUI för OS:et bakom. Linux är dock ett operativsystem, som har en massa olika GUI.

Man behövde skapa ett bibliotek av program som alltid kördes och kunde kallas på genom ett API.

Kernel är början till dagens operativsystem.

## Limited Direct Execution

Den består av två delar:
- User mode
- Kernel mode

User mode har inga privilegier medan den andra har mycket mer. Alltså kan Kernel mode göra mycket mer än User mode.

Man måste byta mellan modes för att göra vad man vill. Syftet med dessa modes är att öka säkerheten.

*System Call* kan användas för att ändra mellan modes.

**Mekanism** och **Policy**.

Hardware Abstraction Layer. Syftet med detta är att göra så att koden kan köras oberoende av vilken hårdvara den är på. Så att det blir lätt att överföra kod från en hårdvara till en annan.

---
Design Principer för ett OS:
- Abstraktion, skapa en API
- Isolation
- Standardisering

---
Stack frames.

I minnet finns:
- Programkod
- Globala variabler
- Stack & Heap

PCB, Process Control Block

Allt som tillhör en process kallas för processens **machine state**

Process states:
- Ready
- Running
- Blocked
- Suspended
