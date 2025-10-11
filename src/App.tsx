import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "@/components/config-provider";
import { router } from "@/router";
import { useConfigStore } from "@/store";
import { Toaster } from "sonner";

function App() {
  const config = useConfigStore();

  return (
    <ConfigProvider value={config}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors={true}
        toastOptions={{ className: "px-4! py-3! rounded-2.5!" }}
        theme="dark"
      />
    </ConfigProvider>
  );
}

export default App;
