import { describe, expect, it } from "vitest";
import { enDictionary } from "@/lib/i18n/dictionaries/en";
import { ruDictionary } from "@/lib/i18n/dictionaries/ru";
import { kgDictionary } from "@/lib/i18n/dictionaries/kg";

function sortedKeys(input: Record<string, string>) {
  return Object.keys(input).sort();
}

describe("i18n dictionaries", () => {
  it("should keep the same keyset across all languages", () => {
    const enKeys = sortedKeys(enDictionary);
    const ruKeys = sortedKeys(ruDictionary);
    const kgKeys = sortedKeys(kgDictionary);

    expect(ruKeys).toEqual(enKeys);
    expect(kgKeys).toEqual(enKeys);
  });

  it("should keep key values non-empty for core keys", () => {
    expect(ruDictionary["nav.home"].trim().length).toBeGreaterThan(0);
    expect(kgDictionary["nav.home"].trim().length).toBeGreaterThan(0);
    expect(ruDictionary["auth.field.fullName"].trim().length).toBeGreaterThan(0);
    expect(kgDictionary["common.years"].trim().length).toBeGreaterThan(0);
    expect(enDictionary["profile.settings.password.title"].trim().length).toBeGreaterThan(0);
    expect(ruDictionary["profile.settings.password.title"].trim().length).toBeGreaterThan(0);
    expect(kgDictionary["profile.settings.password.title"].trim().length).toBeGreaterThan(0);
  });
});
