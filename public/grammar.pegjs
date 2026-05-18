{
  const ctx = options.context || {};

  function resolve(name) {
    if (name in ctx) return ctx[name];
    throw new Error(`Unknown reference: "${name}"`);
  }

  function resolveProp(obj, prop) {
    const val = resolve(obj);
    if (val !== null && typeof val === 'object' && prop in val) {
      return val[prop];
    }
    throw new Error(`Property "${prop}" not found on "${obj}"`);
  }
}

Start = _ expr:Expression _ { return expr; }

Expression = head:Term tail:(_ AddOp _ Term)* {
  for (const [, op, , t] of tail) {
    if (op === '+') head += t;
    else head -= t;
  }
  return head;
}

AddOp = "+" / "-"

Term = head:Factor tail:(_ MulOp _ Factor)* {
  for (const [, op, , f] of tail) {
    if (op === '*') head *= f;
    else if (op === '/') head /= f;
    else head /= f;
  }
  return head;
}

MulOp = "*" / "/" / "PER" ![A-Za-z0-9_]

Factor = Paren / PropRef / VarRef / Num

Paren = "(" _ expr:Expression _ ")" { return expr; }

PropRef = "@" name:Name "." prop:Name {
  return resolveProp(name, prop);
}

VarRef = "@" name:Name {
  return resolve(name);
}

Num = num:Number _ mult:Multiplier? _ unit:Unit? {
  let v = num;
  if (mult === 'K') v *= 1000;
  else if (mult === 'L') v *= 100000;
  else if (mult === 'CR') v *= 10000000;
  return v;
}

Number = num:$([0-9]+ ("." [0-9]+)?) { return parseFloat(num); }

Multiplier = "K" ![A-Za-z0-9_] { return 'K'; }
           / "L" ![A-Za-z0-9_] { return 'L'; }
           / "CR" ![A-Za-z0-9_] { return 'CR'; }

Unit = "SQ" __ "MT" "R"? / "MTR" / "PER" __ "SQ" __ "MT" "R"?

Name = $([A-Za-z_][A-Za-z0-9_]*)

__ = [ \t]+
_  = [ \t]*
