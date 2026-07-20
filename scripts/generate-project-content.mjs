import fs from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");
const WEEKS_DIR = path.join(ROOT, "src/curriculum/weeks");
const OUT_DIR = path.join(ROOT, "src/curriculum/project-content");
const EXTERNAL_LINKS = JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, "external-links.json"), "utf8")
);

/** Weeks 1–3: small console/OOP — full in-app code. Week 4+: repo + YouTube. */
const INLINE_MAX_WEEK = 3;

const solutions = {
  "student-info-system": {
    filename: "StudentInfo.java",
    explanation:
      "Scanner reads each field from the keyboard. String fields use nextLine(); integers use nextInt() followed by nextLine() to consume the leftover newline. Variables store name, age, roll, branch, and college. printf formats a clean summary table. Always call sc.close() when done.",
    sampleInput:
      "Student name: Riya Sharma\nAge: 19\nRoll number: 101\nBranch: CSE\nCollege: Prathyu Academy",
    sampleOutput:
      "\n--- Student Details ---\nName    : Riya Sharma\nAge     : 19\nRoll No : 101\nBranch  : CSE\nCollege : Prathyu Academy",
    code: `import java.util.Scanner;

public class StudentInfo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Student name: ");
        String name = sc.nextLine();
        System.out.print("Age: ");
        int age = sc.nextInt();
        sc.nextLine();
        System.out.print("Roll number: ");
        int roll = sc.nextInt();
        sc.nextLine();
        System.out.print("Branch: ");
        String branch = sc.nextLine();
        System.out.print("College: ");
        String college = sc.nextLine();

        System.out.println("\\n--- Student Details ---");
        System.out.printf("Name    : %s%n", name);
        System.out.printf("Age     : %d%n", age);
        System.out.printf("Roll No : %d%n", roll);
        System.out.printf("Branch  : %s%n", branch);
        System.out.printf("College : %s%n", college);

        sc.close();
    }
}`,
  },
  "simple-calculator": {
    filename: "SimpleCalculator.java",
    explanation:
      "A menu-driven calculator using switch on the user's choice. Each case performs one operation (+, -, *, /, %). Division checks for zero before dividing. Scanner reads choice and two numbers as doubles so division gives decimal results.",
    sampleInput:
      "1. Addition\\n2. Subtraction\\n3. Multiplication\\n4. Division\\n5. Modulus\\nChoice: 1\\nFirst number: 10\\nSecond number: 4",
    sampleOutput: "Result: 14.0",
    code: `import java.util.Scanner;

public class SimpleCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("1. Addition\\n2. Subtraction\\n3. Multiplication\\n4. Division\\n5. Modulus");
        System.out.print("Choice: ");
        int choice = sc.nextInt();
        System.out.print("First number: ");
        double a = sc.nextDouble();
        System.out.print("Second number: ");
        double b = sc.nextDouble();

        switch (choice) {
            case 1 -> System.out.println("Result: " + (a + b));
            case 2 -> System.out.println("Result: " + (a - b));
            case 3 -> System.out.println("Result: " + (a * b));
            case 4 -> {
                if (b == 0) System.out.println("Cannot divide by zero.");
                else System.out.println("Result: " + (a / b));
            }
            case 5 -> System.out.println("Result: " + (a % b));
            default -> System.out.println("Invalid choice.");
        }
        sc.close();
    }
}`,
  },
  "bmi-calculator": {
    filename: "BMICalculator.java",
    explanation:
      "BMI = weight / (height × height). Input is validated so height and weight must be positive. if-else if chain maps BMI ranges to categories (Underweight, Normal, Overweight, Obese) using standard WHO thresholds.",
    sampleInput: "Height (m): 1.75\\nWeight (kg): 70",
    sampleOutput: "BMI: 22.86\\nCategory: Normal",
    code: `import java.util.Scanner;

public class BMICalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Height (m): ");
        double height = sc.nextDouble();
        System.out.print("Weight (kg): ");
        double weight = sc.nextDouble();

        if (height <= 0 || weight <= 0) {
            System.out.println("Invalid input.");
            sc.close();
            return;
        }

        double bmi = weight / (height * height);
        System.out.printf("BMI: %.2f%n", bmi);

        String category;
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";
        System.out.println("Category: " + category);
        sc.close();
    }
}`,
  },
  "student-grade-calculator": {
    filename: "GradeCalculator.java",
    explanation:
      "A for loop reads marks for 5 subjects into an array and accumulates total. Average = total / 5.0 (note the 5.0 double literal so division is not integer). Percentage equals average when each subject is out of 100.",
    sampleInput:
      "Subject 1 marks: 85\\nSubject 2 marks: 90\\nSubject 3 marks: 78\\nSubject 4 marks: 92\\nSubject 5 marks: 88",
    sampleOutput: "Total      : 433\\nAverage    : 86.60\\nPercentage : 86.60%",
    code: `import java.util.Scanner;

public class GradeCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = 0;
        int[] marks = new int[5];

        for (int i = 0; i < 5; i++) {
            System.out.print("Subject " + (i + 1) + " marks: ");
            marks[i] = sc.nextInt();
            total += marks[i];
        }

        double average = total / 5.0;
        double percentage = average;

        System.out.println("Total      : " + total);
        System.out.printf("Average    : %.2f%n", average);
        System.out.printf("Percentage : %.2f%%%n", percentage);
        sc.close();
    }
}`,
  },
  "electricity-bill-calculator": {
    filename: "ElectricityBill.java",
    explanation:
      "Slab-based billing: first 100 units at Rs. 3.5/unit, next 100 at Rs. 4.5, above 200 at Rs. 6.0. if-else if picks the correct tariff. Invalid negative units are rejected early with return.",
    sampleInput: "Units consumed: 250",
    sampleOutput: "Bill Amount: Rs. 1225.00",
    code: `import java.util.Scanner;

public class ElectricityBill {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Units consumed: ");
        int units = sc.nextInt();

        if (units < 0) {
            System.out.println("Invalid units.");
            sc.close();
            return;
        }

        double bill;
        if (units <= 100) bill = units * 3.5;
        else if (units <= 200) bill = 100 * 3.5 + (units - 100) * 4.5;
        else bill = 100 * 3.5 + 100 * 4.5 + (units - 200) * 6.0;

        System.out.printf("Bill Amount: Rs. %.2f%n", bill);
        sc.close();
    }
}`,
  },
  "bank-atm-simulation": {
    filename: "BankATM.java",
    explanation:
      "Uses a while loop for the ATM menu and switch for deposit, withdraw, and balance check. A double balance variable holds the account state. Withdraw validates sufficient funds.",
    sampleInput: "1\\n500\\n2\\n200\\n3\\n4",
    sampleOutput:
      "ATM Menu\\n1.Deposit 2.Withdraw 3.Balance 4.Exit\\nDeposited. Balance: 500.0\\nWithdrawn. Balance: 300.0\\nBalance: 300.0\\nThank you!",
    code: `import java.util.Scanner;

public class BankATM {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double balance = 0;
        int choice;

        do {
            System.out.println("ATM Menu\\n1.Deposit 2.Withdraw 3.Balance 4.Exit");
            choice = sc.nextInt();
            switch (choice) {
                case 1 -> {
                    System.out.print("Amount: ");
                    balance += sc.nextDouble();
                    System.out.println("Deposited. Balance: " + balance);
                }
                case 2 -> {
                    System.out.print("Amount: ");
                    double amt = sc.nextDouble();
                    if (amt > balance) System.out.println("Insufficient funds.");
                    else { balance -= amt; System.out.println("Withdrawn. Balance: " + balance); }
                }
                case 3 -> System.out.println("Balance: " + balance);
                case 4 -> System.out.println("Thank you!");
                default -> System.out.println("Invalid choice.");
            }
        } while (choice != 4);
        sc.close();
    }
}`,
  },
  "pattern-generator": {
    filename: "PatternGenerator.java",
    explanation:
      "Nested for loops print rows and columns of stars. The outer loop controls rows; the inner loop prints stars per row. Classic pattern practice for loops.",
    sampleInput: "Enter rows: 5",
    sampleOutput: "*\\n**\\n***\\n****\\n*****",
    code: `import java.util.Scanner;

public class PatternGenerator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter rows: ");
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
        sc.close();
    }
}`,
  },
};

