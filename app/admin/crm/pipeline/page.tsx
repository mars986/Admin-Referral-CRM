import { PipelineBoard } from "@/components/crm/pipeline-board";
import { getPipeline } from "@/lib/crm/service";

export default async function PipelinePage() {
  return (
    <div data-admin-page>
      <PipelineBoard initialColumns={await getPipeline()} />
    </div>
  );
}
