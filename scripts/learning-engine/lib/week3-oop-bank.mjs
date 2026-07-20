/**
 * Week 3 OOP — every problem teaches the named topic (no generic arithmetic).
 * Lesson ids stay `${slug}-${difficulty}-${problemType}-${index+1}` so progress is preserved.
 */
import { enrichProblem, javaSolution, clsName, defaultApproaches } from "./rich-fields.mjs";
import { estimatedMinutes as estMinutes } from "./problem-type-spec.mjs";

const WEEK3_TOPIC_SLUGS = new Set([
  "classes-objects",
  "constructors",
  "encapsulation",
  "inheritance",
  "polymorphism",
  "interfaces",
  "abstraction",
]);

export function isWeek3OopTopic(slug) {
  return WEEK3_TOPIC_SLUGS.has(slug);
}

const TOPIC_TITLES = {
  "classes-objects": "Classes & Objects",
  constructors: "Constructors",
  encapsulation: "Encapsulation",
  inheritance: "Inheritance",
  polymorphism: "Polymorphism",
  interfaces: "Interfaces",
  abstraction: "Abstraction",
};

/** @type {Record<string, Array<{ title: string; statement: string; code: (cn: string) => string; output: string; input: string }>>} */
const TOPIC_PROBLEMS = {
  "classes-objects": [
    {
      title: "Create a Student Object",
      statement: "Create a Student class with name and marks. Print Ravi scored 88.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Student {
        String name;
        int marks;
        void show() { System.out.println(name + " scored " + marks); }
    }
`,
          `        Student s = new Student();
        s.name = "Ravi";
        s.marks = 88;
        s.show();`
        ),
      output: "Ravi scored 88",
      input: "name=Ravi, marks=88",
    },
    {
      title: "Book Title and Pages",
      statement: "Model a Book with title and pages. Print Java Basics (240 pages).",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Book {
        String title;
        int pages;
    }
`,
          `        Book b = new Book();
        b.title = "Java Basics";
        b.pages = 240;
        System.out.println(b.title + " (" + b.pages + " pages)");`
        ),
      output: "Java Basics (240 pages)",
      input: "title=Java Basics, pages=240",
    },
    {
      title: "Car Speed Method",
      statement: "Create a Car with speed field and accelerate() that adds 10. Start at 40 and print final speed.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Car {
        int speed;
        void accelerate() { speed += 10; }
    }
`,
          `        Car c = new Car();
        c.speed = 40;
        c.accelerate();
        System.out.println(c.speed);`
        ),
      output: "50",
      input: "speed=40, accelerate once",
    },
    {
      title: "Two Phone Objects",
      statement: "Create two Phone objects with brands Samsung and Apple. Print both brands on separate lines.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Phone {
        String brand;
    }
`,
          `        Phone p1 = new Phone();
        Phone p2 = new Phone();
        p1.brand = "Samsung";
        p2.brand = "Apple";
        System.out.println(p1.brand);
        System.out.println(p2.brand);`
        ),
      output: "Samsung\nApple",
      input: "two Phone instances",
    },
    {
      title: "Rectangle Area",
      statement: "Create a Rectangle with length 8 and width 5. Print area using a method.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Rectangle {
        int length;
        int width;
        int area() { return length * width; }
    }
`,
          `        Rectangle r = new Rectangle();
        r.length = 8;
        r.width = 5;
        System.out.println(r.area());`
        ),
      output: "40",
      input: "length=8, width=5",
    },
    {
      title: "Employee Id Display",
      statement: "Create an Employee with id 101 and name Neha. Print [101] Neha.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Employee {
        int id;
        String name;
        void display() { System.out.println("[" + id + "] " + name); }
    }
`,
          `        Employee e = new Employee();
        e.id = 101;
        e.name = "Neha";
        e.display();`
        ),
      output: "[101] Neha",
      input: "id=101, name=Neha",
    },
    {
      title: "Counter Increment",
      statement: "Create a Counter object with value 0. Call inc() three times and print value.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Counter {
        int value;
        void inc() { value++; }
    }
`,
          `        Counter c = new Counter();
        c.inc();
        c.inc();
        c.inc();
        System.out.println(c.value);`
        ),
      output: "3",
      input: "inc() x3",
    },
    {
      title: "Laptop Specs",
      statement: "Create a Laptop with ramGb=16 and print RAM: 16GB.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Laptop {
        int ramGb;
    }
`,
          `        Laptop lap = new Laptop();
        lap.ramGb = 16;
        System.out.println("RAM: " + lap.ramGb + "GB");`
        ),
      output: "RAM: 16GB",
      input: "ramGb=16",
    },
    {
      title: "Dog Bark",
      statement: "Create a Dog class with method bark() that prints Woof. Call it once.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Dog {
        void bark() { System.out.println("Woof"); }
    }
`,
          `        Dog d = new Dog();
        d.bark();`
        ),
      output: "Woof",
      input: "no fields",
    },
    {
      title: "Point Coordinates",
      statement: "Create a Point with x=3 and y=7. Print (3,7).",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Point {
        int x;
        int y;
    }
`,
          `        Point p = new Point();
        p.x = 3;
        p.y = 7;
        System.out.println("(" + p.x + "," + p.y + ")");`
        ),
      output: "(3,7)",
      input: "x=3, y=7",
    },
    {
      title: "Bank Customer",
      statement: "Create a Customer with name Asha and print Hello, Asha.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Customer {
        String name;
        void greet() { System.out.println("Hello, " + name); }
    }
