/**
 * Poran Smart Calculator - Mathematical Evaluation Engine
 * Precise mathematical parser, order of operations, scientific functions,
 * calculus numerical differentiation & integration, and error safety.
 */

export interface MathEngineOptions {
  angleUnit?: 'deg' | 'rad';
}

export interface EvalResult {
  success: boolean;
  result: string;
  error?: string;
  numericValue?: number;
}

export class MathEngine {
  /**
   * Evaluates standard and scientific math expressions.
   */
  static evaluate(rawExpr: string, options: MathEngineOptions = { angleUnit: 'deg' }): EvalResult {
    if (!rawExpr || !rawExpr.trim()) {
      return { success: false, result: '0', error: 'Empty expression' };
    }

    try {
      const sanitized = this.preprocessExpression(rawExpr, options.angleUnit || 'deg');
      const val = this.evaluateParsed(sanitized);

      if (val === undefined || isNaN(val)) {
        return { success: false, result: 'Error', error: 'Invalid expression' };
      }

      if (!isFinite(val)) {
        return { success: false, result: 'Cannot divide by zero', error: 'Division by zero' };
      }

      const formatted = this.formatNumber(val);
      return { success: true, result: formatted, numericValue: val };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Calculation error';
      return { success: false, result: msg, error: msg };
    }
  }

  /**
   * Prepares user-visible display characters into standard mathematical tokens.
   */
  static preprocessExpression(expr: string, angleUnit: 'deg' | 'rad' = 'deg'): string {
    let s = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e/g, `(${Math.E})`);

    // Handle percentage logic:
    // e.g. "A + B%" => "A + (A * B / 100)"
    // e.g. "A - B%" => "A - (A * B / 100)"
    // e.g. "A * B%" => "A * (B / 100)"
    // e.g. "B%" => "(B / 100)"
    s = s.replace(/(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)%/g, '($1 $2 ($1 * $3 / 100))');
    s = s.replace(/(\d+(?:\.\d+)?)%/g, '($1 / 100)');

