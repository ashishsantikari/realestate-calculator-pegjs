class Calculator {
  constructor(parser) {
    this.parser = parser;
  }

  parseDefinitions(text) {
    const context = {};
    if (!text || !text.trim()) return context;

    const lines = text.split('\n').filter(l => l.trim());

    for (const line of lines) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[-=]\s*(.+)$/);
      if (!match) continue;

      const name = match[1];
      const valueStr = match[2].trim();

      if (valueStr.startsWith('{') && valueStr.endsWith('}')) {
        context[name] = this._parseObject(valueStr, context);
      } else {
        context[name] = this._evaluate(valueStr, context);
      }
    }

    return context;
  }

  _parseObject(str, context) {
    const inner = str.slice(1, -1).trim();
    const obj = {};

    if (!inner) return obj;

    const pairs = this._splitPairs(inner);

    for (const pair of pairs) {
      const colonIdx = pair.indexOf(':');
      if (colonIdx === -1) continue;

      const key = pair.slice(0, colonIdx).trim();
      const valStr = pair.slice(colonIdx + 1).trim();

      if (key) {
        obj[key] = this._evaluate(valStr, context);
      }
    }

    return obj;
  }

  _splitPairs(str) {
    const pairs = [];
    let depth = 0;
    let current = '';

    for (const ch of str) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === ',' && depth === 0) {
        pairs.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    if (current.trim()) pairs.push(current);

    return pairs;
  }

  _evaluate(expr, context) {
    return this.parser.parse(expr, { context });
  }

  evaluateExpression(expr, definitionsText) {
    let context = {};
    let defError = null;

    try {
      context = this.parseDefinitions(definitionsText);
    } catch (err) {
      defError = { source: 'definitions', message: err.message };
    }

    if (!expr || !expr.trim()) {
      return { result: null, context, error: null, defError };
    }

    try {
      const result = this._evaluate(expr, context);
      return { result, context, error: null, defError };
    } catch (err) {
      return { result: null, context, error: err, defError };
    }
  }

  suggestFix(error, definitionsText) {
    if (!error) return null;

    const msg = error.message || '';

    const refMatch = msg.match(/Unknown reference: "(.+)"/);
    if (refMatch) {
      const badRef = refMatch[1];
      const defined = this._extractNames(definitionsText);
      const suggestions = defined
        .map(d => ({ name: d, dist: this._levenshtein(badRef, d) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3)
        .filter(s => s.dist <= 3);

      if (suggestions.length > 0) {
        return `Did you mean: ${suggestions.map(s => `"${s.name}"`).join(', ')}?`;
      }
      if (defined.length > 0) {
        return `Available references: ${defined.join(', ')}`;
      }
      return 'No references defined. Add definitions first.';
    }

    const propMatch = msg.match(/Property "(.+)" not found on "(.+)"/);
    if (propMatch) {
      return `"${propMatch[2]}" has no property "${propMatch[1]}". Check available properties.`;
    }

    if (msg.includes('Expected')) {
      const posMatch = msg.match(/position (\d+)/);
      if (posMatch) {
        return `Syntax error at position ${posMatch[1]}. Check your expression.`;
      }
      return `Syntax error: ${msg}`;
    }

    return null;
  }

  _extractNames(text) {
    const names = [];
    const lines = (text || '').split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)/);
      if (match) names.push(match[1]);
    }
    return names;
  }

  _levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}
