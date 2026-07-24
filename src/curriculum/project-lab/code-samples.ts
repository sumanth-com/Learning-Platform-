import type { LabCodeFile, LabLanguage, LabTrack, ProjectLabContext } from "./types";
import { monacoLanguage } from "./tracks";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "project";
}

function className(title: string) {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("")
    .slice(0, 48) || "App";
}

export function buildLabFiles(
  ctx: ProjectLabContext,
  track: LabTrack,
  language: LabLanguage
): LabCodeFile[] {
  const mono = monacoLanguage(track, language);
  const name = className(ctx.title);
  const slug = slugify(ctx.title);

  if (track === "frontend") {
    if (language === "html") {
      return [
        {
          id: "html",
          label: "HTML",
          filename: "index.html",
          language: "html",
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ctx.title}</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="app">
      <header class="app__header">
        <h1>${ctx.title}</h1>
        <p class="app__lede">${ctx.description}</p>
      </header>

      <section class="panel" aria-labelledby="workspace-title">
        <h2 id="workspace-title">Workspace</h2>
        <form id="main-form" class="panel__form">
          <label for="input">
            Your input
            <input id="input" name="input" type="text" placeholder="Type here…" required />
          </label>
          <button type="submit">Run</button>
        </form>
        <output id="result" class="panel__result" for="input">
          Result will appear here.
        </output>
      </section>

      <section class="panel">
        <h2>Acceptance checklist</h2>
        <ul>
${ctx.features.map((f) => `          <li>${f.title}</li>`).join("\n")}
        </ul>
      </section>
    </main>
    <script src="app.js"></script>
  </body>
</html>
`,
        },
      ];
    }
    if (language === "css") {
      return [
        {
          id: "css",
          label: "CSS",
          filename: "styles.css",
          language: "css",
          code: `:root {
  --bg: #0b0f17;
  --panel: #121826;
  --text: #e8eefc;
  --muted: #9aa8c7;
  --accent: #5b8cff;
  --border: rgba(255, 255, 255, 0.08);
  --radius: 14px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, sans-serif;
  background:
    radial-gradient(1200px 500px at 10% -10%, rgba(91, 140, 255, 0.18), transparent),
    var(--bg);
  color: var(--text);
  line-height: 1.5;
}

.app {
  width: min(720px, calc(100% - 2rem));
  margin: 2rem auto 3rem;
}

.app__header h1 {
  margin: 0 0 0.35rem;
  font-size: clamp(1.6rem, 3vw, 2rem);
}

.app__lede {
  margin: 0;
  color: var(--muted);
}

.panel {
  margin-top: 1rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--panel) 92%, black);
}

.panel__form {
  display: grid;
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.92rem;
  color: var(--muted);
}

input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.7rem 0.8rem;
  background: #0a1020;
  color: var(--text);
}

button {
  justify-self: start;
  border: 0;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  background: var(--accent);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:hover { filter: brightness(1.08); }

.panel__result {
  display: block;
  margin-top: 0.9rem;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  background: rgba(91, 140, 255, 0.08);
  border: 1px dashed rgba(91, 140, 255, 0.35);
  color: var(--text);
}

/* Project: ${ctx.title} */
`,
        },
      ];
    }
    return [
      {
        id: "javascript",
        label: "JavaScript",
        filename: "app.js",
        language: "javascript",
        code: `/**
 * ${ctx.title}
 * ${ctx.description}
 *
 * Goals
${ctx.features.map((f) => ` * - ${f.title}`).join("\n")}
 */

const form = document.querySelector("#main-form");
const input = document.querySelector("#input");
const result = document.querySelector("#result");

function validate(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    throw new Error("Please enter a value before running.");
  }
  return trimmed;
}

function processInput(value) {
  // Core project logic lives here.
  // Keep this pure when you can: input → output, no DOM.
  return {
    ok: true,
    message: \`Processed "\${value}" for ${ctx.title}.\`,
    meta: {
      project: ${JSON.stringify(ctx.title)},
      module: ${JSON.stringify(ctx.moduleTitle)},
      difficulty: ${JSON.stringify(ctx.difficulty)},
    },
  };
}

function render(output) {
  result.textContent = output.message;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const value = validate(input?.value);
    const output = processInput(value);
    render(output);
  } catch (error) {
    result.textContent =
      error instanceof Error ? error.message : "Something went wrong.";
  }
});
`,
      },
    ];
  }

  if (track === "backend") {
    return [buildBackendFile(ctx, language, name, slug, mono)];
  }

  return [buildLanguageFile(ctx, language, name, mono)];
}

