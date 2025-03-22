# `=this.file.name`

---

Skapad: `=dateformat(this.file.ctime, "D, HH:mm, EEEE ")`

Uppdaterad: `=dateformat(this.file.mtime, "D, HH:mm, EEEE")`

Tags: #year2025 #HE1028

---

## RISC-V Instruction Set

---

This is a list of common RISC-V instructions, explained in a beginner-friendly way.

---

### **addi** - **Add Immediate**

- **What it stands for:** Add Immediate
- **Explanation:** Adds an immediate (constant) value to a register.
- **How it's used:**  Think of a register as a container holding a number. _addi x1, x2, 5_ adds the number 5 to the value currently in register _x2_ and stores the result in register _x1_.
- **Example in code:** _addi a3, a3, 1_ increments the value in register _a3_ by 1.

### **and** - **AND**

- **What it stands for:** Logical AND
- **Explanation:** Performs a bitwise AND operation between two registers.
- **How it's used:** Each bit in the result is 1 only if both corresponding bits in the operands are 1.  Imagine comparing two light patterns; the resulting pattern only has a light on where both original patterns had lights on.
- **Example in code:** _and t3, t3, t1_ performs a bitwise AND between registers _t3_ and _t1_, storing the result in _t3_.

### **andi** - **AND Immediate**

- **What it stands for:** Logical AND Immediate
- **Explanation:** Performs a bitwise AND operation between a register and an immediate value.
- **How it's used:** Similar to _and_, but one of the operands is a constant value, not a register.
- **Example in code:** _andi a1, a1, 0x07_ performs a bitwise AND between register _a1_ and the value 7, storing the result in _a1_.

### **auipc** - **Add Upper Immediate to PC**

- **What it stands for:** Add Upper Immediate to PC
- **Explanation:** Adds a 20-bit upper immediate value, left-shifted by 12 bits, to the program counter (PC). Used for PC-relative addressing, to create addresses that are relative to the current instruction's location in memory.
- **How it's used:** To access data or jump to labels that are far from the current instruction. It allows the program to be position-independent (can be loaded and run at different memory addresses without modification).
- **Example:** _auipc x1, 0x10000_ will put the address of the current instruction plus _0x10000000_ into x1.

### **beq** - **Branch if Equal**

- **What it stands for:** Branch if Equal
- **Explanation:** Branches (jumps) to a specified label if two registers are equal.
- **How it's used:**  Like an "if" statement in programming. If the values in two registers are the same, the program execution jumps to a different part of the code.
- **Example:** _beq x1, x2, target_label_ will jump to the code at the label _target_label_ if _x1_ is equal to _x2_.

### **bge** - **Branch if Greater Than or Equal**

- **What it stands for:** Branch if Greater Than or Equal
- **Explanation:** Branches to a specified label if the first register is greater than or equal to the second register (signed comparison).
- **How it's used:** Another conditional jump, similar to _beq_, but based on a greater than or equal to comparison.
- **Example:** _bge x5, x6, label_loop_ will jump to the code labeled _label_loop_ if the value of _x5_ is greater or equal to the value of _x6_.

### **bgeu** - **Branch if Greater Than or Equal Unsigned**

- **What it stands for:** Branch if Greater Than or Equal Unsigned
- **Explanation:** Branches to a specified label if the first register is greater than or equal to the second register (unsigned comparison).
- **How it's used:** Similar to _bge_, but the comparison treats the register values as unsigned numbers.
- **Example:** _bgeu x5, x6, label_loop_ will jump to the code labeled _label_loop_ if the value of _x5_ is greater or equal to the value of _x6_, where _x5_ and _x6_ are treated as unsigned integers.

### **blt** - **Branch if Less Than**

- **What it stands for:** Branch if Less Than
- **Explanation:** Branches to a specified label if the first register is less than the second register (signed comparison).
- **How it's used:**  A conditional jump based on a less than comparison.
- **Example in code:** _blt t4, t1, 1f_ jumps to the label _1f_ if the value in _t4_ is less than the value in _t1_.

### **bltu** - **Branch if Less Than Unsigned**

- **What it stands for:** Branch if Less Than Unsigned
- **Explanation:** Branches to a specified label if the first register is less than the second register (unsigned comparison).
- **How it's used:** Similar to _blt_, but the comparison treats the register values as unsigned numbers.
- **Example:** _bltu x8, x9, label_continue_ will jump to the code labeled _label_continue_ if the value of _x8_ is less than _x9_ when both are treated as unsigned integers.

### **bne** - **Branch if Not Equal**

