# 10-30 Föreläsning HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

## Digitalt System

Ett digitalt system kan ses som en svart låda.

Systemet styrs av flera insignaler, vars värden 1 eller 0, sätts av användaren.

Systemet skickar ut flera utsignaler, vars värden är 1 eller 0, som kan exempelvis läsas av lysdioder.

Funktionen hos systemet kan alltid beskrivas med logiska uttryck, där varje utsignal är en funktion av insignalerna.

![[Ett Digitalt System HE1026.png]]

Tabell för 3 insignaler:

![[3 Signaler HE1026.png]]

Tabell för 3 insignaler och 2 utsignaler:

![[Sanningstabell 3 In och 2 Ut HE1026.png]]

SOP: Sum Of Products, minterm (OR)
POS: Product Of Sums, maxterm (AND)

Minterm: Invertera alla 0.
Maxterm: Invertera alla 1.

När man skapar en sanningstabell ska man börja med insignalerna en kolumn åt taget från höger.

## Karnaugh Diagram

---

Verkliga kretsar, IC Kretsar. Har 14 ben.

Inuti varje krets finns det 14 ben. 2 av de är elektroniska kretsar. I detta fall nr 7 och 14. De benen sitter alltid diagonalt mot varandra.

![[IC Krets HE1026.png]]
