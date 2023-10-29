import { getFileChar } from '../../../utils/UtililtyFns'
import './Files.css'

interface Props {
    files: number[]
}

const Files = ({files}: Props) => {
    return (
        <div className="files">
            {files.map(file => <span key={file}>{getFileChar(file)}</span>)}
        </div>
    )
}

export default Files