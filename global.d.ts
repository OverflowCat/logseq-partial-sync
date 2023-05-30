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

    export interface BlockEntity {
      id: EntityID;
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
      meta?: {
        timestamps: any;
        properties: any;
        startPos: number;
        endPos: number;
      };
      title?: Array<any>;

      [key: string]: any;
    }

    export interface PageEntity {
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

    export type BlockIdentity = BlockUUID | Pick<BlockEntity, "uuid">;
  }
}

// 将 logseq.api 注入到全局的 Window 对象中
declare global {
  interface Window {
    logseq: typeof logseq.instance;
  }
}
