import {DB} from './DB'

import {LineEmptyError, OpenFile, isOpenFile} from './OpenFile'

const db = new DB()

export const create = async () => {
    console.log('Recreating database...')
    // Short wait so message isn't missed
    await new Promise(r => setTimeout(r, 250))
    db.recreate()

    const proc = Bun.spawn(['lsof'])
    const output = await new Response(proc.stdout).text()
    const content = output.split('\n').slice(1)

    const lines: OpenFile[] = content
        .map(line => {
            try {
                return OpenFile.fromLine(line)
            } catch (e) {
                if (e instanceof LineEmptyError) return null
                throw e
            }
        })
        .filter(isOpenFile)

    console.log('Saved: ', db.save(lines))
}

export const query = () => {
    const result = db.query("SELECT id, ps, name FROM open_file WHERE ps = 'WiFiAgent' ORDER BY ps").all()

    return result.map((row: any) => `${row.id} ${row.ps} ${row.name}`).join('\n')
}
