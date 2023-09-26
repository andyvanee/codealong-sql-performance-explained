export class LineEmptyError extends Error {}

enum FileType {
    CHR = 'CHR',
    PIPE = 'PIPE',
    PID = 'PID',
    DIR = 'DIR',
    REG = 'REG',
    IPv4 = 'IPv4',
    unix = 'unix',
    NPOLICY = 'NPOLICY',
    KQUEUE = 'KQUEUE',
    systm = 'systm',
    NEXUS = 'NEXUS',
    CHAN = 'CHAN',
    IPv6 = 'IPv6',
}

enum FileDescriptorMode {
    r = 'r',
    w = 'w',
    u = 'u',
    cwd = 'cwd',
    txt = 'txt',
    twd = 'twd',
}

class FileDescriptor {
    id: string
    mode?: FileDescriptorMode

    constructor(fd: string) {
        const match = /(\d*)(\w*)/.exec(fd)
        if (!match) {
            throw new Error('Invalid lsof fd: ' + fd)
        }
        const [_, id, mode] = match
        this.id = id
        if (!mode) {
            this.mode = undefined
        } else {
            this.mode = mode as FileDescriptorMode
            if (!Object.values(FileDescriptorMode).includes(this.mode)) {
                throw new Error('Invalid lsof mode: ' + this.mode)
            }
        }
    }

    toString() {
        return `${this.id || ''}${this.mode || ''}`
    }
}

export class OpenFile {
    id?: string
    ps: string
    pid: number
    uuid: string
    fd: FileDescriptor
    type: FileType
    device: string
    size: string
    node: string
    name: string

    constructor(data: OpenFile) {
        this.id = data.id
        this.ps = data.ps
        this.pid = data.pid
        this.uuid = data.uuid
        this.fd = data.fd
        this.type = data.type
        this.device = data.device
        this.size = data.size
        this.node = data.node
        this.name = data.name
    }

    static fromLine(line: string) {
        const [ps, pid, uuid, fd, type, device, size, node, ...name] = line.split(/\s+/)
        if (!(ps && pid)) {
            throw new LineEmptyError('Invalid lsof line: ' + line)
        }
        if (!/^\d+$/.test(pid)) {
            throw new Error('Invalid lsof pid: ' + pid)
        }
        if (!Object.values(FileType).includes(type as FileType)) {
            throw new Error('Invalid lsof type: ' + type)
        }
        return new OpenFile({
            ps: ps,
            pid: parseInt(pid),
            uuid: uuid,
            fd: new FileDescriptor(fd),
            type: type as FileType,
            device: device,
            size: size,
            node: node,
            name: name.join(' '),
        })
    }
}

export function isOpenFile(file: any): file is OpenFile {
    return file instanceof OpenFile
}
