# 10-28 Föreläsning HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

## Digitalt system

Ett digitalt system är ett system som alltid befinner sig i ett av endast två möjliga lägen.

Finns flera olika digital system.

- Optiska (Ljus/mörker)
- Elektrotekniska (Ström på/av)
- Biologiska (Levande/döda)
- Kvantfysikaliskt (Spinn upp/ned)

Det borde vara lätt att flytta ett digitalt system från ett läge till ett annat.

Vanligen används 1 och 0 för att beteckna de två lägen. Dock är dessa 1:or och 0:or endast symboler och har inget med matematik att göra.

## Morse

För att beskriva text på ett digitalt sätt, med bara två symboler, måste man först komma överens om en standard.

På 1800-talet infördes en standard som kallades Morse-kod, där man använde punkt (.) och streck (-). De vanligaste bokstäverna använde ett mindre antal tecken.

## ASCII

ASCII står för American Standard Code for Information Interchange. Den första versionen kom 1963.

Det fanns en unik kod för varje tecken och det fanns totalt 128 tecken. Senare utökades den till 256 olika kombinationer.

2^7 = 128. Alltså 7 bitar för varje tecken.
2^8 = 256. Alltså 8 bitar för varje tecken.

Digitala numeriska värden bygger oftast på det binära talsystemet där man bara använder talen 1 och 0, inte symbolerna.

En siffra i det binära talsystemet kallas **Bit**

En grupp av 8 bitar kallas för **Byte**

Oavsett hur stora talen är brukar man oftast använda en multipel av en Byte för att representera den, även om 3 bitar skulle räckt använder man 8 bitar, alltså 1 byte.

## Talsystem

I denna kurs ska vi använda 4 talsystem:
- Decimalt (0-9)
- Binärt (0-1)
- Oktalt (0-7)
- Hexadecimalt (0-9 och A-F)

Negativa tal binärt: Använd den vänstra biten (MSB, Most Significant Bit) som teckenbit. (1= Negativ, 0=Positiv)

För att omvandla decimaltal till binär kan man använda BCDKod (Binary Coded Digit) där man omvandlar varje siffra för sig.
