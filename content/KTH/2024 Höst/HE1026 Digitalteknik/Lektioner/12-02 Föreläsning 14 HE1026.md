# 12-02 Föreläsning 14 HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

## Minneskretsar

Kretsar som används för att lagra data i form av 1:or och 0:or

Minneskretsar har generellt 3 typer av signaler:

- Data: Anger vad som skrivs eller läses
- Adress: Anger var i minner data skrivs eller läses
- Styr: Anger om nåt ska hända och isf. vad

### Styrsignaler

R/W (Read/Write): Anger om vi vill läsa eller skriva data, kan antingen vara 1 eller 0.

På/Av: Har olika namn. När den är inaktiv sätts alla datasginaler till Z (Tristate).

### Minnesstorlek

En minneskrests kan ses som en grupp av lådor. Adressledningar anger hur många lådor kretsen innehåller. Dataledningar anger hur mycket som ryms i varje låda.

Alltså beror hur mycket data som ryms i en minneskrets på antalet adress- och signaler.

Ett minne med **n** st adressledningar och **m** st dataledningar rymmer $2^n * m$ bitar.

Ett minne med 10 adressledningar och 8 dataledningar rymmer $2^{10} * 8$ bitar, alltså 1 kByte.

## ROM/RAM

ROM och RAM är olika typer av minnen.

- ROM (Read Only Memory): Kan enbart läsas från
- RAM (Random Access Memory): Kan nå alla delar av minner lika snabbt

För att göra ritningar med minneskretsar mer överskådliga brukar man gruppera adressledningarna och dataledningarna var för sig. En sådan grupp av ledningar brukar kallas för en ”buss”. En minneskrets har alltså en adressbuss och en databuss. En buss brukar anges med ett snedstreck och en siffra som anger hur många ledningar bussen innehåller.

![[Minnes Buss HE1026.png]]

Figuren till höger och till vänster visar samma sak, med ett fel (n-1).

Man kan bygga upp större minnen genom att koppla ihop flera mindre minneskretsar.