- **What it stands for:** Branch if Not Equal
- **Explanation:** Branches to a specified label if two registers are not equal.
- **How it's used:**  A conditional jump that's the opposite of _beq_.
- **Example in code:** _bne a3, a4, 1b_ jumps to the label _1b_ if the value in _a3_ is not equal to the value in _a4_.

### **call** - **Call Subroutine**

- **What it stands for:** Call Subroutine
- **Explanation:**  Jumps to a subroutine (a separate block of code) and stores the return address (the address of the next instruction after the _call_) in the _ra_ (return address) register. In RISC-V, this is a pseudo-instruction composed of an _auipc_ and a _jalr_ instruction
- **How it's used:** Like calling a function in other programming languages. You jump to a reusable piece of code, and when it's finished, you can return to where you left off.
- **Example in code:** _call rcu2en_ jumps to the subroutine labeled _rcu2en_.

### **ebreak** - **Environment Break**

- **What it stands for:** Environment Break
- **Explanation:** Used for debugging. It causes a breakpoint exception, which typically transfers control to a debugger.
- **How it's used:** Like setting a breakpoint in a debugger to pause program execution at a specific point.
- **Example:** _ebreak_ will cause the program to halt execution and await further instruction from a debugger.

### **ecall** - **Environment Call**

- **What it stands for:** Environment Call
- **Explanation:** Used to make a system call, requesting a service from the operating system or environment.
- **How it's used:** To perform tasks like printing to the console, reading input, or exiting the program.
- **Example:** _ecall_ will perform a system call determined by the values in specific registers (like _a7_ for the call number).

### **fence** - **Memory Fence**

- **What it stands for:** Memory Fence
- **Explanation:** Ensures that memory operations are performed in a specific order, especially important in multi-threaded or multi-core systems.
- **How it's used:** To prevent memory access reordering that could lead to unexpected behavior in concurrent programs. This instruction is used to create a memory barrier.
- **Example:** _fence rw, w_ ensures that all preceding read and write operations have completed before any subsequent write operations are executed.

### **j** - **Jump**

- **What it stands for:** Jump
- **Explanation:** Unconditionally jumps to a specified label.
- **How it's used:** Like a "goto" statement, transferring program execution to a different part of the code.
- **Example in code:** _j 1b_ jumps to the label _1b_.

### **jal** - **Jump and Link**

- **What it stands for:** Jump and Link
- **Explanation:** Jumps to a specified label and stores the return address (the address of the next instruction after the _jal_) in a specified register (usually _ra_).
- **How it's used:** Similar to _call_, but you can specify which register to use for the return address.
- **Example:** _jal ra, subroutine_label_ will jump to _subroutine_label_ and store the return address in _ra_.

### **jalr** - **Jump and Link Register**

- **What it stands for:** Jump and Link Register
- **Explanation:** Jumps to an address specified in a register, with an optional offset, and stores the return address in a specified register.
- **How it's used:**  Similar to _jal*, but the target address is calculated by adding an immediate offset to the value in a register. Useful for function pointers or computed jumps.
- **Example:** _jalr x5, 16(x6)_ will jump to the address at _x6 + 16_ and store the return address in _x5_.

### **lb** - **Load Byte**

- **What it stands for:** Load Byte
- **Explanation:** Loads a byte (8 bits) from memory into a register, sign-extending it to the register's width.
- **How it's used:** To read a single byte of data from a specific memory address.
- **Example:** _lb x5, 10(x6)_ loads a byte from the address _x6 + 10_ and stores it in _x5_, extending the sign to the full width of _x5_.

### **lbu** - **Load Byte Unsigned**

- **What it stands for:** Load Byte Unsigned
- **Explanation:** Loads a byte from memory into a register, zero-extending it to the register's width (treating it as an unsigned value).
- **How it's used:** Similar to _lb_, but the loaded byte is treated as an unsigned value.
- **Example:** _lbu x5, 10(x6)_ loads a byte from the address _x6 + 10_ and stores it in _x5_, padding with zeros to the full width of _x5_.

### **lh** - **Load Halfword**

- **What it stands for:** Load Halfword
- **Explanation:** Loads a halfword (16 bits) from memory into a register, sign-extending it.
- **How it's used:** To read a 16-bit value from memory.
- **Example:** _lh x7, 20(x8)_ loads a halfword from the address _x8 + 20_ into _x7_, sign extending it.

### **lhu** - **Load Halfword Unsigned**

- **What it stands for:** Load Halfword Unsigned
- **Explanation:** Loads a halfword (16 bits) from memory into a register, zero-extending it.
- **How it's used:** Similar to _lh_, but the loaded value is treated as unsigned.
- **Example:** _lhu x7, 20(x8)_ loads a halfword from the address _x8 + 20_ into _x7_, padding with zeros.

