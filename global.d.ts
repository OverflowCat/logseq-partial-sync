type BlockUUID = string;
type EntityID = number;
type BlockIdentity = BlockUUID | Pick<BlockEntity, "uuid">;
type BlockPageName = string;
type PageIdentity = BlockPageName | BlockIdentity;
type BlockUUIDTuple = ["uuid", BlockUUID];
type IEntityID = { id: EntityID; [key: string]: any };
type IBatchBlock = {
  content: string;
  properties?: Record<string, any>;
  children?: Array<IBatchBlock>;
};

interface BlockEntity {
  id: EntityID; // db id
  uuid: BlockUUID;
  left: IEntityID;
  format: "markdown" | "org";
  parent: IEntityID;
  unordered: boolean;
  content: string;
  page: IEntityID;
  properties?: Record<string, any>;

  // optional fields in dummy page
  anchor?: string;
  body?: any;
  children?: Array<BlockEntity | BlockUUIDTuple>;
  container?: string;
  file?: IEntityID;
  level?: number;
  meta?: { timestamps: any; properties: any; startPos: number; endPos: number };
  title?: Array<any>;

  [key: string]: any;
}

/**
 * Page is just a block with some specific properties.
 */
interface PageEntity {
  id: EntityID;
  uuid: BlockUUID;
  name: string;
  originalName: string;
  "journal?": boolean;

  file?: IEntityID;
  namespace?: IEntityID;
  children?: Array<PageEntity>;
  properties?: Record<string, any>;
  format?: "markdown" | "org";
  journalDay?: number;
  updatedAt?: number;

  [key: string]: any;
}

