import "virtual:uno.css";
import "@/styles/index.less";
import "react-grid-layout/css/styles.css";
import "@ant-design/v5-patch-for-react-19";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";

async function bootstrap() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
