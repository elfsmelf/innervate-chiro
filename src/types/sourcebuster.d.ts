declare module "sourcebuster" {
  interface SbjsConfig {
    lifetime?: number
    session_length?: number
    timezone_offset?: number
    domain?: string
    referrals?: Array<{ host: string; medium: string; display?: string }>
    organics?: Array<{ host: string; param: string; display?: string }>
    callback?: () => void
  }

  interface SbjsCurrentData {
    typ: string
    src: string
    mdm: string
    cmp: string
    cnt: string
    trm: string
  }

  interface SbjsCurrentAddData {
    ep: string
    rf: string
  }

  interface SbjsFirstData {
    typ: string
    src: string
    mdm: string
    cmp: string
    cnt: string
    trm: string
  }

  interface SbjsSessionData {
    pgs: string
    cpg: string
  }

  interface SbjsUdataData {
    vst: string
    uip: string
    uag: string
  }

  interface SbjsData {
    current: SbjsCurrentData
    current_add: SbjsCurrentAddData
    first: SbjsFirstData
    first_add: SbjsCurrentAddData
    session: SbjsSessionData
    udata: SbjsUdataData
  }

  interface Sbjs {
    init: (config?: SbjsConfig) => void
    get: SbjsData
  }

  const sbjs: Sbjs
  export default sbjs
}
