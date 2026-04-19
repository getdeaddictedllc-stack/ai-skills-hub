"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Download,
  ShoppingCart,
  Sparkles,
  Zap,
  Package,
  Clock,
  ExternalLink,
} from "lucide-react";
import { generateSkillFileContent, generateWorkflowFileContent } from "@/lib/skill-file-generator";
import { getAllSkills, getAllWorkflows } from "@/lib/data-service";
import JSZip from "jszip";

interface PurchaseRecord {
  id: string;
  items: {
    id: string;
    type: "skill" | "workflow" | "bundle";
    name: string;
    price: number;
    industry: string;
  }[];
  total: number;
  date: string;
}

const PURCHASE_STORAGE_KEY = "aiskillhub-purchases";

function getPurchases(): PurchaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(PURCHASE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    setPurchases(getPurchases());
  }, []);

  const handleDownloadItem = async (item: PurchaseRecord["items"][0]) => {
    const allSkills = getAllSkills();
    const allWorkflows = getAllWorkflows();

    if (item.type === "skill") {
      const skill = allSkills.find((s) => s.id === item.id);
      if (skill) downloadFile(`${skill.id}.md`, generateSkillFileContent(skill));
    } else if (item.type === "workflow") {
      const workflow = allWorkflows.find((w) => w.id === item.id);
      if (workflow) downloadFile(`${workflow.id}.md`, generateWorkflowFileContent(workflow));
    } else if (item.type === "bundle") {
      const zip = new JSZip();
      const industrySkills = allSkills.filter((s) => s.industry === item.industry);
      const industryWorkflows = allWorkflows.filter((w) => w.industry === item.industry);
      for (const skill of industrySkills) {
        zip.folder("skills")?.file(`${skill.id}.md`, generateSkillFileContent(skill));
      }
      for (const workflow of industryWorkflows) {
        zip.folder("workflows")?.file(`${workflow.id}.md`, generateWorkflowFileContent(workflow));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.industry}-bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  const totalSpent = purchases.reduce((sum, p) => sum + p.total, 0);
  const totalItems = purchases.reduce((sum, p) => sum + p.items.length, 0);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-6 w-6 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, {session.user?.name ?? session.user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Purchases</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{purchases.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Items Owned</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{totalItems}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Purchase History */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Purchase History
          </h2>
        </div>

        {purchases.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-gray-700">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              No purchases yet
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Browse our marketplace to find AI skills and workflows for your industry.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <Sparkles className="h-4 w-4" />
                Browse Skills
              </Link>
              <Link
                href="/workflows"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <Zap className="h-4 w-4" />
                Browse Workflows
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    {new Date(purchase.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ${purchase.total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {purchase.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                            item.type === "skill"
                              ? "bg-blue-500"
                              : item.type === "workflow"
                              ? "bg-purple-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {item.type === "skill" ? (
                            <Sparkles className="h-4 w-4" />
                          ) : item.type === "workflow" ? (
                            <Zap className="h-4 w-4" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                            {item.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${item.type === "bundle" ? "industry" : item.type}/${item.id.replace(`bundle-`, "")}`}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDownloadItem(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