### **li** - **Load Immediate**

- **What it stands for:** Load Immediate
- **Explanation:** Loads an immediate (constant) value into a register.
- **How it's used:**  To put a specific number directly into a register.
- **Example in code:** _li t0, RCU_ loads the value of _RCU_ (which is a memory address defined earlier) into register _t0_.

### **lui** - **Load Upper Immediate**

- **What it stands for:** Load Upper Immediate
- **Explanation:** Loads a 20-bit immediate value into the upper 20 bits of a register, setting the lower 12 bits to zero.
- **How it's used:** To construct 32-bit constants or addresses in two steps (often used with _addi_ to set the lower 12 bits).
- **Example:** _lui x10, 0x12345_ will place _0x12345000_ into _x10_.

### **lw** - **Load Word**

- **What it stands for:** Load Word
- **Explanation:** Loads a word (32 bits) from memory into a register.
- **How it's used:** To read a 32-bit value from a specific memory address.
- **Example in code:** _lw t1, APB1EN(t0)_ loads the 32-bit value from the memory address calculated by adding the offset _APB1EN_ to the value in _t0_ into register _t1_.

### **lwu** - **Load Word Unsigned**

- **What it stands for:** Load Word Unsigned
- **Explanation:** Loads a word (32 bits) from memory into a register, treating it as an unsigned value.
- **How it's used:** Similar to _lw_, but intended for unsigned data.
- **Example:** _lwu x12, 0(x13)_ loads a word from the address in _x13_ into _x12_ as an unsigned value.

### **mv** - **Move**

- **What it stands for:** Move
- **Explanation:** Copies the value from one register to another. It's actually a pseudo-instruction that's equivalent to _addi rd, rs, 0_.
- **How it's used:** To transfer data between registers.
- **Example in code:** _mv t0, a0_ copies the value in register _a0_ to register _t0_.

### **neg** - **Negate**

- **What it stands for:** Negate
- **Explanation:** Calculates the two's complement of a register's value (makes it negative).
- **How it's used:** To perform arithmetic negation. It's a pseudo-instruction, often implemented as _sub rd, x0, rs_.
- **Example:** _neg x14, x15_ stores the negative of the value in _x15_ into _x14_.

### **nop** - **No Operation**

- **What it stands for:** No Operation
- **Explanation:** Does nothing. It's often used for padding or as a placeholder. It's typically implemented as _addi x0, x0, 0_.
- **How it's used:** To create delays or to align instructions in memory.
- **Example:** _nop_ does nothing when executed.

### **not** - **NOT**

- **What it stands for:** Logical NOT
- **Explanation:** Performs a bitwise NOT operation on a register (inverts all the bits).
- **How it's used:** To flip the bits of a value.  If a bit is 0, it becomes 1, and vice versa. It's a pseudo-instruction, often implemented as _xori rd, rs, -1_.
- **Example in code:** _not t1, t1_ inverts all the bits in register _t1_.

### **or** - **OR**

- **What it stands for:** Logical OR
- **Explanation:** Performs a bitwise OR operation between two registers.
- **How it's used:** Each bit in the result is 1 if at least one of the corresponding bits in the operands is 1. Imagine combining two light patterns; the resulting pattern has a light on wherever either of the original patterns had a light on.
- **Example in code:** _or t3, t3, t2_ performs a bitwise OR between registers _t3_ and _t2_, storing the result in _t3_.

### **ori** - **OR Immediate**

- **What it stands for:** Logical OR Immediate
- **Explanation:** Performs a bitwise OR operation between a register and an immediate value.
- **How it's used:** Similar to _or_, but one of the operands is a constant value.
- **Example:** _ori x1, x2, 0xFF_ will perform a bitwise OR of the contents of register _x2_ with the hexadecimal value _0xFF_ and place the result in _x1_.

### **rem** - **Remainder**

- **What it stands for:** Remainder
- **Explanation:** Calculates the remainder of a division between two registers (signed).
- **How it's used:** To find the remainder after division, useful in various algorithms like modulo operations. It's a pseudo-instruction in the base RISC-V ISA, often requiring the "M" (multiplication and division) extension.
- **Example:** _rem x5, x6, x7_ will place the signed remainder of _x6_ divided by _x7_ into _x5_.

### **remu** - **Remainder Unsigned**

- **What it stands for:** Remainder Unsigned
- **Explanation:** Calculates the remainder of a division between two registers (unsigned).
- **How it's used:** Similar to _rem_, but the values are treated as unsigned. It's a pseudo-instruction, often requiring the "M" extension.
- **Example:** _remu x5, x6, x7_ will place the unsigned remainder of _x6_ divided by _x7_ into _x5_.