function buildBackendFile(
  ctx: ProjectLabContext,
  language: LabLanguage,
  name: string,
  slug: string,
  monaco: string
): LabCodeFile {
  const goals = ctx.features.map((f) => ` * - ${f.title}`).join("\n");

  if (language === "express") {
    return {
      id: "express",
      label: "Express",
      filename: "server.js",
      language: monaco,
      code: `/**
 * ${ctx.title} — Express API
 * ${ctx.description}
${goals}
 */

const express = require("express");
const app = express();
app.use(express.json());

const store = new Map();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, project: "${slug}" });
});

app.get("/items", (_req, res) => {
  res.json({ items: Array.from(store.values()) });
});

app.post("/items", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return badRequest(res, "title is required");

  const item = {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
  };
  store.set(item.id, item);
  return res.status(201).json(item);
});

app.listen(3000, () => {
  console.log("${name} API listening on http://localhost:3000");
});
`,
    };
  }

  if (language === "fastapi") {
    return {
      id: "fastapi",
      label: "FastAPI",
      filename: "main.py",
      language: monaco,
      code: `"""
${ctx.title} — FastAPI service
${ctx.description}
"""

from datetime import datetime
from typing import Dict
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="${ctx.title}")
store: Dict[str, dict] = {}


class ItemIn(BaseModel):
    title: str = Field(min_length=1)


@app.get("/health")
def health():
    return {"ok": True, "project": "${slug}"}


@app.get("/items")
def list_items():
    return {"items": list(store.values())}


@app.post("/items", status_code=201)
def create_item(payload: ItemIn):
    item = {
        "id": str(uuid4()),
        "title": payload.title.strip(),
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    if not item["title"]:
        raise HTTPException(status_code=400, detail="title is required")
    store[item["id"]] = item
    return item
`,
    };
  }

  if (language === "spring") {
    return {
      id: "spring",
      label: "Spring Boot",
      filename: `${name}Controller.java`,
      language: monaco,
      code: `package com.SupraBase.${slug.replace(/-/g, "")};

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * ${ctx.title}
 * ${ctx.description}
 */
@RestController
@RequestMapping("/api")
public class ${name}Controller {
  private final Map<String, Item> store = new ConcurrentHashMap<>();

  @GetMapping("/health")
  public Map<String, Object> health() {
    return Map.of("ok", true, "project", "${slug}");
  }

  @GetMapping("/items")
  public Map<String, List<Item>> list() {
    return Map.of("items", new ArrayList<>(store.values()));
  }

  @PostMapping("/items")
  @ResponseStatus(HttpStatus.CREATED)
  public Item create(@RequestBody ItemRequest request) {
    if (request == null || request.title() == null || request.title().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title is required");
    }
    Item item = new Item(UUID.randomUUID().toString(), request.title().trim(), Instant.now().toString());
    store.put(item.id(), item);
    return item;
  }

  public record ItemRequest(String title) {}
  public record Item(String id, String title, String createdAt) {}
}
`,
    };
  }

  if (language === "django") {
    return {
      id: "django",
      label: "Django",
      filename: "views.py",
      language: monaco,
      code: `"""
${ctx.title} — Django view layer
${ctx.description}
"""

import uuid
from datetime import datetime, timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

STORE = {}


@require_http_methods(["GET"])
def health(_request):
    return JsonResponse({"ok": True, "project": "${slug}"})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def items(request):
    if request.method == "GET":
        return JsonResponse({"items": list(STORE.values())})

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError as exc:
        return JsonResponse({"error": "invalid JSON"}, status=400)

    title = str(body.get("title", "")).strip()
    if not title:
        return JsonResponse({"error": "title is required"}, status=400)

    item = {
        "id": str(uuid.uuid4()),
        "title": title,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    STORE[item["id"]] = item
    return JsonResponse(item, status=201)
`,
    };
  }

  if (language === "dotnet") {
    return {
      id: "dotnet",
      label: ".NET",
      filename: "Program.cs",
      language: monaco,
      code: `// ${ctx.title}
// ${ctx.description}

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var store = new Dictionary<string, Item>();

app.MapGet("/health", () => Results.Ok(new { ok = true, project = "${slug}" }));

app.MapGet("/items", () => Results.Ok(new { items = store.Values }));

app.MapPost("/items", (ItemRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { error = "title is required" });
    }

    var item = new Item(Guid.NewGuid().ToString(), request.Title.Trim(), DateTimeOffset.UtcNow);
    store[item.Id] = item;
    return Results.Created($"/items/{item.Id}", item);
});

app.Run();

record ItemRequest(string Title);
record Item(string Id, string Title, DateTimeOffset CreatedAt);
`,
    };
  }

  // nodejs default
  return {
    id: "nodejs",
    label: "Node.js",
    filename: "index.js",
    language: monaco,
    code: `/**
 * ${ctx.title} — Node.js HTTP service
 * ${ctx.description}
${goals}
 */

const http = require("http");
const { randomUUID } = require("crypto");

const store = new Map();

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("payload too large"));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("invalid JSON"));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      return send(res, 200, { ok: true, project: "${slug}" });
    }

    if (req.method === "GET" && req.url === "/items") {
      return send(res, 200, { items: Array.from(store.values()) });
    }

    if (req.method === "POST" && req.url === "/items") {
      const body = await readJson(req);
      const title = String(body.title ?? "").trim();
      if (!title) return send(res, 400, { error: "title is required" });
      const item = { id: randomUUID(), title, createdAt: new Date().toISOString() };
      store.set(item.id, item);
      return send(res, 201, item);
    }

    return send(res, 404, { error: "not found" });
  } catch (error) {
    return send(res, 400, {
      error: error instanceof Error ? error.message : "bad request",
    });
  }
});

server.listen(3000, () => {
  console.log("${name} listening on http://localhost:3000");
});
`,
  };
}