interface AppState {
  "assets/alias-dirs": string[];
  "assets/alias-enabled?": boolean;
  "auth/access-token": string | null;
  "auth/id-token": string | null;
  "auth/refresh-token": string | null;
  "block/component-editing-mode?": boolean;
  "command-palette/commands": {
    name: string;
    label: string;
    icon?: string;
    command: string;
  }[];
  config: {
    [key: string]: any;
  };
  "copy/export-block-text-indent-style": "no-indent" | "indent" | "auto-detect";
  "copy/export-block-text-other-options": {
    [key: string]: any;
  };
  "copy/export-block-text-remove-options": string[];
  "cursor-range": [number, number] | null;
  "custom-context-menu/links": string[] | null;
  "custom-context-menu/position": [number, number] | null;
  "custom-context-menu/show?": boolean;
  "date-picker/date": Date | null;
  "db/batch-txs": any;
  "db/last-transact-time": {
    [key: string]: number;
  };
  "db/persisted?": {
    [key: string]: boolean;
  };
  "db/restoring?": boolean;
  "document/mode?": boolean;
  draw?: boolean;
  "editor/action": string | null;
  "editor/skip-saving-current-block?": boolean;
  "electron/auto-updater-downloaded": boolean;
  "electron/server": any;
  "electron/updater": any;
  "electron/updater-pending?": boolean;
  "electron/user-cfgs": any | null;
  "encryption/graph-parsing?": boolean;
  "favorites/dragging": any | null;
  "feature/enable-sync?": boolean;
  "file-sync/graph-state": {
    "current-graph-uuid": string | null;
  };
  "file-sync/jstour-inst": any;
  "file-sync/onboarding-state": {
    welcome: boolean;
  };
  "file-sync/remote-graphs": {
    loading: boolean;
    graphs: any | null;
  };
  "file-sync/set-remote-graph-password-result": any;
  "file/rename-event-chan": any;
  "file/unlinked-dirs": string[];
  "file/writes": any;
  "git/current-repo": string;
  "graph/importing": any | null;
  "graph/importing-state": any;
  "graph/parsing-state": any;
  "graph/syncing?": boolean;
  "history/page-only-mode?": boolean;
  "history/tx->editor-cursor": {
    [key: string]: any;
  };
  "indexeddb/support?": boolean;
  "instrument/disabled?": boolean | null;
  "journals-length": number;
  me: {
    repos: any[];
  };
  "mobile/actioned-block": any | null;
  "mobile/app-state-change": any;
  "mobile/container-urls": any | null;
  "mobile/show-action-bar?": boolean;
  "mobile/show-recording-bar?": boolean;
  "mobile/show-tabbar?": boolean;
  "mobile/show-toolbar?": boolean;
  "modal/close-backdrop?": boolean;
  "modal/close-btn?": boolean;
  "modal/dropdowns": {
    [key: string]: any;
  };
  "modal/fullscreen?": boolean;
  "modal/id": string | null;
  "modal/label": string;
  "modal/panel-content": any | null;
  "modal/show?": boolean;
  "modal/subsets": any[];
  "network/online?": boolean;
  "nfs/refreshing?": boolean | null;
  "nfs/user-granted?": {
    [key: string]: boolean;
  };
  "notification/content": any | null;
  "notification/contents": {
    [key: string]: any;
  };
  "notification/show?": boolean;
  "pdf/block-highlight-colored?": boolean;
  "pdf/current": any | null;
  "pdf/ref-highlight": any | null;
  "pdf/system-win?": boolean;
  "plugin/active-readme": string | null;
  "plugin/enabled": boolean;
  "plugin/focused-settings": any | null;
  "plugin/indicator-text": string;
  "plugin/installed-hooks": {
    [key: string]: any;
  };
  "plugin/installed-plugins": {
    [key: string]: any;
  };
  "plugin/installed-resources": {
    [key: string]: any;
  };
  "plugin/installed-services": {
    [key: string]: any;
  };
  "plugin/installed-slash-commands": {
    [key: string]: any;
  };
  "plugin/installed-themes": any[];
  "plugin/installed-ui-items": {
    [key: string]: any[];
  };
  "plugin/installing": any | null;
  "plugin/marketplace-pkgs": any[];
  "plugin/marketplace-stats": any | null;
  "plugin/navs-settings?": boolean;
  "plugin/preferences": {
    theme: any;
    themes: any;
    externals: any[];
    pinnedToolbarItems: any[];
  };
  "plugin/selected-theme": string;
  "plugin/selected-unpacked-pkg": any | null;
  "plugin/simple-commands": {
    [key: string]: any[];
  };
  "plugin/updates-auto-checking?": boolean;
  "plugin/updates-coming": {
    [key: string]: any;
  };
  "plugin/updates-downloading?": boolean;
  "plugin/updates-pending": {
    [key: string]: any;
  };
  "plugin/updates-unchecked": any[];
  "preferred-language": string;
  "reactive/custom-queries": any;
  "reactive/query-dbs": {
    [key: string]: any;
  };
  "repo/loading-files?": {
    [key: string]: boolean;
  };
  "route-match": {
    template: string;
    data: any;
    result: any | null;
    "path-params": {
      [key: string]: string;
    };
    path: string;
  };
  "search/engines": {
    [key: string]: any;
  };
  "search/graph-filters": any[];
  "search/mode": "global" | "page" | "journal" | "blocks" | "selections";
  "search/q": string;
  "search/result": any | null;
  "selection/blocks": any | null;
  "selection/direction": "up" | "down";
  "selection/mode": boolean;
  "selection/selected-all?": boolean;
  "selection/start-block": any | null;
  "sidebar/blocks": any[];
  "srs/cards-due-count": number;
  "srs/mode?": boolean;
  "system/events": any;
  today: string;
  "ui/collapsed-blocks": {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  "ui/custom-theme": {
    light: {
      [key: string]: any;
    };
    dark: {
      [key: string]: any;
    };
  };
  "ui/developer-mode?": boolean;
  "ui/file-component": any | null;
  "ui/find-in-page": any | null;
  "ui/fullscreen?": boolean;
  "ui/left-sidebar-open?": boolean;
  "ui/loading?": {
    [key: string]: boolean;
  };
  "ui/navigation-item-collapsed?": {
    [key: string]: boolean;
  };
  "ui/paths-scroll-positions": {
    [key: string]: number;
  };
  "ui/root-component": any;
  "ui/scrolling?": boolean;
  "ui/settings-open?": boolean;
  "ui/shortcut-handler-refreshing?": boolean;
  "ui/shortcut-tooltip?": boolean;
  "ui/sidebar-collapsed-blocks": {
    [key: string]: boolean;
  };
  "ui/sidebar-open?": boolean;
  "ui/system-theme?": boolean;
  "ui/theme": "light" | "dark";
  "ui/viewport": {
    width: number;
    height: number;
    scale: number;
  };
  "ui/wide-mode?": boolean | null;
  "user/info": {
    UserGroups: any | null;
  };
  "view/components": {
    [key: string]: (...args: any[]) => any;
  };
  "whiteboard/last-persisted-at": {
    [key: string]: number;
  };
  "whiteboard/onboarding-tour?": boolean;
  "whiteboard/onboarding-whiteboard?": boolean;
  "whiteboard/pending-tx-data": {
    [key: string]: any;
  };
  "youtube/players": {
    [key: string]: any;
  };
}

declare namespace logseq {
  namespace api {
    function get_current_page(): Promise<BlockEntity | PageEntity>;
    function get_page_blocks_tree(
      srcPage: PageIdentity
    ): Promise<BlockEntity[]>;
    function insert_block(
      parent: BlockIdentity | PageIdentity,
      content: string,
      opts?: Partial<{
        before: boolean;
        customUUID: string;
        focus: boolean;
        isPageBlock: boolean;
        properties: {};
        sibling: boolean;
      }>
    ): Promise<BlockEntity>;
    function remove_block(block: BlockIdentity): Promise<void>;
  }
  namespace sdk {
    namespace assets {
      function make_url(): any;
      function list_files_of_current_graph(): any;
    }

    namespace core {
      const version: string;
    }

    namespace debug {
      function log_app_state(): () => AppState;
    }
  }

  namespace git {
    function exec_command(): any;
    function load_ignore_file(): () => any;
    function save_ignore_file(): any;
  }

  namespace ui {
    function show_msg(): (arg0: string) => string;
    function close_msg(): (key: string) => any;
  }
}

// 将 logseq.api 注入到全局的 Window 对象中
declare global {
  interface Window {
    logseq: typeof logseq.instance;
  }
}
