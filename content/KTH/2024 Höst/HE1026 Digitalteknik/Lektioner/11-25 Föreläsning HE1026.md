# 11-25 Föreläsning  HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

## Programmerbara Kretsar

• PLD = Programmable Logic Device
• CPLD = Complex PLD, i princip flera PLD-er på ett chip
	• Ex: 108 vippor + 540 produkttermer
• FPGA = Field Programmable Gate Array
	• Blockuppdelad, mycket komplex och omfattande kretsteknik
• ASIC = Application Specific Integrated Circuit
	• Designad helt utifrån användarens kravspec (mycket dyr teknik)

## CPLD

Många insignaler och dess inverser till vänster. Allting går till AND och OR grindar.

XOR grindar kan användas till att invertera utsignalen, aktivt hög eller låg.

![[CPLD Konstruktion HE1026.png]]

## VHDL

VHDL: Very high speed integrated circuit Hardware Description Language

Ett programmerings språk. Koden kan användas för att simulera kretsen beteende eller för att syntetisera, alltså ladda in det i en programmerbar krets.

Mycket stor del av VHDL språket kan användas för att simulera men en liten del för att syntetisera.

VHDL beskriver hårdvara. Börja först med att rita hårdvaran och sen skriv VHDL koden.

VHDL är case insensitive.
