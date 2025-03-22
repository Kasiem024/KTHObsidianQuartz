# 11-04 Föreläsning  HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

Denna föreläsning för KS2.

Sigma notation för att ange vilka rader har 1:or och Pi notation för att ange 0:or. Lägger Don't care inom parents efter.

Sigma = SOP.
PI = POS.

![[Sanningstabell Notation HE1026.png]]

## Logiska Grindar

Kretslayout - Visar hur grindarna är placerade inne i kretsen.

Grinden med högst nummer och den på den andra diagonalen är alltid avsedda för spänning.

![[7408 Kretslayout HE1026.png]]

Spänningsnivåer

VCC - ”Matningsspänning” (rekommenderad spänning att driva kretsen med)
- VIH - Den lägsta spänning på ingångarna som tolkas som ’1’
- VIL - Den högsta spänning på ingångarna som tolkas som ’0’
- VOH - Den lägsta spänning på utgångarna som tolkas som ’1’
- VOL - Den högsta spänning på utgångarna som tolkas som ’0’

Fördröjning - Anger hur lång tid det tar för en grind att ändra värde från låg till hög.

Det finns inget inom teknik som tar 0 sekunder.

## Kombinatoriska Kretsar

Multiplexer (MUX) - En komponent som används för att välja ut en av flera insignaler, som en meny vid programmering.

Den har två grupper av insignaler:

- Dataingångar (D)
- Styringångar (S)

Demultiplexer (DeMUX) - Motsatsen till en multiplexer

Adderare och Subtraherare - Adderar och subtraherar tal på binär form.

Aktivt hög och låg avkodare.

Enable och Tristate.