### **ret** - **Return from Subroutine**

- **What it stands for:** Return from Subroutine
- **Explanation:** Returns from a subroutine by jumping to the address stored in the _ra_ (return address) register. It's a pseudo-instruction for _jalr x0, 0(ra)_.
- **How it's used:**  To go back to the point where the subroutine was called, after the subroutine has finished executing.
- **Example in code:** _ret_ jumps to the address stored in the _ra_ register.

### **sb** - **Store Byte**

- **What it stands for:** Store Byte
- **Explanation:** Stores a byte (8 bits) from a register into memory.
- **How it's used:** To write a single byte of data to a specific memory address.
- **Example:** _sb x5, 20(x6)_ stores the lowest byte of _x5_ at the memory address calculated by adding _20_ to the value of _x6_.

### **seqz** - **Set if Equal to Zero**

- **What it stands for:** Set if Equal to Zero
- **Explanation:** Sets a register to 1 if another register's value is zero, otherwise sets it to 0.
- **How it's used:** To check for zero conditions. It's a pseudo-instruction, often implemented as _sltiu rd, rs, 1_.
- **Example:** _seqz x10, x11_ will place a _1_ in _x10_ if _x11_ contains zero and a _0_ otherwise.

### **sgtz** - **Set if Greater Than Zero**

- **What it stands for:** Set if Greater Than Zero
- **Explanation:** Sets a register to 1 if another register's value is greater than zero (signed comparison), otherwise sets it to 0.
- **How it's used:** To check for positive values. It's a pseudo-instruction, often implemented as _slt rd, x0, rs_.
- **Example:** _sgtz x12, x13_ will place _1_ in _x12_ if _x13_ is greater than zero and _0_ otherwise.

### **sh** - **Store Halfword**

- **What it stands for:** Store Halfword
- **Explanation:** Stores a halfword (16 bits) from a register into memory.
- **How it's used:** To write a 16-bit value to a specific memory address.
- **Example:** _sh x8, 8(x9)_ stores the lower 16 bits of register _x8_ at the memory address computed by adding _8_ to the contents of _x9_.

### **sll** - **Shift Left Logical**

- **What it stands for:** Shift Left Logical
- **Explanation:** Shifts the bits in a register to the left by a specified number of positions, filling the vacated bits with zeros.
- **How it's used:**  Multiplying by powers of 2. Shifting left by one bit is equivalent to multiplying by 2, shifting by two bits is like multiplying by 4, and so on.
- **Example in code:** _sll t1, t1, t4_ shifts the value in _t1_ left by the number of bits specified in _t4_, storing the result in _t1_.

### **slli** - **Shift Left Logical Immediate**

- **What it stands for:** Shift Left Logical Immediate
- **Explanation:** Shifts the bits in a register to the left by an immediate (constant) value, filling the vacated bits with zeros.
- **How it's used:** Similar to _sll_, but the shift amount is a constant, not a register value.
- **Example in code:** _slli t4, t4, 2_ shifts the value in _t4_ left by 2 bits.

### **slt** - **Set if Less Than**

- **What it stands for:** Set if Less Than
- **Explanation:** Sets a register to 1 if the first register is less than the second register (signed comparison), otherwise sets it to 0.
- **How it's used:** To perform a less than comparison and store the boolean result in a register.
- **Example:** _slt x2, x3, x4_ will store _1_ in _x2_ if the signed value of _x3_ is less than that of _x4_, otherwise it will store _0_.

### **slti** - **Set if Less Than Immediate**

- **What it stands for:** Set if Less Than Immediate
- **Explanation:** Sets a register to 1 if the register is less than an immediate value (signed comparison), otherwise sets it to 0.
- **How it's used:** Similar to _slt_, but comparing against a constant value.
- **Example:** _slti x2, x3, 10_ will store _1_ in _x2_ if the signed value of _x3_ is less than _10_, otherwise it will store _0_.

### **sltiu** - **Set if Less Than Immediate Unsigned**

- **What it stands for:** Set if Less Than Immediate Unsigned
- **Explanation:** Sets a register to 1 if the register is less than an immediate value (unsigned comparison), otherwise sets it to 0.
- **How it's used:** Similar to _slti_, but the comparison is unsigned.
- **Example:** _sltiu x2, x3, 10_ will store _1_ in _x2_ if the unsigned value of _x3_ is less than _10_, otherwise it will store _0_.

### **sltu** - **Set if Less Than Unsigned**