function buildLanguageFile(
  ctx: ProjectLabContext,
  language: LabLanguage,
  name: string,
  monaco: string
): LabCodeFile {
  if (language === "python") {
    return {
      id: "python",
      label: "Python",
      filename: "main.py",
      language: monaco,
      code: `"""
${ctx.title}
${ctx.description}

Goals:
${ctx.features.map((f) => `- ${f.title}`).join("\n")}
"""

from __future__ import annotations


def validate(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError("Input cannot be empty.")
    return cleaned


def run(value: str) -> str:
    data = validate(value)
    # Core project logic: transform input into a useful result.
    return f'[{ctx.title}] processed: {data}'


def main() -> None:
    print("${ctx.title}")
    print("Type a value and press Enter. Type 'quit' to exit.")
    while True:
        raw = input("> ")
        if raw.strip().lower() in {"quit", "exit"}:
            print("Done.")
            break
        try:
            print(run(raw))
        except ValueError as exc:
            print(f"Error: {exc}")


if __name__ == "__main__":
    main()
`,
    };
  }

  if (language === "javascript") {
    return {
      id: "javascript",
      label: "JavaScript",
      filename: "main.js",
      language: monaco,
      code: `/**
 * ${ctx.title}
 * ${ctx.description}
 *
${ctx.features.map((f) => ` * - ${f.title}`).join("\n")}
 */

function validate(value) {
  const cleaned = String(value ?? "").trim();
  if (!cleaned) throw new Error("Input cannot be empty.");
  return cleaned;
}

function run(value) {
  const data = validate(value);
  return \`[${ctx.title}] processed: \${data}\`;
}

function main(samples = ["demo", "", "ship-it"]) {
  for (const sample of samples) {
    try {
      console.log(run(sample));
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    }
  }
}

main();
`,
    };
  }

  if (language === "c") {
    return {
      id: "c",
      label: "C",
      filename: "main.c",
      language: monaco,
      code: `/* ${ctx.title}
 * ${ctx.description}
 */

#include <stdio.h>
#include <string.h>
#include <ctype.h>

static void trim_newline(char *s) {
  size_t n = strlen(s);
  if (n > 0 && s[n - 1] == '\\n') s[n - 1] = '\\0';
}

static int is_blank(const char *s) {
  for (; *s; s++) if (!isspace((unsigned char)*s)) return 0;
  return 1;
}

int main(void) {
  char buffer[256];
  printf("${ctx.title}\\n");
  printf("Enter a value (or 'quit'):\\n");

  while (1) {
    printf("> ");
    if (!fgets(buffer, sizeof buffer, stdin)) break;
    trim_newline(buffer);
    if (strcmp(buffer, "quit") == 0) break;
    if (is_blank(buffer)) {
      printf("Error: Input cannot be empty.\\n");
      continue;
    }
    printf("[${name}] processed: %s\\n", buffer);
  }
  return 0;
}
`,
    };
  }

  if (language === "cpp") {
    return {
      id: "cpp",
      label: "C++",
      filename: "main.cpp",
      language: monaco,
      code: `// ${ctx.title}
// ${ctx.description}

#include <iostream>
#include <string>

std::string trim(const std::string& value) {
  const auto start = value.find_first_not_of(" \\t\\n\\r");
  if (start == std::string::npos) return "";
  const auto end = value.find_last_not_of(" \\t\\n\\r");
  return value.substr(start, end - start + 1);
}

std::string run(const std::string& value) {
  auto cleaned = trim(value);
  if (cleaned.empty()) throw std::invalid_argument("Input cannot be empty.");
  return std::string("[${ctx.title}] processed: ") + cleaned;
}

int main() {
  std::cout << "${ctx.title}\\n";
  std::string line;
  while (true) {
    std::cout << "> ";
    if (!std::getline(std::cin, line)) break;
    if (line == "quit") break;
    try {
      std::cout << run(line) << "\\n";
    } catch (const std::exception& ex) {
      std::cout << "Error: " << ex.what() << "\\n";
    }
  }
  return 0;
}
`,
    };
  }

  if (language === "go") {
    return {
      id: "go",
      label: "Go",
      filename: "main.go",
      language: monaco,
      code: `package main

import (
  "bufio"
  "fmt"
  "os"
  "strings"
)

// ${ctx.title}
// ${ctx.description}

func run(value string) (string, error) {
  cleaned := strings.TrimSpace(value)
  if cleaned == "" {
    return "", fmt.Errorf("input cannot be empty")
  }
  return fmt.Sprintf("[${ctx.title}] processed: %s", cleaned), nil
}

func main() {
  fmt.Println("${ctx.title}")
  scanner := bufio.NewScanner(os.Stdin)
  for {
    fmt.Print("> ")
    if !scanner.Scan() {
      break
    }
    line := scanner.Text()
    if line == "quit" {
      break
    }
    out, err := run(line)
    if err != nil {
      fmt.Println("Error:", err)
      continue
    }
    fmt.Println(out)
  }
}
`,
    };
  }

  if (language === "rust") {
    return {
      id: "rust",
      label: "Rust",
      filename: "main.rs",
      language: monaco,
      code: `// ${ctx.title}
// ${ctx.description}

use std::io::{self, Write};

fn run(value: &str) -> Result<String, String> {
    let cleaned = value.trim();
    if cleaned.is_empty() {
        return Err("Input cannot be empty.".into());
    }
    Ok(format!("[${ctx.title}] processed: {}", cleaned))
}

fn main() {
    println!("${ctx.title}");
    loop {
        print!("> ");
        let _ = io::stdout().flush();
        let mut line = String::new();
        if io::stdin().read_line(&mut line).is_err() {
            break;
        }
        let line = line.trim_end();
        if line == "quit" {
            break;
        }
        match run(line) {
            Ok(out) => println!("{out}"),
            Err(err) => println!("Error: {err}"),
        }
    }
}
`,
    };
  }

  if (language === "csharp") {
    return {
      id: "csharp",
      label: "C#",
      filename: "Program.cs",
      language: monaco,
      code: `// ${ctx.title}
// ${ctx.description}

using System;

static class ${name}
{
    static string Run(string value)
    {
        var cleaned = value?.Trim() ?? "";
        if (string.IsNullOrEmpty(cleaned))
            throw new ArgumentException("Input cannot be empty.");
        return $"[${ctx.title}] processed: {cleaned}";
    }

    static void Main()
    {
        Console.WriteLine("${ctx.title}");
        while (true)
        {
            Console.Write("> ");
            var line = Console.ReadLine();
            if (line is null || line == "quit") break;
            try
            {
                Console.WriteLine(Run(line));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
`,
    };
  }

  // java default
  return {
    id: "java",
    label: "Java",
    filename: `${name}.java`,
    language: monaco,
    code: `/**
 * ${ctx.title}
 * ${ctx.description}
 *
${ctx.features.map((f) => ` * - ${f.title}`).join("\n")}
 */

import java.util.Scanner;

public class ${name} {
  public static String run(String value) {
    if (value == null || value.trim().isEmpty()) {
      throw new IllegalArgumentException("Input cannot be empty.");
    }
    return "[${ctx.title}] processed: " + value.trim();
  }

  public static void main(String[] args) {
    System.out.println("${ctx.title}");
    Scanner scanner = new Scanner(System.in);
    while (true) {
      System.out.print("> ");
      if (!scanner.hasNextLine()) break;
      String line = scanner.nextLine();
      if ("quit".equalsIgnoreCase(line)) break;
      try {
        System.out.println(run(line));
      } catch (IllegalArgumentException ex) {
        System.out.println("Error: " + ex.getMessage());
      }
    }
    scanner.close();
  }
}
`,
  };
}
