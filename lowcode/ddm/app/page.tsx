// app/page.tsx
import FlowEdit from "./FlowEdit";
import "reactflow/dist/style.css";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlowEdit />
    </div>
  );
}