`,
          `        Customer c = new Customer();
        c.name = "Asha";
        c.greet();`
        ),
      output: "Hello, Asha",
      input: "name=Asha",
    },
    {
      title: "Two Circles Radius",
      statement: "Create two Circle objects with radius 2 and 5. Print both radii on one line: 2 5.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Circle {
        int radius;
    }
`,
          `        Circle a = new Circle();
        Circle b = new Circle();
        a.radius = 2;
        b.radius = 5;
        System.out.println(a.radius + " " + b.radius);`
        ),
      output: "2 5",
      input: "r=2 and r=5",
    },
  ],

  constructors: [
    {
      title: "Parameterized Student",
      statement: "Use a parameterized constructor to create Student(\"Kiran\", 91) and print Kiran:91.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Student {
        String name;
        int marks;
        Student(String name, int marks) {
            this.name = name;
            this.marks = marks;
        }
    }
`,
          `        Student s = new Student("Kiran", 91);
        System.out.println(s.name + ":" + s.marks);`
        ),
      output: "Kiran:91",
      input: 'Student("Kiran", 91)',
    },
    {
      title: "Default Balance",
      statement: "Account constructor sets balance to 1000 when no args. Print the balance.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Account {
        int balance;
        Account() { balance = 1000; }
    }
`,
          `        Account a = new Account();
        System.out.println(a.balance);`
        ),
      output: "1000",
      input: "new Account()",
    },
    {
      title: "Constructor Chaining",
      statement: "Use this() chaining: Product() calls Product(\"Generic\", 10). Print Generic @ 10.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Product {
        String name;
        int price;
        Product() { this("Generic", 10); }
        Product(String name, int price) {
            this.name = name;
            this.price = price;
        }
    }
`,
          `        Product p = new Product();
        System.out.println(p.name + " @ " + p.price);`
        ),
      output: "Generic @ 10",
      input: "new Product()",
    },
    {
      title: "Rectangle Constructor",
      statement: "Create Rectangle(6, 4) via constructor and print area 24.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Rectangle {
        int l, w;
        Rectangle(int l, int w) { this.l = l; this.w = w; }
        int area() { return l * w; }
    }
`,
          `        Rectangle r = new Rectangle(6, 4);
        System.out.println(r.area());`
        ),
      output: "24",
      input: "l=6, w=4",
    },
    {
      title: "Overloaded Constructors",
      statement: "User has User(String) and User(String, int). Create User(\"Dev\", 25) and print Dev(25).",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class User {
        String name;
        int age;
        User(String name) { this(name, 0); }
        User(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }
`,
          `        User u = new User("Dev", 25);
        System.out.println(u.name + "(" + u.age + ")");`
        ),
      output: "Dev(25)",
      input: 'User("Dev", 25)',
    },
    {
      title: "Immutable Id",
      statement: "Employee constructor sets final id=501 and name Meera. Print 501-Meera.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Employee {
        final int id;
        String name;
        Employee(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }
`,
          `        Employee e = new Employee(501, "Meera");
        System.out.println(e.id + "-" + e.name);`
        ),
      output: "501-Meera",
      input: "id=501, name=Meera",
    },
    {
      title: "City Coordinates",
      statement: "Create City(\"Hyderabad\", 17) with constructor. Print Hyderabad@17.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class City {
        String name;
        int zone;
        City(String name, int zone) {
            this.name = name;
            this.zone = zone;
        }
    }
`,
          `        City c = new City("Hyderabad", 17);
        System.out.println(c.name + "@" + c.zone);`
        ),
      output: "Hyderabad@17",
      input: "Hyderabad, zone 17",
    },
    {
      title: "Copy-like Init",
      statement: "Create Box(3) where side is set in constructor. Print volume side*side*side = 27.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Box {
        int side;
        Box(int side) { this.side = side; }
        int volume() { return side * side * side; }
    }
`,
          `        Box b = new Box(3);
        System.out.println(b.volume());`
        ),
      output: "27",
      input: "side=3",
    },
    {
      title: "Laptop Specs Constructor",
      statement: "Laptop(16, 512) sets ram and ssd. Print 16GB/512GB.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Laptop {
        int ram;
        int ssd;
        Laptop(int ram, int ssd) {
            this.ram = ram;
            this.ssd = ssd;
        }
    }
`,
          `        Laptop l = new Laptop(16, 512);
        System.out.println(l.ram + "GB/" + l.ssd + "GB");`
        ),
      output: "16GB/512GB",
      input: "ram=16, ssd=512",
    },
    {
      title: "Order Total",
      statement: "Order(qty, price) stores fields. Create Order(3, 50) and print total 150.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Order {
        int qty;
        int price;
        Order(int qty, int price) {
            this.qty = qty;
            this.price = price;
        }
        int total() { return qty * price; }
    }
`,
          `        Order o = new Order(3, 50);
        System.out.println(o.total());`
        ),
      output: "150",
      input: "qty=3, price=50",
    },
    {
      title: "Bank Open Account",
      statement: "BankAccount(String holder) starts with balance 0. Print holder and balance: Priya 0.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class BankAccount {
        String holder;
        int balance;
        BankAccount(String holder) {
            this.holder = holder;
            this.balance = 0;
        }
    }
