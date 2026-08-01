import React from "react";
import Playground from "./pages/Playground";
import Connectors from "./pages/Connectors";
import FileUploader from "./components/FileUploader";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 24 }}>
      <h1>AI UI Starter</h1>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 420 }}>
          <Connectors />
          <div style={{ marginTop: 18 }}>
            <FileUploader />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Playground />
        </div>
      </div>
    </div>
  );
}
