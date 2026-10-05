// Feature: gemini-chatbot — Property-Based Tests
// Uses fast-check (fc) with >= 100 iterations per property.
// Tests the pure logic functions in historyUtils.js.

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  buildHistoryEntry,
  appendHistoryPair,
  isValidMessage,
  MAX_HISTORY,
  MAX_CHARS,
} from '../utils/historyUtils.js';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// Non-empty, non-whitespace string up to MAX_CHARS
const validMessageArb = fc
  .string({ minLength: 1, maxLength: MAX_CHARS })
  .filter((s) => s.trim().length > 0);

// Whitespace-only string
const whitespaceArb = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 })
  .map((arr) => arr.join(''));

// A single history entry pair [userText, botText]
const pairArb = fc.tuple(validMessageArb, validMessageArb);

// A sequence of 0..49 pairs (builds a history up to 98 entries)
const historySeqArb = fc.array(pairArb, { minLength: 0, maxLength: 49 });

function buildHistory(pairs) {
  return pairs.reduce((hist, [u, b]) => appendHistoryPair(hist, u, b), []);
}

// ---------------------------------------------------------------------------
// Property 1: Valid message is accepted by isValidMessage
// Feature: gemini-chatbot, Property 1: Valid message grows the message list
// ---------------------------------------------------------------------------
describe('Property 1 — valid messages are accepted', () => {
  it('non-empty non-whitespace strings within limit are valid', () => {
    fc.assert(
      fc.property(validMessageArb, (msg) => {
        expect(isValidMessage(msg)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Whitespace-only input is rejected
// Feature: gemini-chatbot, Property 2: Whitespace-only input is rejected
// ---------------------------------------------------------------------------
describe('Property 2 — whitespace-only input is rejected', () => {
  it('strings of only whitespace characters are not valid', () => {
    fc.assert(
      fc.property(whitespaceArb, (msg) => {
        expect(isValidMessage(msg)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: Messages over MAX_CHARS are rejected
// Feature: gemini-chatbot, Property 3: Over-limit input is rejected
// ---------------------------------------------------------------------------
describe('Property 3 — over-limit messages are rejected', () => {
  it('strings longer than MAX_CHARS are not valid', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: MAX_CHARS + 1, maxLength: MAX_CHARS + 500 }),
        (msg) => {
          expect(isValidMessage(msg)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: buildHistoryEntry maps 'bot' role to 'model'
// Feature: gemini-chatbot, Property 4: History is forwarded with correct role mapping
// ---------------------------------------------------------------------------
describe('Property 4 — role mapping bot -> model', () => {
  it('bot role maps to model in history entry', () => {
    fc.assert(
      fc.property(validMessageArb, (content) => {
        const entry = buildHistoryEntry('bot', content);
        expect(entry.role).toBe('model');
        expect(entry.parts[0].text).toBe(content);
      }),
      { numRuns: 100 }
    );
  });

  it('user role stays as user in history entry', () => {
    fc.assert(
      fc.property(validMessageArb, (content) => {
        const entry = buildHistoryEntry('user', content);
        expect(entry.role).toBe('user');
        expect(entry.parts[0].text).toBe(content);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: appendHistoryPair preserves chronological order
// Feature: gemini-chatbot, Property 5: History is forwarded in chronological order
// ---------------------------------------------------------------------------
describe('Property 5 — history stays in chronological order', () => {
  it('each new pair is appended after existing entries', () => {
    fc.assert(
      fc.property(historySeqArb, pairArb, (pairs, [u, b]) => {
        const before = buildHistory(pairs);
        const after  = appendHistoryPair(before, u, b);

        // New user entry is second-to-last
        expect(after[after.length - 2].parts[0].text).toBe(u);
        // New bot entry is last
        expect(after[after.length - 1].parts[0].text).toBe(b);
        // All previous entries are preserved at the front
        for (let i = 0; i < before.length; i++) {
          expect(after[i]).toEqual(before[i]);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: History never exceeds MAX_HISTORY entries
// Feature: gemini-chatbot, Property 6: History eviction preserves 100-entry cap
// ---------------------------------------------------------------------------
describe('Property 6 — history cap is never exceeded', () => {
  it('history length stays <= MAX_HISTORY after any number of pairs', () => {
    fc.assert(
      fc.property(
        fc.array(pairArb, { minLength: 1, maxLength: 60 }),
        (pairs) => {
          const hist = buildHistory(pairs);
          expect(hist.length).toBeLessThanOrEqual(MAX_HISTORY);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('adding a pair to a full history still stays within cap', () => {
    fc.assert(
      fc.property(pairArb, ([u, b]) => {
        // Build exactly MAX_HISTORY entries (50 pairs = 100 entries)
        const fullPairs = Array.from({ length: 50 }, (_, i) => [`u${i}`, `b${i}`]);
        const fullHist  = buildHistory(fullPairs);
        expect(fullHist.length).toBe(MAX_HISTORY);

        const after = appendHistoryPair(fullHist, u, b);
        expect(after.length).toBeLessThanOrEqual(MAX_HISTORY);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Oldest entry is evicted first (FIFO)
// Feature: gemini-chatbot, Property 7: Oldest entry is removed before new pair
// ---------------------------------------------------------------------------
describe('Property 7 — oldest entry evicted when cap reached', () => {
  it('the first entry of a full history is gone after adding one more pair', () => {
    fc.assert(
      fc.property(pairArb, ([u, b]) => {
        const fullPairs = Array.from({ length: 50 }, (_, i) => [`u${i}`, `b${i}`]);
        const fullHist  = buildHistory(fullPairs);
        const firstEntry = fullHist[0];

        const after = appendHistoryPair(fullHist, u, b);

        // The original first entry must no longer be at index 0
        expect(after[0]).not.toEqual(firstEntry);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: buildHistoryEntry always produces correct shape
// Feature: gemini-chatbot, Property 8: History entries always have correct structure
// ---------------------------------------------------------------------------
describe('Property 8 — history entry shape is always correct', () => {
  it('every entry has role and parts[0].text matching input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('user', 'bot'),
        validMessageArb,
        (role, content) => {
          const entry = buildHistoryEntry(role, content);
          expect(entry).toHaveProperty('role');
          expect(entry).toHaveProperty('parts');
          expect(Array.isArray(entry.parts)).toBe(true);
          expect(entry.parts.length).toBe(1);
          expect(entry.parts[0]).toHaveProperty('text', content);
          expect(['user', 'model']).toContain(entry.role);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: appendHistoryPair always adds exactly 2 entries (unless evicting)
// Feature: gemini-chatbot, Property 9: Each exchange adds exactly one user+bot pair
// ---------------------------------------------------------------------------
describe('Property 9 — pair adds exactly 2 entries when under cap', () => {
  it('history grows by 2 when below MAX_HISTORY', () => {
    fc.assert(
      fc.property(
        // Use at most 49 pairs so history stays below 100 before adding
        fc.array(pairArb, { minLength: 0, maxLength: 48 }),
        pairArb,
        (pairs, [u, b]) => {
          const before = buildHistory(pairs);
          // Only test the growth property when we're safely under the cap
          if (before.length <= MAX_HISTORY - 2) {
            const after = appendHistoryPair(before, u, b);
            expect(after.length).toBe(before.length + 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
