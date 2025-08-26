const people = [
  { name: "Alice", age: 20, role: "user" },
  { name: "Bob", age: 18, role: "admin" },
  { name: "Charlie", age: 25, role: "user" },
];

console.log(people.filter((item) => item.age > 18));

console.log(people.every((item) => item.age >= 18));

console.log(people.some((item) => item.age >= 100));

console.log(people.some((item) => item.role === "admin"));
console.log(people.includes((item) => item.role === "admin"));