`,
          `        BankAccount a = new BankAccount("Priya");
        System.out.println(a.holder + " " + a.balance);`
        ),
      output: "Priya 0",
      input: "holder=Priya",
    },
    {
      title: "Temperature Init",
      statement: "Temperature(celsius) constructor. Create Temperature(37) and print 37C.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Temperature {
        int celsius;
        Temperature(int celsius) { this.celsius = celsius; }
    }
`,
          `        Temperature t = new Temperature(37);
        System.out.println(t.celsius + "C");`
        ),
      output: "37C",
      input: "37 degrees",
    },
  ],

  encapsulation: [
    {
      title: "Private Balance Deposit",
      statement:
        "Create a BankAccount with private balance. Use deposit(500) on an account starting at 1000 and print balance via getter: 1500.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class BankAccount {
        private int balance;
        BankAccount(int balance) { this.balance = balance; }
        public void deposit(int amount) { if (amount > 0) balance += amount; }
        public int getBalance() { return balance; }
    }
`,
          `        BankAccount acc = new BankAccount(1000);
        acc.deposit(500);
        System.out.println(acc.getBalance());`
        ),
      output: "1500",
      input: "start=1000, deposit=500",
    },
    {
      title: "Validated Marks Setter",
      statement:
        "Student has private marks. setMarks rejects values outside 0–100. Set 105 then 85; print getMarks().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Student {
        private int marks;
        public void setMarks(int marks) {
            if (marks >= 0 && marks <= 100) this.marks = marks;
        }
        public int getMarks() { return marks; }
    }
`,
          `        Student s = new Student();
        s.setMarks(105);
        s.setMarks(85);
        System.out.println(s.getMarks());`
        ),
      output: "85",
      input: "setMarks(105) then setMarks(85)",
    },
    {
      title: "Employee Salary Capsule",
      statement:
        "Employee keeps private salary. setSalary(45000) and print getSalary().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Employee {
        private int salary;
        public void setSalary(int salary) {
            if (salary > 0) this.salary = salary;
        }
        public int getSalary() { return salary; }
    }
`,
          `        Employee e = new Employee();
        e.setSalary(45000);
        System.out.println(e.getSalary());`
        ),
      output: "45000",
      input: "salary=45000",
    },
    {
      title: "Withdraw With Guard",
      statement:
        "Account starts at 800 with private balance. withdraw(300) then print remaining balance 500.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Account {
        private int balance;
        Account(int balance) { this.balance = balance; }
        public void withdraw(int amount) {
            if (amount > 0 && amount <= balance) balance -= amount;
        }
        public int getBalance() { return balance; }
    }
`,
          `        Account a = new Account(800);
        a.withdraw(300);
        System.out.println(a.getBalance());`
        ),
      output: "500",
      input: "800 then withdraw 300",
    },
    {
      title: "Product Price Encapsulation",
      statement:
        "Product has private price. setPrice(-10) is ignored; setPrice(299) sticks. Print getPrice().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Product {
        private int price;
        public void setPrice(int price) {
            if (price > 0) this.price = price;
        }
        public int getPrice() { return price; }
    }
`,
          `        Product p = new Product();
        p.setPrice(-10);
        p.setPrice(299);
        System.out.println(p.getPrice());`
        ),
      output: "299",
      input: "invalid then valid price",
    },
    {
      title: "Read-Only Id",
      statement:
        "User has private final id set in constructor and private name with getter. Print 42:Anu.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class User {
        private final int id;
        private String name;
        User(int id, String name) {
            this.id = id;
            this.name = name;
        }
        public int getId() { return id; }
        public String getName() { return name; }
    }
`,
          `        User u = new User(42, "Anu");
        System.out.println(u.getId() + ":" + u.getName());`
        ),
      output: "42:Anu",
      input: "id=42, name=Anu",
    },
    {
      title: "Temperature Bounds",
      statement:
        "Temperature private celsius; setCelsius only allows -50 to 60. Set 100 then 36; print getCelsius().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Temperature {
        private int celsius;
        public void setCelsius(int celsius) {
            if (celsius >= -50 && celsius <= 60) this.celsius = celsius;
        }
        public int getCelsius() { return celsius; }
    }
`,
          `        Temperature t = new Temperature();
        t.setCelsius(100);
        t.setCelsius(36);
        System.out.println(t.getCelsius());`
        ),
      output: "36",
      input: "100 rejected, 36 accepted",
    },
    {
      title: "Hide Password Field",
      statement:
        "Login has private password. setPassword(\"secret\") then authenticate(\"secret\") prints OK.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Login {
        private String password;
        public void setPassword(String password) { this.password = password; }
        public void authenticate(String attempt) {
            if (password != null && password.equals(attempt)) System.out.println("OK");
            else System.out.println("FAIL");
        }
    }
`,
          `        Login login = new Login();
        login.setPassword("secret");
        login.authenticate("secret");`
        ),
      output: "OK",
      input: "password=secret",
    },
    {
      title: "Age Validation",
      statement:
        "Person private age; setAge rejects negatives. setAge(-3) then setAge(21); print getAge().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Person {
        private int age;
        public void setAge(int age) {
            if (age >= 0) this.age = age;
        }
        public int getAge() { return age; }
    }
