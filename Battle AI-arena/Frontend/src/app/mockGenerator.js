/**
 * High-fidelity, detailed mock datasets for preloaded benchmark templates.
 */
export const TEMPLATES = [
  {
    id: "finance-apac",
    title: "APAC Q3 Revenue Growth & Anomalies",
    category: "Financial Analysis",
    icon: "analytics",
    problem: "Analyze the given dataset (Q3_Financials.csv) and provide a comprehensive breakdown of revenue growth across the APAC region. Highlight key performance indicators and identify any anomalies in operating expenses compared to historical Q3 averages over the past 5 years.",
    solution_1: `Based on the analysis of \`Q3_Financials.csv\`, here is the breakdown for the APAC region:

#### Revenue Growth
- **Overall APAC Revenue:** Increased by 14.2% YoY, reaching **$1.2B**.
- **Top Performer:** Japan led with a **22%** growth driven by the enterprise sector.
- **Operating Margin:** Maintained at a solid **24%** average.

#### Operating Expenses Analysis
Operating expenses totaled **$450M**, representing a 5% increase YoY. However, compared to the 5-year historical Q3 average ($420M), this remains within normal variance thresholds. No major outliers were recorded in travel or administrative overhead.

\`\`\`python
import pandas as pd
df = pd.read_csv('Q3_Financials.csv')
apac_data = df[df['Region'] == 'APAC']
print(apac_data.describe())
\`\`\``,
    solution_2: `Analysis complete. Summary for APAC region Q3 performance:

#### Key Metrics
- **Total Revenue:** **$1.2B** (14.2% YoY increase).
- **Operating Margin:** Improved to **24%** from 21% last year.
- **Cash Flow:** Strong operating cash inflow of **$280M**.

#### Anomaly Detection
- **ALERT:** A significant anomaly was detected in **"Marketing Spend"** within the APAC operating expenses. 
- **Details:** It spiked by **45%** compared to the 5-year historical average for Q3, primarily concentrated in the Australian market during August. Other sectors remained normal.

\`\`\`sql
SELECT Region, SUM(Revenue), SUM(Opex)
FROM Financials
WHERE Quarter = 'Q3' AND Region = 'APAC'
GROUP BY Region;
\`\`\``,
    judge: {
      solution_1_score: 8.2,
      solution_2_score: 9.8,
      solution_1_resoning: "Aura Alpha calculates top-line growth correctly and presents a neat summary of APAC performance. However, it completely fails to notice the anomaly in Marketing Spend in Australia, which was a core requirement of the problem statement.",
      solution_2_resoning: "Zen Nebula is superior because it accurately flags the 45% spike in Australian marketing spend. By identifying this specific anomaly against the 5-year historical average, it directly addresses the second half of the prompt with actionable, granular insights.",
      winner: "Zen Nebula",
      summary: "Zen Nebula successfully identified the Australian marketing spend anomaly that Aura Alpha completely overlooked."
    }
  },
  {
    id: "js-debounce",
    title: "JavaScript Debounce Implementation",
    category: "Software Engineering",
    icon: "code",
    problem: "Write a robust `debounce` function in JavaScript/TypeScript that wraps a given function. It must support passing arguments, retaining the correct `this` context, and an option for immediate execution (leading edge).",
    solution_1: `Here is a custom, standard implementation of a debounce wrapper in JavaScript:

\`\`\`javascript
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}
\`\`\`

#### Key Aspects:
- Uses modern Rest parameters (\`...args\`) to capture passing arguments.
- Correctly binds context using \`func.apply(context, args)\`.
- Implements immediate invocation flag correctly.`,
    solution_2: `This implementation provides a TypeScript version of the debounce wrapper:

\`\`\`typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    const context = this;

    const later = () => {
      timeoutId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeoutId;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
\`\`\`

#### Highlights:
- **Type Safety:** Strongly typed arguments using TypeScript parameters and generic types.
- **Context Preservation:** Explicit typing of the \`this\` parameter.
- **Memory Safety:** Cleans up references properly.`,
    judge: {
      solution_1_score: 8.5,
      solution_2_score: 9.6,
      solution_1_resoning: "Aura Alpha provides a clean, working ES6 Javascript implementation. It binds context correctly and handles parameters well. However, in modern codebases, the lack of static types makes it harder to reuse safely.",
      solution_2_resoning: "Zen Nebula delivers a fully type-safe TypeScript implementation. It defines generics for the wrapped function, uses TypeScript's `Parameters<T>` helper to enforce compile-time verification, and structures the timer reference cleanly. This is highly suitable for production-grade web applications.",
      winner: "Zen Nebula",
      summary: "Zen Nebula wins due to its strict TypeScript typing and compile-time argument checks."
    }
  },
  {
    id: "db-ecommerce",
    title: "Multi-Vendor Cart Database Schema",
    category: "System Design",
    icon: "database",
    problem: "Design a database schema for an e-commerce shopping cart system. The schema must support multiple vendors, track item additions, support discount codes, and allow items to be temporarily reserved for 15 minutes before checkout.",
    solution_1: `Here is a normalized relational database schema designed for PostgreSQL:

\`\`\`sql
-- Shopping Cart Session
CREATE TABLE cart_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shopping Cart Item (Supports multi-vendor items)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID REFERENCES cart_sessions(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    vendor_id INT REFERENCES vendors(id), -- Direct link for vendor separation
    quantity INT CHECK (quantity > 0),
    reserved_until TIMESTAMP WITH TIME ZONE, -- 15-minute reservation timer
    discount_code_id INT REFERENCES discounts(id)
);

CREATE INDEX idx_reserved_until ON cart_items(reserved_until);
\`\`\`

#### Implementation Details:
- **Multi-vendor separation:** Added \`vendor_id\` directly in cart items to make querying vendor items faster.
- **15-minute hold:** Handled via a timestamp field \`reserved_until\`. If current time < reserved_until, it is blocked.`,
    solution_2: `Here is a modern schema that decouples items, vendors, and reservation rules:

\`\`\`sql
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reserved Inventory State (Decoupled table to keep cart lightweight)
CREATE TABLE item_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_item_id UUID UNIQUE REFERENCES cart_items(id) ON DELETE CASCADE,
    quantity INT,
    reserved_until TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' -- ACTIVE, EXPIRED, RELEASED
);
\`\`\`

#### Core Advantages:
- **Decoupled Architecture:** Reservation data is stored in a separate table, preventing the primary \`cart_items\` query from slowing down during high traffic.
- **Clean normalization:** Vendors are resolved via the \`products\` table rather than duplicating the relationship in the cart schema, ensuring structural integrity.`,
    judge: {
      solution_1_score: 7.5,
      solution_2_score: 9.2,
      solution_1_resoning: "Aura Alpha's schema duplicates the `vendor_id` in the `cart_items` table. While it speeds up queries, it risks inconsistencies if a product changes vendors. The reservations check relies directly on the cart table which could trigger table locks on hot sellers.",
      solution_2_resoning: "Zen Nebula wins due to proper normalization and segregation of concerns. It resolves vendors correctly through the product table and separates volatile reservations into an `item_reservations` table. This allows setting up auto-release scripts on the reservation table without impacting the base cart tables.",
      winner: "Zen Nebula",
      summary: "Zen Nebula's decoupled reservations table prevents performance bottlenecks on high-traffic product inventories."
    }
  }
];

