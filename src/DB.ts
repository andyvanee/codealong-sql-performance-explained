import {Database} from 'bun:sqlite'
import {OpenFile} from './OpenFile'

export class DB {
    db: Database

    constructor() {
        this.db = new Database('openfiles.sqlite')
    }

    query(sql: string) {
        return this.db.query(sql)
    }

    recreate() {
        this.dropTables()
        this.createTables()
    }

    dropTables() {
        this.db.exec(`drop table if exists open_file;`)
    }

    createTables() {
        this.db.exec(`
            create table open_file (id integer primary key autoincrement, ps text, pid integer, uuid text, fd text, type text, device text, size text, node text, name text);
        `)
    }

    save(records: OpenFile[]) {
        const {db} = this
        const insert = db.prepare(
            'insert into open_file (ps, pid, uuid, fd, type, device, size, node, name) values ($ps, $pid, $uuid, $fd, $type, $device, $size, $node, $name);'
        )
        const transaction = db.transaction((files: OpenFile[]) => {
            for (const file of files) {
                insert.run(
                    file.ps,
                    file.pid,
                    file.uuid,
                    file.fd.toString(),
                    file.type,
                    file.device,
                    file.size,
                    file.node,
                    file.name
                )
            }
            return files.length
        })
        return transaction(records)
    }
}