`,
          `        Person p = new Person();
        p.setAge(-3);
        p.setAge(21);
        System.out.println(p.getAge());`
        ),
      output: "21",
      input: "invalid then valid age",
    },
    {
      title: "Wallet Spend",
      statement:
        "Wallet private money=200. spend(75) then print getMoney() = 125.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Wallet {
        private int money;
        Wallet(int money) { this.money = money; }
        public void spend(int amount) {
            if (amount > 0 && amount <= money) money -= amount;
        }
        public int getMoney() { return money; }
    }
`,
          `        Wallet w = new Wallet(200);
        w.spend(75);
        System.out.println(w.getMoney());`
        ),
      output: "125",
      input: "200 spend 75",
    },
    {
      title: "Score Capsule",
      statement:
        "Game has private score. addPoints(10) twice then print getScore() = 20.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Game {
        private int score;
        public void addPoints(int points) {
            if (points > 0) score += points;
        }
        public int getScore() { return score; }
    }
`,
          `        Game g = new Game();
        g.addPoints(10);
        g.addPoints(10);
        System.out.println(g.getScore());`
        ),
      output: "20",
      input: "addPoints(10) x2",
    },
    {
      title: "Library Book Copies",
      statement:
        "Book private copies=3. borrow() decreases by 1. Borrow once; print getCopies() = 2.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Book {
        private int copies;
        Book(int copies) { this.copies = copies; }
        public void borrow() {
            if (copies > 0) copies--;
        }
        public int getCopies() { return copies; }
    }
`,
          `        Book b = new Book(3);
        b.borrow();
        System.out.println(b.getCopies());`
        ),
      output: "2",
      input: "copies=3, borrow once",
    },
  ],

  inheritance: [
    {
      title: "Animal and Dog",
      statement: "Dog extends Animal. Animal has eat() printing Eating. Call eat() on Dog.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Animal {
        void eat() { System.out.println("Eating"); }
    }
    static class Dog extends Animal {}
`,
          `        Dog d = new Dog();
        d.eat();`
        ),
      output: "Eating",
      input: "Dog inherits eat()",
    },
    {
      title: "Vehicle Speed",
      statement: "Car extends Vehicle. Vehicle has speed=60. Print car.speed.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Vehicle {
        int speed = 60;
    }
    static class Car extends Vehicle {}
`,
          `        Car c = new Car();
        System.out.println(c.speed);`
        ),
      output: "60",
      input: "inherited field",
    },
    {
      title: "Super Constructor",
      statement: "Employee(String) calls super(name). Person stores name. Print Dev.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Person {
        String name;
        Person(String name) { this.name = name; }
    }
    static class Employee extends Person {
        Employee(String name) { super(name); }
    }
`,
          `        Employee e = new Employee("Dev");
        System.out.println(e.name);`
        ),
      output: "Dev",
      input: "super(name)",
    },
    {
      title: "Manager Bonus",
      statement: "Manager extends Employee with salary 50000 and adds bonus 5000. Print total pay 55000.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Employee {
        int salary;
        Employee(int salary) { this.salary = salary; }
    }
    static class Manager extends Employee {
        int bonus;
        Manager(int salary, int bonus) {
            super(salary);
            this.bonus = bonus;
        }
        int total() { return salary + bonus; }
    }
`,
          `        Manager m = new Manager(50000, 5000);
        System.out.println(m.total());`
        ),
      output: "55000",
      input: "salary+bonus",
    },
    {
      title: "Shape Color",
      statement: "Circle extends Shape. Shape has color red. Print circle.color.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Shape {
        String color = "red";
    }
    static class Circle extends Shape {}
`,
          `        Circle c = new Circle();
        System.out.println(c.color);`
        ),
      output: "red",
      input: "inherited color",
    },
    {
      title: "Laptop is Computer",
      statement: "Laptop extends Computer. Computer.start() prints Booting. Call start on Laptop.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Computer {
        void start() { System.out.println("Booting"); }
    }
    static class Laptop extends Computer {}
`,
          `        Laptop l = new Laptop();
        l.start();`
        ),
      output: "Booting",
      input: "IS-A relationship",
    },
    {
      title: "Multilevel Inheritance",
      statement: "Puppy extends Dog extends Animal. Animal.speak prints Sound. Call speak on Puppy.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Animal {
        void speak() { System.out.println("Sound"); }
    }
    static class Dog extends Animal {}
    static class Puppy extends Dog {}
`,
          `        Puppy p = new Puppy();
        p.speak();`
        ),
      output: "Sound",
      input: "multilevel",
    },
    {
      title: "Super Method Call",
      statement: "Child.greet() calls super.greet() then prints Child. Output two lines: Parent then Child.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Parent {
        void greet() { System.out.println("Parent"); }
    }
    static class Child extends Parent {
        @Override
        void greet() {
            super.greet();
            System.out.println("Child");
        }
    }
`,
          `        Child c = new Child();
        c.greet();`
        ),
      output: "Parent\nChild",
      input: "super.greet()",
    },
    {
      title: "Savings Account Rate",
      statement: "SavingsAccount extends Account with rate 4. Print rate from SavingsAccount.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Account {
        String type = "generic";
    }
    static class SavingsAccount extends Account {
        int rate = 4;
    }
