# HI1025 Begrepp Föreläsning 3

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #KTH #HI1025 #begrepp

---

## Begrepp

Memory virtualization (Definition):: Ger illusionen att applikationer har tillgång till ett större, sammanhängande minnesutrymme än vad som faktiskt finns fysiskt, skapas för varje process av OS.

Physical Address (Definition):: Den faktiska platsen i maskinens fysiska minne där information lagras. Operativsystemet (och hårdvaran) känner till den "verkliga sanningen" om var data finns.

Virtual Address (Definition):: En adress som genereras av ett användarprogram. Det är en illusion av hur minnet är organiserat. Varje process får en egen virtuell adressrymd. Skapas av MMU.

Transparent (memory virtualization goal) (Definition):: Minnesvirtualiseringen ska vara osynlig för användarprogrammet. Programmet ska fungera som om det har direkt tillgång till ett stort, sammanhängande minne.

Effective (memory virtualization goal) (Definition):: Minnesvirtualiseringen ska tillhandahålla en användbar och kraftfull abstraktion av minnet, vilket underlättar programmering.

Robust (memory virtualization goal) (Definition):: Minnesvirtualiseringen ska säkerställa isolering mellan processer så att en process inte kan komma åt eller påverka minnet hos en annan process eller operativsystemet självt.

Dynamic (Hardware-based) Relocation (Definition):: Hårdvaran översätter adresser _under körning_ med hjälp av bas- och gränsregister. Ger skydd och flexibilitet att flytta adressrymder.

Static Relocation (Definition):: En loader skriver om programmets adresser _innan_ körning för att passa en specifik plats i fysiskt minne. Oflexibelt och ger inte skydd.

Memory Management Unit (MMU) (Definition):: Den del av processorn som hjälper till med översättning av virtuella minnesadresser till fysiska adresser

Base Register (Definition):: Ett hårdvaruregister som används vid dynamisk relokalisering, anger den fysiska startadressen för processens adressrymd

Bound (Limit) Register (Definition):: Ett hårdvaruregister som används vid dynamisk relokalisering för att säkerställa att en virtuell adress ligger inom gränserna för processens adressrymd, anger storleken på adressrymden och används för skydd

Segmentation Model (Definition):: En minneshanteringsmodell där adressrymden delas in i logiska segment (t.ex. kod, stack, heap), och varje segment har ett eget bas- och gränsregisterpar i MMU:n. Detta gör att operativsystemet kan placera varje segment i olika delar av det fysiska minnet.

Internal Fragmentation (Definition):: Utrymmesförlust som uppstår _inuti_ en allokerad minnesenhet om allokeraren delar ut större minnesblock än vad som efterfrågats, och det oanvända utrymmet inte kan användas av andra.

External Fragmentation (Definition):: Utrymmesförlust som uppstår när det totala lediga minnet är tillräckligt stort för att tillfredsställa en förfrågan, men det är uppdelat i små, icke-sammanhängande bitar.

Free List (Definition):: En datastruktur som innehåller referenser till alla lediga minnesblock i en hanterad minnesregion (t.ex. heapen). Strukturen behöver inte nödvändigtvis vara en lista, utan kan vara vilken datastruktur som helst som spårar ledigt utrymme.

Splitting (Definition):: En mekanism som används av minnesallokerare där ett ledigt minnesblock delas upp i mindre block för att tillfredsställa en minnesallokeringsförfrågan.

Coalescing (Definition):: En mekanism som används av minnesallokerare där intilliggande lediga minnesblock slås ihop till ett större ledigt minnesblock för att minska fragmentering.

Best-Fit Algorithm (Definition):: En strategi för att välja ett ledigt minnesblock från den fria listan som är _närmast_ i storlek till den begärda allokeringen.

Worst-Fit Algorithm (Definition):: En strategi för att välja det _största_ lediga minnesblocket från den fria listan i hopp om att det återstående (splittrade) blocket fortfarande ska vara tillräckligt stort för framtida allokeringar.

First-Fit Algorithm (Definition):: En strategi för att välja det _första_ lediga minnesblocket i den fria listan som är tillräckligt stort för att tillfredsställa allokeringsförfrågan.

Next-Fit Algorithm (Definition):: Liknar First-Fit, men den börjar sökningen efter ett lämpligt ledigt block från där den tidigare sökningen slutade, istället för att alltid börja från början av listan.

Garbage Collection (Definition):: En automatisk minneshanteringsteknik som återvinner minne som inte längre används av programmet. Identifierar och frigör minne som inte längre är åtkomligt eller refereras till av programmet.

Buddy Allocation (Definition):: Delar minnet i tvåpotensblock som kan splittras och slås ihop för effektiv hantering.