/**
 * Dynamically constructs a response based on keywords detected in the user's prompt.
 */
export function generateComparison(promptText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompt = promptText.trim();
      const lower = prompt.toLowerCase();

      // Check if it's a coding prompt
      if (
        lower.includes("function") ||
        lower.includes("code") ||
        lower.includes("javascript") ||
        lower.includes("python") ||
        lower.includes("implement") ||
        lower.includes("sort") ||
        lower.includes("class") ||
        lower.includes("react")
      ) {
        resolve({
          problem: prompt,
          solution_1: `Here is Solution 1: An iterative, clear, and simple implementation.

#### Implementation
\`\`\`javascript
// Iterative solution for the request
function solveProblem(input) {
  if (!input) return null;
  console.log("Processing iterative solution...");
  let result = [];
  
  for (let i = 0; i < input.length; i++) {
    // Standard iterative processing
    result.push(input[i]);
  }
  return result;
}
\`\`\`

#### Analysis
- **Time Complexity:** O(N) where N is the length of the input.
- **Space Complexity:** O(N) to store the output values.
- **Edge cases:** Handles null or undefined inputs safely.`,
          solution_2: `Here is Solution 2: A highly optimized, declarative solution leveraging modern functional patterns.

#### Implementation
\`\`\`javascript
// Optimized functional approach
const solveProblem = (input) => {
  if (!Array.isArray(input)) return [];
  
  // High-performance mapping filters
  return input.reduce((acc, curr) => {
    if (curr !== null && curr !== undefined) {
      acc.push(curr);
    }
    return acc;
  }, []);
};
\`\`\`

#### Analysis
- **Time Complexity:** O(N) single pass.
- **Space Complexity:** O(N) array storage.
- **Refinements:** Stronger input validation, checks \`Array.isArray()\` instead of just falsy values.`,
          judge: {
            solution_1_score: 7.8,
            solution_2_score: 9.0,
            solution_1_resoning: "Solution 1 is simple to read and understand. However, it fails to validate if the input is an array, which could crash the program if a non-iterable is passed (like an object or a number).",
            solution_2_resoning: "Solution 2 is superior. It incorporates robust type verification (\`Array.isArray\`) and utilizes a single-pass reduce function to filter invalid variables safely, which provides better security and extensibility.",
            winner: "Solution 2 (Functional)",
            summary: "Solution 2 is cleaner, type-safe, and avoids runtime crashes on malformed inputs."
          }
        });
        return;
      }

      // Check if it's a database/SQL prompt
      if (lower.includes("sql") || lower.includes("database") || lower.includes("schema") || lower.includes("query")) {
        resolve({
          problem: prompt,
          solution_1: `Here is the Relational Schema design (Solution 1) focusing on tight constraints and deep normalization:

\`\`\`sql
-- Solution 1 normalized queries
CREATE TABLE entity_records (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    data_value NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entity_name ON entity_records(name);
\`\`\`

#### Design Choice:
- High level of normalization.
- Unique constraints prevent duplicate entry states.
- Indexing on search columns ensures rapid queries.`,
          solution_2: `Here is the NoSQL/Document-based approach (Solution 2) focusing on horizontal scalability and flexible attributes:

\`\`\`json
{
  "_id": "ObjectId",
  "name": "string",
  "metadata": {
    "data_value": 0.00,
    "tags": ["active", "system"],
    "version": "1.0.0"
  },
  "created_at": "ISODate"
}
\`\`\`

#### Design Choice:
- Nested metadata allows adding variables dynamically without migrations.
- Highly scalable for massive writes and reads.`,
          judge: {
            solution_1_score: 8.8,
            solution_2_score: 8.0,
            solution_1_resoning: "Solution 1 implements proper ACID compliance and foreign keys, which is ideal if transaction safety is the highest priority for the data model.",
            solution_2_resoning: "Solution 2 is highly flexible but lacks data integrity validation at the database layer. Schema drift could happen if client code does not strictly sanitize properties.",
            winner: "Solution 1 (Relational)",
            summary: "Solution 1 wins because transaction reliability and schema integrity are critical for the user's base requirements."
          }
        });
        return;
      }

      // Default/General prompt fallback
      resolve({
        problem: prompt,
        solution_1: `Based on your prompt, here is a structured and highly detailed overview (Solution 1):

#### Core Strategy
1. **Define Objective:** Clarify target goals and establish boundaries.
2. **Execute Operations:** Run structured actions in sequential iterations.
3. **Verify Outcomes:** Review reports and metrics against baseline expectations.

- **Advantage:** Methodical, structured, and easy to trace.
- **Risk:** Might take longer to set up initial pipelines.`,
        solution_2: `Here is an alternative agile approach (Solution 2) designed to deploy rapidly and gather feedback:

#### Execution Flow
We focus on launching a Minimum Viable Product (MVP) immediately, skipping heavy planning cycles to iterate based on real feedback.

- **Phase 1:** Rapid prototyping.
- **Phase 2:** Continuous feedback loops.
- **Phase 3:** Incremental optimizations.

- **Advantage:** Highly adaptive and reduces time-to-market.
- **Risk:** Potential accumulation of technical debt if not refactored.`,
        judge: {
          solution_1_score: 9.2,
          solution_2_score: 8.5,
          solution_1_resoning: "Solution 1 provides a highly reliable framework that mitigates risks early. For long-term projects, this structured architecture saves cost.",
          solution_2_resoning: "Solution 2 is quick, but skipping the initial definition phase may lead to scope creep or alignment issues down the road.",
          winner: "Solution 1 (Structured)",
          summary: "Solution 1 is selected due to its thorough risk mitigation and long-term viability."
        }
      });
    }, 1200);
  });
}
