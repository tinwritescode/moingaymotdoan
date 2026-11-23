import { crc32, deflateRawSync } from "node:zlib";

export type ZipEntry = { name: string; data: string; store?: boolean };

/** 1980-01-01 in MS-DOS date format: a fixed stamp, so the same content gives the same bytes. */
const DOS_DATE = 0x21;

/**
 * A minimal zip writer, enough for EPUB: entries in the given order, sizes in the local headers
 * (no data descriptors), no extra fields. Names must be ASCII; the UTF-8 name flag is never set.
 */
export function zip(entries: ZipEntry[]): Uint8Array<ArrayBuffer> {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const e of entries) {
    const raw = Buffer.from(e.data, "utf8");
    const body = e.store ? raw : deflateRawSync(raw, { level: 9 });
    const name = Buffer.from(e.name, "ascii");
    const method = e.store ? 0 : 8;
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(method, 10);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(body.length, 20);
    dir.writeUInt32LE(raw.length, 24);
    dir.writeUInt16LE(name.length, 28);
    dir.writeUInt32LE(offset, 42);

    parts.push(local, name, body);
    central.push(dir, name);
    offset += local.length + name.length + body.length;
  }

  const dirSize = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dirSize, 12);
  end.writeUInt32LE(offset, 16);
  return new Uint8Array(Buffer.concat([...parts, ...central, end]));
}