`,
          `        SavingsAccount s = new SavingsAccount();
        System.out.println(s.rate);`
        ),
      output: "4",
      input: "rate=4",
    },
    {
      title: "Teacher is Person",
      statement: "Teacher extends Person. Person has age 30. Print teacher.age.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Person {
        int age = 30;
    }
    static class Teacher extends Person {}
`,
          `        Teacher t = new Teacher();
        System.out.println(t.age);`
        ),
      output: "30",
      input: "inherited age",
    },
    {
      title: "Bike Extends Vehicle",
      statement: "Bike extends Vehicle. Vehicle.start() prints Engine On. Call start on Bike.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Vehicle {
        void start() { System.out.println("Engine On"); }
    }
    static class Bike extends Vehicle {}
`,
          `        Bike b = new Bike();
        b.start();`
        ),
      output: "Engine On",
      input: "inherited method",
    },
    {
      title: "Admin User Role",
      statement: "Admin extends User. User role is user; Admin sets role admin in constructor. Print admin.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class User {
        String role = "user";
    }
    static class Admin extends User {
        Admin() { role = "admin"; }
    }
`,
          `        Admin a = new Admin();
        System.out.println(a.role);`
        ),
      output: "admin",
      input: "subclass overrides field init",
    },
  ],

  polymorphism: [
    {
      title: "Overriding Sound",
      statement: "Animal ref holds Dog. Dog overrides sound() to print Bark. Call sound().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Animal {
        void sound() { System.out.println("Generic"); }
    }
    static class Dog extends Animal {
        @Override
        void sound() { System.out.println("Bark"); }
    }
`,
          `        Animal a = new Dog();
        a.sound();`
        ),
      output: "Bark",
      input: "runtime dispatch",
    },
    {
      title: "Shape Area Dispatch",
      statement: "Shape ref to Rectangle(4,5). Override area() and print 20.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Shape {
        int area() { return 0; }
    }
    static class Rectangle extends Shape {
        int w, h;
        Rectangle(int w, int h) { this.w = w; this.h = h; }
        @Override
        int area() { return w * h; }
    }
`,
          `        Shape s = new Rectangle(4, 5);
        System.out.println(s.area());`
        ),
      output: "20",
      input: "Rectangle via Shape",
    },
    {
      title: "Payment Method Override",
      statement: "Payment p = new UpiPayment(); pay() prints UPI Paid.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Payment {
        void pay() { System.out.println("Cash"); }
    }
    static class UpiPayment extends Payment {
        @Override
        void pay() { System.out.println("UPI Paid"); }
    }
`,
          `        Payment p = new UpiPayment();
        p.pay();`
        ),
      output: "UPI Paid",
      input: "UpiPayment",
    },
    {
      title: "Method Overloading",
      statement: "Calculator has add(int,int) and add(int,int,int). Print add(2,3) and add(1,2,3) on two lines.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Calculator {
        int add(int a, int b) { return a + b; }
        int add(int a, int b, int c) { return a + b + c; }
    }
`,
          `        Calculator c = new Calculator();
        System.out.println(c.add(2, 3));
        System.out.println(c.add(1, 2, 3));`
        ),
      output: "5\n6",
      input: "overloading",
    },
    {
      title: "Employee Notify",
      statement: "Employee e = new Manager(); notifyUser() overridden to print Manager Mail.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Employee {
        void notifyUser() { System.out.println("Staff Mail"); }
    }
    static class Manager extends Employee {
        @Override
        void notifyUser() { System.out.println("Manager Mail"); }
    }
`,
          `        Employee e = new Manager();
        e.notifyUser();`
        ),
      output: "Manager Mail",
      input: "Manager via Employee",
    },
    {
      title: "Array of Shapes",
      statement: "Shape[] holds Circle area 9 and Rectangle area 12. Print sum of areas 21.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Shape {
        int area() { return 0; }
    }
    static class Circle extends Shape {
        @Override int area() { return 9; }
    }
    static class Rectangle extends Shape {
        @Override int area() { return 12; }
    }
`,
          `        Shape[] shapes = { new Circle(), new Rectangle() };
        int sum = 0;
        for (Shape s : shapes) sum += s.area();
        System.out.println(sum);`
        ),
      output: "21",
      input: "polymorphic array",
    },
    {
      title: "Printer Types",
      statement: "Printer p = new ColorPrinter(); print() outputs Color Page.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Printer {
        void print() { System.out.println("Mono Page"); }
    }
    static class ColorPrinter extends Printer {
        @Override
        void print() { System.out.println("Color Page"); }
    }
`,
          `        Printer p = new ColorPrinter();
        p.print();`
        ),
      output: "Color Page",
      input: "ColorPrinter",
    },
    {
      title: "Vehicle Drive",
      statement: "Vehicle v = new Bike(); drive() prints Two Wheeler.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Vehicle {
        void drive() { System.out.println("Driving"); }
    }
    static class Bike extends Vehicle {
        @Override
        void drive() { System.out.println("Two Wheeler"); }
    }
`,
          `        Vehicle v = new Bike();
        v.drive();`
        ),
      output: "Two Wheeler",
      input: "Bike via Vehicle",
    },
    {
      title: "String Value Overload",
      statement: "Display.show(int) and show(String). Call show(7) and show(\"Hi\") on two lines.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Display {
        void show(int n) { System.out.println(n); }
        void show(String s) { System.out.println(s); }
    }
