import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { JsonEditor } from "@/components/json-editor";
import List from "@/components/list";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useCopy } from "@/hooks";
import { useConfigStore, useNavStore } from "@/store";
import {
  bus,
  createWorkspaceSnapshot,
  parseWorkspaceSnapshot,
  resolveTheme,
} from "@/utils";

import type { ChangeEvent } from "react";
import type { Nav } from "@/types";

function countStats(navs: Nav[]) {
  let appCount = 0;
  let folderCount = 0;

  const visit = (items: NonNullable<Nav["children"]>) => {
    items.forEach((item) => {
      if (item.type === "folder") {
        folderCount += 1;
        visit(item.children || []);
        return;
      }

      appCount += 1;
    });
  };

  navs.forEach((nav) => visit(nav.children || []));

  return {
    navCount: navs.length,
    appCount,
    folderCount,
  };
}

function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

const Data = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingImportText, setPendingImportText] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const appName = import.meta.env.VITE_APP_NAME || "itab";

  const { lang, theme, layout, wallpaper, clock, searchEngine, replaceConfig } =
    useConfigStore();
  const { navs, setNavs } = useNavStore();
  const copyText = useCopy({ successMsg: "工作区 JSON 已复制" });
  const resolvedTheme = useMemo(
    () => resolveTheme(theme?.mode || "system"),
    [theme?.mode],
  );

  const snapshot = useMemo(() => {
    return createWorkspaceSnapshot(
      {
        lang,
        theme,
        layout,
        wallpaper,
        clock,
        searchEngine,
      },
      navs,
    );
  }, [clock, lang, layout, navs, searchEngine, theme, wallpaper]);

  const snapshotText = useMemo(() => {
    return JSON.stringify(snapshot, null, 2);
  }, [snapshot]);

  const stats = useMemo(() => countStats(navs), [navs]);

  const applyImport = (raw: string) => {
    if (!raw.trim()) {
      toast.error("请先提供可导入的 JSON 内容");
      return;
    }
    setPendingImportText(raw);
    setConfirmVisible(true);
  };

  const cancelImport = () => {
    setConfirmVisible(false);
    setPendingImportText("");
  };

  const handleConfirmImport = () => {
    if (!pendingImportText.trim()) {
      cancelImport();
      return;
    }

    try {
      const nextSnapshot = parseWorkspaceSnapshot(pendingImportText);
      replaceConfig(nextSnapshot.config);
      setNavs(nextSnapshot.navs);

      if (nextSnapshot.navs[0]?.id) {
        bus.emit("NAV_CHANGE", nextSnapshot.navs[0].id);
      }

      toast.success(`已导入 ${nextSnapshot.navs.length} 个分类`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "导入失败，JSON 格式不正确";
      toast.error(message);
    }

    cancelImport();
  };

  const handleExport = () => {
    const suffix = new Date().toISOString().replace(/[:.]/g, "-");
    downloadTextFile(snapshotText, `itab-workspace-${suffix}.json`);
    toast.success("工作区文件已导出");
  };

  const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      applyImport(text);
    } catch {
      toast.error("读取文件失败");
    }
  };

  return (
    <>
      <List>
        <List.Item
          title="当前工作区"
          describe={`分类 ${stats.navCount} 个，应用 ${stats.appCount} 个，文件夹 ${stats.folderCount} 个`}
          content={
            <div className="rounded-full bg-[var(--c-text-color-10)] px-3 py-1 text-[12px] text-[var(--c-text-color-60)]">
              历史 {searchEngine?.history?.length || 0} 条
            </div>
          }
        />

        <List.Item
          title="本地存储"
          describe="当前设置和导航会持久化保存在浏览器本地"
          content={
            <div className="max-w-68 text-right text-[12px] leading-[1.45] text-[var(--c-text-color-45)]">
              {appName}-ConfigStore
              <br />
              {appName}-NavStore
            </div>
          }
        />

        <List.Item
          title="导出工作区"
          describe="导出当前设置、分类、应用和搜索历史，便于迁移或备份"
          content={
            <div className="flex items-center gap-2">
              <Button onClick={() => copyText(snapshotText)}>复制 JSON</Button>
              <Button onClick={handleExport}>导出文件</Button>
            </div>
          }
        />

        <List.Item
          title="导入工作区文件"
          describe="支持导入之前导出的 JSON 备份文件"
          content={
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleFileImport}
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                选择文件
              </Button>
            </>
          }
        />

        <List.Item className="block!">
          <div className="space-y-3">
            <div>
              <div className="text-[14px] text-[var(--c-text-color)]">
                粘贴 JSON 导入
              </div>
              <div className="mt-1 text-[12px] text-[var(--c-text-color-45)]">
                适合跨设备手动迁移。导入时会自动做字段兜底和导航修复。
              </div>
            </div>

            <Scrollbars
              autoHeight={true}
              autoHeightMin={300}
              autoHeightMax={300}
              renderThumbVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{ ...style }}
                  className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
                />
              )}
            >
              <JsonEditor
                value={draft}
                onChange={setDraft}
                theme={resolvedTheme}
                placeholderText="把工作区 JSON 粘贴到这里"
              />
            </Scrollbars>

            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setDraft(snapshotText)}>
                填入当前快照
              </Button>
              <Button onClick={() => applyImport(draft)}>应用导入</Button>
            </div>
          </div>
        </List.Item>
      </List>

      <ConfirmDialog
        visible={confirmVisible}
        title="导入工作区"
        description="导入会覆盖当前分类、应用和设置。确认后将直接写入本地数据。"
        confirmText="确认导入"
        contentClassName="w-[min(420px,calc(100vw-32px))]!"
        onConfirm={handleConfirmImport}
        onCancel={cancelImport}
      />
    </>
  );
};

export default Data;