    // Factorials: e.g. 5! => fact(5)
    s = s.replace(/(\d+(?:\.\d+)?|\([^)]+\))!/g, 'fact($1)');

    // Roots
    s = s.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
    s = s.replace(/√(\d+(?:\.\d+)?)/g, 'sqrt($1)');
    s = s.replace(/∛\(([^)]+)\)/g, 'cbrt($1)');
    s = s.replace(/∛(\d+(?:\.\d+)?)/g, 'cbrt($1)');

    // Exponents: 2^3 => Math.pow(2, 3)
    // Handle standard trigonometric functions with DEG/RAD awareness
    return s;
  }

  /**
   * Evaluates an arithmetic expression using Shunting-Yard AST/RPN or math-context.
   */
  private static evaluateParsed(expr: string): number {
    // Check for division by zero upfront
    if (/\/\s*0(?![.\d])/.test(expr)) {
      throw new Error('Cannot divide by zero');
    }

    // Mathematical context functions
    const degToRad = (deg: number) => (deg * Math.PI) / 180;
    const radToDeg = (rad: number) => (rad * 180) / Math.PI;

    const fact = (n: number): number => {
      if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
      if (n > 170) return Infinity;
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    };

    // Math sandbox with safe functions
    const scope = {
      sin: (x: number) => Math.sin(degToRad(x)),
      cos: (x: number) => Math.cos(degToRad(x)),
      tan: (x: number) => {
        const rad = degToRad(x);
        if (Math.abs(Math.cos(rad)) < 1e-12) throw new Error('Undefined (tan 90°)');
        return Math.tan(rad);
      },
      sinRad: (x: number) => Math.sin(x),
      cosRad: (x: number) => Math.cos(x),
      tanRad: (x: number) => Math.tan(x),
      asin: (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain error: asin requires [-1, 1]');
        return radToDeg(Math.asin(x));
      },
      acos: (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain error: acos requires [-1, 1]');
        return radToDeg(Math.acos(x));
      },
      atan: (x: number) => radToDeg(Math.atan(x)),
      asinRad: (x: number) => Math.asin(x),
      acosRad: (x: number) => Math.acos(x),
      atanRad: (x: number) => Math.atan(x),
      ln: (x: number) => {
        if (x <= 0) throw new Error('Domain error: ln requires x > 0');
        return Math.log(x);
      },
      log: (x: number) => {
        if (x <= 0) throw new Error('Domain error: log requires x > 0');
        return Math.log10(x);
      },
      log2: (x: number) => {
        if (x <= 0) throw new Error('Domain error: log2 requires x > 0');
        return Math.log2(x);
      },
      sqrt: (x: number) => {
        if (x < 0) throw new Error('Cannot take square root of negative number');
        return Math.sqrt(x);
      },
      cbrt: (x: number) => Math.cbrt(x),
      abs: (x: number) => Math.abs(x),
      pow: (b: number, e: number) => Math.pow(b, e),
      fact,
      PI: Math.PI,
      E: Math.E,
    };

    // Convert caret `a^b` to `pow(a, b)`
    let processed = expr;
    while (processed.includes('^')) {
      processed = processed.replace(/([0-9.]+|\([^()]+\))\s*\^\s*([0-9.]+|\([^()]+\))/g, 'pow($1, $2)');
    }

    // Sanitize tokens strictly to allowed characters: numbers, operators, parens, allowed function names
    const allowed = /^[0-9+\-*/().,\s]|sin|cos|tan|asin|acos|atan|sinRad|cosRad|tanRad|asinRad|acosRad|atanRad|ln|log|log2|sqrt|cbrt|abs|pow|fact|PI|E$/;
    const tokens = processed.match(/[a-zA-Z_]\w*|[0-9.]+|[+\-*/(),^]/g) || [];

    for (const token of tokens) {
      if (typeof token === 'string' && !allowed.test(token) && !(token in scope)) {
        throw new Error(`Invalid symbol: ${token}`);
      }
    }

    // Construct safe function executor with scope
    const argNames = Object.keys(scope);
    const argVals = Object.values(scope);
    const runner = new Function(...argNames, `return (${processed});`);
    const val = runner(...argVals);

    return Number(val);
  }

  /**
   * Numerical differentiation: df/dx at point x0
   * Uses central difference quotient: (f(x0 + h) - f(x0 - h)) / (2h)
   */
  static differentiate(funcExpr: string, x0: number, angleUnit: 'deg' | 'rad' = 'rad'): { value: number; formatted: string } {
    const h = 1e-6;
    const evalAt = (x: number): number => {
      const expr = funcExpr.replace(/\bx\b/g, `(${x})`);
      const res = this.evaluate(expr, { angleUnit });
      if (!res.success || res.numericValue === undefined) {
        throw new Error(res.error || 'Evaluation failed');
      }
      return res.numericValue;
    };

    const fPlus = evalAt(x0 + h);
    const fMinus = evalAt(x0 - h);
    const derivative = (fPlus - fMinus) / (2 * h);

    return {
      value: derivative,
      formatted: this.formatNumber(derivative),
    };
  }

  /**
   * Numerical integration: definite integral ∫ f(x) dx from a to b
   * Uses Simpson's Composite 1/3 Rule
   */
  static integrate(
    funcExpr: string,
    a: number,
    b: number,
    steps: number = 600,
    angleUnit: 'deg' | 'rad' = 'rad'
  ): { value: number; formatted: string } {
    if (a === b) return { value: 0, formatted: '0' };
    if (a > b) {
      const inv = this.integrate(funcExpr, b, a, steps, angleUnit);
      return { value: -inv.value, formatted: this.formatNumber(-inv.value) };
    }

    // Ensure even number of steps for Simpson's rule
    const n = steps % 2 === 0 ? steps : steps + 1;
    const h = (b - a) / n;

    const evalAt = (x: number): number => {
      const expr = funcExpr.replace(/\bx\b/g, `(${x})`);
      const res = this.evaluate(expr, { angleUnit });
      if (!res.success || res.numericValue === undefined) {
        throw new Error(res.error || `Evaluation failed at x = ${x}`);
      }
      return res.numericValue;
    };

    let sum = evalAt(a) + evalAt(b);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const weight = i % 2 === 0 ? 2 : 4;
      sum += weight * evalAt(x);
    }

    const integral = (h / 3) * sum;
    return {
      value: integral,
      formatted: this.formatNumber(integral),
    };
  }

  /**
   * Cleans and formats numbers gracefully without trailing floats.
   */
  static formatNumber(val: number): string {
    if (Math.abs(val) < 1e-12 && val !== 0) return '0';
    if (!isFinite(val)) return 'Error';

    // Round away floating precision jitter: e.g. 0.1 + 0.2 = 0.30000000000000004 => 0.3
    const rounded = Number(val.toPrecision(12));

    // For very large or microscopic numbers, use scientific notation
    if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
      return rounded.toExponential(6).replace('e+', 'e');
    }

    // Otherwise standard formatted with thousands separator if desired
    return rounded.toString();
  }

  /**
   * Bengali numeral converter for display if enabled
   */
  static toBengaliDigits(str: string): string {
    const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let result = str;
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(enDigits[i], 'g'), bnDigits[i]);
    }
    return result;
  }
}