`,
          `        Display d = new Display();
        d.show(7);
        d.show("Hi");`
        ),
      output: "7\nHi",
      input: "compile-time overload",
    },
    {
      title: "Logger Levels",
      statement: "Logger log = new ErrorLogger(); write() prints ERROR.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Logger {
        void write() { System.out.println("INFO"); }
    }
    static class ErrorLogger extends Logger {
        @Override
        void write() { System.out.println("ERROR"); }
    }
`,
          `        Logger log = new ErrorLogger();
        log.write();`
        ),
      output: "ERROR",
      input: "ErrorLogger",
    },
    {
      title: "Discount Policy",
      statement: "Discount d = new FestivalDiscount(); rate() returns 20. Print 20.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Discount {
        int rate() { return 5; }
    }
    static class FestivalDiscount extends Discount {
        @Override
        int rate() { return 20; }
    }
`,
          `        Discount d = new FestivalDiscount();
        System.out.println(d.rate());`
        ),
      output: "20",
      input: "FestivalDiscount",
    },
    {
      title: "Role Greeting",
      statement: "User u = new Admin(); greet() prints Welcome Admin.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class User {
        void greet() { System.out.println("Welcome User"); }
    }
    static class Admin extends User {
        @Override
        void greet() { System.out.println("Welcome Admin"); }
    }
`,
          `        User u = new Admin();
        u.greet();`
        ),
      output: "Welcome Admin",
      input: "Admin via User",
    },
  ],

  interfaces: [
    {
      title: "Payable Invoice",
      statement: "Invoice implements Payable. amount() returns 250. Print amount().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Payable {
        int amount();
    }
    static class Invoice implements Payable {
        @Override
        public int amount() { return 250; }
    }
`,
          `        Payable bill = new Invoice();
        System.out.println(bill.amount());`
        ),
      output: "250",
      input: "Invoice as Payable",
    },
    {
      title: "Drawable Circle",
      statement: "Circle implements Drawable. draw() prints Circle Drawn.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Drawable {
        void draw();
    }
    static class Circle implements Drawable {
        @Override
        public void draw() { System.out.println("Circle Drawn"); }
    }
`,
          `        Drawable d = new Circle();
        d.draw();`
        ),
      output: "Circle Drawn",
      input: "Circle as Drawable",
    },
    {
      title: "Multiple Interfaces",
      statement: "CameraPhone implements Camera and Phone. Call snap() then call(). Output SNAP then CALL.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Camera { void snap(); }
    interface Phone { void call(); }
    static class CameraPhone implements Camera, Phone {
        @Override public void snap() { System.out.println("SNAP"); }
        @Override public void call() { System.out.println("CALL"); }
    }
`,
          `        CameraPhone device = new CameraPhone();
        device.snap();
        device.call();`
        ),
      output: "SNAP\nCALL",
      input: "two interfaces",
    },
    {
      title: "Default Method",
      statement: "Logger interface has default info() printing INFO. AppLogger implements Logger with no override. Call info().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Logger {
        default void info() { System.out.println("INFO"); }
    }
    static class AppLogger implements Logger {}
`,
          `        Logger log = new AppLogger();
        log.info();`
        ),
      output: "INFO",
      input: "default method",
    },
    {
      title: "Comparable Order",
      statement: "Compare two Order ids using Comparable. Print the smaller id 10.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Order implements Comparable<Order> {
        int id;
        Order(int id) { this.id = id; }
        @Override
        public int compareTo(Order other) { return Integer.compare(this.id, other.id); }
    }
`,
          `        Order a = new Order(10);
        Order b = new Order(20);
        System.out.println(a.compareTo(b) < 0 ? a.id : b.id);`
        ),
      output: "10",
      input: "ids 10 and 20",
    },
    {
      title: "Runnable Task",
      statement: "Task implements Runnable. run() prints Task Done. Call run() directly.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static class Task implements Runnable {
        @Override
        public void run() { System.out.println("Task Done"); }
    }
`,
          `        Runnable r = new Task();
        r.run();`
        ),
      output: "Task Done",
      input: "Runnable",
    },
    {
      title: "Payment Gateway",
      statement: "UpiGateway implements PaymentGateway. pay(100) prints Paid 100.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface PaymentGateway {
        void pay(int amount);
    }
    static class UpiGateway implements PaymentGateway {
        @Override
        public void pay(int amount) { System.out.println("Paid " + amount); }
    }
`,
          `        PaymentGateway g = new UpiGateway();
        g.pay(100);`
        ),
      output: "Paid 100",
      input: "amount=100",
    },
    {
      title: "Sensor Read",
      statement: "TempSensor implements Sensor. read() returns 36. Print read().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Sensor {
        int read();
    }
    static class TempSensor implements Sensor {
        @Override
        public int read() { return 36; }
    }
`,
          `        Sensor s = new TempSensor();
        System.out.println(s.read());`
        ),
      output: "36",
      input: "TempSensor",
    },
    {
      title: "Flyable Bird",
      statement: "Bird implements Flyable. fly() prints Flying High.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Flyable {
        void fly();
    }
    static class Bird implements Flyable {
        @Override
        public void fly() { System.out.println("Flying High"); }
    }