function classNameFromId(id) {
  return id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function defaultConsoleProject(project) {
  const cls = classNameFromId(project.id);
  const filename = `${cls}.java`;
  const features = project.features.map((f) => f.title).join(", ");
  return {
    filename,
    explanation: `${project.title} is a console Java program implementing: ${features}. Use Scanner, loops, and conditionals. Build one feature at a time and test each step.`,
    sampleInput: `(enter values when prompted)`,
    sampleOutput: `${project.title}\n${project.description}`,
    code: `import java.util.Scanner;

public class ${cls} {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("${project.title}");
        // Features: ${features}
        sc.close();
    }
}`,
  };
}

function buildOverview(project) {
  const requirements = (project.requirements ?? []).map((r) => `• ${r}`).join("\n");
  const bonus = (project.bonusFeatures ?? []).map((r) => `• ${r}`).join("\n");
  return `${project.description}\n\nFeatures to build:\n${project.features.map((f) => `• ${f.title}`).join("\n")}${requirements ? `\n\nRequirements:\n${requirements}` : ""}${bonus ? `\n\nBonus:\n${bonus}` : ""}`;
}

function buildInlineDetail(project, week) {
  const custom = solutions[project.id];
  const base = custom ?? defaultConsoleProject(project);
  const className = base.filename.replace(/\.java$/, "");
  return {
    mode: "inline",
    overview: buildOverview(project),
    explanation: base.explanation,
    code: base.code,
    filename: base.filename,
    sampleInput: base.sampleInput,
    sampleOutput: base.sampleOutput,
    runInstructions: `javac ${base.filename}\njava ${className}`,
  };
}

function buildExternalDetail(project, week) {
  const links = EXTERNAL_LINKS[project.id];
  if (!links) {
    throw new Error(`Missing external links for project: ${project.id} (week ${week.id})`);
  }
  const features = project.features.map((f) => f.title).join(", ");
  const level = week.id <= 5 ? "intermediate" : week.id <= 8 ? "advanced" : "expert";
  return {
    mode: "external",
    overview: buildOverview(project),
    explanation: `${project.title} is a ${level}-level project (Week ${week.id}). Use the verified GitHub repository for real source code and the YouTube tutorial to learn step by step. Build: ${features}.`,
    githubUrl: links.github.url,
    githubLabel: links.github.label,
    youtubeUrl: links.youtube.url,
    youtubeLabel: links.youtube.label,
    studyNote:
      "1. Watch the YouTube tutorial first.\n2. Open the GitHub repo — clone or browse the source.\n3. Build your version feature-by-feature in IntelliJ.\n4. Test each feature before moving on.\n5. Mark complete when your project works end-to-end.",
  };
}

function buildDetail(project, week) {
  if (week.id <= INLINE_MAX_WEEK) return buildInlineDetail(project, week);
  return buildExternalDetail(project, week);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (let w = 1; w <= 11; w++) {
  const week = JSON.parse(fs.readFileSync(path.join(WEEKS_DIR, `week-${w}.json`), "utf8"));
  const out = {};
  for (const project of week.projects) {
    out[project.id] = buildDetail(project, week);
  }
  fs.writeFileSync(path.join(OUT_DIR, `week-${w}.json`), JSON.stringify(out, null, 2) + "\n");
  const inline = week.projects.filter((p) => buildDetail(p, week).mode === "inline").length;
  console.log(`week-${w}.json — ${week.projects.length} projects (${inline} inline)`);
}

console.log("Done.");