- **What it stands for:** Set if Less Than Unsigned
- **Explanation:** Sets a register to 1 if the first register is less than the second register (unsigned comparison), otherwise sets it to 0.
- **How it's used:** Similar to _slt_, but the comparison is unsigned.
- **Example:** _sltu x2, x3, x4_ will store _1_ in _x2_ if the unsigned value of _x3_ is less than that of _x4_, otherwise it will store _0_.

### **snez** - **Set if Not Equal to Zero**

- **What it stands for:** Set if Not Equal to Zero
- **Explanation:** Sets a register to 1 if another register's value is not zero, otherwise sets it to 0.
- **How it's used:** To check for non-zero conditions. It's a pseudo-instruction, often implemented as _sltu rd, x0, rs_.
- **Example:** _snez x5, x6_ will store _1_ in _x5_ if _x6_ is not zero and _0_ otherwise.

### **sra** - **Shift Right Arithmetic**

- **What it stands for:** Shift Right Arithmetic
- **Explanation:** Shifts the bits in a register to the right by a specified number of positions, filling the vacated bits with the sign bit (most significant bit). This preserves the sign of the number.
- **How it's used:**  Dividing by powers of 2 while preserving the sign.
- **Example:** _sra x7, x8, 3_ will shift the contents of _x8_ right arithmetically by 3 bits and store the result in _x7_.

### **srai** - **Shift Right Arithmetic Immediate**

- **What it stands for:** Shift Right Arithmetic Immediate
- **Explanation:** Shifts the bits in a register to the right by an immediate (constant) value, filling the vacated bits with the sign bit.
- **How it's used:** Similar to _sra_, but the shift amount is a constant.
- **Example:** _srai x7, x8, 3_ will shift the contents of _x8_ right arithmetically by 3 bits and store the result in _x7_.

### **srl** - **Shift Right Logical**

- **What it stands for:** Shift Right Logical
- **Explanation:** Shifts the bits in a register to the right by a specified number of positions, filling the vacated bits with zeros.
- **How it's used:**  Dividing by powers of 2 (unsigned).
- **Example:** _srl x9, x10, 2_ will shift the value of _x10_ right logically by 2 bits and place the result in _x9_.

### **srli** - **Shift Right Logical Immediate**

- **What it stands for:** Shift Right Logical Immediate
- **Explanation:** Shifts the bits in a register to the right by an immediate (constant) value, filling the vacated bits with zeros.
- **How it's used:** Similar to _srl_, but the shift amount is a constant.
- **Example in code:** _srli a1, a1, 5_ shifts the value in _a1_ right by 5 bits.

### **sub** - **Subtract**z

- **What it stands for:** Subtract
- **Explanation:** Subtracts the second register from the first register, storing the result in the destination register.
- **How it's used:**  Basic arithmetic subtraction.
- **Example:** _sub x1, x2, x3_ subtracts the value in _x3_ from _x2_ and stores the result in _x1_.

### **subw** - **Subtract Word**

- **What it stands for:** Subtract Word
- **Explanation:** Subtracts the second register from the first register, treating them as 32-bit values, even on 64-bit systems, and storing a sign-extended 32-bit result. Requires RV64I.
- **How it's used:**  Performing 32-bit subtraction in a 64-bit environment.
- **Example:** _subw x1, x2, x3_ subtracts the lower 32 bits of _x3_ from _x2_, sign-extends the 32-bit result, and stores it in _x1_.

### **sw** - **Store Word**

- **What it stands for:** Store Word
- **Explanation:** Stores a word (32 bits) from a register into memory.
- **How it's used:** To write a 32-bit value to a specific memory address.
- **Example in code:** _sw t3, CTR0(t0)_ stores the value in _t3_ into the memory address calculated by adding the offset _CTR0_ to the value in _t0_.

### **xor** - **XOR**

- **What it stands for:** Exclusive OR
- **Explanation:** Performs a bitwise XOR (exclusive OR) operation between two registers.
- **How it's used:** Each bit in the result is 1 if the corresponding bits in the operands are different, and 0 if they are the same.
- **Example in code:** _xor a2, a2, a1_ performs a bitwise XOR between registers _a2_ and _a1_, storing the result in _a2_.

### **xori** - **XOR Immediate**

- **What it stands for:** Exclusive OR Immediate
- **Explanation:** Performs a bitwise XOR operation between a register and an immediate value.
- **How it's used:** Similar to _xor_, but one of the operands is a constant value.
- **Example:** _xori x5, x6, 0xFF_ performs a bitwise XOR of _x6_ with _0xFF_ and stores the result in _x5_.