`,
          `        Flyable f = new Bird();
        f.fly();`
        ),
      output: "Flying High",
      input: "Bird as Flyable",
    },
    {
      title: "Repository Save",
      statement: "UserRepo implements Repository. save() prints Saved.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Repository {
        void save();
    }
    static class UserRepo implements Repository {
        @Override
        public void save() { System.out.println("Saved"); }
    }
`,
          `        Repository repo = new UserRepo();
        repo.save();`
        ),
      output: "Saved",
      input: "UserRepo",
    },
    {
      title: "Authenticator Check",
      statement: "SimpleAuth implements Authenticator. check(\"admin\") prints true.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Authenticator {
        boolean check(String user);
    }
    static class SimpleAuth implements Authenticator {
        @Override
        public boolean check(String user) { return "admin".equals(user); }
    }
`,
          `        Authenticator auth = new SimpleAuth();
        System.out.println(auth.check("admin"));`
        ),
      output: "true",
      input: "user=admin",
    },
    {
      title: "Exportable Report",
      statement: "PdfReport implements Exportable. export() prints PDF.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Exportable {
        void export();
    }
    static class PdfReport implements Exportable {
        @Override
        public void export() { System.out.println("PDF"); }
    }
`,
          `        Exportable e = new PdfReport();
        e.export();`
        ),
      output: "PDF",
      input: "PdfReport",
    },
  ],

  abstraction: [
    {
      title: "Abstract Shape Area",
      statement: "Abstract Shape with abstract area(). Rectangle(5,6) implements it. Print 30.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Shape {
        abstract int area();
    }
    static class Rectangle extends Shape {
        int w, h;
        Rectangle(int w, int h) { this.w = w; this.h = h; }
        @Override int area() { return w * h; }
    }
`,
          `        Shape s = new Rectangle(5, 6);
        System.out.println(s.area());`
        ),
      output: "30",
      input: "Rectangle via Shape",
    },
    {
      title: "Abstract Animal Speak",
      statement: "Abstract Animal.speak(). Dog implements Bark. Call speak on Animal ref.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Animal {
        abstract void speak();
    }
    static class Dog extends Animal {
        @Override void speak() { System.out.println("Bark"); }
    }
`,
          `        Animal a = new Dog();
        a.speak();`
        ),
      output: "Bark",
      input: "Dog via Animal",
    },
    {
      title: "Template Method",
      statement: "Abstract Report has printHeader() and abstract body(). SalesReport body prints Sales. Call print().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Report {
        void print() {
            System.out.println("HEADER");
            body();
        }
        abstract void body();
    }
    static class SalesReport extends Report {
        @Override void body() { System.out.println("Sales"); }
    }
`,
          `        Report r = new SalesReport();
        r.print();`
        ),
      output: "HEADER\nSales",
      input: "template method",
    },
    {
      title: "Abstract Payment",
      statement: "Abstract Payment.process(). CardPayment prints Card OK.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Payment {
        abstract void process();
    }
    static class CardPayment extends Payment {
        @Override void process() { System.out.println("Card OK"); }
    }
`,
          `        Payment p = new CardPayment();
        p.process();`
        ),
      output: "Card OK",
      input: "CardPayment",
    },
    {
      title: "Abstract + Concrete Method",
      statement: "Abstract Machine has start() printing Start and abstract run(). Fan.run prints Spin. Call start then run.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Machine {
        void start() { System.out.println("Start"); }
        abstract void run();
    }
    static class Fan extends Machine {
        @Override void run() { System.out.println("Spin"); }
    }
`,
          `        Machine m = new Fan();
        m.start();
        m.run();`
        ),
      output: "Start\nSpin",
      input: "Fan via Machine",
    },
    {
      title: "Database Connection",
      statement: "Abstract Database.connect(). MySqlDatabase prints MySQL Connected.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Database {
        abstract void connect();
    }
    static class MySqlDatabase extends Database {
        @Override void connect() { System.out.println("MySQL Connected"); }
    }
`,
          `        Database db = new MySqlDatabase();
        db.connect();`
        ),
      output: "MySQL Connected",
      input: "MySqlDatabase",
    },
    {
      title: "Abstract Employee Pay",
      statement: "Abstract Employee.pay(). FullTime returns 60000. Print pay().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Employee {
        abstract int pay();
    }
    static class FullTime extends Employee {
        @Override int pay() { return 60000; }
    }
`,
          `        Employee e = new FullTime();
        System.out.println(e.pay());`
        ),
      output: "60000",
      input: "FullTime",
    },
    {
      title: "Notification Channel",
      statement: "Abstract Notifier.send(). EmailNotifier prints Email Sent.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Notifier {
        abstract void send();
    }
    static class EmailNotifier extends Notifier {
        @Override void send() { System.out.println("Email Sent"); }
    }
`,
          `        Notifier n = new EmailNotifier();
        n.send();`
        ),
      output: "Email Sent",
      input: "EmailNotifier",
    },
    {
      title: "Abstract Game Loop",
      statement: "Abstract Game has play() calling abstract move(). Chess.move prints Move Piece. Call play().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Game {
        void play() { move(); }
        abstract void move();
    }
    static class Chess extends Game {
        @Override void move() { System.out.println("Move Piece"); }
    }
`,
          `        Game g = new Chess();
        g.play();`
        ),
      output: "Move Piece",
      input: "Chess via Game",
    },
    {
      title: "Storage Write",
      statement: "Abstract Storage.write(). FileStorage prints Written.",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Storage {
        abstract void write();
    }
    static class FileStorage extends Storage {
        @Override void write() { System.out.println("Written"); }
    }
`,
          `        Storage s = new FileStorage();
        s.write();`
        ),
      output: "Written",
      input: "FileStorage",
    },
    {
      title: "Abstract Transport",
      statement: "Abstract Transport.fare(). Bus returns 40. Print fare().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    static abstract class Transport {
        abstract int fare();
    }
    static class Bus extends Transport {
        @Override int fare() { return 40; }
    }
