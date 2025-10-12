# LRU

Lease Recently Used 最近最少使用原则
内存 上限 n 3
A -> [A]
B -> [A,B]
C -> [A,B,C]
A -> [B,C,A]
D -> [C,A,D]

空间换时间
HashMap  
双向队列
