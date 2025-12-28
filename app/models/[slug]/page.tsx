import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ModelDetail } from "@/components/models/model-detail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DRESS_MODELS } from "@/lib/dress-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return DRESS_MODELS.map((model) => ({ slug: model.slug }));
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = DRESS_MODELS.find((item) => item.slug === slug);

  if (!model) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-16 px-4 pb-28 pt-14 sm:gap-20 sm:px-6 sm:pb-32 sm:pt-20">
        <Suspense
          fallback={
            <div className="p-6 text-sm text-foreground/70">
              Loading model...
            </div>
          }
        >
          <ModelDetail modelId={model.id} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
