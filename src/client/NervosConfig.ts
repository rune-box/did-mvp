export class NervosConfig{
    static CKB_NodeUrl: string = "https://mainnet.ckb.dev/rpc";
    static CKB_IndexerUrl: string = "https://mainnet.ckb.dev/indexer_rpc";

    // L9: node_modules\@lay2\pw-core\build\main\core.d.ts
    static PWCore_ChainId: number = 0;

    static Unipass_AggregatorUrl: string = "https://aggregator.unipass.id/";
    static Unipass_SnapshotUrl: string = NervosConfig.Unipass_AggregatorUrl + "snapshot/";
    static Unipass_LockCodeHash: string = "0xd01f5152c267b7f33b9795140c2467742e8424e49ebe2331caec197f7281b60a";
}