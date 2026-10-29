import { priceCatalogItem, bundlePriceUsd } from "@/lib/checkout-pricing";
import { getAllSkills, getAllWorkflows, getAllIndustries } from "@/lib/data-service";
import { getSkillPrice, getWorkflowPrice } from "@/lib/pricing";

describe("server-side checkout pricing", () => {
  it("prices a skill from the catalog, ignoring any client price", () => {
    const s = getAllSkills()[0];
    const p = priceCatalogItem({ id: s.id, type: "skill", price: 0.01 } as never);
    expect(p?.unitAmount).toBe(Math.round(getSkillPrice(s) * 100));
    expect(p?.name).toBe(s.name);
  });

  it("prices a workflow from the catalog", () => {
    const w = getAllWorkflows()[0];
    expect(priceCatalogItem({ id: w.id, type: "workflow" })?.unitAmount).toBe(Math.round(getWorkflowPrice(w) * 100));
  });

  it("prices an industry bundle the same way the pricing page does", () => {
    const ind = getAllIndustries()[0];
    expect(priceCatalogItem({ id: `bundle-${ind.id}`, type: "bundle" })?.unitAmount).toBe(Math.round(bundlePriceUsd(ind.id) * 100));
  });

  it("rejects unknown ids and types", () => {
    expect(priceCatalogItem({ id: "nope", type: "skill" })).toBeNull();
    expect(priceCatalogItem({ id: "bundle-nope", type: "bundle" })).toBeNull();
    expect(priceCatalogItem({ id: getAllSkills()[0].id, type: "coupon" })).toBeNull();
  });
});