`,
          `        Transport t = new Bus();
        System.out.println(t.fare());`
        ),
      output: "40",
      input: "Bus fare",
    },
    {
      title: "Abstract + Interface Mix",
      statement: "Abstract Device implements Switchable. Light.on() prints ON. Call on().",
      code: (cn) =>
        javaSolution(
          cn,
          [],
          `    interface Switchable { void on(); }
    static abstract class Device implements Switchable {}
    static class Light extends Device {
        @Override public void on() { System.out.println("ON"); }
    }
`,
          `        Switchable s = new Light();
        s.on();`
        ),
      output: "ON",
      input: "Light via Switchable",
    },
  ],
};

function pickTemplate(slug, index) {
  const list = TOPIC_PROBLEMS[slug];
  if (!list) {
    throw new Error(`Week 3 topic "${slug}" has no dedicated problem bank`);
  }
  if (index >= list.length) {
    throw new Error(
      `Week 3 topic "${slug}" needs more templates (requested index ${index}, have ${list.length})`
    );
  }
  return list[index];
}

function injectOopBug(code, index) {
  const bugs = [
    (c) => c.replace("private int", "int"),
    (c) => c.replace("@Override\n", ""),
    (c) => c.replace("super(", "/*super(*/"),
    (c) => c.replace("implements ", "extends "),
  ];
  const patched = bugs[index % bugs.length](code);
  // Keep find-bug exercises compilable where possible — prefer simple typos
  if (patched.includes("/*super(")) {
    return code.replace("return balance;", "return balance + 1;");
  }
  if (patched.includes("extends Payable") || patched.includes("extends Drawable")) {
    return code.replace('System.out.println("', 'System.out.println("BUG:');
  }
  return patched === code ? code.replace("return ", "return /*bug*/ ") : patched;
}

function typeSuffix(problemType) {
  if (problemType === "output-prediction") return " — Output?";
  if (problemType === "find-bug") return " — Fix the Bug";
  if (problemType === "dry-run") return " — Dry Run";
  if (problemType === "interview") return " — Practice";
  return "";
}

export function buildWeek3OopProblem(slug, topicTitle, category, difficulty, problemType, index) {
  const className = clsName(slug, `W3${difficulty[0]}${index + 1}`);
  const tpl = pickTemplate(slug, index);
  const topicLabel = TOPIC_TITLES[slug] ?? topicTitle;

  let code = tpl.code(className);
  let output = tpl.output;
  let statement = tpl.statement;
  let title = `${tpl.title}${typeSuffix(problemType)}`;

  if (problemType === "find-bug") {
    statement = `The following ${topicLabel} program has a mistake. Fix it so it matches the expected OOP behavior.\n\n${statement}`;
    title = `Fix: ${tpl.title}`;
    code = injectOopBug(code, index);
  } else if (problemType === "output-prediction") {
    statement = `Predict the output of this ${topicLabel} program.\n\n${statement}`;
    title = `Output: ${tpl.title}`;
  } else if (problemType === "dry-run") {
    statement = `Dry-run this ${topicLabel} program object by object.\n\n${statement}`;
    title = `Dry Run: ${tpl.title}`;
  } else if (problemType === "interview") {
    statement = `Interview-style ${topicLabel} question:\n\n${statement}`;
    title = `Practice: ${tpl.title}`;
  }

  const base = {
    id: `${slug}-${difficulty}-${problemType}-${index + 1}`,
    title,
    description: `${topicLabel} — ${tpl.title}`,
    problemType,
    estimatedMinutes: estMinutes(difficulty, problemType),
    problemStatement: statement,
    constraints: [
      `Use ${topicLabel} concepts from Week 3 OOP.`,
      "Class names must be valid Java identifiers.",
      "Program must compile and produce the expected output.",
    ],
    exampleInput: tpl.input,
    exampleOutput: output,
    explanation: `This exercise applies real ${topicLabel}: ${tpl.title}.`,
    approaches: defaultApproaches(difficulty, "O(1)", "O(1)", "O(1)"),
    code,
    filename: `${className}.java`,
    expectedOutput: output,
    dryRun: `Trace objects/methods and confirm output: ${output.split("\n")[0]}`,
    visualization: `${topicLabel} → objects → methods → stdout`,
    hints: [`Focus on ${topicLabel}.`, "Trace fields and method calls with the sample values."],
    companyTags: [],
    commonMistakes: [
      "Public fields instead of private + getters",
      "Forgetting @Override on subclass methods",
      "Confusing extends vs implements",
    ],
    interviewTips: [`Explain why ${topicLabel} matters in real backends.`],
    alternativeSolutions: ["Extract helpers while keeping the same OOP structure"],
    followUpQuestions: [`How would you unit-test this ${topicLabel} design?`],
    practiceVariations: [`Change sample values and predict the new output.`],
    practiceQuestions: [`Explain ${tpl.title} without running the code.`],
  };

  return {
    ...base,
    ...enrichProblem({ ...base, companyTags: [] }, { slug, difficulty, index, category }),
  };
}
