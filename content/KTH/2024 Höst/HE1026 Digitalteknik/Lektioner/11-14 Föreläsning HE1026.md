# 11-14 Föreläsning HE1026

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2024 #KTH #HE1026 #föreläsning

---

## Tillståndsmaskiner

Det finns generellt två typer av tillståndsmaskiner:
- Moore-maskin
- Mealy-maskin

Skillnaden är att i en Moore-maskin bestäms värdena på utsignalerna enbart av tillstånden, medan i en Mealy-maskin kan de påverkas direkt av insignalerna.

![[Moore- och Mealy-maskiner HE1026.png]]

Mealy är snabbare eftersom man inte behöver vänta på clk.

Tillståndsmaskiner behöver inte nödvändigtvis ha insignaler för att fungera. De måste inte heller skicka utsignaler.

Speciella tillstånd:
- Stopptillstånd - Man kan komma dit men inte därifrån.
- Förlusttillstånd - Man kan komma därifrån men inte dit.
- Isolerat tillstånd - Man kan varken komma dit eller därifrån.

Tillståndsmaskiner kan också vara:
- Synkrona - Alla vippor styrs av en maskin
- Asynkrona - Varje vippa styrs för sig

D-Vippor har beteckningen 7474.
