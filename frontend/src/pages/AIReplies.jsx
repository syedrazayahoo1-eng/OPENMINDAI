import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/dashboard/PageHeader";

import AIPromptCard from "../components/ai/AIPromptCard";
import ReplyEditor from "../components/ai/ReplyEditor";
import ToneSelector from "../components/ai/ToneSelector";
import ReplyHistory from "../components/ai/ReplyHistory";

export default function AIReplies() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <PageHeader
          title="AI Reply Studio"
          subtitle="Generate human-like Google review replies with Azure OpenAI."
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2">

            <ReplyEditor />

          </div>

          <div>

            <ToneSelector />

          </div>

        </div>

        <AIPromptCard />

        <ReplyHistory />

      </div>

    </DashboardLayout>
  );
}